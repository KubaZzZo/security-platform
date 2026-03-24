/**
 * 流量预测算法模块
 *
 * 实现多种时间序列预测方法：
 * - SMA（简单移动平均）：短期趋势平滑
 * - 指数平滑（单次/双次Holt/三次Holt-Winters）：自适应权重预测
 * - 季节性分解：提取趋势+季节+残差分量
 * - 线性回归预测：最小二乘法趋势外推
 * - 置信区间估计：预测不确定性量化
 */

/**
 * 简单移动平均 (SMA)
 * @param {number[]} data - 历史数据
 * @param {number} window - 窗口大小
 * @param {number} forecast - 预测步数
 */
function simpleMovingAverage(data, window = 5, forecast = 12) {
  const n = data.length;
  if (n < window) return { smoothed: [...data], forecast: [], window };

  const smoothed = [];
  for (let i = 0; i < n; i++) {
    if (i < window - 1) {
      smoothed.push(data[i]);
    } else {
      const avg = data.slice(i - window + 1, i + 1).reduce((s, v) => s + v, 0) / window;
      smoothed.push(+avg.toFixed(2));
    }
  }

  // 预测：用最后window个点的均值
  const predictions = [];
  const lastWindow = data.slice(-window);
  for (let i = 0; i < forecast; i++) {
    const pred = lastWindow.reduce((s, v) => s + v, 0) / window;
    predictions.push(+pred.toFixed(2));
    lastWindow.shift();
    lastWindow.push(pred);
  }

  return { smoothed, forecast: predictions, window };
}

/**
 * 单次指数平滑 (SES)
 * 适合无趋势无季节性的平稳序列
 * @param {number[]} data
 * @param {number} alpha - 平滑因子 (0,1)
 * @param {number} forecast - 预测步数
 */
function singleExponentialSmoothing(data, alpha = 0.3, forecast = 12) {
  const n = data.length;
  if (n === 0) return { smoothed: [], forecast: [], alpha };

  const smoothed = [data[0]];
  for (let i = 1; i < n; i++) {
    smoothed.push(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
  }

  // 预测：SES预测值恒定为最后平滑值
  const lastSmoothed = smoothed[n - 1];
  const predictions = Array(forecast).fill(+lastSmoothed.toFixed(2));

  return {
    smoothed: smoothed.map(v => +v.toFixed(2)),
    forecast: predictions,
    alpha,
  };
}

/**
 * Holt 双参数指数平滑（线性趋势）
 * 同时平滑水平和趋势分量
 * @param {number[]} data
 * @param {number} alpha - 水平平滑因子
 * @param {number} beta - 趋势平滑因子
 * @param {number} forecast - 预测步数
 */
function holtLinearSmoothing(data, alpha = 0.3, beta = 0.1, forecast = 12) {
  const n = data.length;
  if (n < 2) return { smoothed: [...data], forecast: [], trend: [] };

  // 初始化
  let level = data[0];
  let trend = data[1] - data[0];
  const smoothed = [level];
  const trends = [trend];

  for (let i = 1; i < n; i++) {
    const newLevel = alpha * data[i] + (1 - alpha) * (level + trend);
    const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
    level = newLevel;
    trend = newTrend;
    smoothed.push(+level.toFixed(2));
    trends.push(+trend.toFixed(2));
  }

  // 预测
  const predictions = [];
  for (let h = 1; h <= forecast; h++) {
    predictions.push(+(level + h * trend).toFixed(2));
  }

  return {
    smoothed,
    forecast: predictions,
    trend: trends,
    finalLevel: +level.toFixed(2),
    finalTrend: +trend.toFixed(2),
    alpha, beta,
  };
}

/**
 * Holt-Winters 三次指数平滑（趋势+季节性）
 * 适合有周期性模式的数据（如24小时流量周期）
 * @param {number[]} data
 * @param {number} seasonLength - 季节周期长度（如24=一天）
 * @param {number} alpha - 水平平滑
 * @param {number} beta - 趋势平滑
 * @param {number} gamma - 季节平滑
 * @param {number} forecast - 预测步数
 */
function holtWinters(data, seasonLength = 24, alpha = 0.3, beta = 0.1, gamma = 0.3, forecast = 24) {
  const n = data.length;
  if (n < seasonLength * 2) {
    return { error: `数据量不足，至少需要 ${seasonLength * 2} 个点`, smoothed: [], forecast: [] };
  }

  // 初始化季节因子（第一个周期的均值比）
  const firstCycleMean = data.slice(0, seasonLength).reduce((s, v) => s + v, 0) / seasonLength;
  const seasonal = data.slice(0, seasonLength).map(v => v / (firstCycleMean || 1));

  // 初始化水平和趋势
  let level = firstCycleMean;
  let trend = 0;
  for (let i = 0; i < seasonLength; i++) {
    trend += (data[seasonLength + i] - data[i]);
  }
  trend /= (seasonLength * seasonLength);

  const smoothed = [];

  for (let i = 0; i < n; i++) {
    const si = i % seasonLength;
    const prevSeasonal = seasonal[si];

    if (i === 0) {
      smoothed.push(+(level * prevSeasonal).toFixed(2));
      continue;
    }

    const newLevel = alpha * (data[i] / (prevSeasonal || 1)) + (1 - alpha) * (level + trend);
    const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
    seasonal[si] = gamma * (data[i] / (newLevel || 1)) + (1 - gamma) * prevSeasonal;

    level = newLevel;
    trend = newTrend;
    smoothed.push(+(level * seasonal[si]).toFixed(2));
  }

  // 预测
  const predictions = [];
  for (let h = 1; h <= forecast; h++) {
    const si = (n + h - 1) % seasonLength;
    predictions.push(+((level + h * trend) * seasonal[si]).toFixed(2));
  }

  return {
    smoothed,
    forecast: predictions,
    seasonalFactors: seasonal.map(s => +s.toFixed(4)),
    finalLevel: +level.toFixed(2),
    finalTrend: +trend.toFixed(2),
    seasonLength,
    alpha, beta, gamma,
  };
}

/**
 * 季节性分解（加法模型）
 * 将时间序列分解为：趋势 + 季节 + 残差
 * @param {number[]} data
 * @param {number} period - 季节周期
 */
function seasonalDecomposition(data, period = 24) {
  const n = data.length;
  if (n < period * 2) return { error: '数据量不足' };

  // 1. 提取趋势（移动平均）
  const trendComponent = [];
  const half = Math.floor(period / 2);
  for (let i = 0; i < n; i++) {
    if (i < half || i >= n - half) {
      trendComponent.push(null);
    } else {
      const window = data.slice(i - half, i + half + 1);
      trendComponent.push(+(window.reduce((s, v) => s + v, 0) / window.length).toFixed(2));
    }
  }

  // 2. 去趋势 → 季节+残差
  const detrended = data.map((v, i) => trendComponent[i] !== null ? v - trendComponent[i] : null);

  // 3. 提取季节分量（按周期位置平均）
  const seasonalAvg = Array(period).fill(0);
  const seasonalCount = Array(period).fill(0);
  detrended.forEach((v, i) => {
    if (v !== null) {
      seasonalAvg[i % period] += v;
      seasonalCount[i % period]++;
    }
  });
  const seasonalPattern = seasonalAvg.map((v, i) => +(v / (seasonalCount[i] || 1)).toFixed(2));

  // 4. 季节分量（扩展到全长）
  const seasonalComponent = data.map((_, i) => seasonalPattern[i % period]);

  // 5. 残差 = 原始 - 趋势 - 季节
  const residualComponent = data.map((v, i) => {
    if (trendComponent[i] === null) return null;
    return +(v - trendComponent[i] - seasonalComponent[i]).toFixed(2);
  });

  // 残差统计
  const validResiduals = residualComponent.filter(v => v !== null);
  const residualMean = validResiduals.reduce((s, v) => s + v, 0) / validResiduals.length;
  const residualStd = Math.sqrt(validResiduals.reduce((s, v) => s + Math.pow(v - residualMean, 2), 0) / validResiduals.length);

  return {
    trend: trendComponent,
    seasonal: seasonalComponent,
    residual: residualComponent,
    seasonalPattern,
    residualStats: {
      mean: +residualMean.toFixed(2),
      std: +residualStd.toFixed(2),
      maxAbsolute: +Math.max(...validResiduals.map(Math.abs)).toFixed(2),
    },
    period,
  };
}

/**
 * 线性回归预测
 * 最小二乘法拟合趋势线并外推
 * @param {number[]} data
 * @param {number} forecast - 预测步数
 */
function linearRegression(data, forecast = 12) {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, forecast: [], r2: 0 };

  const xMean = (n - 1) / 2;
  const yMean = data.reduce((s, v) => s + v, 0) / n;

  let ssXY = 0, ssXX = 0, ssYY = 0;
  for (let i = 0; i < n; i++) {
    ssXY += (i - xMean) * (data[i] - yMean);
    ssXX += (i - xMean) * (i - xMean);
    ssYY += (data[i] - yMean) * (data[i] - yMean);
  }

  const slope = ssXX !== 0 ? ssXY / ssXX : 0;
  const intercept = yMean - slope * xMean;
  const r2 = ssYY !== 0 ? Math.pow(ssXY, 2) / (ssXX * ssYY) : 0;

  // 残差标准误
  const residuals = data.map((v, i) => v - (slope * i + intercept));
  const se = Math.sqrt(residuals.reduce((s, v) => s + v * v, 0) / (n - 2));

  // 预测 + 置信区间
  const predictions = [];
  for (let h = 0; h < forecast; h++) {
    const x = n + h;
    const pred = slope * x + intercept;
    const margin = 1.96 * se * Math.sqrt(1 + 1 / n + Math.pow(x - xMean, 2) / ssXX);
    predictions.push({
      value: +pred.toFixed(2),
      upper: +(pred + margin).toFixed(2),
      lower: +(pred - margin).toFixed(2),
    });
  }

  return {
    slope: +slope.toFixed(4),
    intercept: +intercept.toFixed(2),
    r2: +r2.toFixed(4),
    standardError: +se.toFixed(2),
    forecast: predictions,
    trendDirection: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
  };
}

/**
 * 综合预测（多模型融合）
 * 运行多种预测模型，加权平均输出
 */
function ensembleForecast(data, forecast = 12, seasonLength = 24) {
  const sma = simpleMovingAverage(data, 5, forecast);
  const ses = singleExponentialSmoothing(data, 0.3, forecast);
  const holt = holtLinearSmoothing(data, 0.3, 0.1, forecast);
  const lr = linearRegression(data, forecast);

  // 加权融合（Holt权重最高）
  const weights = { sma: 0.15, ses: 0.2, holt: 0.4, lr: 0.25 };
  const combined = [];

  for (let i = 0; i < forecast; i++) {
    const val = weights.sma * sma.forecast[i]
      + weights.ses * ses.forecast[i]
      + weights.holt * holt.forecast[i]
      + weights.lr * lr.forecast[i].value;
    combined.push(+val.toFixed(2));
  }

  return {
    combined,
    models: {
      sma: sma.forecast,
      ses: ses.forecast,
      holt: holt.forecast,
      linearRegression: lr.forecast.map(f => f.value),
    },
    weights,
    trendDirection: lr.trendDirection,
    r2: lr.r2,
  };
}

module.exports = {
  simpleMovingAverage,
  singleExponentialSmoothing,
  holtLinearSmoothing,
  holtWinters,
  seasonalDecomposition,
  linearRegression,
  ensembleForecast,
};

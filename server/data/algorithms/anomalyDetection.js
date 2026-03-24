/**
 * 异常检测算法模块
 *
 * 实现多种统计学异常检测方法：
 * - Z-Score 检测：基于标准差的离群点检测
 * - EWMA（指数加权移动平均）：对近期数据赋予更高权重
 * - 滑动窗口统计：固定窗口内的均值/方差变化检测
 * - Grubbs 检验：单离群点假设检验
 * - 基线偏差检测：与历史基线对比的偏差度量
 */

/**
 * Z-Score 异常检测
 * 计算每个数据点偏离均值的标准差倍数
 * @param {number[]} data - 时间序列数据
 * @param {number} threshold - Z-Score阈值（默认2.5）
 * @returns {{ anomalies: Array, mean: number, std: number, scores: number[] }}
 */
function zScoreDetection(data, threshold = 2.5) {
  const n = data.length;
  if (n < 3) return { anomalies: [], mean: 0, std: 0, scores: [] };

  const mean = data.reduce((s, v) => s + v, 0) / n;
  const variance = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
  const std = Math.sqrt(variance);

  if (std === 0) return { anomalies: [], mean, std: 0, scores: data.map(() => 0) };

  const scores = data.map(v => (v - mean) / std);
  const anomalies = [];

  scores.forEach((z, i) => {
    if (Math.abs(z) > threshold) {
      anomalies.push({
        index: i,
        value: data[i],
        zScore: +z.toFixed(3),
        direction: z > 0 ? 'high' : 'low',
        severity: Math.abs(z) > 4 ? 'critical' : Math.abs(z) > 3 ? 'high' : 'medium',
      });
    }
  });

  return { anomalies, mean: +mean.toFixed(2), std: +std.toFixed(2), scores: scores.map(s => +s.toFixed(3)) };
}

/**
 * EWMA（指数加权移动平均）异常检测
 * 近期数据权重更高，适合检测趋势突变
 * @param {number[]} data - 时间序列数据
 * @param {number} alpha - 平滑因子 (0,1)，越大越敏感（默认0.3）
 * @param {number} threshold - 控制限倍数（默认3）
 */
function ewmaDetection(data, alpha = 0.3, threshold = 3) {
  const n = data.length;
  if (n < 5) return { anomalies: [], ewma: [], ucl: [], lcl: [] };

  const mean = data.reduce((s, v) => s + v, 0) / n;
  const variance = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
  const std = Math.sqrt(variance);

  const ewma = [mean];
  const anomalies = [];

  for (let i = 1; i < n; i++) {
    ewma[i] = alpha * data[i] + (1 - alpha) * ewma[i - 1];
  }

  // 控制限：基于EWMA方差
  const ewmaStd = std * Math.sqrt(alpha / (2 - alpha));
  const ucl = ewma.map(e => e + threshold * ewmaStd);
  const lcl = ewma.map(e => e - threshold * ewmaStd);

  data.forEach((v, i) => {
    if (v > ucl[i] || v < lcl[i]) {
      anomalies.push({
        index: i,
        value: v,
        ewmaValue: +ewma[i].toFixed(2),
        deviation: +((v - ewma[i]) / ewmaStd).toFixed(3),
        direction: v > ucl[i] ? 'high' : 'low',
      });
    }
  });

  return {
    anomalies,
    ewma: ewma.map(v => +v.toFixed(2)),
    ucl: ucl.map(v => +v.toFixed(2)),
    lcl: lcl.map(v => +v.toFixed(2)),
    alpha,
  };
}

/**
 * 滑动窗口异常检测
 * 在固定窗口内计算局部统计量，检测突变
 * @param {number[]} data
 * @param {number} windowSize - 窗口大小（默认10）
 * @param {number} threshold - 偏差阈值倍数（默认2.5）
 */
function slidingWindowDetection(data, windowSize = 10, threshold = 2.5) {
  const n = data.length;
  if (n < windowSize + 1) return { anomalies: [], windows: [] };

  const anomalies = [];
  const windows = [];

  for (let i = windowSize; i < n; i++) {
    const window = data.slice(i - windowSize, i);
    const wMean = window.reduce((s, v) => s + v, 0) / windowSize;
    const wStd = Math.sqrt(window.reduce((s, v) => s + Math.pow(v - wMean, 2), 0) / (windowSize - 1)) || 1;
    const current = data[i];
    const deviation = (current - wMean) / wStd;

    windows.push({
      index: i,
      windowMean: +wMean.toFixed(2),
      windowStd: +wStd.toFixed(2),
      value: current,
      deviation: +deviation.toFixed(3),
    });

    if (Math.abs(deviation) > threshold) {
      anomalies.push({
        index: i,
        value: current,
        windowMean: +wMean.toFixed(2),
        deviation: +deviation.toFixed(3),
        direction: deviation > 0 ? 'spike' : 'drop',
        severity: Math.abs(deviation) > 4 ? 'critical' : Math.abs(deviation) > 3 ? 'high' : 'medium',
      });
    }
  }

  return { anomalies, windows, windowSize };
}

/**
 * Grubbs 检验（单离群点检验）
 * 假设数据服从正态分布，检验最极端值是否为离群点
 * @param {number[]} data
 * @param {number} significance - 显著性水平（默认0.05）
 */
function grubbsTest(data, significance = 0.05) {
  const n = data.length;
  if (n < 3) return { isOutlier: false, outlierValue: null, G: 0, criticalValue: 0 };

  const mean = data.reduce((s, v) => s + v, 0) / n;
  const std = Math.sqrt(data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1));
  if (std === 0) return { isOutlier: false, outlierValue: null, G: 0, criticalValue: 0 };

  // 找最大偏差值
  let maxDev = 0, outlierIdx = 0;
  data.forEach((v, i) => {
    const dev = Math.abs(v - mean);
    if (dev > maxDev) { maxDev = dev; outlierIdx = i; }
  });

  const G = maxDev / std;

  // 近似临界值（基于t分布近似）
  // t_crit ≈ 使用简化公式
  const tCrit = 2.0 + 0.3 * Math.log(n); // 简化近似
  const criticalValue = ((n - 1) / Math.sqrt(n)) * Math.sqrt(tCrit * tCrit / (n - 2 + tCrit * tCrit));

  return {
    isOutlier: G > criticalValue,
    outlierValue: data[outlierIdx],
    outlierIndex: outlierIdx,
    G: +G.toFixed(4),
    criticalValue: +criticalValue.toFixed(4),
    mean: +mean.toFixed(2),
    std: +std.toFixed(2),
  };
}

/**
 * 基线偏差检测
 * 将当前数据与历史基线对比，计算偏差百分比
 * @param {number[]} current - 当前时段数据
 * @param {number[]} baseline - 历史基线数据（同时段）
 * @param {number} threshold - 偏差百分比阈值（默认50%）
 */
function baselineDeviation(current, baseline, threshold = 50) {
  const len = Math.min(current.length, baseline.length);
  const deviations = [];
  const anomalies = [];

  for (let i = 0; i < len; i++) {
    const base = baseline[i] || 1;
    const pct = ((current[i] - base) / base) * 100;
    deviations.push(+pct.toFixed(2));

    if (Math.abs(pct) > threshold) {
      anomalies.push({
        index: i,
        currentValue: current[i],
        baselineValue: base,
        deviationPct: +pct.toFixed(2),
        direction: pct > 0 ? 'above' : 'below',
        severity: Math.abs(pct) > 200 ? 'critical' : Math.abs(pct) > 100 ? 'high' : 'medium',
      });
    }
  }

  const avgDeviation = deviations.length > 0
    ? +(deviations.reduce((s, v) => s + Math.abs(v), 0) / deviations.length).toFixed(2)
    : 0;

  return { anomalies, deviations, avgDeviation, threshold };
}

/**
 * 综合异常检测（多算法融合）
 * 同时运行多种检测算法，取交集或加权投票
 * @param {number[]} data
 * @param {Object} options
 */
function ensembleDetection(data, options = {}) {
  const { zThreshold = 2.5, ewmaAlpha = 0.3, windowSize = 10 } = options;

  const zResult = zScoreDetection(data, zThreshold);
  const ewmaResult = ewmaDetection(data, ewmaAlpha);
  const swResult = slidingWindowDetection(data, windowSize);

  // 投票机制：被多个算法同时标记的点更可信
  const voteMap = new Map();
  const addVotes = (anomalies, method) => {
    anomalies.forEach(a => {
      const key = a.index;
      if (!voteMap.has(key)) voteMap.set(key, { index: key, value: a.value, methods: [], votes: 0 });
      const entry = voteMap.get(key);
      entry.methods.push(method);
      entry.votes++;
    });
  };

  addVotes(zResult.anomalies, 'z-score');
  addVotes(ewmaResult.anomalies, 'ewma');
  addVotes(swResult.anomalies, 'sliding-window');

  const ensemble = [...voteMap.values()]
    .map(e => ({
      ...e,
      confidence: +(e.votes / 3).toFixed(2),
      severity: e.votes >= 3 ? 'critical' : e.votes >= 2 ? 'high' : 'medium',
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    ensemble,
    details: {
      zScore: { anomalyCount: zResult.anomalies.length },
      ewma: { anomalyCount: ewmaResult.anomalies.length },
      slidingWindow: { anomalyCount: swResult.anomalies.length },
    },
    totalUnique: voteMap.size,
    highConfidence: ensemble.filter(e => e.votes >= 2).length,
  };
}

module.exports = {
  zScoreDetection,
  ewmaDetection,
  slidingWindowDetection,
  grubbsTest,
  baselineDeviation,
  ensembleDetection,
};

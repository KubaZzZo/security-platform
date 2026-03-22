import React from 'react';
import './FilterBar.css';

interface FilterItem {
  type: 'select' | 'input' | 'date' | 'button';
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  value?: string;
  buttonType?: 'primary' | 'default';
  onClick?: () => void;
}

interface FilterBarProps {
  filters: FilterItem[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters }) => {
  return (
    <div className="filter-bar">
      {filters.map((filter, idx) => {
        if (filter.type === 'select') {
          return (
            <div className="filter-item" key={idx}>
              {filter.label && <label>{filter.label}</label>}
              <select defaultValue={filter.value || ''}>
                {filter.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }
        if (filter.type === 'input') {
          return (
            <div className="filter-item" key={idx}>
              {filter.label && <label>{filter.label}</label>}
              <input type="text" placeholder={filter.placeholder || '请输入'} />
            </div>
          );
        }
        if (filter.type === 'date') {
          return (
            <div className="filter-item" key={idx}>
              {filter.label && <label>{filter.label}</label>}
              <input type="date" defaultValue={filter.value} />
              <span className="date-sep">~</span>
              <input type="date" />
            </div>
          );
        }
        if (filter.type === 'button') {
          return (
            <button
              key={idx}
              className={`filter-btn ${filter.buttonType === 'primary' ? 'filter-btn-primary' : ''}`}
              onClick={filter.onClick}
            >
              {filter.label}
            </button>
          );
        }
        return null;
      })}
    </div>
  );
};

export default FilterBar;

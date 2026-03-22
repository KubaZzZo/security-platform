import React, { useState } from 'react';
import './DataTable.css';

export interface Column {
  key: string;
  title: string;
  width?: number | string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  pageSize?: number;
  showPagination?: boolean;
  total?: number;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, pageSize = 10, showPagination = true, total }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = total || data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = data.slice(startIdx, startIdx + pageSize);

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={columns.length} className="data-table-empty">暂无数据</td></tr>
          ) : (
            pageData.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row, startIdx + idx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showPagination && totalPages > 1 && (
        <div className="data-table-pagination">
          <span className="pagination-info">共 {totalItems} 条</span>
          <div className="pagination-btns">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => setCurrentPage(page)}
                >{page}</button>
              );
            })}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>›</button>
          </div>
          <span className="pagination-info">{pageSize}条/页</span>
        </div>
      )}
    </div>
  );
};

export default DataTable;

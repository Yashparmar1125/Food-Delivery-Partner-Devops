import React from 'react';
import { Skeleton } from './Skeleton';

export interface ColumnDef<T> {
  key: string | keyof T;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  keyExtractor: (item: T) => string | number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  keyExtractor,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto bg-white border border-gray-200 rounded-xl ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, idx) => (
              <th
                key={String(col.key) + idx}
                className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4">
                    <Skeleton variant="text" width={col.key === 'id' ? '40px' : '100%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 text-sm">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`group ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'bg-white'}`}
              >
                {columns.map((col, idx) => (
                  <td key={String(col.key) + idx} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

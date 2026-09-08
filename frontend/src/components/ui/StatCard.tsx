import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <Card
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-md transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8590C]" />
      <div className="flex justify-between items-start pl-2">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center text-sm">
              {trend && (
                <span className={`font-medium mr-2 ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
              {subtitle && <span className="text-gray-500">{subtitle}</span>}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

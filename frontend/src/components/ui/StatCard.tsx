import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description: string;
  borderColor: string;
  iconColor: string;
}

export default function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  borderColor, 
  iconColor 
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${borderColor}`}>
      <div className="flex items-center mb-3">
        <Icon className={`${iconColor} mr-2`} />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}
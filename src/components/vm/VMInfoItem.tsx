
import React, { ReactNode } from 'react';

interface VMInfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const VMInfoItem: React.FC<VMInfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md glass-morphism bg-white/5 border border-white/10">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-white/80">{label}</span>
      </div>
      <span className={`text-sm text-white/90 ${label === 'IP Address' ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
};

export default VMInfoItem;

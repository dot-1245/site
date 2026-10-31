import React from 'react';
import { SystemSpec } from '../types';
import { Terminal, Monitor, Smartphone } from 'lucide-react';

interface SystemCardProps {
  spec: SystemSpec;
  isDark: boolean;
}

export const SystemCard: React.FC<SystemCardProps> = ({ spec, isDark }) => {
  const isDebian = spec.os.toLowerCase().includes('debian');
  const isMobile = spec.type === 'mobile';

  const theme = {
    border: isDark ? 'border-swiss-gray' : 'border-swiss-black/20',
    hover: isDark ? 'hover:bg-white/5' : 'hover:bg-black/5',
    iconColor: isDark ? 'text-swiss-white' : 'text-swiss-black',
    subText: isDark ? 'text-gray-300' : 'text-gray-600',
    highlight: isDark ? 'text-white' : 'text-black',
    label: isDark ? 'text-swiss-gray' : 'text-gray-500',
    borderLeft: isDark ? 'border-swiss-gray' : 'border-swiss-black/20'
  };

  return (
    <div className={`border ${theme.border} p-6 h-full flex flex-col justify-between ${theme.hover} transition-colors duration-300 group`}>
      <div className="flex justify-between items-start mb-8">
        {isMobile ? (
          <Smartphone className={`w-6 h-6 ${theme.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
        ) : isDebian ? (
          <Terminal className={`w-6 h-6 ${theme.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
        ) : (
          <Monitor className={`w-6 h-6 ${theme.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
        )}
        <span className={`font-mono text-xs ${theme.label} uppercase tracking-widest`}>
          {spec.type}
        </span>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-1">{spec.os}</h3>
        <div className={`font-mono text-sm ${theme.subText} border-l-2 ${theme.borderLeft} pl-3 mt-4 space-y-1`}>
          <p>VER: <span className={theme.highlight}>{spec.version}</span></p>
          {spec.codename && <p>CODE: <span className={theme.highlight}>{spec.codename}</span></p>}
          {spec.hardware && <p>SPEC: <span className={theme.highlight}>{spec.hardware}</span></p>}
          {spec.de && <p>DE: <span className={theme.highlight}>{spec.de}</span></p>}
          {spec.wm && <p>WM: <span className={theme.highlight}>{spec.wm}</span></p>}
          {spec.ds && <p>DS: <span className={theme.highlight}>{spec.ds}</span></p>}
          {spec.kernel && <p>KERNEL: <span className={theme.highlight}>{spec.kernel}</span></p>}
        </div>
      </div>
    </div>
  );
};
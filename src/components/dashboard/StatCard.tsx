import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'highlight' | 'danger' | 'statusbg'| 'slatebg'; 
  className?: string;
}

const StatCard = ({ value, label, icon, variant = 'default', className }: StatCardProps) => {
  const variants = {
    default: 'bg-card',
    highlight: 'bg-primary/10',
    danger: 'bg-[#FFE2E2]',
    statusbg: 'bg-green-50',
    slatebg:'bg-slate-100', 
  };

  const iconVariants = {
    default: 'text-muted-foreground',
    highlight: 'text-primary',
    statusbg: 'text-muted-foreground'
  };

  const valueVariants = {
    default: 'text-foreground',
    highlight: 'text-primary',
    statusbg: 'text-foreground',
  };

  return (
    <div className={cn(
      'flex flex-col items-center  px-4 py-3 rounded-sm transition-all',
      variants[variant],
      className
    )}>
      <div className={cn('w-8 h-8 flex items-center justify-center', iconVariants[variant])}>
        {icon}
      </div>
      <span className={cn('font-roboto font-semibold', valueVariants[variant])}>{value}</span>
      <span className="text-xs text-[#475569] font-medium font-roboto">{label}</span>
    </div>
  );
};

export default StatCard;

import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'highlight' | 'danger' | 'statusbg'; 
  className?: string;
}

const StatCard = ({ value, label, icon, variant = 'default', className }: StatCardProps) => {
  const variants = {
    default: 'bg-card',
    highlight: 'bg-primary/10',
    danger: 'bg-destructive/10',
    statusbg: 'bg-[rgba(241,245,249,1)]', 
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
      <span className="text-xs text-muted-foreground font-medium font-roboto">{label}</span>
    </div>
  );
};

export default StatCard;

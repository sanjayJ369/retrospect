import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Container = ({
  className,
  children,
  style,
  ...props
}: ContainerProps) => {
  return (
    <div className={cn("relative", className)} {...props} style={style}>
      {children}
      <div
        className="absolute top-0 left-0 w-full h-1.5 bg-foreground dark:bg-ring
          pointer-events-none"
      />
      <div
        className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground dark:bg-ring
          pointer-events-none"
      />
      <div
        className="absolute top-1 -left-1 w-1.5 h-1/2 bg-foreground dark:bg-ring
          pointer-events-none"
      />
      <div
        className="absolute bottom-1 -left-1 w-1.5 h-1/2 bg-foreground dark:bg-ring
          pointer-events-none"
      />
      <div
        className="absolute top-1 -right-1 w-1.5 h-1/2 bg-foreground dark:bg-ring
          pointer-events-none"
      />
      <div
        className="absolute bottom-1 -right-1 w-1.5 h-1/2 bg-foreground dark:bg-ring
          pointer-events-none"
      />
    </div>
  );
};

export default Container;

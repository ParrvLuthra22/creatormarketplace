import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-[1440px] mx-auto px-6 md:px-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}

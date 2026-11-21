import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}
const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-md border relative overflow-hidden", className)}
      {...props}
    >
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">{children}</div>
    </div>
  ),
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };

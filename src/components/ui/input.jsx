import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300",
        className
      )}
      {...props}
    />
  );
});

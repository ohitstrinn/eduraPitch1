// src/components/ui/button.jsx

import * as React from "react";
import { cn } from "../../lib/utils"; // make sure this file exists

export const Button = React.forwardRef(
  ({ className = "", children, onClick, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        type={type}
        className={cn(
          "bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

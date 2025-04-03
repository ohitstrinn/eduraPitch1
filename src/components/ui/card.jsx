// src/components/ui/card.jsx

import * as React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div
      className={cn("p-2 space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

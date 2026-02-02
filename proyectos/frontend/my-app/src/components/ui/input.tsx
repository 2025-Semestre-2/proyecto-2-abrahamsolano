import * as React from "react";
import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "px-5 py-3", // Aumentado: px-4 → px-5 (20px), py-2.5 → py-3 (12px)
        "focus-visible:border-black focus-visible:ring-0",
        "aria-invalid:border-destructive aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  );
}
export { Input };
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" };

export function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      className={cn(variant === "primary" ? "btn-primary" : "btn-secondary", className)}
      {...rest}
    />
  );
}

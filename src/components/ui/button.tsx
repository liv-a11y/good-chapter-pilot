import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm font-medium transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary bg-primary text-primary-foreground hover:border-foreground hover:bg-foreground hover:text-background",
        outline:
          "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        ghost: "text-foreground hover:bg-foreground hover:text-background",
        lime: "border-2 border-foreground bg-highlight text-highlight-foreground hover:bg-foreground hover:text-background",
        ink: "border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-13 px-7 text-sm",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

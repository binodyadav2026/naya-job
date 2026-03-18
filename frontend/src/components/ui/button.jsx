import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 hover:shadow-md",
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 hover:shadow-md",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent/92 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-foreground shadow-sm hover:border-accent/40 hover:bg-accent/10",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85",
        ghost: "text-foreground hover:bg-secondary/80",
        nav: "text-slate-600 hover:bg-secondary/80 hover:text-slate-950",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-11 px-7 text-sm",
        xl: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }

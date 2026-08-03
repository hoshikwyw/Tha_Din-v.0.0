import { cn } from "@/lib/utils"

/**
 * Placeholder block.
 *
 * Was `bg-primary/10`, which after the theme rewrite resolved to the page
 * background at 10% opacity — invisible against the page it sits on.
 * `bg-muted` is the token intended for this.
 *
 * The `.skeleton` class adds a shimmer sweep over the base tint; it is
 * suppressed automatically by the global `prefers-reduced-motion` rule.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }

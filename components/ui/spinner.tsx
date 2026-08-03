import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Indeterminate activity indicator.
 *
 * Decorative by default: when it sits next to a label that already changes
 * ("Publishing…"), announcing it again would be redundant. Pass a `label` when
 * it is the only signal that something is happening.
 */
export const Spinner = ({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) => (
  <>
    <Loader2
      className={cn("size-4 shrink-0 animate-spin", className)}
      aria-hidden="true"
    />
    {label ? <span className="sr-only">{label}</span> : null}
  </>
);

export default Spinner;

"use client";

import { useLinkStatus } from "next/link";

import { Spinner } from "@/components/ui/spinner";

/**
 * Shows a spinner on the specific link the user clicked while its navigation is
 * in flight.
 *
 * `useLinkStatus` reports the pending state of the nearest ancestor `<Link>`,
 * so this must be rendered as a child of one. It lets the filter bar stay a
 * server component while still giving per-control feedback — the global
 * progress bar says "something is loading", this says "the thing you clicked".
 */
const LinkPending = ({ className }: { className?: string }) => {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return <Spinner className={className} />;
};

export default LinkPending;

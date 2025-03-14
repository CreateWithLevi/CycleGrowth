"use client";

import { SubscriptionProvider } from "@/components/subscription-check";

export default function LayoutWithSubscription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionProvider>{children}</SubscriptionProvider>;
}

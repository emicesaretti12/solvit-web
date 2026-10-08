"use client";

import dynamic from "next/dynamic";

// Esqueleto con la misma forma que la tarjeta final, mientras carga reaviz
function DashboardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col rounded-3xl bg-card p-5 md:p-7" aria-hidden="true">
      <div className="h-6 w-44 animate-pulse rounded-full bg-white/5" />
      <div className="mt-6 grid flex-1 gap-6 md:grid-cols-[1.55fr_1fr]">
        <div className="animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="flex flex-col gap-3">
          <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

const DashboardChart = dynamic(() => import("./dashboard-chart"), {
  ssr: false,
  loading: DashboardSkeleton,
});

export function DashboardPreview() {
  return <DashboardChart />;
}

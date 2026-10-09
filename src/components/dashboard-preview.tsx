"use client";

import dynamic from "next/dynamic";

// Esqueleto con la misma forma que el tablero final, mientras carga reaviz
function DashboardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col" aria-hidden="true">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:px-6">
        <div className="h-5 w-5 rounded-md bg-fg/5" />
        <div className="h-4 w-36 animate-pulse rounded-full bg-fg/5" />
      </div>
      <div className="grid flex-1 gap-2 p-2 md:grid-cols-[1fr_280px]">
        <div className="flex flex-col rounded-3xl bg-navy-900/50 p-5 md:p-7">
          <div className="h-6 w-44 animate-pulse rounded-full bg-fg/5" />
          <div className="mt-6 grid flex-1 gap-6 md:grid-cols-[1.55fr_1fr]">
            <div className="animate-pulse rounded-2xl bg-fg/[0.04]" />
            <div className="flex flex-col gap-3">
              <div className="h-12 animate-pulse rounded-xl bg-fg/[0.04]" />
              <div className="h-12 animate-pulse rounded-xl bg-fg/[0.04]" />
              <div className="h-12 animate-pulse rounded-xl bg-fg/[0.04]" />
            </div>
          </div>
        </div>
        <div className="hidden flex-col gap-2 rounded-3xl bg-card p-5 md:flex">
          <div className="h-4 w-20 animate-pulse rounded-full bg-fg/5" />
          <div className="mt-2 h-14 animate-pulse rounded-xl bg-fg/[0.04]" />
          <div className="h-14 animate-pulse rounded-xl bg-fg/[0.04]" />
          <div className="h-14 animate-pulse rounded-xl bg-fg/[0.04]" />
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

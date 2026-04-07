import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <header className="bg-background border-b border-border/50 px-8 lg:px-12 py-10">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </header>
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-8 border border-border/40 shadow-card">
              <Skeleton className="h-5 w-20 rounded-md mb-4" />
              <Skeleton className="h-3 w-28 mb-3" />
              <Skeleton className="h-12 w-32" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="bg-card rounded-3xl p-8 border border-border/40 shadow-card space-y-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
          <div className="bg-card rounded-3xl p-8 border border-border/40 shadow-card space-y-4">
            <Skeleton className="h-6 w-40 mb-2" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-7 border border-border/40 shadow-card space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

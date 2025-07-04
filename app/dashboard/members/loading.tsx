import { Card, CardContent } from "@/components/ui/card"

export default function MembersLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 bg-white/10 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 bg-white/10 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-white/10 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <Card className="bg-zinc-900/50 border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-white/10 rounded animate-pulse"></div>
            <div className="w-full sm:w-48 h-10 bg-white/10 rounded animate-pulse"></div>
            <div className="w-full sm:w-32 h-10 bg-white/10 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/10 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/10 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-white/10 rounded"></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-white/10 rounded w-16"></div>
                  <div className="h-4 bg-white/10 rounded w-20"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-white/10 rounded-full"></div>
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-white/10 rounded w-20"></div>
                  <div className="h-3 bg-white/10 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

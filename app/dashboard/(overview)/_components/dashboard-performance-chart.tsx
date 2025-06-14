interface DashboardPerformanceChartProps {
    clubId: string
}

export function DashboardPerformanceChart({clubId}: DashboardPerformanceChartProps) {
    return (
        <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
            <div className="text-center text-white/60">
                <p>Activity chart visualization would go here</p>
                <p className="text-sm mt-1">
                    {clubId === "city-runners" ? "(Membership growth over time)" : "(Game performance metrics)"}
                </p>
            </div>
        </div>
    )
}

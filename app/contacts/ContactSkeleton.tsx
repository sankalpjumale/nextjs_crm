export default function ContactSkeleton() {
    return (
        <div className="animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 p-2 border-b">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
            ))}
        </div>
    )
}
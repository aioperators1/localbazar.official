export default function AdminLoading() {
    return (
        <div className="p-8 lg:p-12 w-full h-full flex flex-col gap-8 animate-pulse bg-gray-50">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-2">
                <div className="h-8 w-64 bg-gray-200 rounded-md" />
                <div className="h-4 w-96 bg-gray-200 rounded-md opacity-60" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 h-32 flex flex-col justify-between shadow-sm">
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="h-10 w-32 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>

            {/* Main Area Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[400px]">
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    <div className="h-6 w-48 bg-gray-100 rounded mb-8" />
                    <div className="h-64 w-full bg-gray-50 rounded" />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                     <div className="h-6 w-32 bg-gray-100 rounded mb-8" />
                     <div className="space-y-4">
                         {[...Array(5)].map((_, i) => (
                             <div key={i} className="h-12 w-full bg-gray-50 rounded" />
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
}

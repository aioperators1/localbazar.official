import { Search } from "lucide-react";

export default function ProductsLoading() {
    return (
        <div className="space-y-10 pb-20 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="h-9 w-48 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-72 bg-gray-100 rounded-md"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-24 bg-gray-100 rounded-lg"></div>
                    <div className="h-10 w-24 bg-gray-100 rounded-lg"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="h-3 w-24 bg-gray-100 rounded mb-4"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-gray-50 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Main Interface Skeleton */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Tabs Skeleton */}
                <div className="px-6 pt-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="h-8 w-12 bg-gray-200 rounded-t-md"></div>
                        <div className="h-8 w-16 bg-gray-100 rounded-t-md"></div>
                        <div className="h-8 w-16 bg-gray-100 rounded-t-md"></div>
                    </div>
                </div>

                {/* Filter Sub-bar Skeleton */}
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 rounded-full"></div>
                            <div className="h-12 w-full bg-gray-50 rounded-lg border border-gray-100"></div>
                        </div>
                        <div className="h-12 w-24 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="px-6 pb-6">
                    <div className="w-full border-collapse">
                        <div className="bg-gray-50 border-b border-gray-100 flex p-4 gap-6">
                            <div className="h-3 w-4 bg-gray-200 rounded"></div>
                            <div className="h-3 w-4 bg-gray-200 rounded"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex items-center p-4 gap-6">
                                    <div className="h-4 w-4 bg-gray-100 rounded"></div>
                                    <div className="h-6 w-4 bg-gray-100 rounded"></div>
                                    <div className="h-12 w-12 bg-gray-100 rounded"></div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-24 bg-gray-100 rounded"></div>
                                    </div>
                                    <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
                                    <div className="h-4 w-12 bg-gray-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

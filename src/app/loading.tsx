
export default function Loading() {
    return (
        <section className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center gap-4 bg-[#f5fbf7] dark:bg-[#081b16]">

            <div className="size-10 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-600" />

            <div className="text-center">
                <h2 className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                    Loading...
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Please wait a moment.
                </p>
            </div>

        </section>
    )
}

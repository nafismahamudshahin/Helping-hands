
import { Award, Sparkles } from "lucide-react"

const CartificatesPage = () => {
    return (
        <section className="min-h-[70vh] bg-[#f4fbf6] px-5 py-14 text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3] sm:px-8 lg:px-[6.65%]">
            <div className="container mx-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#159b50] dark:text-[#55d788]">
                    Your Achievements
                </p>

                <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                    My Certificates
                </h1>

                <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-emerald-900/15 bg-white/60 px-6 py-16 text-center backdrop-blur dark:border-white/15 dark:bg-white/3">
                    <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                        <Award className="size-9" />
                    </span>

                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        <Sparkles className="size-3.5" />
                        Coming Soon
                    </span>

                    <h2 className="text-xl font-bold sm:text-2xl">
                        Your Achievements Deserve Recognition!
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-[#557368] dark:text-[#b3c9bf]">
                        Complete events and earn certificates. All your
                        achievements will be available here to view and download.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default CartificatesPage

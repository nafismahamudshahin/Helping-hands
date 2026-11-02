import { BadgeCheck, CalendarCheck, MapPinned, Users } from "lucide-react"

const stats = [
    { value: "1,280+", label: "Events Organized", Icon: CalendarCheck, tone: "from-emerald-400 to-green-600 shadow-emerald-500/30" },
    { value: "52,300+", label: "Volunteers Joined", Icon: Users, tone: "from-sky-400 to-blue-600 shadow-sky-500/30" },
    { value: "310+", label: "Verified Organizations", Icon: BadgeCheck, tone: "from-violet-400 to-purple-600 shadow-violet-500/30" },
    { value: "42+", label: "Districts Covered", Icon: MapPinned, tone: "from-amber-400 to-orange-500 shadow-amber-500/30" },
]

export default function StatusSection() {
    return (
        <section className="bg-[#f4fbf6] px-5 pb-12 pt-2 transition-colors dark:bg-[#081b16] sm:px-8 sm:pb-16 lg:px-[6.65%]">
            <dl className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map(({ value, label, Icon, tone }) => (
                    <div
                        key={label}
                        className="group flex flex-col items-center gap-3 rounded-3xl border border-white/80 bg-white/70 p-5 text-center shadow-[0_10px_40px_-24px_rgba(15,65,42,0.4)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,65,42,0.5)] dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:gap-4 sm:p-6 sm:text-left"
                    >
                        <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-110 ${tone}`}>
                            <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col-reverse">
                            <dt className="mt-1 text-xs font-medium text-[#557368] dark:text-[#b3c9bf] sm:text-sm">{label}</dt>
                            <dd className="text-2xl font-extrabold leading-none tracking-tight text-[#092d23] dark:text-[#f1f8f3] sm:text-3xl">{value}</dd>
                        </div>
                    </div>
                ))}
            </dl>
        </section>
    )
}
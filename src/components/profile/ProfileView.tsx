"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarCheck, CalendarPlus, Camera, Clock, Pencil, Share2, Users } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { ProfileBadge, ProfileEvents, ProfileFormValues, ProfileStat, ProfileUser } from "@/types"
import { card, container, heading, muted, outlineBtn, primaryBtn } from "@/lib/ui"
import { EditProfileForm } from "./EditProfile"

const statIcons = [CalendarCheck, Clock, CalendarPlus, Users]
const tabs = ["Joined", "Created"] as const
type Tab = (typeof tabs)[number]

function GoalRing({ value, goal }: { value: number | null; goal: number | null }) {
    const r = 44
    const c = 2 * Math.PI * r
    const pct = value !== null && goal !== null && goal > 0 ? Math.min(value / goal, 1) : 0
    return (
        <div className="relative grid size-[112px] place-items-center">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-[#def2e6] dark:stroke-[#123b2b]" />
                <circle
                    cx="50" cy="50" r={r} fill="none" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
                    className="stroke-[#16a653] transition-all duration-700 dark:stroke-[#45d879]"
                />
            </svg>
            <div className="absolute text-center leading-tight">
                <div className="text-xl font-extrabold text-[#082e24] dark:text-[#f3f9f5]">{value === null ? "—" : `${value}h`}</div>
                <div className="text-[10px] font-semibold text-[#56716a] dark:text-[#b3c9bf]">{goal === null ? "tracked" : `of ${goal}h`}</div>
            </div>
        </div>
    )
}

type Props = {
    user: ProfileUser
    stats: ProfileStat[] // 4 items: joined, hours, created, reached
    goal: { hours: number | null; target: number | null }
    badges: ProfileBadge[]
    events: ProfileEvents
    saving?: boolean
    onSave: (values: ProfileFormValues) => void | Promise<void>
    onShare?: () => void
}

export function ProfileView({ user, stats, goal, badges, events, saving, onSave, onShare }: Props) {
    const [tab, setTab] = useState<Tab>("Joined")
    const [editing, setEditing] = useState(false)
    const list = events[tab.toLowerCase() as keyof ProfileEvents]
    const remaining = goal.hours !== null && goal.target !== null ? Math.max(goal.target - goal.hours, 0) : null

    return (
        <main className="min-h-screen bg-[#f4fbf6] pb-16 text-[#092d23] dark:bg-[#081b16] dark:text-[#f1f8f3]">
            {/* Cover */}
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-[#082e24] via-[#0b4a37] to-[#1c8a5a] sm:h-[240px]">
                <div className="absolute -left-10 -top-16 size-64 rounded-full bg-[#45d879]/20 blur-3xl" />
                <div className="absolute -bottom-20 right-10 size-72 rounded-full bg-[#86efac]/20 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            </div>

            <div className={container}>
                {/* Header */}
                <section className={cn(card, "relative -mt-16 p-5 sm:-mt-20 sm:p-7")}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                        <div className="relative -mt-16 size-28 shrink-0 sm:-mt-20 sm:size-36">
                            <div className="relative size-full overflow-hidden rounded-full border-4 border-white bg-[#dff1e5] shadow-lg dark:border-[#10291f] dark:bg-[#123b2b]">
                                {user.avatarUrl ? (
                                    <Image src={user.avatarUrl} alt={user.name} fill sizes="144px" unoptimized className="object-cover" />
                                ) : (
                                    <span className="grid size-full place-items-center text-4xl font-extrabold text-[#075b3c] dark:text-[#a8e4bd]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                aria-label="Change photo"
                                onClick={() => setEditing(true)}
                                className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full bg-[#064c38] text-white shadow-md transition hover:scale-105 dark:bg-[#25a95e] dark:text-[#062817]"
                            >
                                <Camera className="size-4" />
                            </button>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className={cn(heading, "text-2xl sm:text-3xl")}>{user.name}</h1>
                                {user.verified && (
                                    <span className="rounded-full bg-[#def2e6] px-2.5 py-1 text-[11px] font-semibold text-[#075b3c] dark:bg-[#123b2b] dark:text-[#a8e4bd]">
                                        Verified Volunteer
                                    </span>
                                )}
                            </div>
                            <p className={cn("mt-0.5 flex flex-wrap items-center gap-x-2 text-sm", muted)}>
                                <span>@{user.username}</span>
                                <span>·</span>
                                <span>Joined {user.joinedAt}</span>
                            </p>
                            <p className={cn("mt-1 text-sm", muted)}>{user.email}</p>
                        </div>

                        <div className="flex gap-2.5">
                            <Button onClick={() => setEditing((v) => !v)} className={cn(primaryBtn, "gap-2")}>
                                <Pencil className="size-3.5" />
                                {editing ? "Close" : "Edit Profile"}
                            </Button>
                            <Button variant="outline" onClick={onShare} className={cn(outlineBtn, "px-3.5")} aria-label="Share profile">
                                <Share2 className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {editing && (
                        <EditProfileForm
                            user={user}
                            saving={saving}
                            onCancel={() => setEditing(false)}
                            onSubmit={async (v) => {
                                await onSave(v)
                                setEditing(false)
                            }}
                        />
                    )}
                </section>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((s, i) => {
                        const Icon = statIcons[i % statIcons.length]
                        return (
                            <div key={s.label} className={cn(card, "flex items-center gap-4 p-5 transition hover:-translate-y-0.5")}>
                                <div className="grid size-11 place-items-center rounded-xl bg-[#def2e6] text-[#075b3c] dark:bg-[#123b2b] dark:text-[#a8e4bd]">
                                    <Icon className="size-5" />
                                </div>
                                <div>
                                    <div className={cn(heading, "text-2xl leading-none")}>{s.value}</div>
                                    <div className={cn("mt-1 text-xs", muted)}>{s.label}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[320px_1fr]">
                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <section className={cn(card, "p-5")}>
                            <h2 className={cn(heading, "mb-4 text-base")}>Volunteer Goal</h2>
                            <div className="flex items-center gap-5">
                                <GoalRing value={goal.hours} goal={goal.target} />
                                <p className={cn("text-[13px] leading-relaxed", muted)}>
                                    {remaining === null ? "Hours appear here when event data includes volunteer hours." : remaining > 0 ? `${remaining} more hours to reach your yearly goal.` : "Goal reached. Amazing work!"}
                                </p>
                            </div>
                        </section>

                        {user.interests.length > 0 && (
                            <section className={cn(card, "p-5")}>
                                <h2 className={cn(heading, "mb-4 text-base")}>Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map((i) => (
                                        <span key={i} className="rounded-full border border-[#c5dfd0] bg-[#f4fbf6] px-3 py-1.5 text-xs font-semibold text-[#075b3c] dark:border-[#365b4a] dark:bg-[#081b16] dark:text-[#a8e4bd]">
                                            {i}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {badges.length > 0 && (
                            <section className={cn(card, "p-5")}>
                                <h2 className={cn(heading, "mb-4 text-base")}>Badges</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {badges.map(({ icon: Icon, name, tone }) => (
                                        <div key={name} className="text-center">
                                            <div className={cn("mx-auto grid size-14 place-items-center rounded-2xl", tone)}>
                                                <Icon className="size-6" />
                                            </div>
                                            <div className="mt-1.5 text-[11px] font-semibold leading-tight">{name}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* Events */}
                    <section className={cn(card, "p-5 sm:p-6")}>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex gap-1 rounded-full bg-[#def2e6] p-1 dark:bg-[#123b2b]">
                                {tabs.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={cn(
                                            "rounded-full px-4 py-1.5 text-[13px] font-semibold transition",
                                            tab === t
                                                ? "bg-white text-[#064c38] shadow-sm dark:bg-[#25a95e] dark:text-[#062817]"
                                                : "text-[#56716a] hover:text-[#064c38] dark:text-[#b3c9bf] dark:hover:text-white"
                                        )}
                                    >
                                        {t} <span className="opacity-60">{events[t.toLowerCase() as keyof ProfileEvents].length}</span>
                                    </button>
                                ))}
                            </div>
                            <Link href="/upcoming-events" className="text-[13px] font-semibold text-[#16a653] dark:text-[#45d879]">
                                Find more events →
                            </Link>
                        </div>

                        {list.length === 0 ? (
                            <div className="grid place-items-center rounded-xl border border-dashed border-[#c5dfd0] py-14 text-center dark:border-[#365b4a]">
                                <p className="font-bold text-[#082e24] dark:text-[#f3f9f5]">Nothing here yet</p>
                                <p className={cn("mt-1 text-[13px]", muted)}>Events you {tab.toLowerCase()} will show up here.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {list.map((e) => (
                                    <li key={e.id} className="group flex items-center gap-4 rounded-xl border border-transparent p-2.5 transition hover:border-[#c5dfd0] hover:bg-[#f4fbf6] dark:hover:border-[#365b4a] dark:hover:bg-[#12302a]">
                                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#dff1e5] dark:bg-[#123b2b]">
                                             <Image src={e.image} alt="" fill sizes="96px" unoptimized className="object-cover transition duration-300 group-hover:scale-105" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[11px] font-bold uppercase tracking-wide text-[#16a653] dark:text-[#45d879]">{e.category}</span>
                                            <h3 className="truncate text-[15px] font-bold text-[#082e24] dark:text-[#f3f9f5]">{e.title}</h3>
                                            <p className={cn("flex flex-wrap gap-x-3 text-xs", muted)}>
                                                <span>📅 {e.date}</span>
                                                <span>📍 {e.location}</span>
                                            </p>
                                        </div>
                                        <Link
                                            href={`/events/${e.id}`}
                                            className={cn(buttonVariants({ variant: "outline", size: "sm" }), outlineBtn, "hidden h-8 px-4 sm:inline-flex")}
                                        >
                                            View
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </main>
    )
}

"use client"

import { ProfileView } from "@/components/profile/ProfileView"
import { authClient, useSession } from "@/lib/auth-client"
import { ProfileEventItem, ProfileFormValues } from "@/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getClientJwtToken } from "@/lib/getClientJwtToken"

const FALLBACK_IMAGE = "/images/event-community-volunteers.jpg"
const todayInDhaka = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
}).format(new Date())

type Activity = {
    joined: ProfileEventItem[]
    created: ProfileEventItem[]
    joinedCount: number
    reached: number
    hours: number | null
}

const emptyActivity: Activity = { joined: [], created: [], joinedCount: 0, reached: 0, hours: null }

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getRecords(payload: unknown): Record<string, unknown>[] {
    const list = Array.isArray(payload)
        ? payload
        : isRecord(payload) && Array.isArray(payload.events)
            ? payload.events
            : isRecord(payload) && Array.isArray(payload.data)
                ? payload.data
                : []
    return list.filter(isRecord)
}

function toProfileEvent(value: Record<string, unknown>, id: string): ProfileEventItem | null {
    if (typeof value.title !== "string") return null
    const date = typeof value.date === "string" ? value.date : ""
    const eventDay = date.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
    const location = typeof value.location === "string" ? value.location : ""
    const image = value.thumbnailUrl ?? value.thumbnail ?? value.image
    return {
        id,
        title: value.title,
        category: typeof value.category === "string" ? value.category : "Community",
        date: date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Date not set",
        location: location || "Location not set",
        image: typeof image === "string" && image ? image : FALLBACK_IMAGE,
        completed: Boolean(eventDay && eventDay < todayInDhaka),
    }
}

export default function ProfilePage() {
    const [saving, setSaving] = useState(false)
    const [activity, setActivity] = useState<Activity>(emptyActivity)
    const [activityLoading, setActivityLoading] = useState(true)
    const { data: session, isPending } = useSession()
    const authUser = session?.user
    const userId = authUser?.id

    useEffect(() => {
        const currentUserId = userId
        if (typeof currentUserId !== "string" || !currentUserId) return
        const authenticatedUserId: string = currentUserId

        let cancelled = false
        async function loadActivity() {
            setActivityLoading(true)
            const apiUrl = process.env.NEXT_PUBLIC_API_URL
            if (!apiUrl) {
                setActivityLoading(false)
                toast.error("The events service is not configured.")
                return
            }

            try {
                const token = await getClientJwtToken()
                if (!token) throw new Error("Could not authenticate with the events service.")
                const headers = { Authorization: `Bearer ${token}` }
                const [createdResponse, joinedResponse] = await Promise.all([
                    fetch(`${apiUrl}/events/my/${encodeURIComponent(authenticatedUserId)}`, { cache: "no-store", headers }),
                    fetch(`${apiUrl}/participants/me/${encodeURIComponent(authenticatedUserId)}`, { cache: "no-store", headers }),
                ])
                if (!createdResponse.ok) throw new Error(`Created events request failed (${createdResponse.status}).`)
                if (!joinedResponse.ok) throw new Error(`Joined events request failed (${joinedResponse.status}).`)

                const [createdPayload, joinedPayload] = await Promise.all([
                    createdResponse.json() as Promise<unknown>,
                    joinedResponse.json() as Promise<unknown>,
                ])
                const createdRecords = getRecords(createdPayload)
                const created = createdRecords.flatMap((event) => {
                    const id = typeof event._id === "string" ? event._id : typeof event.id === "string" ? event.id : null
                    const item = id ? toProfileEvent(event, id) : null
                    return item ? [item] : []
                })
                const joins = getRecords(joinedPayload).filter((join) => typeof join.eventId === "string")
                const uniqueIds = [...new Set(joins.map((join) => join.eventId as string))]
                const fetchedEvents = await Promise.all(uniqueIds.map(async (id) => {
                    const response = await fetch(`${apiUrl}/events/${encodeURIComponent(id)}`, { cache: "no-store", headers })
                    if (!response.ok) return null
                    const payload: unknown = await response.json()
                    const record = isRecord(payload) && isRecord(payload.event) ? payload.event : payload
                    return isRecord(record) ? toProfileEvent(record, id) : null
                }))
                const eventById = new Map(fetchedEvents.filter((event): event is ProfileEventItem => event !== null).map((event) => [event.id, event]))
                const joined = uniqueIds.flatMap((id) => {
                    const event = eventById.get(id)
                    return event ? [event] : []
                })
                const reached = createdRecords.reduce((total, event) => total + (typeof event.joined === "number" ? event.joined : 0), 0)
                if (!cancelled) {
                    setActivity({ joined, created, joinedCount: joins.length, reached, hours: joined.filter((event) => event.completed).length * 3 })
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Unable to load profile activity:", error)
                    toast.error("Could not load your event activity. Please try again later.")
                    setActivity(emptyActivity)
                }
            } finally {
                if (!cancelled) setActivityLoading(false)
            }
        }

        void loadActivity()
        return () => { cancelled = true }
    }, [userId])

    if (isPending) {
        return <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-16 text-center">Loading your profile…</main>
    }

    if (authUser && activityLoading) {
        return <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-16 text-center">Loading your profile activity…</main>
    }

    if (!authUser) {
        return (
            <main className="mx-auto grid min-h-[60vh] max-w-5xl place-items-center px-5 py-16 text-center">
                <div>
                    <h1 className="text-2xl font-bold">Sign in to view your profile</h1>
                    <p className="mt-2 text-muted-foreground">Your profile information is available after you sign in.</p>
                    <Button render={<Link href="/login" />} className="mt-5">Log in</Button>
                </div>
            </main>
        )
    }

    const user = {
        name: authUser.name || "HelpingHands volunteer",
        email: authUser.email,
        avatarUrl: authUser.image ?? null,
        joinedAt: new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date(authUser.createdAt)),
        verified: authUser.emailVerified,
        username: authUser.email.split("@")[0] || "volunteer",
        interests: [],
    }

    async function handleSave(values: ProfileFormValues) {
        setSaving(true)
        try {
            const avatarUrl = values.avatarUrl.trim()
            if (avatarUrl) {
                const parsedUrl = new URL(avatarUrl)
                if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
                    throw new Error("Photo URL must start with http:// or https://.")
                }
            }
            const { error } = await authClient.updateUser({
                name: values.name,
                image: avatarUrl || null,
            })
            if (error) throw new Error(error.message)
            toast.success("Profile updated")
            if (values.username !== user.username) {
                toast.info("Username changes aren’t supported yet; your other profile details were saved.")
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not save changes")
        } finally {
            setSaving(false)
        }
    }

    return (
        <ProfileView
            user={user}
            stats={[
                { label: "Events Joined", value: String(activity.joinedCount) },
                { label: "Hours Given", value: activity.hours === null ? "—" : `${activity.hours}h` },
                { label: "Events Created", value: String(activity.created.length) },
                { label: "People Reached", value: String(activity.reached) },
            ]}
            goal={{ hours: activity.hours, target: null }}
            badges={[]}
            events={{ joined: activity.joined, created: activity.created }}
            saving={saving}
            onSave={handleSave}
            onShare={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Profile link copied")
            }}
        />
    )
}

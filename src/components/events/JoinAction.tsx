"use client"

import { authClient } from "@/lib/auth-client"
import { EventType } from "@/types"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getClientJwtToken } from "@/lib/getClientJwtToken"
import { isPastEvent } from "@/commonfeatures/common-function"

const JoinAction = ({ event }: { event: EventType }) => {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()
    const [joinedKey, setJoinedKey] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [checkingJoinKey, setCheckingJoinKey] = useState<string | null>(null)
    const userId = session?.user?.id
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const joinKey = userId ? `${userId}:${event._id}` : null
    const joined = joinKey !== null && joinedKey === joinKey
    const checkingJoin = joinKey !== null && checkingJoinKey === joinKey
    const ended = isPastEvent(event?.date)

    useEffect(() => {
        let cancelled = false

        if (!userId) {
            return
        }

        const checkJoinStatus = async () => {
            setCheckingJoinKey(joinKey)

            try {
                if (!apiUrl) {
                    throw new Error("The events service is not configured.")
                }

                const token = await getClientJwtToken()
                if (!token) {
                    throw new Error("Please log in again to check your event status.")
                }

                const res = await fetch(
                    `${apiUrl}/check-join/${encodeURIComponent(userId)}/${encodeURIComponent(event._id)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`)
                }

                const data = await res.json()
                if (typeof data.joined !== "boolean") {
                    throw new Error("The join status response was invalid.")
                }
                if (!cancelled) {
                    setJoinedKey(data.joined ? joinKey : null)
                }
            } catch (error) {
                console.error("Check join status error:", error)
                if (!cancelled) {
                    toast.error(error instanceof Error ? error.message : "Couldn’t check your join status.")
                }
            } finally {
                if (!cancelled) setCheckingJoinKey(null)
            }
        }

        checkJoinStatus()

        return () => {
            cancelled = true
        }
    }, [apiUrl, userId, event._id, joinKey])

    const handleJoin = async () => {
        if (isPending) return

        if (!userId) {
            toast.info("Please log in to join this event.")
            router.push("/login")
            return
        }

        if (joined || loading || checkingJoin) {
            return
        }

        if (!apiUrl) {
            toast.error("The events service is not configured.")
            return
        }

        if (ended) {
            toast.warning("This event has already ended", {
                description: "You can only join upcoming or ongoing events.",
            })
            return
        }

        try {
            setLoading(true)
            const token = await getClientJwtToken()
            if (!token) {
                throw new Error("Your session has expired. Please log in again.")
            }

            const res = await fetch(`${apiUrl}/participants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    eventId: event._id,
                    eventDate: event.date,
                    joinDate: new Date().toISOString(),
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.message || "Failed to join event")
            }

            // The participation was created. Keep the UI in sync even if the
            // separate count endpoint fails; the API should ideally update both atomically.
            setJoinedKey(joinKey)

            const countRes = await fetch(
                `${apiUrl}/count-joined/${encodeURIComponent(event._id)}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (!countRes.ok) {
                toast.success("You joined the event. The participant count may take a moment to update.")
            } else {
                toast.success("Successfully joined the event!")
            }
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const busy = isPending || loading || checkingJoin

    return (
        <Button
            onClick={handleJoin}
            disabled={busy || joined || ended}
            className="w-full bg-green-600 hover:bg-green-700"
        >
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isPending
                ? "Loading..."
                : loading
                    ? "Joining..."
                    : checkingJoin
                        ? "Checking..."
                        : joined
                            ? "Already Joined ✓"
                            : ended
                                ? "Event Ended"
                                : "Join Event"}
        </Button>
    )
}

export default JoinAction
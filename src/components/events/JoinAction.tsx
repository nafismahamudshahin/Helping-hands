"use client"

import { authClient } from "@/lib/auth-client"
import { EventType } from "@/types"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const JoinAction = ({ event }: { event: EventType }) => {
    const { data: session } = authClient.useSession()

    const [joined, setJoined] = useState(false)
    const [loading, setLoading] = useState(false)

    const userId = session?.user?.id

    // Check already joined
    useEffect(() => {
        if (!userId) return

        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/check-join/${userId}/${event._id}`
        )
            .then(res => res.json())
            .then(data => {
                setJoined(data.joined)

                if (data.joined) {
                    toast.info("You already joined this event!")
                }
            })
            .catch(error => console.error(error))

    }, [userId, event._id])

    // Join event
    const handleJoin = async () => {
        if (!userId) {
            toast.error("Please login first!")
            return
        }

        if (joined) {
            return
        }

        try {
            setLoading(true)

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/join-event`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        eventId: event._id,
                        joinDate: new Date().toISOString(),
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to join event")
            }

            const countRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/count-joined/${event._id}`,
                {
                    method: "PATCH",
                }
            )
            if (!countRes.ok) {
                throw new Error("Joined successfully, but count update failed")
            }

            setJoined(true)

            toast.success("Successfully joined the event!")

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleJoin}
            disabled={loading || !userId || joined}
            className="w-full bg-green-600 hover:bg-green-700"
        >
            {loading
                ? "Joining..."
                : joined
                    ? "Already Joined ✓"
                    : "Join Event"}
        </Button>
    )
}

export default JoinAction
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarX2, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { getClientJwtToken } from "@/lib/getClientJwtToken"

type EventInfo = {
    title: string
    date: string
    location: string
    thumbnail?: string
}


export function LeaveEventButton({ joinId, event }: { joinId: string; event: EventInfo }) {
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    const [busy, setBusy] = useState(false)

    async function leave() {
        setBusy(true)
        const token = await getClientJwtToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participants/me/${joinId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })

            if (!res.ok) {
                throw new Error(`Status ${res.status}`)
            }

            toast.success("You’ve left the event")

            router.refresh() // re-runs the server page
        } catch {
            toast.error("Couldn’t update. Please try again.")
            setBusy(false)
        }
    }

    if (!confirming) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirming(true)}
                aria-label={`I don’t go to ${event.title}`}
                className="rounded-full px-3 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
                <CalendarX2 className="size-4" aria-hidden="true" />
                I don&apos;t go
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95">
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={busy}
                onClick={() => setConfirming(false)}
                aria-label="Cancel"
                className="rounded-full"
            >
                <X className="size-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                disabled={busy}
                onClick={leave}
                className="rounded-full bg-red-600 px-3 text-white hover:bg-red-700"
            >
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CalendarX2 className="size-4" aria-hidden="true" />}
                Yes, leave
            </Button>
        </div>
    )
}
"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getClientJwtToken } from "@/lib/getClientJwtToken"
import type { EventType } from "@/types"

const DeleteEvent = ({ event }: { event: EventType }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        // keep the dialog open while the request is running
        e.preventDefault()
        if (loading) return

        setLoading(true)
        try {
            const token = await getClientJwtToken()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.message || "Delete failed")

            toast.success("Event deleted successfully!")
            setOpen(false)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog
            open={open}
            // block closing (overlay click / Esc) while deleting
            onOpenChange={(next) => !loading && setOpen(next)}
        >
            <AlertDialogTrigger
                className="inline-flex size-9 items-center justify-center rounded-full text-red-600 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                aria-label={`Delete ${event.title}`}
                title="Delete event"
            >
                <Trash2 className="size-4" />
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        event <span className="font-semibold text-foreground">{event.title}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} className="rounded-full">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        aria-busy={loading}
                        className="rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
                    >
                        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEvent
"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
    CalendarDays,
    ImageIcon,
    Loader2,
    MapPin,
    Pencil,
    Save,
    Tag,
} from "lucide-react"
import { toast } from "sonner"

import type { EventType } from "@/types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getClientJwtToken } from "@/lib/getClientJwtToken"
import { isPastEvent } from "@/commonfeatures/common-function"

// Fields this form edits. Intersected so it works even if EventType lacks some of them.
type EditableEvent = EventType &
    Partial<{
        _id: string
        title: string
        category: string
        date: string
        time: string
        location: string
        thumbnailUrl: string
        joined: number
        description: string
    }>

function Field({
    id,
    label,
    icon: Icon,
    children,
    className = "",
}: {
    id: string
    label: string
    icon: typeof Pencil
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                {label}
            </Label>
            {children}
        </div>
    )
}

const inputClass =
    "h-10 rounded-xl focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
const EditEvent = ({ event: rawEvent }: { event: EventType }) => {
    const event = rawEvent as EditableEvent
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [thumb, setThumb] = useState(event.thumbnailUrl ?? "")
    const [thumbBroken, setThumbBroken] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (saving || !event._id) return
        const ended = isPastEvent(event?.date)
        if (ended) {
            toast.warning("This Event is Ended!", {
                description: "You can't Edit this Event Information.",
            })
            return
        }
        const fd = new FormData(e.currentTarget)
        const text = (k: string) => String(fd.get(k) ?? "").trim()

        const title = text("title")
        const category = text("category")
        const date = text("date")
        const location = text("location")
        const thumbnailUrl = text("thumbnailUrl")
        // keep description a string; tidy each line and cap blank lines at one
        const description = text("description")
            .split("\n")
            .map((line) => line.trim())
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")

        // --- validation ---
        if (title.length < 3 || title.length > 80) {
            toast.error("Title must be between 3 and 80 characters.")
            return
        }

        if (!category) {
            toast.error("Please choose an event type.")
            return
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
            toast.error("Please enter a valid date.")
            return
        }
        if (isPastEvent(date)) {
            toast.error("The event date must be today or in the future.")
            return
        }

        if (location.length < 3 || location.length > 100) {
            toast.error("Location must be between 3 and 100 characters.")
            return
        }
        if (!/\p{L}/u.test(location) || !/^[\p{L}\p{N}\s,.\-/#()']+$/u.test(location)) {
            toast.error("Please enter a valid location, for example: Mirpur 10, Dhaka.")
            return
        }

        if (description.length < 20 || description.length > 1000) {
            toast.error("Description must be between 20 and 1000 characters.")
            return
        }

        try {
            const url = new URL(thumbnailUrl)
            if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("bad protocol")
        } catch {
            toast.error("Please enter a valid image URL starting with http:// or https://")
            return
        }

        const payload = { title, category, date, location, thumbnailUrl, description }

        setSaving(true)
        const token = await getClientJwtToken()
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(`Status ${res.status}`)

            toast.success("Event updated successfully")
            setOpen(false)
            router.refresh() // re-runs the server page so the card shows new data
        } catch (error) {
            console.error("Update event failed:", error)
            toast.error("Couldn’t update the event. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(true)}
                aria-label={`Edit ${event.title}`}
                title="Edit event"
                className="rounded-full text-[#557368] hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-[#b3c9bf] dark:hover:text-emerald-300"
            >
                <Pencil className="size-4" />
            </Button>

            <Dialog open={open} onOpenChange={(v) => !saving && setOpen(v)}>
                <DialogContent className="max-h-[90vh] gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-2xl">
                    {/* Header */}
                    <DialogHeader className="border-b bg-linear-to-r from-emerald-500/10 via-transparent to-transparent p-6 pr-14">
                        <div className="flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                                <Pencil className="size-5" aria-hidden="true" />
                            </span>
                            <div className="text-left">
                                <DialogTitle className="text-xl font-bold">Edit event</DialogTitle>
                                <DialogDescription className="mt-0.5">
                                    Update the details of &ldquo;{event.title}&rdquo;.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" aria-busy={saving}>
                        {/* Scrollable body */}
                        <div className="max-h-[60vh] space-y-5 overflow-y-auto p-6">
                            <Field id="title" label="Event title" icon={Pencil}>
                                <Input id="title" name="title" required defaultValue={event.title} className={inputClass} />
                            </Field>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field id="category" label="Category" icon={Tag}>
                                    <Input id="category" name="category" defaultValue={event.category ?? ""} placeholder="e.g. Environment" className={inputClass} />
                                </Field>
                                <Field id="date" label="Date" icon={CalendarDays}>
                                    <Input id="date" min={new Date().toISOString().split("T")[0]} name="date" type="date" required defaultValue={event.date?.slice(0, 10)} className={inputClass} />
                                </Field>
                            </div>

                            <Field id="location" label="Location" icon={MapPin}>
                                <Input id="location" name="location" required defaultValue={event.location} className={inputClass} />
                            </Field>

                            <Field id="thumbnailUrl" label="Cover image URL" icon={ImageIcon}>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="thumbnailUrl"
                                        name="thumbnailUrl"
                                        type="url"
                                        value={thumb}
                                        onChange={(e) => {
                                            setThumb(e.target.value)
                                            setThumbBroken(false)
                                        }}
                                        placeholder="https://example.com/cover.jpg"
                                        className={inputClass}
                                    />
                                    {thumb && !thumbBroken && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={thumb}
                                            alt=""
                                            onError={() => setThumbBroken(true)}
                                            className="size-10 shrink-0 rounded-xl border object-cover"
                                        />
                                    )}
                                </div>
                            </Field>

                            <Field id="description" label="Description" icon={Pencil}>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    defaultValue={event.description ?? ""}
                                    className="rounded-xl focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                                />
                            </Field>
                        </div>

                        {/* Footer */}
                        <DialogFooter className="border-t bg-muted/40 p-4 sm:px-6">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={saving}
                                onClick={() => setOpen(false)}
                                className="rounded-full px-5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-6 text-white shadow-md shadow-emerald-600/30 hover:brightness-110"
                            >
                                {saving ? (
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <Save className="size-4" aria-hidden="true" />
                                )}
                                {saving ? "Saving…" : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditEvent

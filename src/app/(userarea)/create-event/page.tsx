"use client";

import { useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
  Tag,
  Type,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth-client"
import { getClientJwtToken } from "@/lib/getClientJwtToken";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

const eventTypes = [
  "Environment",
  "Education",
  "Health",
  "Food Support",
  "Winter Support",
  "Community",
]

const field =
  "h-11 rounded-xl border-emerald-900/10 bg-white/80 pl-10 text-sm shadow-sm transition placeholder:text-[#8a9b92] focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-[#748a7d]"

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string
  label: string
  icon: typeof Type
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-[#3b5a4c] dark:text-[#cfe3d6]">
        {label} <span className="text-emerald-500">*</span>
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}

export default function CreateEventPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [imgFailed, setImgFailed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const today = new Date().toISOString().split("T")[0]
  const router = useRouter()
  const handleEventCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const event = {
      ...Object.fromEntries(new FormData(form).entries()),
      joined: 0,
      organizer: user?.name,
      organizerPhoto: user?.image,
      userId: user?.id,
    }

    setSubmitting(true)
    setStatus("idle")
    const token = await getClientJwtToken()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      })
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      setStatus("success")
      form.reset()
      setTitle("")
      setLocation("")
      setDate("")
      setThumbnail("")
      router.push("/manage-event");
      toast.success("Event created successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
      setStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const prettyDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Pick a date"

  return (
    <section className="relative isolate min-h-full overflow-hidden bg-linear-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-8 text-[#0f3325] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff8f2] sm:px-8 sm:py-12 lg:px-[6.65%]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-140 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />

      <div className="mx-auto container">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 backdrop-blur dark:border-emerald-300/20 dark:bg-white/5 dark:text-emerald-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            New event
          </span>
          <h1 className="mt-4 bg-linear-to-r from-[#0f3325] via-emerald-700 to-emerald-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-emerald-200 dark:to-emerald-400 md:text-5xl">
            Create Event
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Organize a social service event for your community.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Form */}
          <div className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_-28px_rgba(15,65,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-white/4 sm:p-8">
            <form onSubmit={handleEventCreate} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="event-title" label="Event Title" icon={Type}>
                  <Input
                    id="event-title"
                    name="title"
                    placeholder="Winter Clothes Distribution"
                    className={field}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Field>

                <Field id="event-type" label="Event Type" icon={Tag}>
                  <Select defaultValue="Winter Support" name="category">
                    <SelectTrigger id="event-type" className={`${field} w-full`}>
                      <SelectValue placeholder="Choose an event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="event-date" label="Event Date" icon={CalendarDays}>
                  <Input
                    id="event-date"
                    name="date"
                    type="date"
                    min={today}
                    className={`${field} text-[#526e60] dark:text-[#d8e9de]`}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Field>

                <Field id="event-location" label="Location" icon={MapPin}>
                  <Input
                    id="event-location"
                    name="location"
                    placeholder="Mirpur 10, Dhaka"
                    className={field}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description" className="text-xs font-semibold uppercase tracking-wide text-[#3b5a4c] dark:text-[#cfe3d6]">
                  Description <span className="text-emerald-500">*</span>
                </Label>
                <Textarea
                  id="event-description"
                  name="description"
                  rows={5}
                  placeholder="Tell volunteers what this event is about and how they can help..."
                  className="min-h-28 resize-y rounded-xl border-emerald-900/10 bg-white/80 text-sm shadow-sm transition placeholder:text-[#8a9b92] focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-[#748a7d]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Field id="thumbnail-url" label="Thumbnail URL" icon={ImageIcon}>
                  <Input
                    id="thumbnail-url"
                    name="thumbnailUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    className={field}
                    onChange={(e) => {
                      setThumbnail(e.target.value)
                      setImgFailed(false)
                    }}
                    required
                  />
                </Field>
                <p className="text-xs text-muted-foreground">The event date must be today or in the future.</p>
              </div>

              {status === "success" && (
                <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Event created successfully.
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40 disabled:translate-y-0 disabled:opacity-70"
              >
                {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {submitting ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </div>

          {/* Live preview */}
          <aside className="lg:sticky lg:top-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Live preview</p>
            <article className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_18px_50px_-28px_rgba(15,65,42,0.5)] dark:border-white/10 dark:bg-[#10251b]">
              <div className="relative aspect-16/10 bg-linear-to-br from-emerald-100 to-emerald-200 dark:from-[#183629] dark:to-[#0f2a1e]">
                {thumbnail && !imgFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt=""
                    className="size-full object-cover"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-emerald-600/60 dark:text-emerald-300/40">
                    <ImageIcon className="size-10" aria-hidden="true" />
                  </div>
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="line-clamp-2 text-lg font-bold tracking-tight">{title || "Your event title"}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    {prettyDate}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span className="truncate">{location || "Event location"}</span>
                  </p>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}

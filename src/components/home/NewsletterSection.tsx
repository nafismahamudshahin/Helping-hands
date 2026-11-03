import { Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
  return (
    <section className="bg-[#f4fbf6] px-5 pb-12 pt-4 transition-colors dark:bg-[#081b16] sm:px-8 sm:pb-16 lg:px-[6.65%]">
      <div className="relative isolate mx-auto flex max-w-7xl flex-col gap-8 overflow-hidden rounded-[32px] bg-linear-to-br from-[#06382a] via-[#0a5a41] to-[#12915a] px-6 py-10 text-white shadow-[0_28px_70px_-32px_rgba(5,72,48,0.85)] dark:from-[#0c3325] dark:via-[#0d3828] dark:to-[#0f5a3b] sm:px-10 md:flex-row md:items-center md:justify-between md:gap-10  lg:py-12">
        <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 left-1/4 -z-10 size-72 rounded-full bg-green-200/15 blur-3xl" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <div className="max-w-xl">
          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
            <Mail className="size-6 text-emerald-100" aria-hidden="true" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            A little good in your inbox
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Stay Updated with HelpingHands
          </h2>
          <p className="mt-2 text-sm leading-6 text-emerald-50/80 sm:text-base">
            Get the latest social events and volunteer opportunities.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 rounded-3xl border border-white/20 bg-white/10 p-2 backdrop-blur sm:flex-row sm:rounded-full md:max-w-120">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Email address</span>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="h-12 rounded-full border-transparent bg-white px-5 text-sm text-[#15382d] shadow-none placeholder:text-[#83958b] focus-visible:border-emerald-300 focus-visible:ring-4 focus-visible:ring-emerald-300/40 dark:bg-white"
            />
          </label>
          <Button
            type="button"
            className="h-12 shrink-0 rounded-full bg-linear-to-r from-emerald-400 to-green-500 px-6 text-sm font-semibold text-[#04281b] shadow-lg shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-green-400"
          >
            Subscribe
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}

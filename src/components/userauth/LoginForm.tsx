"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CalendarCheck2, HeartHandshake, Leaf, Loader2, Mail, ShieldCheck, Users } from "lucide-react"
import { toast } from "sonner"

import { PasswordField, TextField } from "./SignupForm"
import { ContinueWithGoogle } from "./ContinueWithGoogle"
import { signIn } from "@/lib/auth-client"

/* STATIC DEMO CONTENT – replace with real numbers whenever you like */
const STATS = [
  { Icon: Users, value: "2.4k+", label: "Volunteers" },
  { Icon: CalendarCheck2, value: "180+", label: "Events" },
  { Icon: HeartHandshake, value: "35", label: "Communities" },
]

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const remember = formData.get("remember") === "true"

    setSubmitting(true)
    try {
      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe: remember,
      })

      if (error) {
        toast.error(error.message || "Invalid email or password.")
        return
      }

      const firstName = data?.user?.name?.split(" ")[0]
      toast.success(firstName ? `Welcome back, ${firstName}!` : "Welcome back!", {
        description: "You have signed in successfully.",
      })

      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-linear-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-10 text-[#13382b] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff7f1] sm:px-8 sm:py-14 lg:px-[6.65%]">
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-140 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 -z-10 size-105 rounded-full bg-green-300/25 blur-[110px] dark:bg-green-600/10" />

      <div className="mx-auto grid container overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_40px_90px_-40px_rgba(14,65,39,0.35)] dark:border-white/10 dark:bg-[#0d2119] dark:shadow-black/40 md:min-h-155 md:grid-cols-[0.9fr_1.1fr]">
        {/* ------------------------------ Brand panel ------------------------------ */}
        <aside className="relative hidden overflow-hidden bg-[#0a3626] md:block">
          <Image
            src="/images/hero-volunteers-tree-plantation.jpg"
            alt="Volunteers working together in their community"
            fill
            priority
            sizes="(max-width: 1040px) 45vw, 470px"
            className="object-cover opacity-50"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#04150d] via-[#073221]/60 to-[#073221]/10" />
          <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 p-8">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-[#a7edbc] ring-1 ring-white/25 backdrop-blur">
              <Leaf className="size-5" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-white">
              Helping<span className="text-[#79db98]">Hands</span>
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 space-y-6 p-8 pb-10 text-white lg:p-10 lg:pb-12">
            <div>
              <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[#c5f0d1] backdrop-blur">
                <HeartHandshake className="size-3.5" aria-hidden="true" />
                Welcome back
              </p>
              <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight lg:text-[2.5rem]">
                Good to see you again.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                Pick up where you left off and keep making a difference in your community.
              </p>
            </div>

            {/* Stats */}
            <dl className="grid grid-cols-3 gap-2.5">
              {STATS.map(({ Icon, value, label }) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur">
                  <Icon className="mx-auto size-4 text-[#a7edbc]" aria-hidden="true" />
                  <dd className="mt-1.5 text-lg font-extrabold leading-none">{value}</dd>
                  <dt className="mt-1 text-[11px] text-white/70">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        {/* ------------------------------ Form panel ------------------------------ */}
        <div className="flex items-center px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto w-full max-w-105">
            {/* Mobile logo */}
            <div className="mb-8 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#e7f5eb] text-[#16814b] dark:bg-[#153d2a] dark:text-[#7ae39a]">
                  <Leaf className="size-4.5" />
                </span>
                Helping<span className="-ml-2 text-[#19a454]">Hands</span>
              </Link>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15834a] dark:text-[#6bdd92]">
              Welcome back
            </p>
            <h1 className="mt-2 bg-linear-to-r from-[#0f3325] via-emerald-700 to-emerald-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-emerald-200 dark:to-emerald-400 sm:text-[2.2rem]">
              Log in to HelpingHands
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#71857b] dark:text-[#a8bdb1]">
              Continue making a positive impact in your community.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={submitting}>
              <TextField
                label="Email address"
                icon={Mail}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                minLength={1}
              />

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="inline-flex cursor-pointer items-center gap-2 text-[#60776c] dark:text-[#b0c3b8]">
                  <input
                    type="checkbox"
                    name="remember"
                    value="true"
                    className="size-4 rounded border-[#c9d9ce] accent-[#168a4d]"
                  />
                  Remember me
                </label>
                {/* ⚠️ Point this to your real reset-password route */}
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[#147b46] hover:underline dark:text-[#6bdd92]"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#075237] via-[#0c7a46] to-[#14964c] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(12,130,67,0.85)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14964c] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:from-[#147a45] dark:to-[#23ad5b]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Logging in…
                  </>
                ) : (
                  <>
                    Log in
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <ContinueWithGoogle />

            <p className="mt-7 text-center text-sm text-[#71857b] dark:text-[#a8bdb1]">
              New to HelpingHands?{" "}
              <Link href="/signup" className="font-semibold text-[#117b44] hover:underline dark:text-[#6bdd92]">
                Create an account
              </Link>
            </p>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#8aa096] dark:text-[#7f9588]">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Your data is encrypted and never shared
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

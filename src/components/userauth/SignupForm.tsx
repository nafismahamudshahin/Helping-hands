"use client"

import { useState, type FormEvent, type InputHTMLAttributes } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  Image as ImageIcon,
  Leaf,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"
import { ContinueWithGoogle } from "./ContinueWithGoogle"
import { signOut, signUp } from "@/lib/auth-client"
import { toast } from "sonner"

/* -------------------------------------------------------------------------- */
/*  Shared fields (also imported by LoginForm – keep these exports!)          */
/* -------------------------------------------------------------------------- */
type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: typeof UserRound
}

const FIELD_WRAP =
  "flex h-[50px] items-center gap-3 rounded-xl border border-[#dbe8df] bg-white px-3.5 transition focus-within:border-[#20a45a] focus-within:ring-4 focus-within:ring-[#20a45a]/10 dark:border-white/10 dark:bg-white/[0.04] dark:focus-within:border-[#51d480] dark:focus-within:ring-[#51d480]/10"
const FIELD_INPUT =
  "h-full min-w-0 flex-1 bg-transparent text-sm text-[#17382d] outline-none placeholder:text-[#9aaba3] dark:text-[#eff7f1] dark:placeholder:text-[#71887c]"

export function TextField({ label, icon: Icon, ...props }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#19392e] dark:text-[#e7f1eb]">{label}</span>
      <span className={FIELD_WRAP}>
        <Icon className="size-4.25 shrink-0 text-[#789087] dark:text-[#91a99d]" aria-hidden="true" />
        <input {...props} className={FIELD_INPUT} />
      </span>
    </label>
  )
}

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  minLength = 6,
  placeholder = "Enter your password",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  minLength?: number
  placeholder?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#19392e] dark:text-[#e7f1eb]">{label}</span>
      <span className={FIELD_WRAP}>
        <LockKeyhole className="size-4.25 shrink-0 text-[#789087] dark:text-[#91a99d]" aria-hidden="true" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className={FIELD_INPUT}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="rounded-md p-1 text-[#789087] transition hover:text-[#147b46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20a45a] dark:text-[#91a99d] dark:hover:text-[#69df94]"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
    </label>
  )
}

/* -------------------------------------------------------------------------- */
/*  Password strength meter                                                   */
/* -------------------------------------------------------------------------- */
function getStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"]
  const colors = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-green-600"]
  return { score, label: labels[score], color: colors[score] }
}

function StrengthMeter({ password }: { password: string }) {
  if (!password) return null
  const { score, label, color } = getStrength(password)
  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? color : "bg-[#dbe8df] dark:bg-white/10"}`}
          />
        ))}
      </div>
      <p className="text-xs text-[#71857b] dark:text-[#a8bdb1]">
        Password strength: <span className="font-semibold">{label}</span>
      </p>
    </div>
  )
}

/* STATIC DEMO CONTENT – edit freely */
const PERKS = [
  "Join events in a single click",
  "Track every event you’ve joined",
  "Create and manage your own events",
]
const STATS = [
  { Icon: Users, value: "2.4k+", label: "Volunteers" },
  { Icon: CalendarCheck2, value: "180+", label: "Events" },
  { Icon: HeartHandshake, value: "35", label: "Communities" },
]

/* -------------------------------------------------------------------------- */
/*  Signup form                                                               */
/* -------------------------------------------------------------------------- */
export function SignupForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const { score } = getStrength(password)
    if (score < 4) {
      toast.warning("Please used more strong password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Your passwords don’t match. Please check and try again.")
      return
    }

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const photoUrl = (formData.get("photoUrl") as string)?.trim()
    if (photoUrl) {
      if (photoUrl.startsWith("data:") || photoUrl.length > 300) {
        toast.error("Please use a short image link (https://...), not an uploaded or encoded image.")
        return
      }
    }
    setSubmitting(true)
    try {
      const { error } = await signUp.email({
        name,
        email,
        image: photoUrl,
        password,
      })

      if (error) {
        console.error("Signup failed:", error.message)
        toast.error(error.message || "Could not create your account.")
        return
      }

      toast.success("Account created successfully!")
      await signOut();
      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-linear-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-10 text-[#13382b] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff7f1] sm:px-8 sm:py-14 lg:px-[6.65%]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-140 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 -z-10 size-105 rounded-full bg-green-300/25 blur-[110px] dark:bg-green-600/10" />

      <div className="mx-auto grid container overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_40px_90px_-40px_rgba(14,65,39,0.35)] dark:border-white/10 dark:bg-[#0d2119] dark:shadow-black/40 md:min-h-175 md:grid-cols-[0.9fr_1.1fr]">
        {/* ------------------------------ Brand panel ------------------------------ */}
        <aside className="relative hidden overflow-hidden bg-[#0a3626] md:block">
          <Image
            src="/images/hero-volunteers-tree-plantation.jpg"
            alt="Community volunteers planting a tree together"
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
                Small acts. Lasting change.
              </p>
              <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight lg:text-[2.5rem]">
                Be part of something good.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                Meet your community, find meaningful events, and make every bit of help count.
              </p>
            </div>

            <ul className="space-y-2.5">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-white/90">
                  <CheckCircle2 className="size-4.5 shrink-0 text-[#79db98]" aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>

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
            <div className="mb-8 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#e7f5eb] text-[#16814b] dark:bg-[#153d2a] dark:text-[#7ae39a]">
                  <Leaf className="size-4.5" />
                </span>
                Helping<span className="-ml-2 text-[#19a454]">Hands</span>
              </Link>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15834a] dark:text-[#6bdd92]">
              Join our community
            </p>
            <h1 className="mt-2 bg-linear-to-r from-[#0f3325] via-emerald-700 to-emerald-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-emerald-200 dark:to-emerald-400 sm:text-[2.2rem]">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#71857b] dark:text-[#a8bdb1]">
              Start making a difference, one good deed at a time.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" aria-busy={submitting}>
              <TextField
                label="Full name"
                icon={UserRound}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                required
              />
              <TextField
                label="Email address"
                icon={Mail}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              <TextField
                label="Photo URL"
                icon={ImageIcon}
                name="photoUrl"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
                required
              />

              <div className="space-y-2.5">
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                />
                <StrengthMeter password={password} />
              </div>

              <div className="space-y-2">
                <PasswordField
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                />
                {passwordsMismatch && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                    Passwords don’t match.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || passwordsMismatch}
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#075237] via-[#0c7a46] to-[#14964c] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(12,130,67,0.85)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14964c] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 dark:from-[#147a45] dark:to-[#23ad5b]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <ContinueWithGoogle />

            <p className="mt-6 text-center text-sm text-[#71857b] dark:text-[#a8bdb1]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#117b44] hover:underline dark:text-[#6bdd92]">
                Log in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-[#94a49b] dark:text-[#80958a]">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[#147b46]">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#147b46]">
                Privacy Policy
              </Link>
              .
            </p>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#8aa096] dark:text-[#7f9588]">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Your data is encrypted and never shared
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, type FormEvent, type InputHTMLAttributes } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react"
import { ContinueWithGoogle } from "./ContinueWithGoogle"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"


type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: typeof UserRound
}

export function TextField({ label, icon: Icon, ...props }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#19392e] dark:text-[#e7f1eb]">
        {label}
      </span>
      <span className="flex h-[50px] items-center gap-3 rounded-xl border border-[#dbe8df] bg-white px-3.5 transition focus-within:border-[#20a45a] focus-within:ring-4 focus-within:ring-[#20a45a]/10 dark:border-white/10 dark:bg-white/[0.04] dark:focus-within:border-[#51d480] dark:focus-within:ring-[#51d480]/10">
        <Icon className="size-[17px] shrink-0 text-[#789087] dark:text-[#91a99d]" aria-hidden="true" />
        <input
          {...props}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#17382d] outline-none placeholder:text-[#9aaba3] dark:text-[#eff7f1] dark:placeholder:text-[#71887c]"
        />
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
}: {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  minLength?: number
}) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#19392e] dark:text-[#e7f1eb]">
        {label}
      </span>
      <span className="flex h-[50px] items-center gap-3 rounded-xl border border-[#dbe8df] bg-white px-3.5 transition focus-within:border-[#20a45a] focus-within:ring-4 focus-within:ring-[#20a45a]/10 dark:border-white/10 dark:bg-white/[0.04] dark:focus-within:border-[#51d480] dark:focus-within:ring-[#51d480]/10">
        <LockKeyhole className="size-[17px] shrink-0 text-[#789087] dark:text-[#91a99d]" aria-hidden="true" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#17382d] outline-none placeholder:text-[#9aaba3] dark:text-[#eff7f1] dark:placeholder:text-[#71887c]"
          placeholder="At least 8 characters"
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

export function SignupForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setMessage("Your passwords don’t match. Please check and try again.")
      return
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const formUser = Object.fromEntries(formData.entries()) as { name: string, email: string, photoUrl: string }
    try {
      const { data, error } = await signUp.email({
        name: formUser.name,
        email: formUser.email,
        image: formUser.photoUrl,
        password: password as string,
      });

      if (error) {
        console.error("Signup failed:", error.message);
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully!");

      console.log(data);
    } catch (error) {
      console.error("Unexpected error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
    setMessage("Your details look good. Account creation will be available soon.")
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#f5faf6] px-4 py-10 text-[#13382b] dark:bg-[#071a13] dark:text-[#eff7f1] sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[440px] -translate-x-1/2 rounded-full bg-[#dff4e5] blur-3xl dark:bg-[#0e452c]/40" />

      <div className="mx-auto grid w-full max-w-[1000px] overflow-hidden rounded-[28px] border border-[#e1ebe4] bg-white shadow-[0_28px_80px_-40px_rgba(14,65,39,0.24)] dark:border-white/10 dark:bg-[#0d2119] dark:shadow-black/30 md:min-h-[660px] md:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative hidden min-h-full overflow-hidden bg-[#0a3626] md:block">
          <Image
            src="/images/hero-volunteers-tree-plantation.jpg"
            alt="Community volunteers planting a tree together"
            fill
            sizes="(max-width: 1000px) 40vw, 420px"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062519] via-[#073221]/55 to-[#073221]/10" />
          <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 p-8">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-[#a7edbc] ring-1 ring-white/20 backdrop-blur-sm">
              <Leaf className="size-5" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-white">
              Helping<span className="text-[#79db98]">Hands</span>
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 pb-10 text-white lg:p-10 lg:pb-12">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[#c5f0d1] backdrop-blur-sm">
              Small acts. Lasting change.
            </p>
            <h2 className="max-w-sm text-3xl font-bold leading-tight tracking-tight lg:text-[2.5rem]">
              Be part of something good.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              Meet your community, find meaningful events, and make every bit
              of help count.
            </p>
            <div className="mt-8 flex items-center gap-3 text-xs text-white/70">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="size-7 rounded-full border-2 border-[#17422f] bg-[#e8c4a1]" />
                <span className="size-7 rounded-full border-2 border-[#17422f] bg-[#b8d4a2]" />
                <span className="size-7 rounded-full border-2 border-[#17422f] bg-[#d49f83]" />
              </span>
              A kinder community starts with you
            </div>
          </div>
        </aside>

        <div className="px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-[420px]">
            <div className="mb-8 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#e7f5eb] text-[#16814b] dark:bg-[#153d2a] dark:text-[#7ae39a]">
                  <Leaf className="size-[18px]" />
                </span>
                Helping<span className="-ml-2 text-[#19a454]">Hands</span>
              </Link>
            </div>

            <p className="text-sm font-semibold text-[#15834a] dark:text-[#6bdd92]">
              JOIN OUR COMMUNITY
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123629] dark:text-[#f0f7f2] sm:text-[2.1rem]">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#71857b] dark:text-[#a8bdb1]">
              Start making a difference, one good deed at a time.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4.5">
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
              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <PasswordField
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />

              {passwordsMismatch && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  Passwords don’t match.
                </p>
              )}
              {message && (
                <p className="text-sm text-[#147b46] dark:text-[#6bdd92]" role="status">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075237] to-[#14964c] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(12,130,67,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14964c] disabled:opacity-60 dark:from-[#147a45] dark:to-[#23ad5b]"
              >
                Create account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <ContinueWithGoogle />

            <p className="mt-6 text-center text-sm text-[#71857b] dark:text-[#a8bdb1]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#117b44] hover:underline dark:text-[#6bdd92]"
              >
                Log in
              </Link>
            </p>
            <p className="mt-6 text-center text-xs leading-5 text-[#94a49b] dark:text-[#80958a]">
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
          </div>
        </div>
      </div>
    </section>
  )
}

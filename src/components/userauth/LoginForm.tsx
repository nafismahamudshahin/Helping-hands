"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf } from "lucide-react"

import { Mail } from "lucide-react"
import { PasswordField, TextField } from "./SignupForm"
import { ContinueWithGoogle } from "./ContinueWithGoogle"

export function LoginForm() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("Sign in will be available once authentication is connected.")
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#f5faf6] px-4 py-10 text-[#13382b] dark:bg-[#071a13] dark:text-[#eff7f1] sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[440px] -translate-x-1/2 rounded-full bg-[#dff4e5] blur-3xl dark:bg-[#0e452c]/40" />

      <div className="mx-auto grid w-full max-w-[1000px] overflow-hidden rounded-[28px] border border-[#e1ebe4] bg-white shadow-[0_28px_80px_-40px_rgba(14,65,39,0.24)] dark:border-white/10 dark:bg-[#0d2119] dark:shadow-black/30 md:min-h-[590px] md:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative hidden min-h-full overflow-hidden bg-[#0a3626] md:block">
          <Image
            src="/images/hero-volunteers-tree-plantation.jpg"
            alt="Volunteers working together in their community"
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
              Welcome back
            </p>
            <h2 className="max-w-sm text-3xl font-bold leading-tight tracking-tight lg:text-[2.5rem]">
              Good to see you again.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              Pick up where you left off and keep making a difference in your
              community.
            </p>
            <div className="mt-8 flex items-center gap-3 text-xs text-white/70">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="size-7 rounded-full border-2 border-[#17422f] bg-[#e8c4a1]" />
                <span className="size-7 rounded-full border-2 border-[#17422f] bg-[#b8d4a2]" />
                <span className="size-7 rounded-full border-2 border-[#17422f] bg-[#d49f83]" />
              </span>
              Your next good deed is waiting
            </div>
          </div>
        </aside>

        <div className="flex items-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="mb-8 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#e7f5eb] text-[#16814b] dark:bg-[#153d2a] dark:text-[#7ae39a]">
                  <Leaf className="size-[18px]" />
                </span>
                Helping<span className="-ml-2 text-[#19a454]">Hands</span>
              </Link>
            </div>

            <p className="text-sm font-semibold text-[#15834a] dark:text-[#6bdd92]">
              WELCOME BACK
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123629] dark:text-[#f0f7f2] sm:text-[2.1rem]">
              Log in to HelpingHands
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#71857b] dark:text-[#a8bdb1]">
              Continue making a positive impact in your community.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                name="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                minLength={1}
              />

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="inline-flex items-center gap-2 text-[#60776c] dark:text-[#b0c3b8]">
                  <input
                    type="checkbox"
                    name="remember"
                    className="size-4 rounded border-[#c9d9ce] accent-[#168a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4d]"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[#147b46] hover:underline dark:text-[#6bdd92]"
                >
                  Forgot password?
                </Link>
              </div>

              {message && (
                <p className="text-sm text-[#147b46] dark:text-[#6bdd92]" role="status">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075237] to-[#14964c] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(12,130,67,0.8)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14964c] dark:from-[#147a45] dark:to-[#23ad5b]"
              >
                Log in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <ContinueWithGoogle />

            <p className="mt-7 text-center text-sm text-[#71857b] dark:text-[#a8bdb1]">
              New to HelpingHands?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#117b44] hover:underline dark:text-[#6bdd92]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

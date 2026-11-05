"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowRight, CalendarCheck, CalendarCog, CirclePlus, Loader2, LogOut, Menu } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ModeToggle } from "@/components/mode-toggle"
import { signOut, useSession } from "@/lib/auth-client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/upcoming-events", label: "Upcoming Events" },
]

// Shown in the account dropdown (desktop) and in the mobile menu (logged-in users)
const accountLinks = [
  { href: "/create-event", label: "Create Event", Icon: CirclePlus, highlight: true },
  { href: "/manage-event", label: "Manage Events", Icon: CalendarCog, highlight: false },
  { href: "/joined-events", label: "Joined Events", Icon: CalendarCheck, highlight: false },
]

const logoClassName =
  "h-9 w-auto sm:h-11 dark:invert dark:hue-rotate-180 dark:brightness-110"

function LoginButton({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      href="/login"
      onClick={onClick}
      className={cn(
        buttonVariants({ size: "lg" }),
        "group/login h-11 gap-2 rounded-full bg-linear-to-r from-green-800 via-green-600 to-green-500 px-6 text-[0.95rem] font-semibold text-white shadow-[0_10px_25px_-8px_rgba(34,197,94,0.55)] transition-all hover:bg-transparent hover:from-green-700 hover:via-green-500 hover:to-green-400 hover:shadow-[0_12px_28px_-8px_rgba(34,197,94,0.7)] focus-visible:ring-green-500/40 active:translate-y-px",
        className
      )}
    >
      Log in
      <ArrowRight className="size-4 transition-transform group-hover/login:translate-x-0.5" />
    </Link>
  )
}

/* Skeletons shown while the session is loading */
function ProfileSkeleton() {
  return (
    <div role="status" aria-label="Loading profile" className="flex items-center">
      <Skeleton className="size-10 rounded-full bg-green-900/10 dark:bg-white/10" />
    </div>
  )
}

function UserCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading profile"
      className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-green-50 p-3 dark:bg-green-500/10"
    >
      <Skeleton className="size-10 shrink-0 rounded-full bg-green-900/10 dark:bg-white/10" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-28 bg-green-900/10 dark:bg-white/10" />
        <Skeleton className="h-3 w-40 max-w-full bg-green-900/10 dark:bg-white/10" />
      </div>
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { data: session, isPending } = useSession()
  const user = session?.user

  // the navbar stays mounted between pages, so clear the flag once we navigate away
  useEffect(() => {
    setLoggingOut(false)
  }, [pathname])

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await signOut()
      setOpen(false)
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error(error)
      setLoggingOut(false)
    }
  }

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e1ebe4] bg-white/90 px-5 text-[#15382d] backdrop-blur-md transition-colors supports-backdrop-filter:bg-white/80 dark:border-white/10 dark:bg-[#071a13]/90 dark:text-[#eff7f1] dark:supports-backdrop-filter:bg-[#071a13]/85 sm:px-8 lg:px-[6.65%]">
        <div className="mx-auto grid h-20 container grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
          <Link
            href="/"
            aria-label="HelpingHands home"
            className="flex items-center justify-self-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="HelpingHands"
              width={2172}
              height={724}
              className={logoClassName}
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-8 lg:flex xl:gap-10"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[0.95rem] font-medium text-gray-600 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400",
                    active && "text-green-700 dark:text-green-400"
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r from-green-600 to-green-400 transition-transform duration-300",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 lg:col-start-3">
            <ModeToggle />
            {isPending ? (
              <ProfileSkeleton />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Open ${user.name ?? "user"} account menu`}
                  className="rounded-full outline-none ring-2 ring-transparent transition hover:ring-green-500/40 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                >
                  <Avatar title={`${user.name}`} size="lg">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Profile photo"} />
                    <AvatarFallback className="bg-green-100 font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-xl border border-[#e1ebe4] bg-white p-1.5 text-[#15382d] dark:border-white/10 dark:bg-[#0d2119] dark:text-[#eff7f1]"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.name || "HelpingHands user"}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountLinks.map(({ href, label, Icon, highlight }) => {
                    const active = isActive(href)
                    return (
                      <DropdownMenuLinkItem
                        key={href}
                        render={<Link href={href} aria-current={active ? "page" : undefined} />}
                        className={cn(
                          "px-3 py-2 font-medium",
                          highlight &&
                          "text-green-600 focus:bg-green-50 focus:text-green-700 dark:text-green-400 dark:focus:bg-green-950 dark:focus:text-green-300",
                          active && !highlight && "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4",
                            highlight || active
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          )}
                        />
                        {label}
                      </DropdownMenuLinkItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="cursor-pointer px-3 py-2 text-red-600 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300"
                  >
                    {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                    {loggingOut ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginButton className="hidden sm:inline-flex" />
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open navigation menu"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted lg:hidden"
              >
                <Menu className="size-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="gap-0 overflow-y-auto border-[#e1ebe4] bg-white p-0 text-[#15382d] data-[side=right]:w-75 dark:border-white/10 dark:bg-[#0d2119] dark:text-[#eff7f1]"
              >
                <SheetHeader className="border-b border-[#e1ebe4] pr-14 dark:border-white/10">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Browse the HelpingHands pages
                  </SheetDescription>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.png"
                    alt="HelpingHands"
                    width={2172}
                    height={724}
                    className="h-8 w-auto dark:invert dark:hue-rotate-180 dark:brightness-110"
                  />
                </SheetHeader>

                {/* Signed-in user card */}
                {isPending ? (
                  <UserCardSkeleton />
                ) : (
                  user && (
                    <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-green-50 p-3 dark:bg-green-500/10">
                      <Avatar title={`${user.name}`} size="lg">
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Profile photo"} />
                        <AvatarFallback className="bg-green-100 font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">
                          {initials || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.name || "HelpingHands user"}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  )
                )}

                <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-green-600",
                          active && "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  })}

                  {/* Account links */}
                  {isPending ? (
                    <div role="status" aria-label="Loading account links" className="mt-4 space-y-2">
                      <Skeleton className="mx-3 mb-3 h-3 w-24 bg-green-900/10 dark:bg-white/10" />
                      {Array.from({ length: 3 }, (_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg bg-green-900/10 dark:bg-white/10" />
                      ))}
                    </div>
                  ) : (
                    user && (
                      <>
                        <p className="mt-4 px-3 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          My account
                        </p>
                        {accountLinks.map(({ href, label, Icon }) => {
                          const active = isActive(href)
                          return (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setOpen(false)}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-green-600",
                                active && "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              )}
                            >
                              <Icon className="size-4.5 text-green-600 dark:text-green-400" />
                              {label}
                            </Link>
                          )
                        })}
                      </>
                    )
                  )}
                </nav>

                <div className="mt-auto border-t border-[#e1ebe4] p-4 dark:border-white/10">
                  {isPending ? (
                    <Skeleton className="h-11 w-full rounded-lg bg-green-900/10 dark:bg-white/10" />
                  ) : user ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      aria-busy={loggingOut}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-muted disabled:opacity-70 dark:text-red-400"
                    >
                      {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                      {loggingOut ? "Logging out..." : "Log out"}
                    </button>
                  ) : (
                    <LoginButton
                      className="w-full"
                      onClick={() => setOpen(false)}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Full-screen logout loader (outside the header: backdrop-blur would trap fixed positioning) */}
      {loggingOut && (
        <div
          role="status"
          aria-live="assertive"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-md dark:bg-[#06150f]/75"
        >
          <div className="flex flex-col items-center gap-5 rounded-[28px] border border-white/80 bg-white/70 px-10 py-8 shadow-[0_30px_80px_-30px_rgba(15,65,42,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <div className="relative size-14">
              <span aria-hidden="true" className="absolute inset-0 rounded-full border-[5px] border-red-500/15" />
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,#f87171_200deg,#dc2626_340deg,transparent_360deg)] [animation-duration:0.9s] [mask:radial-gradient(farthest-side,transparent_calc(100%-5px),#000_calc(100%-4px))] motion-reduce:animate-none"
              />
              <LogOut aria-hidden="true" className="absolute inset-0 m-auto size-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0f3325] dark:text-[#eff8f2]">Logging out...</p>
              <p className="mt-0.5 text-xs text-muted-foreground">See you soon!</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowRight, CalendarCheck, CalendarCog, CirclePlus, LogOut, Menu } from "lucide-react"
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
import { ModeToggle } from "@/components/mode-toggle"
import { signOut, useSession } from "@/lib/auth-client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/upcoming-events", label: "Upcoming Events" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
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
        "group/login h-11 gap-2 rounded-full bg-gradient-to-r from-green-800 via-green-600 to-green-500 px-6 text-[0.95rem] font-semibold text-white shadow-[0_10px_25px_-8px_rgba(34,197,94,0.55)] transition-all hover:bg-transparent hover:from-green-700 hover:via-green-500 hover:to-green-400 hover:shadow-[0_12px_28px_-8px_rgba(34,197,94,0.7)] focus-visible:ring-green-500/40 active:translate-y-px",
        className
      )}
    >
      Log in
      <ArrowRight className="size-4 transition-transform group-hover/login:translate-x-0.5" />
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { data: session, isPending } = useSession()
  const user = session?.user

  async function handleLogout() {
    await signOut()
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-[#e1ebe4] bg-white/90 text-[#15382d] backdrop-blur-md transition-colors supports-[backdrop-filter]:bg-white/80 dark:border-white/10 dark:bg-[#071a13]/90 dark:text-[#eff7f1] dark:supports-[backdrop-filter]:bg-[#071a13]/85">
      <div className="mx-auto grid h-20 max-w-[1400px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
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
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[0.95rem] font-medium text-gray-600 transition-colors hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400",
                  active &&
                    "text-green-700 dark:text-green-400"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 lg:col-start-3">
          <ModeToggle />
          {isPending ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open ${user.name ?? "user"} account menu`}
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                <Avatar size="lg">
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
                <DropdownMenuLinkItem
                  render={<Link href="/manage-events" />}
                  className="px-3 py-2 font-medium text-green-600 focus:bg-green-50 focus:text-green-700 dark:text-green-400 dark:focus:bg-green-950 dark:focus:text-green-300"
                >
                  <CirclePlus className="size-4 text-green-600 dark:text-green-400" />
                  Create Event
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem
                  render={<Link href="/manage-events" />}
                  className="px-3 py-2"
                >
                  <CalendarCog className="size-4 text-muted-foreground" />
                  Manage Events
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem
                  render={<Link href="/joined-events" />}
                  className="px-3 py-2"
                >
                  <CalendarCheck className="size-4 text-muted-foreground" />
                  Joined Events
                </DropdownMenuLinkItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer px-3 py-2 text-red-600 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300"
                >
                  <LogOut className="size-4" />
                  Log out
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
              className="gap-0 border-[#e1ebe4] bg-white p-0 text-[#15382d] data-[side=right]:w-[300px] dark:border-white/10 dark:bg-[#0d2119] dark:text-[#eff7f1]"
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

              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 p-4"
              >
                {navLinks.map((link) => {
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-green-600",
                        active &&
                          "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto border-t border-[#e1ebe4] p-4 dark:border-white/10">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-muted dark:text-red-400"
                  >
                    <LogOut className="size-4" />
                    Log out
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
  )
}

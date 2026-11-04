import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Heart, Mail, MapPin, Phone } from "lucide-react"

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Create Event", href: "/create-event" },
  { label: "Organizations", href: "/manage-events" },
]

const supportLinks = [
  { label: "Help Center", href: "mailto:hello@helpinghands.org" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "mailto:hello@helpinghands.org" },
]

const socials = [
  { label: "X", href: "https://x.com", text: "𝕏" },
  { label: "Facebook", href: "https://facebook.com", text: "f" },
  { label: "LinkedIn", href: "https://linkedin.com", text: "in" },
]

const contacts = [
  { Icon: Mail, text: "hello@helpinghands.org", href: "mailto:hello@helpinghands.org" },
  { Icon: Phone, text: "+880 1XXX-XXXXXX", href: "tel:+8801000000000" },
  { Icon: MapPin, text: "Dhaka, Bangladesh" },
]

const linkClass =
  "group inline-flex w-fit items-center gap-1 text-sm text-[#587269] transition-all hover:translate-x-1 hover:text-[#078246] dark:text-[#b4c9c0] dark:hover:text-[#65df97]"

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#dcebe1] bg-linear-to-b from-[#f3faf5] to-[#e6f5ec] text-[#15382d] dark:border-white/10 dark:from-[#06271d] dark:to-[#041a13] dark:text-[#eef7f1]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-96 rounded-full bg-emerald-400/20 blur-[110px] dark:bg-emerald-500/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-green-300/20 blur-[110px] dark:bg-green-500/10" />

      <div className="px-5 sm:px-8 lg:px-[6.65%]">
        <div className="mx-auto container grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:gap-10 md:py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12 lg:py-16">
          <div className="col-span-2 max-w-[320px] md:col-span-1">
            <Link href="/" aria-label="HelpingHands home" className="inline-flex">
              <Image
                src="/images/logo.png"
                alt="HelpingHands"
                width={2172}
                height={724}
                className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 dark:brightness-110"
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-[#587269] dark:text-[#b4c9c0]">
              A community platform for social development events in Bangladesh.
              Join, create and track events that matter.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ label, href, text }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-emerald-900/10 bg-white/80 text-sm font-bold text-[#174b36] shadow-sm transition hover:-translate-y-1 hover:border-transparent hover:bg-linear-to-br hover:from-emerald-500 hover:to-green-600 hover:text-white hover:shadow-lg hover:shadow-emerald-600/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  {text}
                </a>
              ))}
            </div>
          </div>

          <FooterLinks title="Platform" links={platformLinks} />
          <FooterLinks title="Support" links={supportLinks} />

          <div className="col-span-2 flex min-w-0 flex-col items-start gap-4 md:col-span-1">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Contact</h2>
            {contacts.map(({ Icon, text, href }) => {
              const inner = (
                <>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 break-words">{text}</span>
                </>
              )
              return href ? (
                <a key={text} href={href} className="inline-flex max-w-full items-center gap-3 text-sm text-[#587269] transition-colors hover:text-[#078246] dark:text-[#b4c9c0] dark:hover:text-[#65df97]">
                  {inner}
                </a>
              ) : (
                <p key={text} className="inline-flex max-w-full items-center gap-3 text-sm text-[#587269] dark:text-[#b4c9c0]">
                  {inner}
                </p>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-[#dcebe1] px-5 sm:px-8 lg:px-[6.65%] dark:border-white/10">
        <div className="mx-auto container flex flex-col gap-3 py-5 text-center text-xs text-[#668077] md:flex-row md:items-center md:justify-between md:text-left dark:text-[#a9c0b5]">
          <p>© {new Date().getFullYear()} HelpingHands. All rights reserved.</p>
          <p className="inline-flex items-center justify-center gap-1.5 md:justify-start">
            Made with <Heart className="size-3.5 animate-pulse fill-current text-[#20a75a]" aria-hidden="true" />
            for a kinder Bangladesh
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-3.5">
      <h2 className="text-sm font-bold uppercase tracking-[0.14em]">{title}</h2>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className={linkClass}>
          {link.label}
          <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </Link>
      ))}
    </div>
  )
}
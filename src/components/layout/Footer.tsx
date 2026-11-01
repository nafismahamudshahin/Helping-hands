import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Create Event", href: "/manage-events" },
  { label: "Organizations", href: "/manage-events" },
]

const supportLinks = [
  { label: "Help Center", href: "mailto:hello@helpinghands.org" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "mailto:hello@helpinghands.org" },
]

const footerLinkClass =
  "w-fit text-sm text-[#587269] transition-colors hover:text-[#078246] dark:text-[#b4c9c0] dark:hover:text-[#65df97]"

export function Footer() {
  return (
    <footer className="border-t border-[#dcebe1] bg-[#f3faf5] text-[#15382d] dark:border-white/10 dark:bg-[#06271d] dark:text-[#eef7f1]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr] lg:gap-12 lg:px-[6.65%] lg:py-14">
        <div className="max-w-[300px]">
          <Link href="/" aria-label="HelpingHands home" className="inline-flex">
            <Image
              src="/images/logo.png"
              alt="HelpingHands"
              width={2172}
              height={724}
              className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 dark:brightness-110"
            />
          </Link>
          <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#587269] dark:text-[#b4c9c0]">
            A community platform for social development events in Bangladesh.
            Join, create and track events that matter.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex size-9 items-center justify-center rounded-full bg-[#e2f1e7] text-sm font-semibold text-[#174b36] transition-colors hover:bg-[#cfe9d8] dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              𝕏
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-full bg-[#e2f1e7] text-[#174b36] transition-colors hover:bg-[#cfe9d8] dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span className="text-sm font-bold">f</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-full bg-[#e2f1e7] text-[#174b36] transition-colors hover:bg-[#cfe9d8] dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span className="text-xs font-bold">in</span>
            </a>
          </div>
        </div>

        <FooterLinks title="Platform" links={platformLinks} />
        <FooterLinks title="Support" links={supportLinks} />

        <div className="flex flex-col items-start gap-3">
          <h2 className="text-sm font-semibold tracking-wide">Contact</h2>
          <a href="mailto:hello@helpinghands.org" className={footerLinkClass}>
            hello@helpinghands.org
          </a>
          <p className={footerLinkClass}>Dhaka, Bangladesh</p>
          <a href="tel:+8801000000000" className={footerLinkClass}>
            +880 1XXX-XXXXXX
          </a>
        </div>
      </div>

      <div className="border-t border-[#dcebe1] dark:border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-4 text-xs text-[#668077] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-[6.65%] dark:text-[#a9c0b5]">
          <p>© {new Date().getFullYear()} HelpingHands. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="size-3.5 fill-current text-[#20a75a]" />
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
    <div className="flex flex-col items-start gap-3">
      <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className={footerLinkClass}>
          {link.label}
        </Link>
      ))}
    </div>
  )
}

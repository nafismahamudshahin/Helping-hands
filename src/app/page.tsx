import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export default function HomePage() {
  return (
    <section className="overflow-hidden bg-[#f4fbf6] text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3]">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1400px] items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-[0.98fr_1.02fr] md:gap-12 md:py-10 lg:px-[6.65%] lg:py-0">
        <div className="relative z-10 max-w-[540px]">
          <span className="mb-4 inline-flex rounded-full bg-[#def2e6] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#075b3c] dark:bg-[#123b2b] dark:text-[#a8e4bd]">
            Social Development Events Platform
          </span>

          <h1 className="max-w-[570px] text-[clamp(3.25rem,5vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.055em] text-[#082e24] dark:text-[#f3f9f5]">
            Make Every
            <br />
            <span className="text-[#16a653] dark:text-[#45d879]">Small Action</span>
            <br />
            Matter
          </h1>

          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.5] text-[#56716a] dark:text-[#b3c9bf] sm:text-base">
            Discover, join, and create meaningful social service events in your
            community. Together, we build a kinder, healthier and more inclusive
            Bangladesh.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/upcoming-events"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-[38px] rounded-full border-0 bg-[#064c38] px-6 text-xs font-semibold text-white shadow-none hover:bg-[#086447] dark:bg-[#25a95e] dark:text-[#062817] dark:hover:bg-[#39c875]"
              )}
            >
              Explore Events
            </Link>
            <Link
              href="/manage-events"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-[38px] rounded-full border-[#c5dfd0] bg-white/80 px-6 text-xs font-semibold text-[#123d30] shadow-none hover:border-[#8fbea3] hover:bg-white dark:border-[#365b4a] dark:bg-[#10291f] dark:text-[#e4f2e9] dark:hover:bg-[#18392b]"
              )}
            >
              Create an Event
            </Link>
          </div>
        </div>

        <div className="relative mx-auto h-[280px] w-full max-w-[650px] bg-[#dff1e5] sm:h-[360px] md:h-[440px]">
          <Image
            src="/images/hero-volunteers-tree-plantation.jpg"
            alt="Volunteers planting a tree together"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
            style={{
              borderRadius: "60px 240px 60px 60px",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  )
}

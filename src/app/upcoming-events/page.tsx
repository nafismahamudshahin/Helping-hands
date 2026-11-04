
import { UpcomingEventsBrowser } from "@/components/events/UpcomingEventsBrowser";
import UpcomingEventsSkeleton from "@/components/skeleton/UpcomingEventPageSkeleton";
import type { EventType } from "@/types";
import { connection } from "next/server";
import { Suspense } from "react";

async function getEvents(): Promise<EventType[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upcoming-events`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch events");

    const data = await res.json();

    return Array.isArray(data) ? data : data.events || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function Events() {
  const events = await getEvents();
  return <UpcomingEventsBrowser events={events} />;
}

export default async function UpcomingEventsPage() {
  await connection()
  return (
    <section className="relative isolate min-h-full overflow-hidden bg-linear-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-8 text-[#0f3325] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff8f2] sm:px-8 sm:py-12 lg:px-[6.65%]">
      <div className="mx-auto container">
        <Suspense fallback={<UpcomingEventsSkeleton />}>
          <Events />
        </Suspense>
      </div>
    </section>
  );
}

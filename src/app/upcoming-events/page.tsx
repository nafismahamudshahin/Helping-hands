
import { UpcomingEventsBrowser } from "@/components/events/UpcomingEventsBrowser";
import type { EventType } from "@/types";
import { Suspense } from "react";

async function getEvents(): Promise<EventType[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events`,
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

export default function UpcomingEventsPage() {
  return (
    <section className="min-h-full bg-[#f2faf5] px-4 py-6 text-[#12382d] dark:bg-[#081b15] dark:text-[#eff8f2] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <Suspense fallback={<p>Loading events...</p>}>
          <Events />
        </Suspense>
      </div>
    </section>
  );
}

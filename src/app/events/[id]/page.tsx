
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import JoinAction from "@/components/events/JoinAction";

async function getEvent(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        { cache: "no-store" }
    );

    if (res.status === 404) return null;

    if (!res.ok) {
        throw new Error("Failed to fetch event");
    }

    const data = await res.json();

    return data.event || data;
}

export default async function EventDetailsPage({ params, }: PageProps<"/events/[id]">) {
    const { id } = await params;

    const event = await getEvent(id);
    if (!event) notFound();
    return (
        <section className="min-h-screen bg-[#f2faf5] px-4 py-6 dark:bg-[#081b15]">
            <div className="mx-auto max-w-[1240px]">

                {/* Event Image */}
                <div className="relative h-[250px] overflow-hidden rounded-2xl">
                    <Image
                        src={event.thumbnailUrl}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>

                <div className="grid gap-7 py-6 lg:grid-cols-[1fr_340px]">

                    {/* Event Details */}
                    <article>
                        <h1 className="text-3xl font-bold dark:text-white">
                            {event.title}
                        </h1>

                        <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                            {event.category}
                        </span>

                        <p className="mt-3 text-sm text-gray-500">
                            <MapPin className="mr-1 inline size-4" />
                            {event.location}
                        </p>

                        <p className="mt-5 leading-7 text-gray-600 dark:text-gray-300">
                            {event.description}
                        </p>

                        {event.activities?.length > 0 && (
                            <div className="mt-5">
                                <h2 className="text-lg font-bold dark:text-white">
                                    What You{`'`}ll Do
                                </h2>

                                <ul className="mt-3 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                                    {event.activities.map((activity: string, index: number) => (
                                        <li key={index}>{activity}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </article>

                    {/* Event Information */}
                    <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm dark:bg-[#10251b]">

                        <JoinAction event={event}></JoinAction>

                        <p className="mt-4 flex items-center gap-2 text-sm dark:text-white">
                            <Users className="size-4" />
                            {event.joined ?? 0} people joined
                        </p>

                        <hr className="my-4" />

                        <h2 className="font-bold dark:text-white">
                            Event Information
                        </h2>

                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="size-4" />
                            {event.location}
                        </p>

                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays className="size-4" />
                            {event.date}
                        </p>

                        {event.time && (
                            <p className="mt-3 text-sm text-gray-500">
                                {event.time}
                            </p>
                        )}

                        {event.volunteerSlots != null && (
                            <p className="mt-3 text-sm text-gray-500">
                                {event.volunteerSlots} volunteer slots
                            </p>
                        )}
                    </aside>

                </div>
            </div>
        </section>
    );
}

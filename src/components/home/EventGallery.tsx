import Image from "next/image"

const galleryItems = [
    {
        title: "Community Tree Plantation",
        category: "Environment",
        image: "/images/gallery-1-plantation-group.jpg",
        alt: "Volunteers gathered together after planting trees",
        layout: "lg:row-span-2",
    },
    {
        title: "Winter Clothes Distribution",
        category: "Winter Support",
        image: "/images/gallery-3-clothes-distribution.jpg",
        alt: "Volunteers distributing warm clothes to local families",
        layout: "",
    },
    {
        title: "Free Health Camp",
        category: "Health",
        image: "/images/event-health-camp.jpg",
        alt: "A doctor checking an older community member's blood pressure",
        layout: "",
    },
    {
        title: "Community Clean-Up Drive",
        category: "Community",
        image: "/images/gallery-4-cleanup-team.jpg",
        alt: "Volunteers working together to clean a public park",
        layout: "sm:col-span-2",
    },
]

export default function EventGallery() {
    return (
        <section className="bg-[#f4fbf6] px-5 pb-14 pt-4 text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3] sm:px-8 sm:pb-20 lg:px-[6.65%]">
            <div className="mx-auto max-w-[1400px]">
                <header className="mb-8 max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#159b50] dark:text-[#55d788]">
                        Moments that matter
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Event Gallery</h2>
                    <p className="mt-2 text-sm leading-6 text-[#61796d] dark:text-[#a8bdb1]">
                        A look at the people and communities making positive change together.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-3">
                    {galleryItems.map((item) => (
                        <figure
                            key={item.title}
                            className={`group relative isolate aspect-[4/3] overflow-hidden rounded-3xl bg-[#dcebe1] shadow-[0_14px_40px_-24px_rgba(15,65,42,0.6)] ring-1 ring-inset ring-black/5 dark:bg-[#183629] dark:ring-white/10 lg:aspect-auto ${item.layout}`}
                        >
                            <Image
                                src={item.image}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-[#061d14]/90 via-[#061d14]/50 to-transparent px-5 pb-5 pt-16 text-white transition-all duration-300 group-hover:pb-6">
                                <span className="w-fit rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                                    {item.category}
                                </span>
                                <span className="text-base font-bold leading-tight drop-shadow-sm">{item.title}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
"use client";
// Private page: /my-certificates
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, CalendarDays, Check, Copy, Download, Eye, Hash, Sparkles } from "lucide-react";
import { cn } from "cn";
import { api, Certificate, downloadCertificatePdf, formatDate } from "@/lib/certificate";

function CertificateCard({ c }: { c: Certificate }) {
    const [copied, setCopied] = useState(false);

    async function copyId() {
        try {
            await navigator.clipboard.writeText(c.certificateId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard blocked */
        }
    }

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#c5dfd0] bg-white shadow-[0_6px_24px_rgba(8,46,36,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-[#16a653]/50 hover:shadow-[0_18px_44px_rgba(22,166,83,0.18)] dark:border-[#365b4a] dark:bg-[#10291f] dark:hover:border-[#45d879]/50">
            {/* Gradient header */}
            <div className="relative h-24 overflow-hidden bg-gradient-to-br from-[#064c38] via-[#0b6b4c] to-[#16a653]">
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                />
                <div className="absolute -right-6 -top-8 size-32 rounded-full bg-white/10 blur-xl transition duration-500 group-hover:scale-125" />
                <Award className="absolute -bottom-4 right-3 size-24 -rotate-12 text-white/10" />
                <span className="absolute left-5 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    <Sparkles className="size-3" /> Certified
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5 pt-0">
                {/* Floating icon + title */}
                <div className="-mt-6 flex items-end gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#22c55e] to-[#075b3c] text-white shadow-lg dark:border-[#10291f]">
                        <Award size={22} />
                    </span>
                </div>
                <h2 className="mt-3 line-clamp-2 min-h-[2.75rem] text-[17px] font-extrabold leading-snug tracking-tight text-[#082e24] dark:text-[#f3f9f5]">
                    {c.eventTitle}
                </h2>

                <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2.5 text-[#56716a] dark:text-[#b3c9bf]">
                        <CalendarDays size={15} className="shrink-0 text-[#16a653] dark:text-[#45d879]" />
                        <span>
                            Issued{" "}
                            <span className="font-semibold text-[#082e24] dark:text-[#f3f9f5]">{formatDate(c.issueDate)}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[#f4fbf6] py-1.5 pl-3 pr-1.5 dark:bg-[#081b16]">
                        <Hash size={15} className="shrink-0 text-[#16a653] dark:text-[#45d879]" />
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-[#075b3c] dark:text-[#a8e4bd]">
                            {c.certificateId}
                        </span>
                        <button
                            onClick={copyId}
                            aria-label="Copy certificate ID"
                            className="grid size-7 shrink-0 place-items-center rounded-lg text-[#56716a] transition hover:bg-white hover:text-[#16a653] dark:text-[#b3c9bf] dark:hover:bg-[#10291f]"
                        >
                            {copied ? <Check size={14} className="text-[#16a653]" /> : <Copy size={14} />}
                        </button>
                    </div>
                </dl>

                <div className="mt-5 flex gap-2.5">
                    <Link
                        href={`/my-certificates/${c.certificateId}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#064c38] to-[#0b7a54] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(6,76,56,0.3)] transition hover:brightness-110 dark:from-[#1f9d57] dark:to-[#2bc16e] dark:text-[#062817]"
                    >
                        <Eye size={16} /> View
                    </Link>
                    <button
                        onClick={() => downloadCertificatePdf(c)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#c5dfd0] bg-white px-3 py-2.5 text-sm font-semibold text-[#123d30] transition hover:border-[#16a653] hover:bg-[#def2e6] dark:border-[#365b4a] dark:bg-[#10291f] dark:text-[#e4f2e9] dark:hover:bg-[#18392b]"
                    >
                        <Download size={16} /> Download
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function CertificatesPage() {
    const router = useRouter();
    const [certs, setCerts] = useState<Certificate[] | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                await api("/certificate/sync", { method: "POST" }); // create any missing ones
                setCerts(await api<Certificate[]>("/certificate/my"));
            } catch (e: any) {
                if (e.status === 401) router.replace("/login?redirect=/my-certificates");
                else setError(e.message);
            }
        })();
    }, [router]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f4fbf6] px-5 py-10 transition-colors dark:bg-[#081b16] sm:px-8 sm:py-12 lg:px-[6.65%]">
            {/* Soft background glows */}
            <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[#86efac]/25 blur-3xl dark:bg-[#16a653]/10" />
            <div className="pointer-events-none absolute -right-32 top-40 size-[380px] rounded-full bg-[#5eead4]/20 blur-3xl dark:bg-[#0f766e]/10" />

            <div className="relative mx-auto container">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#075b3c] backdrop-blur dark:border-white/10 dark:bg-white/4 dark:text-[#a8e4bd]">
                            <span className="size-1.5 rounded-full bg-[#16a653]" /> Private to you
                        </span>
                        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#082e24] sm:text-4xl dark:text-[#f3f9f5]">
                            My <span className="bg-linear-to-r from-[#16a653] to-[#0b7a54] bg-clip-text text-transparent dark:from-[#45d879] dark:to-[#25a95e]">Certificates</span>
                        </h1>
                        <p className="mt-1.5 text-[#56716a] dark:text-[#b3c9bf]">Earned from the events you completed.</p>
                    </div>

                    {certs && certs.length > 0 && (
                        <div className="flex items-center gap-3 rounded-3xl border border-white/80 bg-white/70 px-5 py-3 shadow-[0_10px_40px_-24px_rgba(15,65,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/4">
                            <span className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                                <Award size={20} />
                            </span>
                            <div className="leading-tight">
                                <div className="text-2xl font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">{certs.length}</div>
                                <div className="text-xs font-medium text-[#557368] dark:text-[#b3c9bf]">
                                    {certs.length === 1 ? "certificate earned" : "certificates earned"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-6 rounded-3xl border border-[#f4b8c6] bg-[#fde3ea] px-4 py-3 text-sm font-semibold text-[#b4234a] dark:border-[#7a2a40] dark:bg-[#4a1f2c] dark:text-[#f9a8bd]">
                        {error}
                    </p>
                )}

                {certs === null && !error && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[340px] animate-pulse rounded-3xl border border-white/80 bg-white/60 dark:border-white/10 dark:bg-white/4" />
                        ))}
                    </div>
                )}

                {certs?.length === 0 && (
                    <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-[#8fbea3] bg-white/70 p-12 text-center backdrop-blur dark:border-white/15 dark:bg-white/4">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                            <Award size={30} />
                        </div>
                        <p className="text-lg font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">No certificates yet</p>
                        <p className="mt-1 max-w-sm text-sm text-[#557368] dark:text-[#b3c9bf]">
                            Join an event and you&apos;ll get one once it&apos;s completed.
                        </p>
                        <Link
                            href="/upcoming-events"
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#064c38] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#086447] dark:bg-[#25a95e] dark:text-[#062817]"
                        >
                            Explore events
                        </Link>
                    </div>
                )}

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {certs?.map((c) => <CertificateCard key={c.certificateId} c={c} />)}
                </div>
            </div>
        </main>
    );
}
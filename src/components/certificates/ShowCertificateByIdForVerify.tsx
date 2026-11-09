"use client";
import { useEffect, useState } from "react";
import { CalendarDays, Hash, Loader2, ShieldCheck, ShieldX, User, Award } from "lucide-react";
import { cn } from "cn";
import { publicApi, Certificate, formatDate } from "@/lib/certificate";
import { buildCertificateSvg } from "@/lib/certificateSvg";

type PublicCertificate = Certificate & { revoked?: boolean };

const glass =
    "rounded-3xl border border-white/80 bg-white/70 shadow-[0_10px_40px_-24px_rgba(15,65,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/4";

function Chip({ icon: Icon, tone, label, value, mono }: {
    icon: typeof User; tone: string; label: string; value: string; mono?: boolean;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 dark:bg-white/4">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg", tone)}>
                <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <div className="text-xs font-medium text-[#557368] dark:text-[#b3c9bf]">{label}</div>
                <div className={cn("truncate font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]", mono && "font-mono text-sm font-semibold")}>
                    {value}
                </div>
            </div>
        </div>
    );
}

const ShowCertificateByIdForVerify = ({ certificateId }: { certificateId: string }) => {
    const [cert, setCert] = useState<PublicCertificate | null>(null);
    const [status, setStatus] = useState<"loading" | "found" | "notfound" | "error">("loading");

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        setCert(null);
        publicApi<PublicCertificate>(`/cerfificate/${encodeURIComponent(certificateId)}`)
            .then((c) => {
                if (cancelled) return;
                setCert(c);
                setStatus("found");
            })
            .catch((e) => {
                if (cancelled) return;
                setStatus(e.status === 404 ? "notfound" : "error");
            });
        return () => {
            cancelled = true;
        };
    }, [certificateId]);

    if (status === "loading")
        return (
            <div className="space-y-4" aria-live="polite">
                <div className="flex h-24 animate-pulse items-center justify-center rounded-3xl border border-white/80 bg-white/60 dark:border-white/10 dark:bg-white/4">
                    <Loader2 className="size-6 animate-spin text-[#16a653]" />
                </div>
                <div className="aspect-[1.414] animate-pulse rounded-3xl border border-white/80 bg-white/60 dark:border-white/10 dark:bg-white/4" />
            </div>
        );

    if (status === "notfound")
        return (
            <section className={cn(glass, "p-8 text-center")} aria-live="polite">
                <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-400 to-red-600 text-white shadow-lg shadow-rose-500/30">
                    <ShieldX className="size-7" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">No certificate found</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-[#557368] dark:text-[#b3c9bf]">
                    We couldn&apos;t find a certificate with ID{" "}
                    <span className="break-all font-mono font-semibold text-[#075b3c] dark:text-[#a8e4bd]">{certificateId}</span>.
                    Check the ID and try again.
                </p>
            </section>
        );

    if (status === "error" || !cert)
        return (
            <p className="rounded-3xl border border-[#f4b8c6] bg-[#fde3ea] px-4 py-3 text-center text-sm font-semibold text-[#b4234a] dark:border-[#7a2a40] dark:bg-[#4a1f2c] dark:text-[#f9a8bd]">
                Something went wrong. Please try again in a moment.
            </p>
        );

    const valid = !cert.revoked;

    return (
        <div className="space-y-6" aria-live="polite">
            {/* Status banner */}
            <section className={cn(glass, "overflow-hidden")}>
                <div
                    className={cn(
                        "relative flex items-center gap-4 overflow-hidden px-5 py-5 text-white sm:px-6",
                        valid ? "bg-linear-to-br from-[#064c38] via-[#0b6b4c] to-[#16a653]" : "bg-linear-to-br from-amber-500 to-orange-600"
                    )}
                >
                    <div
                        className="absolute inset-0 opacity-[0.12]"
                        style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                    />
                    <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10 backdrop-blur">
                        {valid ? <ShieldCheck className="size-7" /> : <ShieldX className="size-7" />}
                    </span>
                    <div className="relative">
                        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                            {valid ? "Certificate is valid" : "Certificate was revoked"}
                        </h2>
                        <p className="text-sm text-white/80">
                            {valid ? "Issued and recorded by HelpingHands." : "This certificate is no longer valid."}
                        </p>
                    </div>
                </div>

                <div className="grid gap-2.5 p-4 sm:grid-cols-2 sm:p-5">
                    <Chip icon={User} tone="from-emerald-400 to-green-600 shadow-emerald-500/30" label="Awarded to" value={cert.participantName} />
                    <Chip icon={Award} tone="from-sky-400 to-blue-600 shadow-sky-500/30" label="Event" value={cert.eventTitle} />
                    <Chip icon={CalendarDays} tone="from-amber-400 to-orange-500 shadow-amber-500/30" label="Issued on" value={formatDate(cert.issueDate)} />
                    <Chip icon={Hash} tone="from-violet-400 to-purple-600 shadow-violet-500/30" label="Certificate ID" value={cert.certificateId} mono />
                </div>
            </section>

            {/* The certificate itself */}
            <div className="relative">
                <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-linear-to-br from-[#16a653]/25 via-transparent to-sky-400/20 blur-2xl" />
                <div
                    className={cn(
                        "w-full overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-[0_24px_50px_-24px_rgba(15,65,42,0.5)] dark:border-white/10 sm:p-3 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:rounded-2xl",
                        !valid && "opacity-60 grayscale"
                    )}
                    /* SVG text is escaped inside buildCertificateSvg */
                    dangerouslySetInnerHTML={{ __html: buildCertificateSvg(cert) }}
                />
            </div>
        </div>
    );
};

export default ShowCertificateByIdForVerify;

"use client";
// Public page: /verify  and  /verify/:certificateId  (no login needed)
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Hash, Search, ShieldCheck, ShieldX, User, Award, Loader2 } from "lucide-react";
import { cn } from "cn";
import { publicApi, formatDate } from "@/lib/certificate";

// Public endpoint response — only non-sensitive fields (no email, no user id)
type VerifyResult = {
    certificateId: string;
    participantName: string;
    eventTitle: string;
    issueDate: string;
    revoked?: boolean;
};

const glass =
    "rounded-3xl border border-white/80 bg-white/70 shadow-[0_10px_40px_-24px_rgba(15,65,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/4";

function Row({ icon: Icon, tone, label, value, mono }: {
    icon: typeof User; tone: string; label: string; value: string; mono?: boolean;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-3 dark:bg-white/4">
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg", tone)}>
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

const VerifyCertificate = () => {
    const params = useParams<{ certificateid?: string }>();
    const router = useRouter();
    const id = params.certificateid ? decodeURIComponent(params.certificateid) : "";

    const [input, setInput] = useState(id);
    const [result, setResult] = useState<VerifyResult | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "found" | "notfound" | "error">(id ? "loading" : "idle");

    useEffect(() => {
        setInput(id);
        if (!id) {
            setStatus("idle");
            setResult(null);
            return;
        }
        let cancelled = false;
        setStatus("loading");
        publicApi<VerifyResult>(`/cerfificate/${encodeURIComponent(id)}`)
            .then((r) => {
                if (cancelled) return;
                setResult(r);
                setStatus("found");
            })
            .catch((e) => {
                if (cancelled) return;
                setResult(null);
                setStatus(e.status === 404 ? "notfound" : "error");
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const v = input.trim();
        if (v) router.push(`/certificate/verify/${encodeURIComponent(v)}`);
    }

    const valid = status === "found" && result && !result.revoked;
    const revoked = status === "found" && result?.revoked;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f4fbf6] px-5 py-10 text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3] sm:px-8 sm:py-14 lg:px-[6.65%]">
            {/* Soft background glows */}
            <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[#86efac]/25 blur-3xl dark:bg-[#16a653]/10" />
            <div className="pointer-events-none absolute -right-32 top-40 size-[380px] rounded-full bg-[#5eead4]/20 blur-3xl dark:bg-[#0f766e]/10" />

            <div className="relative mx-auto container">
                {/* Hero */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#075b3c] backdrop-blur dark:border-white/10 dark:bg-white/4 dark:text-[#a8e4bd]">
                        <ShieldCheck className="size-3.5" /> Public verification
                    </span>
                    <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#082e24] dark:text-[#f3f9f5] sm:text-5xl">
                        Verify a{" "}
                        <span className="bg-linear-to-r from-[#16a653] to-[#0b7a54] bg-clip-text text-transparent dark:from-[#45d879] dark:to-[#25a95e]">
                            Certificate
                        </span>
                    </h1>
                    <p className="mt-2 text-[#557368] dark:text-[#b3c9bf]">
                        Enter the certificate ID, or scan the QR code on the certificate, to confirm it was issued by HelpingHands.
                    </p>

                    <form onSubmit={submit} className={cn(glass, "mt-6 flex items-center gap-2 p-2")}>
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#557368] dark:text-[#b3c9bf]" />
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g. HH-2026-AB12CD34"
                                aria-label="Certificate ID"
                                className="h-11 w-full rounded-full bg-transparent pl-11 pr-4 font-mono text-sm text-[#092d23] outline-none placeholder:font-sans placeholder:text-[#557368]/70 dark:text-[#f1f8f3]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || status === "loading"}
                            className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-[#064c38] to-[#0b7a54] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(6,76,56,0.6)] transition hover:brightness-110 disabled:opacity-60 dark:from-[#1f9d57] dark:to-[#2bc16e] dark:text-[#062817]"
                        >
                            {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
                            Verify
                        </button>
                    </form>
                </div>

                {/* Result */}
                <div className="mx-auto mt-8 max-w-2xl" aria-live="polite">
                    {status === "loading" && (
                        <div className="h-72 animate-pulse rounded-3xl border border-white/80 bg-white/60 dark:border-white/10 dark:bg-white/4" />
                    )}

                    {(valid || revoked) && result && (
                        <section className={cn(glass, "overflow-hidden")}>
                            <div
                                className={cn(
                                    "relative overflow-hidden px-6 py-7 text-center text-white",
                                    valid ? "bg-linear-to-br from-[#064c38] via-[#0b6b4c] to-[#16a653]" : "bg-linear-to-br from-amber-500 to-orange-600"
                                )}
                            >
                                <div
                                    className="absolute inset-0 opacity-[0.12]"
                                    style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                                />
                                <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10 backdrop-blur">
                                    {valid ? <ShieldCheck className="size-8" /> : <ShieldX className="size-8" />}
                                </span>
                                <h2 className="relative mt-3 text-2xl font-extrabold tracking-tight">
                                    {valid ? "Certificate is valid" : "Certificate was revoked"}
                                </h2>
                                <p className="relative mt-1 text-sm text-white/80">
                                    {valid ? "Issued and recorded by HelpingHands." : "This certificate is no longer valid."}
                                </p>
                            </div>

                            <div className="space-y-2.5 p-5 sm:p-6">
                                <Row icon={User} tone="from-emerald-400 to-green-600 shadow-emerald-500/30" label="Awarded to" value={result.participantName} />
                                <Row icon={Award} tone="from-sky-400 to-blue-600 shadow-sky-500/30" label="Event" value={result.eventTitle} />
                                <Row icon={CalendarDays} tone="from-amber-400 to-orange-500 shadow-amber-500/30" label="Issued on" value={formatDate(result.issueDate)} />
                                <Row icon={Hash} tone="from-violet-400 to-purple-600 shadow-violet-500/30" label="Certificate ID" value={result.certificateId} mono />
                            </div>
                        </section>
                    )}

                    {status === "notfound" && (
                        <section className={cn(glass, "p-8 text-center")}>
                            <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-400 to-red-600 text-white shadow-lg shadow-rose-500/30">
                                <ShieldX className="size-7" aria-hidden="true" />
                            </span>
                            <h2 className="text-xl font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">No certificate found</h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-[#557368] dark:text-[#b3c9bf]">
                                We couldn&apos;t find a certificate with ID{" "}
                                <span className="break-all font-mono font-semibold text-[#075b3c] dark:text-[#a8e4bd]">{id}</span>. Check the ID and try again.
                            </p>
                        </section>
                    )}

                    {status === "error" && (
                        <p className="rounded-3xl border border-[#f4b8c6] bg-[#fde3ea] px-4 py-3 text-center text-sm font-semibold text-[#b4234a] dark:border-[#7a2a40] dark:bg-[#4a1f2c] dark:text-[#f9a8bd]">
                            Something went wrong. Please try again in a moment.
                        </p>
                    )}

                    {status === "idle" && (
                        <p className="text-center text-sm text-[#557368] dark:text-[#b3c9bf]">
                            Have an account?{" "}
                            <Link href="/my-certificates" className="font-semibold text-[#16a653] hover:underline dark:text-[#45d879]">
                                View your certificates
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default VerifyCertificate;

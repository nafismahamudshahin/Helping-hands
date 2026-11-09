"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Search, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import ShowCertificateByIdForVerify from "@/components/certificates/ShowCertificateByIdForVerify";

const glass =
    "rounded-3xl border border-white/80 bg-white/70 shadow-[0_10px_40px_-24px_rgba(15,65,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/4";

const VerifyCertificate = () => {
    const params = useParams<{ certificateid?: string }>();
    const router = useRouter();
    const id = params.certificateid ? decodeURIComponent(params.certificateid) : "";
    const [input, setInput] = useState(id);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const v = input.trim();
        if (v) router.push(`/certificate/verify/${encodeURIComponent(v)}`);
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f4fbf6] px-5 py-10 text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3] sm:px-8 sm:py-14 lg:px-[6.65%]">
            <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[#86efac]/25 blur-3xl dark:bg-[#16a653]/10" />
            <div className="pointer-events-none absolute -right-32 top-40 size-[380px] rounded-full bg-[#5eead4]/20 blur-3xl dark:bg-[#0f766e]/10" />

            <div className="relative mx-auto container">
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
                            disabled={!input.trim()}
                            className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-[#064c38] to-[#0b7a54] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(6,76,56,0.6)] transition hover:brightness-110 disabled:opacity-60 dark:from-[#1f9d57] dark:to-[#2bc16e] dark:text-[#062817]"
                        >
                            <BadgeCheck className="size-4" /> Verify
                        </button>
                    </form>
                </div>

                <div className="mx-auto mt-8 max-w-4xl">
                    {id ? (
                        <ShowCertificateByIdForVerify certificateId={id} />
                    ) : (
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

"use client";
// View page: /my-certificates/:certificateId  (server rejects anyone who isn't the owner)
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, BadgeCheck, CalendarDays, Check, Copy, Download, ExternalLink,
    Hash, Image as ImageIcon, Link2, Share2, ShieldAlert, Sparkles,
} from "lucide-react";
import { cn } from "cn";
import { api, Certificate, downloadCertificatePdf, downloadCertificatePng, certificateToPngBlob, formatDate } from "@/lib/certificate";
import { buildCertificateSvg } from "@/lib/certificateSvg";
import Loading from "@/app/loading";

const glass =
    "rounded-3xl border border-white/80 bg-white/70 shadow-[0_10px_40px_-24px_rgba(15,65,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/4";
const pageBg =
    "relative min-h-screen overflow-hidden bg-[#f4fbf6] px-5 pb-12 pt-2 text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3] sm:px-8 sm:pb-16 lg:px-[6.65%]";
const btn =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:opacity-60";
const btnPrimary = cn(
    btn,
    "bg-linear-to-r from-[#064c38] to-[#0b7a54] text-white shadow-[0_8px_20px_-8px_rgba(6,76,56,0.6)] hover:-translate-y-0.5 hover:brightness-110 dark:from-[#1f9d57] dark:to-[#2bc16e] dark:text-[#062817]"
);
const btnOutline = cn(
    btn,
    "border border-[#c5dfd0] bg-white/80 text-[#123d30] hover:border-[#16a653] hover:bg-[#def2e6] dark:border-white/15 dark:bg-white/5 dark:text-[#e4f2e9] dark:hover:bg-white/10"
);
const socialBtn =
    "inline-flex h-10 items-center justify-center rounded-full px-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90";

function Glows() {
    return (
        <>
            <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-[#86efac]/25 blur-3xl dark:bg-[#16a653]/10" />
            <div className="pointer-events-none absolute -right-32 top-40 size-[380px] rounded-full bg-[#5eead4]/20 blur-3xl dark:bg-[#0f766e]/10" />
        </>
    );
}

function IconBadge({ tone, children }: { tone: string; children: React.ReactNode }) {
    return (
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg", tone)}>
            {children}
        </span>
    );
}

function DetailsPanel({ cert }: { cert: Certificate }) {
    const [copied, setCopied] = useState(false);

    async function copyId() {
        try {
            await navigator.clipboard.writeText(cert.certificateId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard blocked */
        }
    }

    return (
        <section className={cn(glass, "p-5 sm:p-6")}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16a653] dark:text-[#45d879]">
                <BadgeCheck className="size-4" /> Verified certificate
            </div>

            <div className="mt-4 space-y-3.5">
                <div className="flex items-center gap-3">
                    <IconBadge tone="from-amber-400 to-orange-500 shadow-amber-500/30">
                        <CalendarDays className="size-5" aria-hidden="true" />
                    </IconBadge>
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-[#557368] dark:text-[#b3c9bf]">Issued on</div>
                        <div className="font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">{formatDate(cert.issueDate)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <IconBadge tone="from-violet-400 to-purple-600 shadow-violet-500/30">
                        <Hash className="size-5" aria-hidden="true" />
                    </IconBadge>
                    <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-[#557368] dark:text-[#b3c9bf]">Certificate ID</div>
                        <div className="truncate font-mono text-sm font-semibold text-[#075b3c] dark:text-[#a8e4bd]">{cert.certificateId}</div>
                    </div>
                    <button
                        onClick={copyId}
                        aria-label="Copy certificate ID"
                        className="grid size-9 shrink-0 place-items-center rounded-xl text-[#557368] transition hover:bg-white hover:text-[#16a653] dark:text-[#b3c9bf] dark:hover:bg-white/10"
                    >
                        {copied ? <Check className="size-4 text-[#16a653]" /> : <Copy className="size-4" />}
                    </button>
                </div>
            </div>

            <div className="my-5 h-px bg-linear-to-r from-transparent via-[#c5dfd0] to-transparent dark:via-white/15" />

            <div className="space-y-2.5">
                <button onClick={() => downloadCertificatePdf(cert)} className={btnPrimary}>
                    <Download className="size-4" /> Download PDF
                </button>
                <button onClick={() => downloadCertificatePng(cert)} className={btnOutline}>
                    <ImageIcon className="size-4" /> Download image
                </button>
                {/* ADAPT: change "/events/" if your event details route is different */}
                <Link href={`/events/${cert.eventId}`} className={btnOutline}>
                    <ExternalLink className="size-4" /> View event
                </Link>
            </div>
        </section>
    );
}

function SharePanel({ cert }: { cert: Certificate }) {
    const [copied, setCopied] = useState(false);
    const [busy, setBusy] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);
    useEffect(() => setCanNativeShare("share" in navigator), []);

    // Use the public verification page so recipients can validate the credential.
    const url = typeof window !== "undefined"
        ? `${window.location.origin}/certificate/verify/${encodeURIComponent(cert.certificateId)}`
        : "";
    const text = `I just earned a Certificate of Participation for "${cert.eventTitle}" with Helping Hands! 🌟`;
    const enc = encodeURIComponent;
    const issueDate = new Date(cert.issueDate);
    const linkedInParams = new URLSearchParams({
        startTask: "CERTIFICATION_NAME",
        name: `Certificate of Participation - ${cert.eventTitle}`,
        organizationName: "HelpingHands",
        issueYear: String(issueDate.getFullYear()),
        issueMonth: String(issueDate.getMonth() + 1),
        certId: cert.certificateId,
        certUrl: url,
    });
    const addToLinkedInUrl = `https://www.linkedin.com/profile/add?${linkedInParams.toString()}`;

    const links = [
        { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, cls: "bg-[#1877f2]" },
        { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, cls: "bg-[#0a66c2]" },
        { name: "X", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`, cls: "bg-black" },
        { name: "WhatsApp", href: `https://wa.me/?text=${enc(text + " " + url)}`, cls: "bg-[#25d366]" },
    ];

    async function nativeShare() {
        setBusy(true);
        try {
            const blob = await certificateToPngBlob(cert);
            const file = new File([blob], `certificate-${cert.certificateId}.png`, { type: "image/png" });
            if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text, url });
            else await navigator.share({ text, url });
        } catch {
            /* user closed the share sheet */
        } finally {
            setBusy(false);
        }
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard blocked */
        }
    }

    return (
        <section className={cn(glass, "p-5 sm:p-6")}>
            <div className="flex items-center gap-3">
                <IconBadge tone="from-sky-400 to-blue-600 shadow-sky-500/30">
                    <Share2 className="size-5" aria-hidden="true" />
                </IconBadge>
                <div>
                    <h2 className="font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">Share your achievement</h2>
                    <p className="text-xs font-medium text-[#557368] dark:text-[#b3c9bf]">Link to the event, attach the image.</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                {links.map((l) => (
                    <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={cn(socialBtn, l.cls)}>
                        {l.name}
                    </a>
                ))}
            </div>

            <a
                href={addToLinkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(btnPrimary, "mt-2.5 bg-[#0a66c2] hover:bg-[#004182] dark:bg-[#0a66c2] dark:text-white")}
            >
                <ExternalLink className="size-4" /> Add certificate to LinkedIn
            </a>

            <div className="mt-2.5 space-y-2.5">
                <button onClick={copy} className={btnOutline}>
                    {copied ? <Check className="size-4 text-[#16a653]" /> : <Link2 className="size-4" />}
                    {copied ? "Copied!" : "Copy text & link"}
                </button>
                {canNativeShare && (
                    <button onClick={nativeShare} disabled={busy} className={btnPrimary}>
                        <Share2 className="size-4" /> {busy ? "Preparing…" : "Share with image"}
                    </button>
                )}
            </div>
        </section>
    );
}

export default function CertificateViewPage() {
    const { certificateId } = useParams<{ certificateId: string }>();
    const router = useRouter();
    const [cert, setCert] = useState<Certificate | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api<Certificate>(`/certificate/id/${certificateId}`)
            .then(setCert)
            .catch((e) => {
                if (e.status === 401) router.replace(`/login?redirect=/my-certificates/${certificateId}`);
                else if (e.status === 403) setError("You are not allowed to view this certificate.");
                else if (e.status === 404) setError("Certificate not found.");
                else setError(e.message);
            });
    }, [certificateId, router]);

    if (error)
        return (
            <main className={cn(pageBg, "grid min-h-[calc(100vh-5rem)] place-items-center py-10")}>
                <Glows />
                <div className={cn(glass, "relative max-w-md p-8 text-center")}>
                    <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-400 to-red-600 text-white shadow-lg shadow-rose-500/30">
                        <ShieldAlert className="size-7" aria-hidden="true" />
                    </span>
                    <p className="text-lg font-extrabold tracking-tight text-[#092d23] dark:text-[#f1f8f3]">{error}</p>
                    <Link href="/my-certificates" className={cn(btnPrimary, "mt-5")}>
                        <ArrowLeft className="size-4" /> Back to my certificates
                    </Link>
                </div>
            </main>
        );
    if (!cert) return <Loading></Loading>;

    return (
        <main className={pageBg}>
            <Glows />

            <div className="relative mx-auto container">
                <Link
                    href="/my-certificates"
                    className="group inline-flex items-center gap-1.5 py-6 text-[13px] font-semibold text-[#16a653] dark:text-[#45d879]"
                >
                    <ArrowLeft className="size-4 transition group-hover:-translate-x-1" /> My Certificates
                </Link>

                {/* Hero */}
                <div className="mb-8 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#075b3c] backdrop-blur dark:border-white/10 dark:bg-white/4 dark:text-[#a8e4bd]">
                        <Sparkles className="size-3" /> Certificate of Participation
                    </span>
                    <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#082e24] dark:text-[#f3f9f5] sm:text-5xl">
                        {cert.eventTitle}
                    </h1>
                    <p className="mt-2 text-[#557368] dark:text-[#b3c9bf]">
                        Thank you for making a difference with <span className="font-semibold text-[#16a653] dark:text-[#45d879]">HelpingHands</span>.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                    {/* Certificate */}
                    <div className="relative">
                        <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-linear-to-br from-[#16a653]/25 via-transparent to-sky-400/20 blur-2xl" />
                        <div
                            className="w-full overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-[0_24px_50px_-24px_rgba(15,65,42,0.5)] dark:border-white/10 sm:p-3 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:rounded-2xl"
                            /* SVG text is escaped inside buildCertificateSvg */
                            dangerouslySetInnerHTML={{ __html: buildCertificateSvg(cert) }}
                        />
                    </div>

                    {/* Side panels */}
                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <DetailsPanel cert={cert} />
                        <SharePanel cert={cert} />
                    </aside>
                </div>
            </div>
        </main>
    );
}

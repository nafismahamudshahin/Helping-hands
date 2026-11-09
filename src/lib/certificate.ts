// npm i jspdf
import jsPDF from "jspdf";
import { buildCertificateSvg } from "./certificateSvg";

export type Certificate = {
    _id: string;
    certificateId: string;
    userId: string;
    eventId: string;
    eventTitle: string;
    participantName: string;
    issueDate: string;
};

const API = process.env.NEXT_PUBLIC_API_URL!;

// ADAPT: import YOUR auth client (the file where you call createAuthClient from "better-auth/react")
import { authClient } from "@/lib/auth-client";

async function getToken(): Promise<string | null> {
    const { data } = await authClient.token(); // JWT for your Express verifyToken
    return data?.token ?? null;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getToken();
    if (!token) throw Object.assign(new Error("Not logged in"), { status: 401 });

    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...init.headers,
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw Object.assign(new Error(body.message || "Request failed"), {
            status: res.status,
        });
    }
    return res.json();
}

export const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

// Rasterize the certificate SVG to a PNG (used by PDF, PNG download and social sharing)
export async function certificateToPngBlob(c: Certificate): Promise<Blob> {
    const svg = buildCertificateSvg(c);
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    try {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Could not render certificate"));
            img.src = url;
        });
        const canvas = document.createElement("canvas");
        canvas.width = 3072; // 2x for a sharp result
        canvas.height = 2048;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        return await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG failed"))), "image/png")
        );
    } finally {
        URL.revokeObjectURL(url);
    }
}

function saveBlob(blob: Blob, filename: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function downloadCertificatePng(c: Certificate) {
    saveBlob(await certificateToPngBlob(c), `certificate-${c.certificateId}.png`);
}

export async function downloadCertificatePdf(c: Certificate) {
    const blob = await certificateToPngBlob(c);
    const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(blob);
    });
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: [900, 600] });
    doc.addImage(dataUrl, "PNG", 0, 0, 900, 600);
    doc.save(`certificate-${c.certificateId}.pdf`);
}
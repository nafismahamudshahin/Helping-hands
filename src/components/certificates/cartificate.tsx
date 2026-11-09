// npm i jspdf
import jsPDF from "jspdf";

export type Certificate = {
    _id: string;
    certificateId: string;
    userId: string;
    eventId: string;
    eventTitle: string;
    participantName: string;
    issueDate: string;
};

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. http://localhost:5000

// No token needed: auth is a session cookie that the browser sends automatically.
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API}${path}`, {
        ...init,
        credentials: "include", // sends the session cookie
        headers: { "Content-Type": "application/json", ...init.headers },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw Object.assign(new Error(body.message || "Request failed"), { status: res.status });
    }
    return res.json();
}

export const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

// Draws the certificate directly with jsPDF (no html2canvas -> no CSS colour issues)
export function downloadCertificatePdf(c: Certificate) {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const green: [number, number, number] = [22, 101, 52];

    doc.setDrawColor(...green).setLineWidth(6).rect(24, 24, W - 48, H - 48);
    doc.setLineWidth(1.5).rect(38, 38, W - 76, H - 76);

    doc.setTextColor(...green).setFont("times", "bold").setFontSize(40);
    doc.text("Certificate of Participation", W / 2, 130, { align: "center" });

    doc.setTextColor(90).setFont("helvetica", "normal").setFontSize(14);
    doc.text("This certificate is proudly presented to", W / 2, 185, { align: "center" });

    doc.setTextColor(20).setFont("times", "bolditalic").setFontSize(38);
    doc.text(c.participantName, W / 2, 245, { align: "center" });
    doc.setDrawColor(150).setLineWidth(0.8).line(W / 2 - 170, 258, W / 2 + 170, 258);

    doc.setTextColor(90).setFont("helvetica", "normal").setFontSize(14);
    doc.text("for actively participating in and successfully completing", W / 2, 295, { align: "center" });

    doc.setTextColor(...green).setFont("helvetica", "bold").setFontSize(24);
    doc.text(c.eventTitle, W / 2, 335, { align: "center", maxWidth: W - 200 });

    doc.setTextColor(90).setFont("helvetica", "normal").setFontSize(12);
    doc.text(`Issued on ${formatDate(c.issueDate)}`, 80, H - 80);
    doc.text("Helping Hands", W - 80, H - 80, { align: "right" });
    doc.setFontSize(9).setTextColor(130);
    doc.text(`Certificate ID: ${c.certificateId}`, W / 2, H - 55, { align: "center" });

    doc.save(`certificate-${c.certificateId}.pdf`);
}
// Builds the certificate as one SVG string (1536 x 1024).
// The view page shows it directly and the PDF download rasterizes the same SVG,
// so on-screen and PDF always look identical.
import type { Certificate } from "./certificate";

const W = 1536;
const H = 1024;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

const esc = (s: string) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

type P = [number, number];

// A laurel branch: curved stem + leaves along a quadratic bezier
function laurel(p0: P, p1: P, p2: P, n: number, len: number, wid: number, fill: string, stem: string) {
    let out = `<path d="M${p0} Q${p1} ${p2}" fill="none" stroke="${stem}" stroke-width="${Math.max(1.5, wid / 4)}" stroke-linecap="round"/>`;
    for (let i = 0; i < n; i++) {
        const t = 0.04 + (0.92 * i) / (n - 1);
        const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
        const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
        const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
        const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        const k = 1 - 0.35 * t;
        for (const side of [-42, 42]) {
            out += `<ellipse cx="0" cy="${(-len * k) / 1}" rx="${wid * k}" ry="${len * k}" fill="${fill}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + side).toFixed(1)}) translate(0 ${(len * k * 0.2).toFixed(1)})"/>`;
        }
    }
    return out;
}

// three people over a hand (logo mark)
function peopleHand(cx: number, cy: number, s: number, people: string, hand: string) {
    const head = (x: number, y: number) =>
        `<circle cx="${cx + x * s}" cy="${cy + y * s}" r="${8.5 * s}" fill="${people}"/>` +
        `<path d="M${cx + (x - 12) * s},${cy + (y + 24) * s} q${12 * s},${-18 * s} ${24 * s},0 z" fill="${people}"/>`;
    return (
        head(-17, -6) + head(17, -6) + head(0, -14) +
        `<path d="M${cx - 44 * s},${cy + 14 * s} C${cx - 26 * s},${cy + 46 * s} ${cx + 18 * s},${cy + 52 * s} ${cx + 46 * s},${cy + 10 * s}` +
        ` C${cx + 30 * s},${cy + 28 * s} ${cx + 4 * s},${cy + 30 * s} ${cx - 20 * s},${cy + 22 * s} Z" fill="${hand}"/>`
    );
}

function swoosh() {
    return `
  <path d="M22,22 L480,22 C330,52 165,125 22,330 Z" fill="url(#gGreen)"/>
  <path d="M22,22 L340,22 C225,62 110,135 22,245 Z" fill="#04382a" opacity=".55"/>
  <path d="M22,300 C150,150 300,72 470,40" fill="none" stroke="#e4ece6" stroke-width="16" opacity=".7"/>
  <path d="M22,222 C120,102 245,46 350,22 L418,22 C292,58 150,140 22,276 Z" fill="url(#gGold)"/>
  <path d="M22,238 C126,120 248,64 352,36" fill="none" stroke="#fff3b0" stroke-width="2" opacity=".8"/>
  <path d="M22,290 C150,175 290,95 440,52" fill="none" stroke="#d4a62f" stroke-width="2.5"/>`;
}

export function buildCertificateSvg(c: Certificate): string {
    const name = esc(c.participantName || "Participant");
    const event = esc(c.eventTitle || "Event");
    const id = esc(c.certificateId);
    const date = esc(fmtDate(c.issueDate));

    const nameSize = Math.min(98, 900 / ((c.participantName?.length || 10) * 0.5));
    const eventSize = Math.min(54, 860 / ((c.eventTitle?.length || 10) * 0.58));

    // scalloped seal edge
    let scallops = "";
    for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        scallops += `<circle cx="${(768 + 88 * Math.cos(a)).toFixed(1)}" cy="${(795 + 88 * Math.sin(a)).toFixed(1)}" r="13" fill="url(#gGold)"/>`;
    }

    const gold = "#c9972b";
    const gLeaf = "url(#gGold)";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d7457"/><stop offset="1" stop-color="#054030"/></linearGradient>
  <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8dc78"/><stop offset=".45" stop-color="#cf9b2c"/><stop offset="1" stop-color="#f3d36b"/></linearGradient>
  <linearGradient id="gLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a93a" stop-opacity="0"/><stop offset=".25" stop-color="#d9a93a"/><stop offset=".5" stop-color="#f6d86c"/><stop offset=".75" stop-color="#d9a93a"/><stop offset="1" stop-color="#d9a93a" stop-opacity="0"/></linearGradient>
  <linearGradient id="gBanner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f6b50"/><stop offset="1" stop-color="#074735"/></linearGradient>
  <clipPath id="inner"><rect x="21" y="21" width="${W - 42}" height="${H - 42}"/></clipPath>
  <radialGradient id="gPaper" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f1f5f1"/></radialGradient>
</defs>

<!-- frame -->
<rect width="${W}" height="${H}" fill="#06503c"/>
<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="url(#gPaper)"/>
<rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="url(#gGold)" stroke-width="3"/>
<rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="#e2bd55" stroke-width="1" opacity=".7"/>

<!-- faint background curves -->
<path d="M20,740 C200,700 360,860 560,1004" fill="none" stroke="#e6ebe6" stroke-width="2"/>
<path d="M20,790 C220,760 400,900 600,1004" fill="none" stroke="#e6ebe6" stroke-width="2"/>
<path d="M1516,330 C1330,310 1190,200 1060,24" fill="none" stroke="#e6ebe6" stroke-width="2"/>

<!-- corner swooshes -->
<g clip-path="url(#inner)"><g>${swoosh()}</g>
<g transform="rotate(180 ${W / 2} ${H / 2})">${swoosh()}</g></g>

<!-- faint side laurels -->
<g opacity=".9">${laurel([165, 600], [30, 480], [120, 345], 11, 34, 10, "#f0f1f0", "#eceeec")}</g>
<g opacity=".9" transform="translate(${W} 0) scale(-1 1)">${laurel([165, 600], [30, 480], [120, 345], 11, 34, 10, "#f0f1f0", "#eceeec")}</g>

<!-- logo -->
${peopleHand(598, 98, 1.05, "#1f8a5b", "#073f31")}
<line x1="668" y1="66" x2="668" y2="144" stroke="#073f31" stroke-width="2"/>
<text x="690" y="104" font-family="${SANS}" font-weight="700" font-size="46" fill="#073f31">Helping Hands</text>
<text x="700" y="136" font-family="${SANS}" font-size="17" letter-spacing="1.5" fill="#222">PEOPLE · SUPPORT · COMMUNITY</text>

<!-- gold laurels beside title -->
<g>${laurel([378, 320], [262, 250], [352, 165], 9, 22, 8, gLeaf, gold)}</g>
<g transform="translate(${W} 0) scale(-1 1)">${laurel([378, 320], [262, 250], [352, 165], 9, 22, 8, gLeaf, gold)}</g>

<!-- title -->
<text x="${W / 2}" y="262" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="100" fill="#073f31" textLength="735" lengthAdjust="spacingAndGlyphs">CERTIFICATE</text>
<line x1="402" y1="299" x2="482" y2="299" stroke="${gold}" stroke-width="2.5"/>
<line x1="1054" y1="299" x2="1134" y2="299" stroke="${gold}" stroke-width="2.5"/>
<text x="${W / 2}" y="311" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="38" fill="#c8961f" textLength="515">OF PARTICIPATION</text>

<!-- ribbon banner -->
<polygon points="476,364 520,364 520,400 476,400 494,382" fill="#05432f"/>
<polygon points="1060,364 1016,364 1016,400 1060,400 1042,382" fill="#05432f"/>
<polygon points="510,355 510,372 520,364" fill="#032b1f"/>
<polygon points="1026,355 1026,372 1016,364" fill="#032b1f"/>
<rect x="510" y="355" width="516" height="46" fill="url(#gBanner)"/>
<text x="${W / 2}" y="387" text-anchor="middle" font-family="${SANS}" font-size="26" fill="#fff">This certificate is proudly presented to</text>

<!-- name -->
<text x="${W / 2}" y="492" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-weight="700" font-size="${nameSize.toFixed(0)}" fill="#073f31">${name}</text>
<rect x="335" y="520" width="866" height="3" fill="url(#gLine)"/>

<text x="${W / 2}" y="570" text-anchor="middle" font-family="${SANS}" font-size="27" fill="#1d2b26">In recognition of active participation and successful completion of</text>
<text x="${W / 2}" y="632" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="${eventSize.toFixed(0)}" fill="#073f31">${event}</text>

<!-- divider with heart -->
<line x1="578" y1="674" x2="722" y2="674" stroke="${gold}" stroke-width="2.5"/>
<circle cx="729" cy="674" r="3" fill="${gold}"/>
<line x1="814" y1="674" x2="958" y2="674" stroke="${gold}" stroke-width="2.5"/>
<circle cx="807" cy="674" r="3" fill="${gold}"/>
<path d="M768,692 C742,672 742,655 756,654 C762,654 766,658 768,662 C770,658 774,654 780,654 C794,655 794,672 768,692 Z" fill="none" stroke="#073f31" stroke-width="2.2"/>
<path d="M754,670 L766,676 L775,668 L782,674" fill="none" stroke="#073f31" stroke-width="2"/>

<!-- date (left) -->
<g transform="translate(266 756)">
  <rect width="32" height="32" rx="5" fill="none" stroke="#073f31" stroke-width="2.5"/>
  <rect width="32" height="10" rx="4" fill="#073f31"/>
  ${[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3, 4].map((col) => `<rect x="${4 + col * 5.4}" y="${14 + r * 4.6}" width="3" height="3" fill="#073f31"/>`)).join("")}
</g>
<text x="319" y="779" font-family="${SERIF}" font-weight="700" font-size="27" fill="#1d2b26">${date}</text>
<line x1="235" y1="803" x2="560" y2="803" stroke="url(#gGold)" stroke-width="2.5"/>
<text x="398" y="830" text-anchor="middle" font-family="${SANS}" font-size="20" letter-spacing="3" fill="#59635f">DATE ISSUED</text>

<!-- seal -->
<polygon points="700,860 740,880 724,935 706,912 684,925" fill="#05432f" stroke="#d1a233" stroke-width="2.5"/>
<polygon points="836,860 796,880 812,935 830,912 852,925" fill="#05432f" stroke="#d1a233" stroke-width="2.5"/>
${scallops}
<circle cx="768" cy="795" r="90" fill="url(#gGold)"/>
<circle cx="768" cy="795" r="72" fill="#06402f"/>
<circle cx="768" cy="795" r="66" fill="none" stroke="url(#gGold)" stroke-width="2"/>
<g>${laurel([728, 838], [703, 795], [722, 752], 7, 10, 4, gLeaf, gold)}</g>
<g transform="translate(1536 0) scale(-1 1)">${laurel([728, 838], [703, 795], [722, 752], 7, 10, 4, gLeaf, gold)}</g>
${peopleHand(768, 788, 0.95, "#ffffff", "#ffffff")}

<!-- signature (right) -->
<path d="M1048,780 C1062,772 1078,750 1090,730 C1098,716 1114,716 1108,732 C1100,752 1078,774 1066,764 C1086,756 1112,742 1130,724 C1128,742 1136,752 1150,740 C1164,728 1178,742 1196,734 C1206,730 1216,730 1226,728 M1096,744 C1140,738 1182,730 1228,722" fill="none" stroke="#12161a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="1000" y1="803" x2="1048" y2="803" stroke="url(#gGold)" stroke-width="2.5"/>
<line x1="1228" y1="803" x2="1285" y2="803" stroke="url(#gGold)" stroke-width="2.5"/>
<text x="1138" y="814" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="28" fill="#0a5a40">Helping Hands</text>
<text x="1138" y="848" text-anchor="middle" font-family="${SANS}" font-size="20" letter-spacing="3" fill="#59635f">AUTHORIZED BY</text>

<!-- certificate id -->
<rect x="448" y="932" width="640" height="44" rx="22" fill="#fff" stroke="url(#gGold)" stroke-width="2"/>
<text x="${W / 2}" y="961" text-anchor="middle" font-family="${SANS}" font-size="20" fill="#1d2b26">Certificate ID: ${id}</text>
</svg>`;
}
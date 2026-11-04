export const todayInDhaka = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date())

export const dateKey = (v?: string | null) => v?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null

export function getDate(v?: string | null) {
    const key = dateKey(v)
    const d = key ? new Date(`${key}T00:00:00`) : null
    return d && !Number.isNaN(d.getTime()) ? d : null
}

export function formatDate(v?: string | null) {
    return getDate(v)?.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) ?? v ?? ""
}

/** -1 = before today, 0 = today, 1 = after today, null = invalid date */
export function compareToToday(v?: string | null): -1 | 0 | 1 | null {
    const key = dateKey(v)
    if (!key) return null
    const today = todayInDhaka()
    return key < today ? -1 : key > today ? 1 : 0
}

export const isPastEvent = (v?: string | null) => compareToToday(v) === -1
export const isTodayEvent = (v?: string | null) => compareToToday(v) === 0
export const isUpcomingEvent = (v?: string | null) => compareToToday(v) === 1
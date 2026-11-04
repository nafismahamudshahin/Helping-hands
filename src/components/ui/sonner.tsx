"use client"

import type { CSSProperties } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCheck, CircleAlert, Info, Loader2, TriangleAlert, Bell } from "lucide-react"

const DURATION = 3500

const toast =
  "group relative flex w-full items-center gap-3.5 overflow-hidden rounded-3xl border p-3.5 pr-5 " +
  "border-white/70 bg-white/80 text-[#0f3325] shadow-[0_24px_60px_-24px_rgba(15,65,42,0.55),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl " +
  "dark:border-white/10 dark:bg-[#0d2119]/80 dark:text-[#eff8f2] dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] " +
  "sm:w-[400px]"

const icon =
  "flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ring-4 " +
  "bg-linear-to-br from-emerald-400 to-green-600 shadow-emerald-600/40 ring-emerald-500/15 " +
  "group-data-[type=error]:from-red-400 group-data-[type=error]:to-red-600 group-data-[type=error]:shadow-red-600/40 group-data-[type=error]:ring-red-500/15 " +
  "group-data-[type=warning]:from-amber-400 group-data-[type=warning]:to-orange-500 group-data-[type=warning]:shadow-amber-600/40 group-data-[type=warning]:ring-amber-500/15 " +
  "group-data-[type=info]:from-sky-400 group-data-[type=info]:to-blue-600 group-data-[type=info]:shadow-sky-600/40 group-data-[type=info]:ring-sky-500/15"

export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      duration={DURATION}
      visibleToasts={3}
      gap={12}
      offset={18}
      mobileOffset={12}
      closeButton
      style={{ "--toast-duration": `${DURATION}ms` } as CSSProperties}
      icons={{
        success: <CheckCheck className="size-5" aria-hidden="true" />,
        error: <CircleAlert className="size-5" aria-hidden="true" />,
        warning: <TriangleAlert className="size-5" aria-hidden="true" />,
        info: <Info className="size-5" aria-hidden="true" />,
        loading: <Loader2 className="size-5 animate-spin" aria-hidden="true" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast,
          icon,
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          title: "text-[15px] font-bold leading-snug tracking-tight",
          description: "text-[13px] leading-snug text-[#587269] dark:text-[#b4c9c0]",
          actionButton:
            "ml-2 shrink-0 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition hover:brightness-110 active:scale-95",
          cancelButton:
            "ml-2 shrink-0 rounded-full border border-emerald-900/10 px-4 py-2 text-xs font-semibold text-[#315747] transition hover:bg-emerald-50 dark:border-white/10 dark:text-[#d5eadc] dark:hover:bg-white/10",
          closeButton:
            "!border-emerald-900/10 !bg-white !text-[#315747] hover:!bg-emerald-50 dark:!border-white/10 dark:!bg-[#10251b] dark:!text-[#d5eadc]",
        },
      }}
      {...props}
    />
  )
}
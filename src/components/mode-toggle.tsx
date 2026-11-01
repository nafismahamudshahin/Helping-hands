"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "size-10 shrink-0 rounded-full border-border bg-background shadow-sm transition-colors hover:bg-muted dark:bg-input/30",
        className
      )}
    >
      {/* Both icons are always rendered so server and client markup match;
          CSS picks which one to show based on the active theme. */}
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </Button>
  )
}

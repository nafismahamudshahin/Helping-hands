"use client"

import { useCallback, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type ContinueWithGoogleProps = {
  callbackURL?: string
  errorCallbackURL?: string
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === "string" && error) return error
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message
  ) {
    return (error as { message: string }).message
  }
  return "Something went wrong. Please try again."
}

export function ContinueWithGoogle({
  callbackURL = "/?login=success",
  errorCallbackURL,
}: ContinueWithGoogleProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleContinueWithGoogle = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      // Better Auth returns `{ data, error }` instead of throwing on API errors
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL,
      })

      if (error) {
        toast.error("Google sign-in failed", {
          description: getErrorMessage(error),
        })
        setIsLoading(false)
      }

    } catch (error) {
      // Network errors or unexpected exceptions
      toast.error("Unable to continue with Google", {
        description: getErrorMessage(error),
      })
      setIsLoading(false)
    }
  }, [isLoading, callbackURL, errorCallbackURL])

  return (
    <div className="mt-6 space-y-5">
      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[#e3ece6] dark:bg-white/10" />
        <span className="text-xs font-medium text-[#8a9b92] dark:text-[#91a99d]">
          or continue with
        </span>
        <span className="h-px flex-1 bg-[#e3ece6] dark:bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        aria-busy={isLoading}
        onClick={handleContinueWithGoogle}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#dbe6df] bg-white text-sm font-semibold text-[#253a30] transition-colors hover:bg-[#f7faf8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4d] disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:bg-white/4 dark:text-[#edf5ef] dark:hover:bg-white/8"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
            Redirecting to Google...
          </>
        ) : (
          <>
            <GoogleMark />
            Continue with Google
          </>
        )}
      </Button>
    </div>
  )
}

// Lucide has no brand icons, so the official multi-color Google logo stays as SVG.
function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-4.5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.67 5.95c4.48-4.14 7.11-10.24 7.11-17.6Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.85l-7.67-5.95c-2.13 1.43-4.86 2.3-8.24 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  )
}
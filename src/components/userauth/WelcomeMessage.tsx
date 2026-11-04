"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

export function WelcomeToast() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, isPending } = authClient.useSession()
    const hasShown = useRef(false)

    const isLoginRedirect = searchParams.get("login") === "success"

    useEffect(() => {
        if (!isLoginRedirect || isPending || hasShown.current) return
        hasShown.current = true

        if (session?.user) {
            const firstName = session.user.name?.split(" ")[0]
            toast.success(firstName ? `Welcome, ${firstName}!` : "Welcome back!", {
                description: "You have signed in successfully.",
            })
        }

        // Remove ?login=success so the toast doesn't repeat on refresh
        const params = new URLSearchParams(searchParams.toString())
        params.delete("login")
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [isLoginRedirect, isPending, session, searchParams, router, pathname])

    return null
}
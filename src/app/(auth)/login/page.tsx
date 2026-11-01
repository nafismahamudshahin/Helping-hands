
import { LoginForm } from "@/components/userauth/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log in | HelpingHands",
  description: "Log in to your HelpingHands account.",
}

export default function LoginPage() {
  return <LoginForm />
}

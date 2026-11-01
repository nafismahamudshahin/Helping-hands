import { SignupForm } from "@/components/userauth/SignupForm"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Create your account | HelpingHands",
  description: "Join the HelpingHands community and make a difference.",
}

export default function SignupPage() {
  return <SignupForm />
}

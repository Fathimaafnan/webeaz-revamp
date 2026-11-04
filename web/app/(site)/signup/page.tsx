import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your WebEaz account.",
  alternates: { canonical: "/signup" },
};

export default function SignUpPage() {
  return <SignUpForm />;
}
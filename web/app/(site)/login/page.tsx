import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your WebEaz account.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <LoginForm />;
}
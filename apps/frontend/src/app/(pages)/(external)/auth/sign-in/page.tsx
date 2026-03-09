"use client";
import { SignInPage as AuthSignInPage } from "@pharmacore/auth-web";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@pharmacore/auth-web";

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);
  return <AuthSignInPage />;
}

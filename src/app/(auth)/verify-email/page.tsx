"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";
import Link from "next/link";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setMessage("No verification token found.");
      return;
    }

    const verify = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/users/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setMessage("Email verified successfully! You can now sign in.");
        } else {
          const error = await res.json();
          setMessage(error.message || "Failed to verify email.");
        }
      } catch {
        setMessage("An error occurred during verification.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <p className="mb-4">{message}</p>
      <Link href="/signin">
        <Button>Go to Sign In</Button>
      </Link>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;

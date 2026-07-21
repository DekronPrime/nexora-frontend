"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    // Note: This endpoint would need to be implemented in the backend
    // For now, we'll simulate it
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setResent(true);
    setIsResending(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20"
        >
          <Mail className="h-8 w-8 text-white" />
        </motion.div>

        <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="text-slate-600 mt-2 max-w-sm mx-auto">
          We've sent a verification link to{" "}
          <span className="font-medium text-slate-900">{email}</span>
        </p>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-slate-500">
            Didn't receive the email? Check your spam folder or
          </p>

          {resent ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Email resent!</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <Link href="/login">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already verified?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

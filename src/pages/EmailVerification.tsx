import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useEmailVerification } from "@/hooks/useAuth";
import { Truck, Mail, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const verifyEmail = useEmailVerification();

  const handleVerification = async () => {
    if (token) {
      try {
        await verifyEmail.mutateAsync({ token });
        setIsVerified(true);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">RouteIQ</span>
          </Link>
        </div>

        <AnimatedCard className="p-8 text-center">
          {isVerified ? (
            <>
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Email Verified!
                </h1>
                <p className="text-muted-foreground">
                  Your email has been successfully verified. You can now access all features of RouteIQ.
                </p>
              </div>

              <div className="space-y-4">
                <Link to="/dashboard">
                  <AnimatedButton className="w-full">
                    Go to Dashboard
                  </AnimatedButton>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </>
          ) : token ? (
            <>
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <Mail className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground">
                  Click the button below to verify your email address and activate your account.
                </p>
              </div>

              <div className="space-y-4">
                <AnimatedButton 
                  className="w-full"
                  onClick={handleVerification}
                  disabled={verifyEmail.isPending}
                >
                  {verifyEmail.isPending ? "Verifying..." : "Verify Email"}
                </AnimatedButton>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <Mail className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground">
                  We've sent a verification link to{" "}
                  <span className="font-medium text-foreground">{email || "your email address"}</span>.
                  Please check your inbox and click the link to verify your account.
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? "Resending..." : "Resend Verification Email"}
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </>
          )}
        </AnimatedCard>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
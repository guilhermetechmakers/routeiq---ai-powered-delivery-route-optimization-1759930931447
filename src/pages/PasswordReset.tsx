import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { usePasswordReset } from "@/hooks/useAuth";
import { Truck, ArrowLeft, CheckCircle } from "lucide-react";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function PasswordReset() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const passwordReset = usePasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      await passwordReset.mutateAsync(data);
      setIsEmailSent(true);
    } catch (error) {
      // Error is handled by the mutation
    }
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

        <AnimatedCard className="p-8">
          {isEmailSent ? (
            <>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Email Sent!
                </h1>
                <p className="text-muted-foreground">
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>

              <div className="space-y-4">
                <Link to="/login">
                  <AnimatedButton className="w-full">
                    Back to Sign In
                  </AnimatedButton>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsEmailSent(false)}
                >
                  Try Different Email
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Reset Password
                </h1>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <AnimatedButton
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </AnimatedButton>
              </form>

              <div className="mt-6 text-center">
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
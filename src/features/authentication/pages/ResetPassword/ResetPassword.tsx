import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { request } from "../../../../utils/api";
import { Box } from "../../components/Box/Box";
import classes from "./ResetPassword.module.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ResetPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  usePageTitle("Reset Password - Opportune");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendPasswordResetToken = async (email: string) => {
    await request<void>({
      endpoint: `/api/v1/authentication/send-password-reset-token?email=${email}`,
      method: "PUT",
      onSuccess: () => {
        setErrorMessage("");
        setEmailSent(true);
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
    });
    setIsLoading(false);
  };

  const resetPassword = async (email: string, code: string, password: string) => {
    await request<void>({
      endpoint: `/api/v1/authentication/reset-password?email=${email}&token=${code}&newPassword=${password}`,
      method: "PUT",
      onSuccess: () => {
        setErrorMessage("");
        navigate("/authentication/login");
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
    });
    setIsLoading(false);
  };

  return (
    <div className={classes.root}>
      <Box>
        <div className={classes.header}>
          <div className={classes.iconContainer}>
            {!emailSent ? (
              <svg className={classes.headerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            ) : (
              <svg className={classes.headerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <h1 className={classes.title}>
            {!emailSent ? "Reset Your Password" : "Check Your Email"}
          </h1>
          <p className={classes.subtitle}>
            {!emailSent 
              ? "Don't worry, we'll help you get back into your Opportune account."
              : "We've sent you a verification code to reset your password."
            }
          </p>
        </div>

        {!emailSent ? (
          <form
            className={classes.form}
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const email = e.currentTarget.email.value;
              await sendPasswordResetToken(email);
              setEmail(email);
              setIsLoading(false);
            }}
          >
            <div className={classes.instructionBox}>
              <svg className={classes.infoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={classes.instructionText}>
                Enter your email address and we'll send you a verification code if it matches an existing Opportune account.
              </p>
            </div>

            <div className={classes.inputGroup}>
              <Input 
                key="email" 
                name="email" 
                type="email" 
                label="Email Address" 
                placeholder="Enter your email address"
                onFocus={() => setErrorMessage("")}
                required
              />
            </div>

            {errorMessage && (
              <div className={classes.errorContainer}>
                <p className={classes.error}>
                  <svg className={classes.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {errorMessage}
                </p>
              </div>
            )}

            <div className={classes.buttons}>
              <Button type="submit" disabled={isLoading} className={classes.primaryButton}>
                {isLoading ? (
                  <span className={classes.loadingText}>
                    <svg className={classes.spinner} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Reset Code
                    <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </Button>
              
              <Button
                outline
                onClick={() => navigate("/authentication/login")}
                disabled={isLoading}
                className={classes.secondaryButton}
              >
                <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Sign In
              </Button>
            </div>
          </form>
        ) : (
          <form
            className={classes.form}
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const code = e.currentTarget.code.value;
              const password = e.currentTarget.password.value;
              await resetPassword(email, code, password);
              setIsLoading(false);
            }}
          >
            <div className={classes.instructionBox}>
              <svg className={classes.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={classes.instructionText}>
                We've sent a verification code to <strong>{email}</strong>. Enter the code below along with your new password.
              </p>
            </div>

            <div className={classes.inputGroup}>
              <Input 
                type="text" 
                label="Verification Code" 
                key="code" 
                name="code" 
                placeholder="Enter 6-digit code"
                onFocus={() => setErrorMessage("")}
                required
              />
              <Input
                label="New Password"
                name="password"
                key="password"
                type="password"
                id="password"
                placeholder="Enter your new password"
                onFocus={() => setErrorMessage("")}
                required
              />
            </div>

            {errorMessage && (
              <div className={classes.errorContainer}>
                <p className={classes.error}>
                  <svg className={classes.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {errorMessage}
                </p>
              </div>
            )}

            <div className={classes.buttons}>
              <Button type="submit" disabled={isLoading} className={classes.primaryButton}>
                {isLoading ? (
                  <span className={classes.loadingText}>
                    <svg className={classes.spinner} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  <>
                    Reset Password
                    <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </Button>

              <Button
                outline
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setErrorMessage("");
                }}
                disabled={isLoading}
                className={classes.secondaryButton}
              >
                <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Try Different Email
              </Button>
            </div>

            <div className={classes.helpText}>
              <p className={classes.helpMessage}>
                Didn't receive the code? Check your spam folder or{" "}
                <button 
                  type="button" 
                  className={classes.resendLink}
                  onClick={() => sendPasswordResetToken(email)}
                  disabled={isLoading}
                >
                  resend the code
                </button>
              </p>
            </div>
          </form>
        )}
      </Box>
    </div>
  );
}

import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { Box } from "../../components/Box/Box";
import classes from "./VerifyEmail.module.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";

export function VerifyEmail() {
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser } = useAuthentication();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  usePageTitle("Verify Email - Opportune");
  const navigate = useNavigate();

  const validateEmail = async (code: string) => {
    setMessage("");
    await request<void>({
      endpoint: `/api/v1/authentication/validate-email-verification-token?token=${code}`,
      method: "PUT",
      onSuccess: () => {
        setErrorMessage("");
        setUser({ ...user!, emailVerified: true });
        navigate("/");
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
    });
    setIsLoading(false);
  };

  const sendEmailVerificationToken = async () => {
    setErrorMessage("");
    setIsResending(true);

    await request<void>({
      endpoint: `/api/v1/authentication/send-email-verification-token`,
      onSuccess: () => {
        setErrorMessage("");
        setMessage("Code sent successfully. Please check your email.");
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
    });
    setIsResending(false);
  };

  return (
    <div className={classes.root}>
      <Box>
        <div className={classes.header}>
          <div className={classes.iconContainer}>
            <svg className={classes.headerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className={classes.title}>Verify Your Email</h1>
          <p className={classes.subtitle}>
            You're almost done! Just one more step to complete your Opportune registration.
          </p>
        </div>

        <div className={classes.instructionBox}>
          <svg className={classes.infoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className={classes.instructionContent}>
            <p className={classes.instructionText}>
              We've sent a verification code to <strong>{user?.email}</strong>
            </p>
            <p className={classes.instructionSubtext}>
              Enter the code below to verify your email address and activate your account.
            </p>
          </div>
        </div>

        <form
          className={classes.form}
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const code = e.currentTarget.code.value;
            await validateEmail(code);
            setIsLoading(false);
          }}
        >
          <div className={classes.inputGroup}>
            <Input 
              type="text" 
              label="Verification Code" 
              key="code" 
              name="code" 
              placeholder="Enter 6-digit code"
              onFocus={() => {
                setErrorMessage("");
                setMessage("");
              }}
              required
            />
          </div>

          {message && (
            <div className={classes.successContainer}>
              <p className={classes.success}>
                <svg className={classes.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </p>
            </div>
          )}

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
            <Button type="submit" disabled={isLoading || isResending} className={classes.primaryButton}>
              {isLoading ? (
                <span className={classes.loadingText}>
                  <svg className={classes.spinner} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <>
                  Verify Email
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
                sendEmailVerificationToken();
              }}
              disabled={isLoading || isResending}
              className={classes.secondaryButton}
            >
              {isResending ? (
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
                  <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Code
                </>
              )}
            </Button>
          </div>
        </form>

        <div className={classes.helpSection}>
          <div className={classes.helpBox}>
            <svg className={classes.helpIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className={classes.helpContent}>
              <p className={classes.helpTitle}>Need help?</p>
              <p className={classes.helpText}>
                • Check your spam or junk folder<br/>
                • Make sure you entered the correct email<br/>
                • The code expires in 15 minutes
              </p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

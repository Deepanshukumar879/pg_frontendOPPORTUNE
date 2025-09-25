import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button.tsx";
import { Input } from "../../../../components/Input/Input.tsx";
import { Loader } from "../../../../components/Loader/Loader.tsx";
import { usePageTitle } from "../../../../hooks/usePageTitle.tsx";
import { Box } from "../../components/Box/Box";
import { Seperator } from "../../components/Seperator/Seperator";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider.tsx";
import { useOauth } from "../../hooks/useOauth.ts";
import classes from "./Signup.module.scss";

export function Signup() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthentication();
  const navigate = useNavigate();
  usePageTitle("Join Opportune");
  const { isOauthInProgress, oauthError, startOauth } = useOauth("signup");

  const doSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try {
      await signup(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isOauthInProgress) {
    return (
      <div className={classes.loaderContainer}>
        <Loader isInline />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Box>
        <div className={classes.header}>
          <div className={classes.iconContainer}>
            <svg className={classes.headerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className={classes.title}>Join Opportune Today</h1>
          <p className={classes.subtitle}>
            Create your account and unlock new professional opportunities.
          </p>
        </div>

        <form onSubmit={doSignup} className={classes.form}>
          <div className={classes.inputGroup}>
            <Input 
              type="email" 
              id="email" 
              label="Email Address" 
              placeholder="Enter your email address"
              onFocus={() => setErrorMessage("")}
              required
            />
          </div>

          <div className={classes.inputGroup}>
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Create a strong password"
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

          <div className={classes.disclaimer}>
            <svg className={classes.shieldIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className={classes.disclaimerText}>
              By clicking "Create Account" or "Continue with Google", you agree to Opportune's{" "}
              <a href="#" className={classes.disclaimerLink}>Terms of Service</a>,{" "}
              <a href="#" className={classes.disclaimerLink}>Privacy Policy</a>, and{" "}
              <a href="#" className={classes.disclaimerLink}>Cookie Policy</a>.
            </p>
          </div>

          <Button disabled={isLoading} type="submit" className={classes.submitButton}>
            {isLoading ? (
              <span className={classes.loadingText}>
                <svg className={classes.spinner} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Creating account...
              </span>
            ) : (
              <>
                Create Account
                <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </Button>
        </form>

        <Seperator>or</Seperator>

        <div className={classes.socialAuth}>
          {oauthError && (
            <div className={classes.errorContainer}>
              <p className={classes.error}>
                <svg className={classes.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {oauthError}
              </p>
            </div>
          )}
          
          <Button
            outline
            onClick={() => {
              startOauth();
            }}
            className={classes.googleButton}
          >
            <svg className={classes.googleIcon} viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className={classes.login}>
          <p className={classes.loginText}>
            Already have an Opportune account?{" "}
            <Link to="/authentication/login" className={classes.loginLink}>
              Sign in here
            </Link>
          </p>
        </div>
      </Box>
    </div>
  );
}

import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loader } from "../../../../components/Loader/Loader";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { Box } from "../../components/Box/Box";
import { Seperator } from "../../components/Seperator/Seperator";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { useOauth } from "../../hooks/useOauth";
import classes from "./Login.module.scss";

export function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOauthInProgress, oauthError, startOauth } = useOauth("login");
  
  // ✅ FIXED: Clean Opportune title without LinkedIn
  usePageTitle("Opportune - Login");

  const doLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    try {
      await login(email, password);
      const destination = location.state?.from || "/";
      navigate(destination);
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
          <h1 className={classes.title}>Welcome back</h1>
          <p className={classes.subtitle}>
            Sign in to your Opportune account to continue your professional journey.
          </p>
        </div>

        <form onSubmit={doLogin} className={classes.form}>
          <div className={classes.inputGroup}>
            <Input 
              label="Email" 
              type="email" 
              id="email" 
              onFocus={() => setErrorMessage("")}
              required
            />
          </div>
          <div className={classes.inputGroup}>
            <Input
              label="Password"
              type="password"
              id="password"
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

          <div className={classes.actions}>
            <Button type="submit" disabled={isLoading} className={classes.submitButton}>
              {isLoading ? (
                <span className={classes.loadingText}>
                  <svg className={classes.spinner} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>

            <Link to="/authentication/request-password-reset" className={classes.forgotLink}>
              Forgot your password?
            </Link>
          </div>
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

        <div className={classes.register}>
          <p className={classes.registerText}>
            New to Opportune?{" "}
            <Link to="/authentication/signup" className={classes.registerLink}>
              Create your account
            </Link>
          </p>
        </div>
      </Box>
    </div>
  );
}

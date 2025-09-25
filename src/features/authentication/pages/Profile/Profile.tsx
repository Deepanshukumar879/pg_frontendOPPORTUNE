import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { request } from "../../../../utils/api";
import { Box } from "../../components/Box/Box";
import { IUser, useAuthentication } from "../../contexts/AuthenticationContextProvider";
import classes from "./Profile.module.scss";

export function Profile() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { user, setUser } = useAuthentication();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: user?.company || "",
    position: user?.position || "",
    location: user?.location || "",
  });

  const steps = [
    {
      title: "Personal Information",
      description: "Let's start with your basic details",
      icon: "👤"
    },
    {
      title: "Professional Background",
      description: "Tell us about your career",
      icon: "💼"
    },
    {
      title: "Location",
      description: "Where are you based?",
      icon: "📍"
    }
  ];

  const onSubmit = async () => {
    if (!data.firstName || !data.lastName) {
      setError("Please fill in your first and last name.");
      return;
    }
    if (!data.company || !data.position) {
      setError("Please fill in your latest company and position.");
      return;
    }
    if (!data.location) {
      setError("Please fill in your location.");
      return;
    }

    setIsLoading(true);
    await request<IUser>({
      endpoint: `/api/v1/authentication/profile/${user?.id}/info?firstName=${data.firstName}&lastName=${data.lastName}&company=${data.company}&position=${data.position}&location=${data.location}`,
      method: "PUT",
      body: JSON.stringify(data),
      onSuccess: (data) => {
        setUser(data);
        navigate("/");
      },
      onFailure: (error) => {
        setError(error);
        setIsLoading(false);
      },
    });
  };

  return (
    <div className={classes.root}>
      <Box>
        <div className={classes.header}>
          <div className={classes.welcomeSection}>
            <h1 className={classes.title}>Welcome to Opportune! 🎉</h1>
            <p className={classes.subtitle}>
              Let's personalize your experience with just a few quick details.
            </p>
          </div>

          {/* Progress Bar */}
          <div className={classes.progressContainer}>
            <div className={classes.progressBar}>
              <div 
                className={classes.progressFill}
                style={{ width: `${((step + 1) / 3) * 100}%` }}
              ></div>
            </div>
            <div className={classes.progressText}>
              Step {step + 1} of 3
            </div>
          </div>

          {/* Current Step Info */}
          <div className={classes.stepHeader}>
            <div className={classes.stepIcon}>{steps[step].icon}</div>
            <div className={classes.stepInfo}>
              <h2 className={classes.stepTitle}>{steps[step].title}</h2>
              <p className={classes.stepDescription}>{steps[step].description}</p>
            </div>
          </div>
        </div>

        <div className={classes.formContainer}>
          {step === 0 && (
            <div className={classes.inputs}>
              <Input
                onFocus={() => setError("")}
                required
                label="First Name"
                name="firstName"
                placeholder="John"
                onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))}
                value={data.firstName}
              />
              <Input
                onFocus={() => setError("")}
                required
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))}
                value={data.lastName}
              />
            </div>
          )}

          {step === 1 && (
            <div className={classes.inputs}>
              <Input
                onFocus={() => setError("")}
                label="Latest Company"
                name="company"
                placeholder="e.g., Google, Microsoft, Startup Inc."
                onChange={(e) => setData((prev) => ({ ...prev, company: e.target.value }))}
                value={data.company}
              />
              <Input
                onFocus={() => setError("")}
                onChange={(e) => setData((prev) => ({ ...prev, position: e.target.value }))}
                value={data.position}
                label="Latest Position"
                name="position"
                placeholder="e.g., Software Engineer, Product Manager"
              />
            </div>
          )}

          {step === 2 && (
            <div className={classes.inputs}>
              <Input
                onFocus={() => setError("")}
                label="Location"
                name="location"
                placeholder="e.g., San Francisco, CA"
                value={data.location}
                onChange={(e) => setData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          )}

          {error && (
            <div className={classes.errorContainer}>
              <p className={classes.error}>
                <svg className={classes.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <div className={classes.buttons}>
            {step > 0 && (
              <Button 
                outline 
                onClick={() => setStep((prev) => prev - 1)}
                className={classes.backButton}
              >
                <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            )}

            {step < 2 && (
              <Button
                disabled={
                  (step === 0 && (!data.firstName || !data.lastName)) ||
                  (step === 1 && (!data.company || !data.position))
                }
                onClick={() => setStep((prev) => prev + 1)}
                className={classes.nextButton}
              >
                Continue
                <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}

            {step === 2 && (
              <Button 
                disabled={!data.location || isLoading} 
                onClick={onSubmit}
                className={classes.submitButton}
              >
                {isLoading ? (
                  <span className={classes.loadingText}>
                    <svg className={classes.spinner} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Setting up your profile...
                  </span>
                ) : (
                  <>
                    Complete Setup
                    <svg className={classes.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Box>
    </div>
  );
}

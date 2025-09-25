import { ButtonHTMLAttributes } from "react";
import classes from "./Button.module.scss";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  outline?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "accent" | "success" | "danger";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({ 
  outline, 
  children, 
  className, 
  size = "large", 
  variant = "primary",
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  ...others 
}: IButtonProps) {
  const buttonClasses = [
    classes.button,
    classes[size],
    classes[variant],
    outline ? classes.outline : "",
    loading ? classes.loading : "",
    disabled ? classes.disabled : "",
    icon ? classes.hasIcon : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      {...others}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading && <div className={classes.spinner} />}
      {!loading && icon && iconPosition === "left" && (
        <span className={classes.iconLeft}>{icon}</span>
      )}
      {!loading && children && <span className={classes.content}>{children}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className={classes.iconRight}>{icon}</span>
      )}
    </button>
  );
}

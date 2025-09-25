import { InputHTMLAttributes, useState, useRef } from "react";
import classes from "./Input.module.scss";

interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "filled" | "outlined";
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
}

export function Input({ 
  label, 
  size = "large", 
  variant = "default",
  error,
  helperText,
  leftIcon,
  rightIcon,
  loading = false,
  success = false,
  width, 
  className,
  onFocus,
  onBlur,
  disabled,
  ...others 
}: IInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!others.value || !!others.defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    others.onChange?.(e);
  };

  const inputClasses = [
    classes.root,
    classes[size],
    classes[variant],
    focused ? classes.focused : "",
    hasValue ? classes.hasValue : "",
    error ? classes.error : "",
    success ? classes.success : "",
    disabled ? classes.disabled : "",
    loading ? classes.loading : "",
    leftIcon ? classes.hasLeftIcon : "",
    rightIcon ? classes.hasRightIcon : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div 
      className={inputClasses}
      style={{ width: width ? `${width}px` : undefined }}
    >
      {label && (
        <label 
          className={classes.label} 
          htmlFor={others.id}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
          {others.required && <span className={classes.required}>*</span>}
        </label>
      )}
      
      <div className={classes.inputWrapper}>
        {leftIcon && (
          <div className={classes.leftIcon}>
            {leftIcon}
          </div>
        )}
        
        <input
          {...others}
          ref={inputRef}
          className={classes.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled || loading}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${others.id}-error` : helperText ? `${others.id}-helper` : undefined}
        />
        
        {loading && (
          <div className={classes.rightIcon}>
            <div className={classes.spinner} />
          </div>
        )}
        
        {!loading && success && (
          <div className={classes.rightIcon}>
            <svg 
              className={classes.successIcon} 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
        
        {!loading && !success && rightIcon && (
          <div className={classes.rightIcon}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div className={classes.errorMessage} id={`${others.id}-error`}>
          <svg 
            className={classes.errorIcon} 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </div>
      )}
      
      {!error && helperText && (
        <div className={classes.helperText} id={`${others.id}-helper`}>
          {helperText}
        </div>
      )}
    </div>
  );
}

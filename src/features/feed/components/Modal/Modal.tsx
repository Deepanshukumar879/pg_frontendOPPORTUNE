import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import classes from "./Modal.module.scss";

interface IPostingMadalProps {
  showModal: boolean;
  content?: string;
  picture?: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: FormData) => Promise<void>;
  title: string;
}

export function Madal({
  setShowModal,
  showModal,
  onSubmit,
  content,
  picture,
  title,
}: IPostingMadalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(picture);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [textLength, setTextLength] = useState(content?.length || 0);

  if (!showModal) return null;

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const content = e.currentTarget.content.value;
    const formData = new FormData();

    if (file) {
      formData.append("picture", file);
    }

    if (!content) {
      setError("Content is required");
      setIsLoading(false);
      return;
    }

    formData.append("content", content);

    try {
      await onSubmit(formData);
      setPreview(undefined);
      setShowModal(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.backdrop} onClick={() => setShowModal(false)}></div>
      
      <div className={classes.modal}>
        {/* Animated particles background */}
        <div className={classes.particlesContainer}>
          <div className={classes.particle}></div>
          <div className={classes.particle}></div>
          <div className={classes.particle}></div>
          <div className={classes.particle}></div>
          <div className={classes.particle}></div>
        </div>

        {/* Glass morphism overlay */}
        <div className={classes.glassOverlay}></div>

        {/* Header with premium styling */}
        <div className={classes.header}>
          <div className={classes.titleSection}>
            <div className={classes.titleIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className={classes.title}>
              {title}
              <div className={classes.titleUnderline}></div>
            </h3>
          </div>
          
          <button 
            className={classes.close} 
            onClick={() => setShowModal(false)}
            aria-label="Close modal"
          >
            <div className={classes.closeIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={classes.closeRipple}></div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.body}>
            {/* Enhanced textarea with character count */}
            <div className={classes.textareaContainer}>
              <textarea
                placeholder="What's on your mind? Share your thoughts..."
                onFocus={() => setError("")}
                onChange={(e) => {
                  setError("");
                  setTextLength(e.target.value.length);
                }}
                name="content"
                ref={textareaRef}
                defaultValue={content}
                className={classes.textarea}
                maxLength={2000}
              />
              <div className={classes.textareaFooter}>
                <div className={classes.characterCount}>
                  <span className={textLength > 1800 ? classes.warning : ''}>
                    {textLength}/2000
                  </span>
                </div>
                <div className={classes.progressBar}>
                  <div 
                    className={classes.progressFill}
                    style={{ width: `${(textLength / 2000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Enhanced image upload section */}
            {!preview ? (
              <div 
                className={`${classes.uploadSection} ${isDragging ? classes.dragging : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className={classes.uploadArea}>
                  <div className={classes.uploadIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={classes.uploadText}>
                    <p className={classes.uploadTitle}>Drop an image here</p>
                    <p className={classes.uploadSubtitle}>or click to browse</p>
                  </div>
                  <Input
                    onFocus={() => setError("")}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    placeholder="Image URL (optional)"
                    name="picture"
                    type="file"
                    className={classes.hiddenInput}
                    style={{ marginBlock: 0 }}
                  />
                </div>
                <div className={classes.uploadHint}>
                  <span>Supports: JPG, PNG, GIF, WebP (Max: 10MB)</span>
                </div>
              </div>
            ) : (
              <div className={classes.previewSection}>
                <div className={classes.previewContainer}>
                  <button
                    className={classes.removeImage}
                    type="button"
                    onClick={() => {
                      setPreview(undefined);
                      setFile(undefined);
                    }}
                    aria-label="Remove image"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className={classes.removeRipple}></div>
                  </button>
                  
                  <div className={classes.imageWrapper}>
                    <img src={preview} alt="Preview" className={classes.previewImage} />
                    <div className={classes.imageOverlay}>
                      <div className={classes.imageInfo}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Image attached</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced error display */}
          {error && (
            <div className={classes.errorContainer}>
              <div className={classes.errorIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className={classes.errorText}>{error}</span>
            </div>
          )}

          {/* Enhanced footer */}
          <div className={classes.footer}>
            <div className={classes.footerLeft}>
              <div className={classes.mediaOptions}>
                <button type="button" className={classes.mediaButton} title="Add emoji">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                
                <button type="button" className={classes.mediaButton} title="Add location">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={classes.footerRight}>
              <button
                type="button"
                className={classes.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              
              <div className={classes.submitButtonContainer}>
                <Button 
                  size="medium" 
                  type="submit" 
                  disabled={isLoading || textLength === 0}
                  className={classes.submitButton}
                >
                  {isLoading ? (
                    <>
                      <div className={classes.loadingSpinner}></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polygon points="22,2 15,22 11,13 2,9 22,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Post</span>
                    </>
                  )}
                </Button>
                <div className={classes.submitRipple}></div>
              </div>
            </div>
          </div>
        </form>

        {/* Loading overlay */}
        {isLoading && (
          <div className={classes.loadingOverlay}>
            <div className={classes.loadingContent}>
              <div className={classes.loadingSpinnerLarge}></div>
              <p>Publishing your post...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


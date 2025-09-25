import { ChangeEvent, RefObject } from "react";
import classes from "./ProfileAndCoverPictureUpdateModal.module.scss";

interface IProfilePictureModalProps {
  newPicturePreview: string | null;
  setNewPicturePreview: (value: string | null) => void;
  setNewPicture: (value: File | null) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  updatePicture: () => void;
  setEditingPicture: (value: boolean) => void;
  type: "profile" | "cover";
}

export function ProfileAndCoverPictureUpdateModal({
  newPicturePreview,
  setNewPicturePreview,
  setNewPicture,
  fileInputRef,
  handleFileChange,
  triggerFileInput,
  updatePicture,
  setEditingPicture,
  type,
}: IProfilePictureModalProps) {
  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContainer}>
        <div className={classes.modalContent}>
          <div className={classes.modalHeader}>
            <div className={classes.headerInfo}>
              <div className={classes.headerIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className={classes.headerText}>
                <h3 className={classes.modalTitle}>
                  {type === "profile" ? "Update profile picture" : "Update cover photo"}
                </h3>
                <p className={classes.modalSubtitle}>
                  {type === "profile" 
                    ? "Choose a photo that represents you well" 
                    : "Add a cover photo to personalize your profile"
                  }
                </p>
              </div>
            </div>
            <button 
              className={classes.closeButton}
              onClick={() => setEditingPicture(false)}
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className={classes.imagePreviewSection}>
            {type === "profile" ? (
              <div className={classes.profilePreview}>
                <div className={classes.profileImageWrapper}>
                  <img 
                    src={!newPicturePreview ? "/avatar.svg" : newPicturePreview} 
                    alt="Profile preview"
                    className={classes.profileImage}
                  />
                  <div className={classes.previewOverlay}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className={classes.coverPreview}>
                <img 
                  src={!newPicturePreview ? "/cover.jpeg" : newPicturePreview} 
                  alt="Cover preview"
                  className={classes.coverImage}
                />
                <div className={classes.coverOverlay}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />

          <div className={classes.actionButtons}>
            <button
              className={classes.deleteButton}
              onClick={() => {
                setNewPicturePreview(null);
                setNewPicture(null);
              }}
              aria-label="Remove photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Remove</span>
            </button>

            <button
              className={classes.uploadButton}
              onClick={triggerFileInput}
              aria-label="Upload new photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Upload photo</span>
            </button>

            <button
              className={classes.saveButton}
              onClick={updatePicture}
              aria-label="Save changes"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Save changes</span>
            </button>
          </div>

          <div className={classes.helpText}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              {type === "profile" 
                ? "For best results, use a square image that's at least 400×400 pixels"
                : "Recommended size: 1584×396 pixels. Use a high-quality image for best results"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

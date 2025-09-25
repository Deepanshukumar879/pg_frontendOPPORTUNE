import { useState } from "react";
import { Input } from "../../../../components/Input/Input";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import classes from "./About.module.scss";

interface AboutProps {
  user: IUser | null;
  authUser: IUser | null;
  onUpdate: (updatedUser: IUser) => void;
}

export function About({ user, authUser, onUpdate }: AboutProps) {
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutInput, setAboutInput] = useState(authUser?.about || "");

  async function updateAbout() {
    if (!user?.id) return;

    await request<IUser>({
      endpoint: `/api/v1/authentication/profile/${user.id}/info?about=${aboutInput}`,
      method: "PUT",
      onSuccess: (data) => {
        onUpdate(data);
        setEditingAbout(false);
      },
      onFailure: (error) => console.log(error),
    });
  }

  return (
    <div className={classes.aboutContainer}>
      <div className={classes.aboutCard}>
        <div className={classes.cardHeader}>
          <div className={classes.titleSection}>
            <div className={classes.titleIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8S17.1 10 16 10H14V12C14 13.1 13.1 14 12 14S10 13.1 10 12V10H8C6.9 10 6 9.1 6 8S6.9 6 8 6H10V4C10 2.9 10.9 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className={classes.sectionTitle}>About</h2>
          </div>

          {authUser?.id === user?.id && (
            <div className={classes.actionButtons}>
              {!editingAbout ? (
                <button 
                  className={classes.editButton}
                  onClick={() => setEditingAbout(!editingAbout)}
                  aria-label="Edit about section"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Edit</span>
                </button>
              ) : (
                <div className={classes.editActions}>
                  <button
                    className={classes.cancelButton}
                    onClick={() => {
                      setEditingAbout(false);
                      setAboutInput(user?.about || "");
                    }}
                    aria-label="Cancel editing"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Cancel</span>
                  </button>
                  <button 
                    className={classes.saveButton}
                    onClick={updateAbout}
                    aria-label="Save changes"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={classes.cardContent}>
          {!editingAbout ? (
            <div className={classes.aboutContent}>
              {user?.about ? (
                <div className={classes.aboutText}>
                  <p>{user.about}</p>
                </div>
              ) : (
                <div className={classes.emptyState}>
                  <div className={classes.emptyIcon}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={classes.emptyContent}>
                    <h3 className={classes.emptyTitle}>Share your story</h3>
                    <p className={classes.emptyDescription}>
                      Tell people about yourself, your experience, and what makes you unique.
                    </p>
                    {authUser?.id === user?.id && (
                      <button 
                        className={classes.addAboutButton}
                        onClick={() => setEditingAbout(true)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Add about section
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={classes.editingContent}>
              <div className={classes.inputWrapper}>
                <Input
                  value={aboutInput}
                  onChange={(e) => setAboutInput(e.target.value)}
                  placeholder="Share your professional story, experience, and what makes you unique..."
                />
              </div>
              <div className={classes.editingHints}>
                <div className={classes.hint}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Write 2-3 sentences about your professional background and interests</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

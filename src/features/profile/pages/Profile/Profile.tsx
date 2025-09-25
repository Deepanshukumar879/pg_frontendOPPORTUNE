import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../components/Loader/Loader";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { request } from "../../../../utils/api";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { RightSidebar } from "../../../feed/components/RightSidebar/RightSidebar";
import { About } from "../../components/About/About";
import { Activity } from "../../components/Activity/Activity";
import { Header } from "../../components/Header/Header";
import classes from "./Profile.module.scss";

export function Profile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { user: authUser, setUser: setAuthUser } = useAuthentication();
  const [user, setUser] = useState<IUser | null>(null);

  usePageTitle(user?.firstName + " " + user?.lastName);

  useEffect(() => {
    setLoading(true);
    if (id == authUser?.id) {
      setUser(authUser);
      setLoading(false);
    } else {
      request<IUser>({
        endpoint: `/api/v1/authentication/users/${id}`,
        onSuccess: (data) => {
          setUser(data);
          setLoading(false);
        },
        onFailure: (error) => console.log(error),
      });
    }
  }, [authUser, id]);

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <div className={classes.loadingContent}>
          <Loader />
          <span className={classes.loadingText}>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.profileContainer}>
      <div className={classes.mainContent}>
        <Header user={user} authUser={authUser} onUpdate={(user) => setAuthUser(user)} />
        <About user={user} authUser={authUser} onUpdate={(user) => setAuthUser(user)} />
        <Activity authUser={authUser} user={user} id={id} />

        <div className={classes.sectionsGrid}>
          <div className={classes.experienceSection}>
            <div className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <div className={classes.sectionTitleWrapper}>
                  <div className={classes.sectionIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h2 className={classes.sectionTitle}>Experience</h2>
                </div>
                {authUser?.id === user?.id && (
                  <button className={classes.addButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className={classes.comingSoonContent}>
                <div className={classes.comingSoonIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={classes.comingSoonTitle}>Coming Soon</h3>
                <p className={classes.comingSoonText}>
                  Professional experience showcase will be available soon.
                </p>
              </div>
            </div>
          </div>

          <div className={classes.educationSection}>
            <div className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <div className={classes.sectionTitleWrapper}>
                  <div className={classes.sectionIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className={classes.sectionTitle}>Education</h2>
                </div>
                {authUser?.id === user?.id && (
                  <button className={classes.addButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className={classes.comingSoonContent}>
                <div className={classes.comingSoonIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={classes.comingSoonTitle}>Coming Soon</h3>
                <p className={classes.comingSoonText}>
                  Educational background details will be available soon.
                </p>
              </div>
            </div>
          </div>

          <div className={classes.skillsSection}>
            <div className={classes.sectionCard}>
              <div className={classes.sectionHeader}>
                <div className={classes.sectionTitleWrapper}>
                  <div className={classes.sectionIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className={classes.sectionTitle}>Skills & Expertise</h2>
                </div>
                {authUser?.id === user?.id && (
                  <button className={classes.addButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className={classes.comingSoonContent}>
                <div className={classes.comingSoonIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={classes.comingSoonTitle}>Coming Soon</h3>
                <p className={classes.comingSoonText}>
                  Skills showcase and endorsements will be available soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.rightSidebar}>
        <RightSidebar />
      </div>
    </div>
  );
}

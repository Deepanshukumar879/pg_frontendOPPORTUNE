import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import { ProfileAndCoverPictureUpdateModal } from "../ProfileAndCoverPictureUpdateModal/ProfileAndCoverPictureUpdateModal";
import classes from "./Header.module.scss";

interface ITopProps {
  user: IUser | null;
  authUser: IUser | null;
  onUpdate: (user: IUser) => void;
}

export function Header({ user, authUser, onUpdate }: ITopProps) {
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [editingCoverPicture, setEditingCoverPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState({
    firstName: authUser?.firstName,
    lastName: authUser?.lastName,
    position: authUser?.position,
    company: authUser?.company,
    location: authUser?.location,
  });
  const [connexions, setConnections] = useState<IConnection[]>([]);
  const [invitations, setInvitations] = useState<IConnection[]>([]);
  const connection =
    connexions.find((c) => c.recipient.id === user?.id || c.author.id === user?.id) ||
    invitations.find((c) => c.recipient.id === user?.id || c.author.id === user?.id);

  const [newProfilePicture, setNewProfilePicture] = useState<File | undefined | null>();
  const [newProfilePicturePreview, setNewProfilePicturePreview] = useState<string | null>(
    user?.profilePicture
      ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
      : "/avatar.svg"
  );
  const [newCoverPicture, setNewCoverPicture] = useState<File | undefined | null>();
  const [newCoverPicturePreview, setNewCoverPicturePreview] = useState<string | null>(
    user?.coverPicture
      ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.coverPicture}`
      : "/cover.jpeg"
  );

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections",
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?status=PENDING",
      onSuccess: (data) => setInvitations(data),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  async function updateInfo() {
    await request<IUser>({
      endpoint: `/api/v1/authentication/profile/${user?.id}/info?firstName=${info.firstName}&lastName=${info.lastName}&position=${info.position}&company=${info.company}&location=${info.location}`,
      contentType: "multipart/form-data",
      method: "PUT",
      onSuccess: (data) => {
        onUpdate(data);
        setEditingInfo(false);
      },
      onFailure: (error) => console.log(error),
    });
    setEditingInfo(false);
  }

  async function updateProfilePicture() {
    const formData = new FormData();
    formData.append(
      "profilePicture",
      newProfilePicture === null
        ? ""
        : newProfilePicture
        ? newProfilePicture
        : user?.profilePicture || ""
    );

    await request<IUser>({
      endpoint: `/api/v1/authentication/profile/${user?.id}/profile-picture`,
      method: "PUT",
      contentType: "multipart/form-data",
      body: formData,
      onSuccess: (data) => {
        onUpdate(data);
        setEditingProfilePicture(false);
      },
      onFailure: (error) => console.log(error),
    });
  }

  async function updateCoverPicture() {
    const formData = new FormData();
    formData.append(
      "coverPicture",
      newCoverPicture === null ? "" : newCoverPicture ? newCoverPicture : user?.coverPicture || ""
    );

    await request<IUser>({
      endpoint: `/api/v1/authentication/profile/${user?.id}/cover-picture`,
      method: "PUT",
      contentType: "multipart/form-data",
      body: formData,
      onSuccess: (data) => {
        onUpdate(data);
        setEditingCoverPicture(false);
      },
      onFailure: (error) => console.log(error),
    });
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "profile") {
        setNewProfilePicture(file);
      } else {
        setNewCoverPicture(file);
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "profile") {
          setNewProfilePicturePreview(reader.result as string);
        } else {
          setNewCoverPicturePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.profileCard}>
        <div className={classes.coverSection}>
          <div className={classes.coverWrapper}>
            <img
              className={classes.coverImage}
              src={
                user?.coverPicture
                  ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.coverPicture}`
                  : "/cover.jpeg"
              }
              alt="Cover"
            />
            <div className={classes.coverOverlay}></div>
            
            {user?.id === authUser?.id && (
              <button 
                className={classes.coverEditButton} 
                onClick={() => setEditingCoverPicture(true)}
                aria-label="Edit cover photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Edit cover</span>
              </button>
            )}
          </div>

          <div className={classes.profileImageSection}>
            {user?.id === authUser?.id ? (
              <button 
                className={classes.profileImageButton} 
                onClick={() => setEditingProfilePicture(true)}
                aria-label="Edit profile picture"
              >
                <img
                  className={classes.profileImage}
                  src={
                    user?.profilePicture
                      ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
                      : "/avatar.svg"
                  }
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
                <div className={classes.profileImageOverlay}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </button>
            ) : (
              <div className={classes.profileImageContainer}>
                <img
                  className={classes.profileImage}
                  src={
                    user?.profilePicture
                      ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
                      : "/avatar.svg"
                  }
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
              </div>
            )}
          </div>
        </div>

        <div className={classes.profileContent}>
          <div className={classes.profileInfo}>
            {!editingInfo ? (
              <div className={classes.infoDisplay}>
                <div className={classes.nameSection}>
                  <h1 className={classes.profileName}>
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {user?.id === authUser?.id && (
                    <button 
                      className={classes.editInfoButton}
                      onClick={() => setEditingInfo(true)}
                      aria-label="Edit profile information"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className={classes.profileDetails}>
                  <div className={classes.jobTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{user?.position} at {user?.company}</span>
                  </div>
                  
                  {user?.location && (
                    <div className={classes.location}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{user?.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={classes.editingForm}>
                <div className={classes.editHeader}>
                  <h3 className={classes.editTitle}>Edit profile information</h3>
                  <div className={classes.editActions}>
                    <button
                      className={classes.cancelButton}
                      onClick={() => {
                        setEditingInfo(false);
                        setInfo({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                          company: user?.company || "",
                          position: user?.position || "",
                          location: user?.location || "",
                        });
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
                      onClick={updateInfo}
                      aria-label="Save changes"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                
                <div className={classes.formGrid}>
                  <div className={classes.nameInputs}>
                    <Input
                      value={info?.firstName}
                      onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
                      placeholder="First name"
                    />
                    <Input
                      value={info?.lastName}
                      onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                  <div className={classes.workInputs}>
                    <Input
                      value={info?.position}
                      onChange={(e) => setInfo({ ...info, position: e.target.value })}
                      placeholder="Job title"
                    />
                    <Input
                      value={info?.company}
                      onChange={(e) => setInfo({ ...info, company: e.target.value })}
                      placeholder="Company"
                    />
                  </div>
                  <Input
                    value={info?.location}
                    onChange={(e) => setInfo({ ...info, location: e.target.value })}
                    placeholder="Location"
                  />
                </div>
              </div>
            )}
          </div>

          {user?.id !== authUser?.id && (
            <div className={classes.connectionActions}>
              {!connection ? (
                <Button
                  size="medium"
                  className={classes.connectButton}
                  onClick={() => {
                    request<IConnection>({
                      endpoint: "/api/v1/networking/connections?recipientId=" + user?.id,
                      method: "POST",
                      onSuccess: (data) => {
                        setInvitations([...invitations, data]);
                      },
                      onFailure: (error) => console.log(error),
                    });
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Connect
                </Button>
              ) : (
                <Button
                  size="medium"
                  outline
                  className={classes.disconnectButton}
                  onClick={() => {
                    request<IConnection>({
                      endpoint: `/api/v1/networking/connections/${connection?.id}`,
                      method: "DELETE",
                      onSuccess: () => {
                        setConnections((connections) =>
                          connections.filter((c) => c.id !== connection?.id)
                        );
                        setInvitations((invitations) =>
                          invitations.filter((c) => c.id !== connection?.id)
                        );
                      },
                      onFailure: (error) => console.log(error),
                    });
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16 4h4v4M20 4l-8 8M8 12H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4m8 8v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {connection?.status === "ACCEPTED"
                    ? "Connected"
                    : authUser?.id === connection?.author.id
                    ? "Pending"
                    : "Respond"}
                </Button>
              )}
              
              <Button
                size="medium"
                outline
                className={classes.messageButton}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Message
              </Button>
            </div>
          )}
        </div>
      </div>

      {editingCoverPicture && (
        <ProfileAndCoverPictureUpdateModal
          newPicturePreview={newCoverPicturePreview}
          setNewPicturePreview={setNewCoverPicturePreview}
          setNewPicture={setNewCoverPicture}
          fileInputRef={fileInputRef}
          handleFileChange={(e) => handleFileChange(e, "cover")}
          triggerFileInput={triggerFileInput}
          updatePicture={updateCoverPicture}
          setEditingPicture={setEditingCoverPicture}
          type="cover"
        />
      )}

      {editingProfilePicture && (
        <ProfileAndCoverPictureUpdateModal
          newPicturePreview={newProfilePicturePreview}
          setNewPicturePreview={setNewProfilePicturePreview}
          setNewPicture={setNewProfilePicture}
          fileInputRef={fileInputRef}
          handleFileChange={(e) => handleFileChange(e, "profile")}
          triggerFileInput={triggerFileInput}
          updatePicture={updateProfilePicture}
          setEditingPicture={setEditingProfilePicture}
          type="profile"
        />
      )}
    </div>
  );
}

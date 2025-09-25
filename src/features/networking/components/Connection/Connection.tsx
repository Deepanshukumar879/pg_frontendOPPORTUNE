import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "../../../../components/Button/Button";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";

import { useNavigate } from "react-router-dom";
import classes from "./Connection.module.scss";

export enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export interface IConnection {
  id: number;
  author: IUser;
  recipient: IUser;
  status: Status;
  connectionDate: string;
  seen: boolean;
}

interface IConnectionProps {
  connection: IConnection;
  user: IUser | null;
  setConnections: Dispatch<SetStateAction<IConnection[]>>;
}

export function Connection({ connection, user, setConnections }: IConnectionProps) {
  const navigate = useNavigate();
  const userToDisplay =
    connection.author.id === user?.id ? connection.recipient : connection.author;

  useEffect(() => {
    if (connection.recipient.id === user?.id) {
      request<void>({
        endpoint: `/api/v1/networking/connections/${connection.id}/seen`,
        method: "PUT",
        onSuccess: () => {},
        onFailure: (error) => console.log(error),
      });
    }
  }, [connection.id, connection.recipient.id, setConnections, user?.id]);

  return (
    <div key={connection.id} className={`${classes.connection} ${connection.status === Status.ACCEPTED ? classes.accepted : classes.pending} ${!connection.seen && connection.recipient.id === user?.id ? classes.unread : ''}`}>
      <div className={classes.profileSection}>
        <button 
          className={classes.profileButton}
          onClick={() => navigate("/profile/" + userToDisplay.id)}
        >
          <div className={classes.avatarWrapper}>
            <img
              className={classes.avatar}
              src={userToDisplay.profilePicture || "/avatar.svg"}
              alt={`${userToDisplay?.firstName} ${userToDisplay?.lastName}`}
            />
            <div className={classes.statusIndicator}></div>
          </div>
        </button>
        
        <button 
          className={classes.userInfoButton}
          onClick={() => navigate("/profile/" + userToDisplay.id)}
        >
          <div className={classes.userInfo}>
            <h3 className={classes.userName}>
              {userToDisplay?.firstName} {userToDisplay?.lastName}
            </h3>
            <p className={classes.userTitle}>
              {userToDisplay?.position} at {userToDisplay?.company}
            </p>
          </div>
        </button>
      </div>

      <div className={classes.actions}>
        {connection.status === Status.ACCEPTED ? (
          <Button
            size="small"
            outline
            className={`${classes.actionButton} ${classes.removeButton}`}
            onClick={() => {
              request<IConnection>({
                endpoint: `/api/v1/networking/connections/${connection.id}`,
                method: "DELETE",
                onSuccess: () => {
                  setConnections((connections) =>
                    connections.filter((c) => c.id !== connection.id)
                  );
                },
                onFailure: (error) => console.log(error),
              });
            }}
          >
            <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h4v4M20 4l-8 8M8 12H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4m8 8v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/>
            </svg>
            <span>Remove</span>
          </Button>
        ) : (
          <div className={classes.pendingActions}>
            <Button
              size="small"
              outline
              className={`${classes.actionButton} ${classes.declineButton}`}
              onClick={() => {
                request<IConnection>({
                  endpoint: `/api/v1/networking/connections/${connection.id}`,
                  method: "DELETE",
                  onSuccess: () => {
                    setConnections((connections) =>
                      connections.filter((c) => c.id !== connection.id)
                    );
                  },
                  onFailure: (error) => console.log(error),
                });
              }}
            >
              <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              <span>{user?.id === connection.author.id ? "Cancel" : "Ignore"}</span>
            </Button>
            
            {user?.id === connection.recipient.id && (
              <Button
                size="small"
                className={`${classes.actionButton} ${classes.acceptButton}`}
                onClick={() => {
                  request<IConnection>({
                    endpoint: `/api/v1/networking/connections/${connection.id}`,
                    method: "PUT",
                    onSuccess: () => {
                      setConnections((connections) =>
                        connections.filter((c) => c.id !== connection.id)
                      );
                    },
                    onFailure: (error) => console.log(error),
                  });
                }}
              >
                <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Accept</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {!connection.seen && connection.recipient.id === user?.id && (
        <div className={classes.newBadge}>
          <span>New</span>
        </div>
      )}
    </div>
  );
}

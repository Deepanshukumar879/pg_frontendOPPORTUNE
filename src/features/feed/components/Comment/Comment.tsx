import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/Input/Input";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";

import { TimeAgo } from "../TimeAgo/TimeAgo";
import classes from "./Comment.module.scss";

export interface IComment {
  id: number;
  content: string;
  author: IUser;
  creationDate: string;
  updatedDate?: string;
}

interface ICommentProps {
  comment: IComment;
  deleteComment: (commentId: number) => Promise<void>;
  editComment: (commentId: number, content: string) => Promise<void>;
}

export function Comment({ comment, deleteComment, editComment }: ICommentProps) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [commentContent, setCommentContent] = useState(comment.content);
  const { user } = useAuthentication();

  return (
    <div className={classes.root}>
      {!editing ? (
        <>
          <div className={classes.header}>
            <button
              onClick={() => {
                navigate(`/profile/${comment.author.id}`);
              }}
              className={classes.author}
            >
              <div className={classes.avatarContainer}>
                <img
                  className={classes.avatar}
                  src={comment.author.profilePicture || "/avatar.svg"}
                  alt={`${comment.author.firstName} ${comment.author.lastName}`}
                />
              </div>
              <div className={classes.authorInfo}>
                <div className={classes.name}>
                  {comment.author.firstName + " " + comment.author.lastName}
                </div>
                <div className={classes.title}>
                  {comment.author.position} at {comment.author.company}
                </div>
                <TimeAgo date={comment.creationDate} edited={!!comment.updatedDate} />
              </div>
            </button>
            
            {comment.author.id == user?.id && (
              <div className={classes.actionContainer}>
                <button
                  className={`${classes.actionButton} ${showActions ? classes.active : ""}`}
                  onClick={() => setShowActions(!showActions)}
                  aria-label="Comment options"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                    <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                  </svg>
                </button>

                {showActions && (
                  <div className={classes.actionsDropdown}>
                    <button 
                      className={classes.actionItem}
                      onClick={() => {
                        setEditing(true);
                        setShowActions(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </button>
                    <button 
                      className={`${classes.actionItem} ${classes.deleteAction}`}
                      onClick={() => {
                        deleteComment(comment.id);
                        setShowActions(false);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={classes.content}>{comment.content}</div>
        </>
      ) : (
        <div className={classes.editForm}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await editComment(comment.id, commentContent);
              setEditing(false);
              setShowActions(false);
            }}
            className={classes.editFormContainer}
          >
            <div className={classes.inputContainer}>
              <Input
                type="text"
                value={commentContent}
                onChange={(e) => {
                  setCommentContent(e.target.value);
                }}
                placeholder="Edit your comment"
                className={classes.editInput}
              />
            </div>
            <div className={classes.editActions}>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setCommentContent(comment.content);
                }}
                className={classes.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={classes.saveButton}
                disabled={!commentContent.trim()}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Comment;

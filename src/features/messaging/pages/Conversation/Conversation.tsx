import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../../../components/Input/Input";
import { request } from "../../../../utils/api";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import { IConversation } from "../../components/Conversations/Conversations";
import { Messages } from "../../components/Messages/Messages";
import classes from "./Conversation.module.scss";

export function Conversation() {
  const [postingMessage, setPostingMessage] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [suggestingUsers, setSuggestingUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState<string>("");
  const [slectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const websocketClient = useWebSocket();
  const { id } = useParams();
  const navigate = useNavigate();
  const creatingNewConversation = id === "new";
  const { user } = useAuthentication();

  useEffect(() => {
    request<IConversation[]>({
      endpoint: "/api/v1/messaging/conversations",
      onSuccess: (data) => setConversations(data),
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    const subscription = websocketClient?.subscribe(
      `/topic/users/${user?.id}/conversations`,
      (message) => {
        const conversation = JSON.parse(message.body);
        console.log(conversation);
        setConversations((prevConversations) => {
          const index = prevConversations.findIndex((c) => c.id === conversation.id);
          if (index === -1) {
            return [conversation, ...prevConversations];
          }
          return prevConversations.map((c) => (c.id === conversation.id ? conversation : c));
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [user?.id, websocketClient]);

  useEffect(() => {
    if (id == "new") {
      setConversation(null);
      request<IConnection[]>({
        endpoint: "/api/v1/networking/connections",
        onSuccess: (data) =>
          setSuggestingUsers(data.map((c) => (c.author.id === user?.id ? c.recipient : c.author))),
        onFailure: (error) => console.log(error),
      });
    } else {
      request<IConversation>({
        endpoint: `/api/v1/messaging/conversations/${id}`,
        onSuccess: (data) => setConversation(data),
        onFailure: () => navigate("/messaging"),
      });
    }
  }, [id, navigate]);

  useEffect(() => {
    const subscription = websocketClient?.subscribe(
      `/topic/conversations/${conversation?.id}/messages`,
      (data) => {
        const message = JSON.parse(data.body);

        setConversation((prevConversation) => {
          if (!prevConversation) return null;
          const index = prevConversation.messages.findIndex((m) => m.id === message.id);
          if (index === -1) {
            return {
              ...prevConversation,
              messages: [...prevConversation.messages, message],
            };
          }
          return {
            ...prevConversation,
            messages: prevConversation?.messages.map((m) => (m.id === message.id ? message : m)),
          };
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [conversation?.id, websocketClient]);

  async function addMessageToConversation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPostingMessage(true);
    await request<void>({
      endpoint: `/api/v1/messaging/conversations/${conversation?.id}/messages`,
      method: "POST",
      body: JSON.stringify({
        receiverId:
          conversation?.recipient.id == user?.id
            ? conversation?.author.id
            : conversation?.recipient.id,
        content,
      }),
      onSuccess: () => {},
      onFailure: (error) => console.log(error),
    });
    setPostingMessage(false);
  }

  async function createConversationWithMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = {
      receiverId: slectedUser?.id,
      content,
    };

    await request<IConversation>({
      endpoint: "/api/v1/messaging/conversations",
      method: "POST",
      body: JSON.stringify(message),
      onSuccess: (conversation) => navigate(`/messaging/conversations/${conversation.id}`),
      onFailure: (error) => console.log(error),
    });
  }

  const conversationUserToDisplay =
    conversation?.recipient.id === user?.id ? conversation?.author : conversation?.recipient;

  return (
    <div className={`${classes.root} ${creatingNewConversation ? classes.new : ""}`}>
      {(conversation || creatingNewConversation) && (
        <>
          <div className={classes.header}>
            <button className={classes.backButton} onClick={() => navigate("/messaging")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to Conversations</span>
            </button>
          </div>

          {conversation && (
            <div className={classes.conversationHeader}>
              <button 
                className={classes.profileButton}
                onClick={() => navigate(`/profile/${conversationUserToDisplay?.id}`)}
              >
                <div className={classes.avatarWrapper}>
                  <img
                    className={classes.avatar}
                    src={conversationUserToDisplay?.profilePicture || "/avatar.svg"}
                    alt={`${conversationUserToDisplay?.firstName} ${conversationUserToDisplay?.lastName}`}
                  />
                  <div className={classes.onlineIndicator}></div>
                </div>
                <div className={classes.userInfo}>
                  <h2 className={classes.userName}>
                    {conversationUserToDisplay?.firstName} {conversationUserToDisplay?.lastName}
                  </h2>
                  <p className={classes.userTitle}>
                    {conversationUserToDisplay?.position} at {conversationUserToDisplay?.company}
                  </p>
                </div>
              </button>
            </div>
          )}

          {creatingNewConversation && (
            <div className={classes.newConversationSection}>
              <div className={classes.newConversationHeader}>
                <h2 className={classes.sectionTitle}>
                  Start a New Conversation
                </h2>
                <p className={classes.sectionSubtitle}>
                  {slectedUser ? "Selected recipient:" : "Choose someone from your connections"}
                </p>
              </div>

              {!slectedUser && (
                <div className={classes.searchContainer}>
                  <div className={classes.searchWrapper}>
                    <svg className={classes.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <Input
                      disabled={suggestingUsers.length === 0}
                      type="text"
                      name="recipient"
                      placeholder="Search your connections..."
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
                  </div>
                </div>
              )}

              {slectedUser && (
                <div className={classes.selectedUserCard}>
                  <div className={classes.selectedUserInfo}>
                    <img
                      className={classes.avatar}
                      src={slectedUser.profilePicture || "/avatar.svg"}
                      alt={`${slectedUser.firstName} ${slectedUser.lastName}`}
                    />
                    <div className={classes.userDetails}>
                      <h3 className={classes.selectedUserName}>
                        {slectedUser.firstName} {slectedUser.lastName}
                      </h3>
                      <p className={classes.selectedUserTitle}>
                        {slectedUser.position} at {slectedUser.company}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className={classes.removeButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              )}

              {!slectedUser && !conversation && (
                <div className={classes.suggestions}>
                  {suggestingUsers.length === 0 ? (
                    <div className={classes.emptyState}>
                      <div className={classes.emptyStateIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <h3 className={classes.emptyStateTitle}>No Connections Found</h3>
                      <p className={classes.emptyStateText}>
                        You need to have connections to start a conversation. Build your network first!
                      </p>
                    </div>
                  ) : (
                    <div className={classes.suggestionsList}>
                      {suggestingUsers
                        .filter(
                          (user) => user.firstName?.toLowerCase().includes(search.toLowerCase()) || 
                                   user.lastName?.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((user) => (
                          <button
                            key={user.id}
                            className={classes.suggestionCard}
                            onClick={() => {
                              const conversation = conversations.find(
                                (c) => c.recipient.id === user.id || c.author.id === user.id
                              );
                              if (conversation) {
                                navigate(`/messaging/conversations/${conversation.id}`);
                              } else {
                                setSelectedUser(user);
                              }
                            }}
                          >
                            <img
                              className={classes.suggestionAvatar}
                              src={user.profilePicture || "/avatar.svg"}
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                            <div className={classes.suggestionInfo}>
                              <h4 className={classes.suggestionName}>
                                {user.firstName} {user.lastName}
                              </h4>
                              <p className={classes.suggestionTitle}>
                                {user.position} at {user.company}
                              </p>
                            </div>
                            <div className={classes.suggestionArrow}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6"/>
                              </svg>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {conversation && (
            <div className={classes.messagesContainer}>
              <Messages messages={conversation.messages} user={user} />
            </div>
          )}

          <div className={classes.messageInputSection}>
            <form
              className={classes.messageForm}
              onSubmit={async (e) => {
                if (!content.trim()) return;
                if (conversation) {
                  await addMessageToConversation(e);
                } else {
                  await createConversationWithMessage(e);
                }
                setContent("");
                setSelectedUser(null);
              }}
            >
              <div className={classes.inputContainer}>
                <input
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  name="content"
                  className={classes.messageInput}
                  placeholder="Type your message..."
                  disabled={postingMessage}
                />
                <button
                  type="submit"
                  className={`${classes.sendButton} ${postingMessage ? classes.sending : ''}`}
                  disabled={
                    postingMessage || !content.trim() || (creatingNewConversation && !slectedUser)
                  }
                >
                  {postingMessage ? (
                    <div className={classes.loadingSpinner}>
                      <svg className={classes.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className={classes.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className={classes.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                    </div>
                  ) : (
                    <svg className={classes.sendIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { RightSidebar } from "../../../feed/components/RightSidebar/RightSidebar";
import { Conversations } from "../../components/Conversations/Conversations";
import classes from "./Messaging.module.scss";

export function Messaging() {
  usePageTitle("Messaging");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const creatingNewConversation = location.pathname.includes("new");
  const onConversation = location.pathname.includes("conversations");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.messaging}>
        <div
          className={classes.sidebar}
          style={{
            display: windowWidth >= 1024 || !creatingNewConversation ? "block" : "none",
          }}
        >
          <div className={classes.header}>
            <div className={classes.headerContent}>
              <div className={classes.titleSection}>
                <div className={classes.titleIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h1 className={classes.title}>Messages</h1>
              </div>
              <button
                onClick={() => {
                  navigate("conversations/new");
                }}
                className={classes.newButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                <span className={classes.newButtonText}>New</span>
              </button>
            </div>
          </div>
          
          <div className={classes.conversationsWrapper}>
            <Conversations
              style={{
                display: onConversation && windowWidth < 1024 ? "none" : "block",
              }}
            />
          </div>
        </div>

        <div className={classes.mainContent}>
          <Outlet />
        </div>
      </div>
      
      <div className={classes.rightSidebarWrapper}>
        <RightSidebar />
      </div>
    </div>
  );
}

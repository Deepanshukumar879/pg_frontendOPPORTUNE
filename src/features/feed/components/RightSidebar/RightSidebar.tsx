import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Loader } from "../../../../components/Loader/Loader";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import classes from "./RightSidebar.module.scss";

export function RightSidebar() {
  const [suggestions, setSuggestions] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingIds, setConnectingIds] = useState<Set<string | number>>(new Set());
  const navigate = useNavigate();
  const { id } = useParams();

  // Safe helper to get user ID
  const getUserId = (user: any) => {
    return user?.id || user?.userId || user?.ID || Math.random().toString();
  };

  // Safe helper to get user name
  const getUserName = (user: any) => {
    const firstName = user?.firstName || user?.first_name || "User";
    const lastName = user?.lastName || user?.last_name || "";
    return { firstName, lastName };
  };

  // Safe helper to get user details
  const getUserDetails = (user: any) => {
    return {
      position: user?.position || user?.title || "Professional",
      company: user?.company || user?.organization || "Company"
    };
  };

  // Safe helper to get profile picture
  const getProfilePicture = (user: any) => {
    return user?.profilePicture || user?.profile_picture || user?.avatar || null;
  };

  useEffect(() => {
    request<IUser[]>({
      endpoint: "/api/v1/networking/suggestions?limit=2",
      onSuccess: (data) => {
        console.log("Suggestions data:", data); // Debug log
        
        if (Array.isArray(data)) {
          const filteredData = data.filter((s) => {
            const suggestionId = getUserId(s);
            return suggestionId && suggestionId.toString() !== id?.toString();
          });
          setSuggestions(filteredData);
        } else {
          console.warn("Suggestions data is not an array:", data);
          setSuggestions([]);
        }
      },
      onFailure: (error) => {
        console.log("Error fetching suggestions:", error);
        setSuggestions([]);
      },
    }).then(() => setLoading(false));
  }, [id]);

  const handleConnect = async (suggestion: any) => {
    const suggestionId = getUserId(suggestion);
    
    if (!suggestionId || connectingIds.has(suggestionId)) return;
    
    setConnectingIds(prev => new Set([...prev, suggestionId]));
    
    try {
      await request<IConnection>({
        endpoint: "/api/v1/networking/connections?recipientId=" + suggestionId,
        method: "POST",
        onSuccess: () => {
          setSuggestions(prev => prev.filter((s) => getUserId(s) !== suggestionId));
        },
        onFailure: (error) => {
          console.log("Connection error:", error);
        },
      });
    } catch (error) {
      console.log("Connection request failed:", error);
    } finally {
      setConnectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestionId);
        return newSet;
      });
    }
  };

  return (
    <div className={classes.root}>
      {/* Animated background */}
      <div className={classes.backgroundEffects}>
        <div className={classes.gradientOrb}></div>
        <div className={classes.gradientOrb}></div>
        <div className={classes.floatingParticles}>
          <div className={classes.particle}></div>
          <div className={classes.particle}></div>
          <div className={classes.particle}></div>
        </div>
      </div>

      {/* Glass overlay */}
      <div className={classes.glassOverlay}></div>

      {/* Premium header */}
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <div className={classes.iconContainer}>
            <div className={classes.headerIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
                <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <div className={classes.titleSection}>
            <h3 className={classes.title}>Add to your connexions</h3>
            <div className={classes.titleGlow}></div>
          </div>
        </div>
        {suggestions.length > 0 && (
          <div className={classes.counter}>
            <span>{suggestions.length}</span>
            <div className={classes.counterRing}></div>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className={classes.content}>
        {suggestions.map((suggestion, index) => {
          const suggestionId = getUserId(suggestion);
          const { firstName, lastName } = getUserName(suggestion);
          const { position, company } = getUserDetails(suggestion);
          const profilePicture = getProfilePicture(suggestion);
          const isConnecting = connectingIds.has(suggestionId);
          
          return (
            <div 
              className={classes.suggestionCard} 
              key={suggestionId || index}
              style={{'--animation-delay': `${index * 0.15}s`} as React.CSSProperties}
            >
              {/* Card background effects */}
              <div className={classes.cardBackground}>
                <div className={classes.cardGradient}></div>
                <div className={classes.cardGlow}></div>
              </div>

              {/* Profile section */}
              <div className={classes.profileSection}>
                <button
                  className={classes.avatarButton}
                  onClick={() => navigate("/profile/" + suggestionId)}
                >
                  <div className={classes.avatarContainer}>
                    <div className={classes.avatarFrame}>
                      <img 
                        src={
                          profilePicture 
                            ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${profilePicture}` 
                            : "/avatar.svg"
                        } 
                        alt={`${firstName} ${lastName}`}
                        className={classes.avatarImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/avatar.svg";
                        }}
                      />
                      <div className={classes.avatarOverlay}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                    <div className={classes.onlineBadge}></div>
                  </div>
                </button>
              </div>

              {/* User info section */}
              <div className={classes.userInfo}>
                <button 
                  onClick={() => navigate("/profile/" + suggestionId)}
                  className={classes.nameButton}
                >
                  <div className={classes.nameContainer}>
                    <h4 className={classes.userName}>
                      {firstName} {lastName}
                      <div className={classes.verifiedIcon}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </h4>
                    <div className={classes.nameHighlight}></div>
                  </div>
                  
                  <p className={classes.userTitle}>
                    <span className={classes.position}>{position}</span>
                    <span className={classes.divider}>at</span>
                    <span className={classes.company}>{company}</span>
                  </p>
                </button>

                {/* Connection info */}
                <div className={classes.connectionInfo}>
                  <div className={classes.mutualConnections}>
                    <div className={classes.mutualAvatars}>
                      <div className={classes.mutualAvatar}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <div className={classes.mutualAvatar}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </div>
                    </div>
                    <span className={classes.mutualText}>2 mutual</span>
                  </div>
                </div>

                {/* Action button */}
                <div className={classes.actionSection}>
                  <Button
                    size="medium"
                    outline
                    className={`${classes.connectButton} ${isConnecting ? classes.connecting : ''}`}
                    onClick={() => handleConnect(suggestion)}
                    disabled={isConnecting}
                  >
                    <div className={classes.buttonContent}>
                      {isConnecting ? (
                        <>
                          <div className={classes.loadingSpinner}></div>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <div className={classes.connectIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </div>
                          <span>Connect</span>
                        </>
                      )}
                    </div>
                    <div className={classes.buttonRipple}></div>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Enhanced empty state */}
        {suggestions.length === 0 && !loading && (
          <div className={classes.emptyState}>
            <div className={classes.emptyAnimation}>
              <div className={classes.emptyIcon}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
                  <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className={classes.emptyGlow}></div>
            </div>
            
            <div className={classes.emptyContent}>
              <h4 className={classes.emptyTitle}>All caught up! ✨</h4>
              <p className={classes.emptyDescription}>
                No new connection suggestions available right now.
              </p>
              
              <button 
                className={classes.exploreButton}
                onClick={() => navigate("/network/discover")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Explore Network</span>
                <div className={classes.exploreRipple}></div>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced loading state */}
        {loading && (
          <div className={classes.loadingState}>
            <div className={classes.loadingAnimation}>
              <Loader isInline />
              <div className={classes.loadingPulse}></div>
            </div>
            <p className={classes.loadingText}>Discovering amazing connections for you...</p>
          </div>
        )}
      </div>

      {/* Floating hint */}
      {suggestions.length > 0 && !loading && (
        <div className={classes.floatingHint}>
          <div className={classes.hintIcon}>🚀</div>
          <span>Grow your network</span>
        </div>
      )}
    </div>
  );
}

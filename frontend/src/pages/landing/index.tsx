import React, { useEffect, useState } from "react";
import "../login/styles.css";
import { fetchUserDetails } from "@/hooks/UserHooks";
import { Button } from "@mui/material";
import { useGroup } from "@/hooks/GroupHooks";

type User = {
  id: string;
  group_id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type GroupResponse = {
  group: {
    group_code: string;
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  user: User;
};

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User>({} as User);
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showGroupCode, setShowGroupCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const { handleCreateGroup, handleJoinGroup, error, loading, onSuccess } =
    useGroup();
  const [isCreating, setIsCreating] = useState(false);

  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails();
      setUser(userData);
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreating) {
        const result = (await handleCreateGroup(
          groupName,
          user.id
        )) as GroupResponse;
        if (result?.group?.group_code) {
          setGroupCode(result.group.group_code);
          setShowGroupCode(true);
        }
      } else {
        await handleJoinGroup(groupCode, user.id);
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(groupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Welcome to RoomieSync, {user.first_name}!</h1>

        {showGroupCode ? (
          <div>
            <h2>Group Created Successfully!</h2>
            <p>Share this code with your roommates:</p>

            <div className="floating-label-group" style={{ marginTop: "40px" }}>
              <input
                type="text"
                value={groupCode}
                readOnly
                className="floating-input code-display"
              />
              <label className="floating-label">Group Code</label>
            </div>
            <Button onClick={handleCopyCode} className="copy-button">
              {copied ? "Copied!" : "Copy Code"}
            </Button>

            <Button onClick={onSuccess} className="continue-button">
              Continue
            </Button>
          </div>
        ) : (
          <>
            <h2>{isCreating ? "Create a Group" : "Join a Group"}</h2>
            {error && <div className="error-message">{error}</div>}

            {isCreating ? (
              <div className="form-group">
                <div className="floating-label-group">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                    className="floating-input"
                  />
                  <label className="floating-label">Group Name</label>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <div className="floating-label-group">
                  <input
                    type="text"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    required
                    className="floating-input"
                  />
                  <label className="floating-label">Group Code</label>
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : isCreating ? "Create" : "Join"}
            </Button>

            <Button
              type="button"
              onClick={() => setIsCreating(!isCreating)}
              className="toggle-button"
            >
              {isCreating
                ? "Join an existing group?"
                : "Need to create a group?"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default LandingPage;

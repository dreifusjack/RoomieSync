import React, { useEffect, useState } from "react";
import styles from "../../styles/Modal.module.css";
import { fetchUserDetails } from "@/hooks/UserHooks";
import { Button } from "@mui/material";
import { useGroup } from "@/hooks/GroupHooks";
import { User } from "@/types/user-types";
import { GroupResponse } from "@/types/group-types";

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
    <div className={styles.modalContainer}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <h2>Welcome to RoomieSync, {user.first_name}!</h2>

        {showGroupCode ? (
          <div>
            <h2>Group Created Successfully!</h2>
            <p>Share this code with your roommates:</p>

            <div
              className={styles.floatingLabelGroup}
              style={{ marginTop: "40px" }}
            >
              <input
                type="text"
                value={groupCode}
                readOnly
                className={styles.floatingInput} // + code-display
              />
              <label className={styles.floatingLabel}>Group Code</label>
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
            {error && <div className={styles.errorMessage}>{error}</div>}

            {isCreating ? (
              <div className={styles.floatingLabelGroup}>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className={styles.floatingInput}
                />
                <label className={styles.floatingLabel}>Group Name</label>
              </div>
            ) : (
              <div className={styles.floatingLabelGroup}>
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  required
                  className={styles.floatingInput}
                />
                <label className={styles.floatingLabel}>Group Code</label>
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

import React, { useState } from "react";
import styles from "../../styles/Modal.module.css";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useCreateGroup, useJoinGroup } from "@/hooks/groups.hooks";

const LandingPage: React.FC = () => {
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showGroupCode, setShowGroupCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdGroupCode, setCreatedGroupCode] = useState("");

  const router = useRouter();

  // current user + group hooks
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const createGroupMutation = useCreateGroup();
  const joinGroupMutation = useJoinGroup();

  const loading = createGroupMutation.isPending || joinGroupMutation.isPending;
  const error =
    createGroupMutation.error?.message ||
    joinGroupMutation.error?.message ||
    null;

  if (userLoading) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalForm}>
          <div>Loading user data...</div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalForm}>
          <div>Error loading user data. Please try refreshing the page.</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isCreating) {
        const result = await createGroupMutation.mutateAsync(groupName);
        if (result?.groupCode) {
          setCreatedGroupCode(result.groupCode);
          setShowGroupCode(true);
        }
      } else {
        await joinGroupMutation.mutateAsync(groupCode);
        handleContinue;
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

  const handleContinue = () => {
    router.push("/alarms");
  };

  return (
    <div className={styles.modalContainer}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <h2>Welcome to RoomieSync, {user.firstName}!</h2>

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
                value={createdGroupCode}
                readOnly
                className={styles.floatingInput} // + code-display
              />
              <label className={styles.floatingLabel}>Group Code</label>
            </div>
            <Button onClick={handleCopyCode} className="copy-button">
              {copied ? "Copied!" : "Copy Code"}
            </Button>

            <Button onClick={handleContinue} className="continue-button">
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

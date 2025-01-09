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

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User>({} as User);
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const { handleCreateGroup, handleJoinGroup, error, loading } = useGroup();
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    try {
      const userData = await fetchUserDetails();
      setUser(userData);
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      await handleCreateGroup(groupName, user.id);
    } else {
      await handleJoinGroup(groupCode, user.id);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Welcome to RoomieSync, {user.first_name}!</h1>
        <h2>{isCreating ? "Create a Group" : "Join a Group"}</h2>
        {error && <div className="error-message">{error}</div>}
        {isCreating ? (
          <div className="form-group">
            <label>Group Name:</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Group Code:</label>
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              required
            />
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
          {isCreating ? "Joing an existing group?" : "Need to create a group?"}
        </Button>
      </form>
    </div>
  );
};

export default LandingPage;

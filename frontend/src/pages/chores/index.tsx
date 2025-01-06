import React, { useEffect, useState } from "react";
import axios from "axios";
import ChoresList from "@/components/ChoresList/ChoresList";
import AssignChoreForm from "@/components/AssignChoreForm";
import CreateChoreForm from "@/components/CreateChoreForm";
import "./styles.css";
import Sidebar from "@/components/Sidebar";
import { fetchUserDetails } from "@/hooks/UserHooks";
import {
  uesRemindUser,
  useDeleteChore,
  useGetGroupChores,
} from "@/hooks/ChoreHooks";

type Chore = {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
};

const ChoresPage: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [isAssignFormVisible, setAssignFormVisible] = useState(false);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { getAllGroupChores, isLoading, error } = useGetGroupChores();
  const { remindUserWithId } = uesRemindUser();
  const { deleteChoreWithId } = useDeleteChore();

  const currentGroupId = async () => {
    const userDetails = await fetchUserDetails();
    return userDetails.group_id;
  };

  useEffect(() => {
    const fetchChores = async () => {
      const userDetails = await fetchUserDetails();
      const groupId = userDetails.group_id;
      console.log(groupId);
      const choresData = await getAllGroupChores(groupId);
      setChores(choresData || []);
    };

    fetchChores();
  }, []);

  const handleRemindUser = async (choreId: string) => {
    await remindUserWithId(choreId);
    alert("Reminder sent successfully!");
  };

  const handleDeleteChore = async (choreId: string) => {
    await deleteChoreWithId(choreId);
    const userDetails = await fetchUserDetails();
    const choresData = await getAllGroupChores(userDetails.group_id);
    setChores(choresData || []);
  };

  if (isLoading) {
    return <div>Loading chores...</div>;
  }

  return (
    <div className="chores-page">
      <h1 className="page-title">Chores</h1>
      <div className="button-container">
        <button
          className="action-button"
          onClick={() => {
            setCreateFormVisible(true);
            setAssignFormVisible(false);
          }}
        >
          Create New Chore
        </button>
        <button
          className="action-button"
          onClick={() => {
            setAssignFormVisible(true);
            setCreateFormVisible(false);
          }}
        >
          Assign Chore
        </button>
      </div>
      <div className="chores-list">
        <ChoresList
          chores={chores}
          assigneeName="Jack"
          onRemindUser={handleRemindUser}
          onDeletedChore={handleDeleteChore}
        />
      </div>

      <Sidebar />
    </div>
  );
};

export default ChoresPage;

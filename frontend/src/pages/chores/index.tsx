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

  const fetchChores = async () => {
    const choresData = await getAllGroupChores();
    setChores(choresData || []);
  };

  useEffect(() => {
    fetchChores();
  }, []);

  const handleRemindUser = async (choreId: string) => {
    await remindUserWithId(choreId);
    alert("Reminder sent successfully!");
  };

  const handleDeleteChore = async (choreId: string) => {
    await deleteChoreWithId(choreId);
    await fetchChores();
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
      {isCreateFormVisible && (
        <div className="form">
          <CreateChoreForm onChoreCreated={fetchChores} />
          <button
            className="form-close"
            onClick={() => setCreateFormVisible(false)}
          >
            Close
          </button>
        </div>
      )}

      <Sidebar />
    </div>
  );
};

export default ChoresPage;

import React, { useEffect, useState } from "react";
import ChoresList from "@/components/ChoresList/ChoresList";
import AssignChoreForm from "@/components/AssignChoreForm";
import CreateChoreForm from "@/components/ChoreForm/CreateChoreForm";
import "./styles.css";
import Sidebar from "@/components/Sidebar";
import {
  uesRemindUser,
  useDeleteChore,
  useGetGroupChores,
} from "@/hooks/ChoreHooks";
import { Box, Modal } from "@mui/material";
import { useAllGroupUsers } from "@/hooks/UserHooks";

type Chore = {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

const ChoresPage: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAssignFormVisible, setAssignFormVisible] = useState(false);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { getAllGroupChores, isLoading } = useGetGroupChores();
  const { remindUserWithId } = uesRemindUser();
  const { deleteChoreWithId } = useDeleteChore();
  const { getAllGroupUsers } = useAllGroupUsers();

  const fetchChores = async () => {
    const choresData = await getAllGroupChores();
    setChores(choresData || []);
  };

  const fetchGroupMembers = async () => {
    const groupUsers = await getAllGroupUsers();
    setUsers(groupUsers || []);
  };

  useEffect(() => {
    fetchChores();
    fetchGroupMembers();
  }, []);

  const handleRemindUser = async (choreId: string) => {
    await remindUserWithId(choreId);
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
          onRemindUser={handleRemindUser}
          onDeletedChore={handleDeleteChore}
        />
      </div>
      <Modal
        open={isCreateFormVisible}
        onClose={() => setCreateFormVisible(false)}
        aria-labelledby="create-chore-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <CreateChoreForm
            onChoreCreated={() => {
              fetchChores();
              setCreateFormVisible(false);
            }}
          />
        </Box>
      </Modal>
      <Modal
        open={isAssignFormVisible}
        onClose={() => setAssignFormVisible(false)}
        aria-labelledby="assign-chore-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <AssignChoreForm
            chores={chores}
            users={users}
            onChoreAssigned={() => {
              fetchChores();
              setAssignFormVisible(false);
            }}
          />
        </Box>
      </Modal>
      <Sidebar />
    </div>
  );
};

export default ChoresPage;

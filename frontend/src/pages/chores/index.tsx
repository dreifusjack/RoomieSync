import React, { useEffect, useState } from "react";
import ChoresList from "@/components/ChoresList/ChoresList";
import CreateChoreForm from "@/components/ChoreForm/CreateChoreForm";
import "./styles.css";
import Sidebar from "@/components/Sidebar";
import {
  uesRemindUser,
  useDeleteChore,
  useGetGroupChores,
} from "@/hooks/ChoreHooks";
import { Box, Modal } from "@mui/material";

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
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { getAllGroupChores, isLoading } = useGetGroupChores();
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
          }}
        >
          Create New Chore
        </button>
      </div>
      <div className="chores-list">
        <ChoresList
          chores={chores}
          onRemindUser={handleRemindUser}
          onDeletedChore={handleDeleteChore}
          onChoreAssigned={() => {
            fetchChores();
          }}
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
      <Sidebar />
    </div>
  );
};

export default ChoresPage;

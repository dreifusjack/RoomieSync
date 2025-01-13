import React, { useEffect, useState } from "react";
import ChoresList from "@/components/ChoresList/ChoresList";
import CreateChoreForm from "@/components/ChoreForm/CreateChoreForm";
import styles from "@/styles/Explore.module.css";
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
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className={styles.heading}>Chores</h1>

          <button
            className={styles.button}
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
              backgroundColor: "#000000",
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
      </div>
    </div>
  );
};

export default ChoresPage;

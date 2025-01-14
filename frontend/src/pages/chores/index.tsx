import React, { useEffect, useState } from "react";
import ChoresList from "@/components/ChoresList/ChoresList";
import CreateChoreForm from "@/components/CreateChoreForm";
import styles from "@/styles/Feature.module.css";
import Sidebar from "@/components/Sidebar";
import {
  uesRemindUser,
  useDeleteChore,
  useGetGroupChores,
} from "@/hooks/ChoreHooks";
import CustomModal from "@/components/Modal";
import { Chore } from "@/types/chore-types";

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
        <hr className={styles.horizontalLine} />
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
        <CustomModal
          form={
            <CreateChoreForm
              onChoreCreated={() => {
                fetchChores();
                setCreateFormVisible(false);
              }}
            />
          }
          open={isCreateFormVisible}
          onClose={() => setCreateFormVisible(false)}
        />
      </div>
    </div>
  );
};

export default ChoresPage;

import React, { useState } from "react";
import ChoresList from "@/components/ChoresList/ChoresList";
import CreateChoreForm from "@/components/CreateChoreForm";
import styles from "@/styles/Feature.module.css";
import Sidebar from "@/components/Sidebar";
import CustomModal from "@/components/Modal";
import { Chore } from "@/types/chore-types";
import {
  useGroupChores,
  useSendReminder,
  useDeleteChore,
} from "@/hooks/chores.hooks";

const ChoresPage: React.FC = () => {
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { data: groupChores, isLoading, isError } = useGroupChores();
  const { mutate: sendReminder } = useSendReminder();
  const { mutate: deleteChore } = useDeleteChore();

  // might need these
  // const handleRemindUser = async (choreId: string) => {
  //   sendReminder(choreId);
  // };

  // const handleDeleteChore = (choreId: string) => {
  //   deleteChore(choreId);
  // };

  if (isError) {
    return <div>Error fetching user chores</div>;
  }

  if (isLoading || !groupChores) {
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
        {/* {isError && <div className={styles.errorMessage}>{error}</div>} */}
        <div className="chores-list">
          <ChoresList
            chores={groupChores}
            onRemindUser={sendReminder}
            onDeletedChore={deleteChore}
          />
        </div>
        <CustomModal
          form={
            <CreateChoreForm
              onChoreCreated={() => {
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

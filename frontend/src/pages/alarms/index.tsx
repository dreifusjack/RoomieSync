import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "@/styles/Explore.module.css";
import { useAlarms } from "@/hooks/AlarmHooks";
import AlarmCard from "@/components/AlarmCard";
import { Box, Modal } from "@mui/material";
import CreateAlarmForm from "@/components/CreateAlarmForm";

function AlarmsPage() {
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { userAlarms, groupAlarms, createAlarm, deleteAlarm } = useAlarms();

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className={styles.heading}>Alarms</h1>
          <button
            className={styles.button}
            onClick={() => setCreateFormVisible(true)}
          >
            Create New Alarm
          </button>
        </div>

        <h2 className={styles.subheading}>Your Alarms</h2>
        <div className={styles.alarmList}>
          {(Array.isArray(userAlarms) ? userAlarms : []).map((alarm) => (
            <AlarmCard alarm={alarm} onDelete={deleteAlarm} />
          ))}
        </div>

        <h2 className={styles.subheading}>Group Alarms</h2>
        <div className={styles.alarmList}>
          {(Array.isArray(groupAlarms) ? groupAlarms : []).map((alarm) => (
            <AlarmCard alarm={alarm} onDelete={deleteAlarm} isGroup={true} />
          ))}
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
            <CreateAlarmForm
              createAlarm={createAlarm}
              onAlarmCreated={() => setCreateFormVisible(false)}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default AlarmsPage;

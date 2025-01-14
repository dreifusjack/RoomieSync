import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "@/styles/Feature.module.css";
import { useAlarms } from "@/hooks/AlarmHooks";
import AlarmCard from "@/components/AlarmCard";
import CreateAlarmForm from "@/components/CreateAlarmForm";
import CustomModal from "@/components/Modal";

function AlarmsPage() {
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { userAlarms, groupAlarms, deleteAlarm, error } = useAlarms();

  return (
    <div className={styles.container}>
      <Sidebar />
      {error && <div className={styles.errorMessage}>{error}</div>}
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
        <hr className={styles.horizontalLine} />
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
        <CustomModal
          form={
            <CreateAlarmForm
              onAlarmCreated={() => setCreateFormVisible(false)}
            />
          }
          open={isCreateFormVisible}
          onClose={() => setCreateFormVisible(false)}
        />
      </div>
    </div>
  );
}

export default AlarmsPage;

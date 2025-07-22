import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "@/styles/Feature.module.css";
import AlarmCard from "@/components/AlarmCard";
import CreateAlarmForm from "@/components/CreateAlarmForm";
import CustomModal from "@/components/Modal";
import { useGroupAlarms, useUserAlarms } from "@/hooks/alarms.hooks";
import { useCurrentUser } from "@/hooks/auth.hooks";

function AlarmsPage() {
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: groupAlarms,
    isLoading: groupAlarmsLoading,
    error: groupAlarmsError,
  } = useGroupAlarms(user?.groupId || "");

  const {
    data: userAlarms,
    isLoading: userAlarmsLoading,
    error: userAlarmsError,
  } = useUserAlarms();

  if (userLoading) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalForm}>
          <div>Loading user data...</div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalForm}>
          <div>Error loading user data. Please try refreshing the page.</div>
        </div>
      </div>
    );
  }

  if (!user?.groupId) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalForm}>
          <div>User must have a group. Please logout.</div>
        </div>
      </div>
    );
  }

  const error = userAlarmsError?.message || groupAlarmsError?.message;
  const loading = userAlarmsLoading || groupAlarmsLoading;

  if (loading) {
    <div className={styles.modalContainer}>
      <div>Loading alarms...</div>
    </div>;
  }

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
            <AlarmCard alarm={alarm} />
          ))}
        </div>

        <h2 className={styles.subheading}>Group Alarms</h2>
        <div className={styles.alarmList}>
          {(Array.isArray(groupAlarms) ? groupAlarms : []).map((alarm) => (
            <AlarmCard alarm={alarm} isGroup={true} />
          ))}
        </div>
        <CustomModal
          form={
            <CreateAlarmForm
              onAlarmCreated={() => {
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
}

export default AlarmsPage;

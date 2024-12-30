import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "@/styles/Explore.module.css";
import "./styles.css";
import { useAlarms } from "@/hooks/AlarmHooks";
import AlarmCard from "@/components/AlarmCard";

function AlarmsPage() {
  const [newAlarmName, setNewAlarmName] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const { userAlarms, groupAlarms, createAlarm } = useAlarms();

  const handleCreateAlarm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await createAlarm(newAlarmName, newAlarmTime);
      setNewAlarmName("");
      setNewAlarmTime("");
    } catch (error) {
      throw new Error("Error creating alarm:");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Alarms</h1>

        <h2 className={styles.subheading}>Create New Alarm</h2>
        <form className={styles.form} onSubmit={handleCreateAlarm}>
          <div>
            <label className={styles.label}>
              Alarm Name:
              <input
                className={styles.input}
                type="text"
                value={newAlarmName}
                onChange={(e) => setNewAlarmName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label className={styles.label}>
              Alarm Time:
              <input
                className={styles.input}
                type="time"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                required
              />
            </label>
          </div>
          <button className={styles.button} type="submit">
            Create Alarm
          </button>
        </form>

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
      </div>
    </div>
  );
}

export default AlarmsPage;

import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { Button } from "@mui/material";
import { useAlarms } from "@/hooks/AlarmHooks";

interface CreateAlarmFormProps {
  onAlarmCreated: () => void;
}

const CreateAlarmForm: React.FC<CreateAlarmFormProps> = ({
  onAlarmCreated,
}) => {
  const [newAlarmName, setNewAlarmName] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const { createAlarm, error } = useAlarms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAlarm(newAlarmName, newAlarmTime);
      onAlarmCreated();
      setNewAlarmName("");
      setNewAlarmTime("");
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.floatingLabelGroup}>
          <input
            type="text"
            value={newAlarmName}
            onChange={(e) => setNewAlarmName(e.target.value)}
            required
            className={styles.floatingInput}
          />
          <label htmlFor="alarmName" className={styles.floatingLabel}>
            Alarm Name
          </label>
        </div>
        <div className={styles.floatingLabelGroup}>
          <input
            type="time"
            id="alarmTime"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            required
            className={styles.floatingInput}
          />
          <label htmlFor="alarmTime" className={styles.floatingLabel}>
            Alarm Time
          </label>
        </div>

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default CreateAlarmForm;

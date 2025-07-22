import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { Button } from "@mui/material";
import { useCreateAlarm } from "@/hooks/alarms.hooks";

interface CreateAlarmFormProps {
  onAlarmCreated: () => void;
}

const CreateAlarmForm: React.FC<CreateAlarmFormProps> = ({
  onAlarmCreated,
}) => {
  const [alarmName, setAlarmName] = useState("");
  const [alarmTime, setAlarmTime] = useState("");
  const createAlarmMutation = useCreateAlarm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(alarmTime);
    try {
      createAlarmMutation.mutate({
        payload: { name: alarmName, time: alarmTime },
      });
      onAlarmCreated();
      setAlarmName("");
      setAlarmTime("");
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };

  const error = createAlarmMutation.error;

  return (
    <div className={styles.modalContainer}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {error && <div className={styles.errorMessage}>{error.message}</div>}
        <div className={styles.floatingLabelGroup}>
          <input
            type="text"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
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
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
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

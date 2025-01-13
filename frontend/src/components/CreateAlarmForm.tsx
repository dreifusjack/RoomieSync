import React, { useState } from "react";
import "./ChoreForm/style.css";

interface CreateAlarmFormProps {
  createAlarm: (alarmName: string, alarmTime: string) => Promise<any>;
  onAlarmCreated: () => void;
}

const CreateAlarmForm: React.FC<CreateAlarmFormProps> = ({
  onAlarmCreated,
  createAlarm,
}) => {
  const [newAlarmName, setNewAlarmName] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAlarm(newAlarmName, newAlarmTime);
      onAlarmCreated();
      // Reset fields after successful submission
      setNewAlarmName("");
      setNewAlarmTime("");
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <div>
          <label htmlFor="alarmName">Alarm Name</label>
          <input
            type="text"
            id="alarmName"
            value={newAlarmName}
            onChange={(e) => setNewAlarmName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="alarmTime">Alarm Time</label>
          <input
            type="time"
            id="alarmTime"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!newAlarmName || !newAlarmTime}
          className="modal-button"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateAlarmForm;

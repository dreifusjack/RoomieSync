import React, { useState } from "react";
import "./style.css";

import { useCreateChore } from "@/hooks/ChoreHooks";

interface CreateChoreFormProps {
  onChoreCreated: () => void;
}

const CreateChoreForm: React.FC<CreateChoreFormProps> = ({
  onChoreCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cadence, setCadence] = useState("");
  const { createChoreWithPayload } = useCreateChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createChoreWithPayload(name, description, cadence);

      onChoreCreated();
      setName("");
      setDescription("");
      setCadence("");
    } catch (error) {
      console.error("Error creating chore:", error);
    }
  };

  return (
    <div className="modal-container">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="floating-label-group">
          <input
            id="name"
            type="text"
            className="floating-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="name" className="floating-label">
            Chore Name
          </label>
        </div>

        <div className="floating-label-group">
          <textarea
            id="description"
            className="floating-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="description" className="floating-label">
            Description
          </label>
        </div>

        <div className="floating-label-group">
          <input
            id="cadence"
            type="text"
            className="floating-input"
            value={cadence}
            onChange={(e) => setCadence(e.target.value)}
            required
          />
          <label htmlFor="cadence" className="floating-label">
            Cadence
          </label>
        </div>

        <button type="submit">Create Chore</button>
      </form>
    </div>
  );
};

export default CreateChoreForm;

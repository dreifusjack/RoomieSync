import React, { useState } from "react";
import axios from "axios";

interface CreateChoreFormProps {
  groupId: string;
  onChoreCreated: () => void; // callback to update the chores
}

const CreateChoreForm: React.FC<CreateChoreFormProps> = ({
  groupId,
  onChoreCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cadence, setCadence] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/chores", {
        group_id: groupId,
        name,
        description,
        cadence,
      });
      onChoreCreated();
      // refresh selections
      setName("");
      setDescription("");
      setCadence("");
    } catch (error) {
      console.error("Error creating chore:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-chore-form">
      <div>
        <label htmlFor="name">Chore Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter chore name"
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter chore description"
        />
      </div>

      <div>
        <label htmlFor="cadence">Cadence</label>
        <input
          id="cadence"
          type="text"
          value={cadence}
          onChange={(e) => setCadence(e.target.value)}
          required
          placeholder="e.g., Daily, Weekly, Monthly"
        />
      </div>

      <button type="submit">Create Chore</button>
    </form>
  );
};

export default CreateChoreForm;

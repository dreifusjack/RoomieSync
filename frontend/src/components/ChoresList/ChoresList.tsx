import React from "react";
import "./list.css";

interface Chore {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
}

interface ChoresListProps {
  chores: Chore[];
  assigneeName: string;
  onRemindUser: (choreId: string) => void;
  onDeletedChore: (choreId: string) => void;
}

const ChoresList: React.FC<ChoresListProps> = ({
  chores,
  assigneeName,
  onRemindUser,
  onDeletedChore,
}) => {
  return (
    <div className="chores-list">
      {chores.map((chore) => (
        <div key={chore.id} className="chore-card">
          <h3>{chore.name}</h3>
          <p>{chore.description}</p>
          <p>Cadence: {chore.cadence}</p>
          <p>Assigned to: {assigneeName}</p>
          <button onClick={() => onRemindUser(chore.id)}>Send Reminder</button>
          <button onClick={() => onDeletedChore(chore.id)}>Remove Chore</button>
        </div>
      ))}
    </div>
  );
};

export default ChoresList;

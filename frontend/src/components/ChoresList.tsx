import React, { useState } from "react";

interface Chore {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
}

interface Assignee {
  userId: string;
  dueDate: string;
}

interface ChoresListProps {
  chores: Chore[];
  onRemindUser: (choreId: string) => void;
  onDeletedChore: (choreId: string) => void;
}

const ChoresList: React.FC<ChoresListProps> = ({
  chores,
  onRemindUser,
  onDeletedChore,
}) => {
  return (
    <div className="chores-list">
      {chores.map((chore) => (
        <div key={chore.id} className="chore-card">
          <h3>{chore.name}</h3>
          <p>{chore.description}</p>
          <p>Created on: {chore.createdAt}</p>
          <p>Assignees: </p>
          <p>Due at: </p>
          <button onClick={() => onRemindUser(chore.id)}>Send Reminder</button>
          <button onClick={() => onDeletedChore(chore.id)}>Delete Chore</button>
        </div>
      ))}
    </div>
  );
};

export default ChoresList;

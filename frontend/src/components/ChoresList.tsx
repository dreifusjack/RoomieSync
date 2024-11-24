import React from "react";

interface Chore {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

interface ChoresListProps {
  chores: Chore[];
  remindUserFunc: (choreId: string) => void;
  deleteChoreFunc: (choreId: string) => void;
}

const ChoresList: React.FC<ChoresListProps> = ({
  chores,
  remindUserFunc,
  deleteChoreFunc,
}) => {
  return (
    <div className="chores-list">
      {chores.map((chore) => (
        <div key={chore.id} className="chore-card">
          <h3>{chore.name}</h3>
          <p>{chore.description}</p>
          <p>Assigned to: {chore.assignedTo}</p>
          <p>Due date: {chore.dueDate}</p>
          <button onClick={() => remindUserFunc(chore.id)}>
            Send Reminder
          </button>
          <button onClick={() => deleteChoreFunc(chore.id)}>
            Delete Chore
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChoresList;

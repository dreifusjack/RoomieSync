import React from "react";
import "./list.css";
import { useGetChoreAssignees } from "@/hooks/ChoreHooks";

interface Chore {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
}

interface ChoreCardProps {
  chore: Chore;
  onRemindUser: (choreId: string) => void;
  onDeletedChore: (choreId: string) => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({
  chore,
  onRemindUser,
  onDeletedChore,
}) => {
  const { getChoreAssigneesFromId, isLoading, error } = useGetChoreAssignees();

  const handleGetAssignee = async () => {
    const assignee = await getChoreAssigneesFromId(chore.id);
    console.log(assignee);
  };

  return (
    <div key={chore.id} className="chore-card">
      <h3>{chore.name}</h3>
      <p>{chore.description}</p>
      <p>Cadence: {chore.cadence}</p>
      <p>Assigned to: {}</p>
      <button onClick={() => onRemindUser(chore.id)}>Send Reminder</button>
      <button onClick={() => onDeletedChore(chore.id)}>Remove Chore</button>
    </div>
  );
};

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
        <ChoreCard
          chore={chore}
          onRemindUser={onRemindUser}
          onDeletedChore={onDeletedChore}
        />
      ))}
    </div>
  );
};

export default ChoresList;

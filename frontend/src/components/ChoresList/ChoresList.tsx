import React, { useEffect, useState } from "react";
import "./list.css";
import { useGetChoreAssignees } from "@/hooks/ChoreHooks";
import { useUserById } from "@/hooks/UserHooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface ChoreAssignee {
  user_id: string;
  due_date: string;
}

const ChoreCard: React.FC<ChoreCardProps> = ({
  chore,
  onRemindUser,
  onDeletedChore,
}) => {
  const { getChoreAssigneesFromId } = useGetChoreAssignees();
  const [assignee, setAssignee] = useState<ChoreAssignee>();

  const handleGetAssignee = async () => {
    const assignee = await getChoreAssigneesFromId(chore.id);
    setAssignee(assignee[0]);
  };

  useEffect(() => {
    handleGetAssignee();
  }, []);

  const userName = useUserById(assignee?.user_id || "").userName;
  let parsedDueDate = "chore must be assigned";

  if (assignee?.due_date) {
    const date = new Date(assignee.due_date); // Parse the date string
    parsedDueDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()}`;
  }

  return (
    <div key={chore.id} className="chore-card">
      <h3>{chore.name}</h3>
      <p>{chore.description}</p>
      <p>Cadence: {chore.cadence}</p>
      <p>👤 {userName || "chore must be assigned"}</p>
      <p>⏰ {parsedDueDate}</p>
      {userName && (
        <button
          onClick={() => {
            onRemindUser(chore.id);
            toast.success("Reminder sent successfully!");
          }}
        >
          Send Reminder
        </button>
      )}
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
    <div>
      <ToastContainer />
      <div className="chores-list">
        {chores.map((chore) => (
          <ChoreCard
            chore={chore}
            onRemindUser={onRemindUser}
            onDeletedChore={onDeletedChore}
          />
        ))}
      </div>
    </div>
  );
};

export default ChoresList;

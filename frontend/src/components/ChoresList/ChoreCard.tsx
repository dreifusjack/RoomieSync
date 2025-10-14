import React, { useEffect, useState } from "react";
import "./list.css";
import { useAllGroupUsers, useUserById } from "@/hooks/users.hooks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignChoreForm from "../AssignChoreForm";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../Modal";
import { Chore, ChoreAssignment } from "@/types/chore-types";
import { useChoreAssignments } from "@/hooks/chores.hooks";

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
  const [assignee, setAssignee] = useState<ChoreAssignment | null>(null);
  const [isAssignFormVisible, setAssignFormVisible] = useState(false);
  const { data: groupUsers } = useAllGroupUsers();
  const { data: choreAssignments } = useChoreAssignments(chore.id);

  useEffect(() => {
    if (choreAssignments && choreAssignments.length > 0) {
      // currently assuming each chore has only one assignee
      setAssignee(choreAssignments[0]);
    } else {
      setAssignee(null);
    }
  }, [choreAssignments]);

  const parsedDueDate = assignee?.dueDate
    ? new Date(assignee.dueDate).toLocaleDateString()
    : "Chore must be assigned";

  const { data: assigneeUser } = useUserById(assignee?.userId ?? "");
  const userName = assigneeUser
    ? `${assigneeUser.firstName} ${assigneeUser.lastName}`
    : "";

  return (
    <div key={chore.id} className="chore-card">
      <h3>{chore.name}</h3>
      <p>{chore.description}</p>
      <p>⏳ {chore.cadence}</p>

      {userName ? (
        <>
          <p>👤 {userName}</p>
          <p>⏰ {parsedDueDate}</p>
          <button
            onClick={() => {
              onRemindUser(chore.id);
              toast.success("Reminder sent successfully!");
            }}
          >
            Send Reminder
          </button>
        </>
      ) : (
        <button
          className="action-button"
          onClick={() => setAssignFormVisible(true)}
        >
          Assign Chore
        </button>
      )}

      <DeleteIcon
        sx={{
          marginLeft: "70px",
          color: "#ffffff",
          cursor: "pointer",
        }}
        onClick={() => onDeletedChore(chore.id)}
      />

      <CustomModal
        form={
          <AssignChoreForm
            chore={chore}
            users={groupUsers || []}
            onChoreAssigned={() => {
              setAssignFormVisible(false);
            }}
          />
        }
        open={isAssignFormVisible}
        onClose={() => setAssignFormVisible(false)}
      />
    </div>
  );
};

export default ChoreCard;

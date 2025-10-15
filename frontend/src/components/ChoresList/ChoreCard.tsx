import React, { useEffect, useState } from "react";
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
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-80 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white mb-2">{chore.name}</h3>
        <DeleteIcon
          sx={{
            color: "#ffffff",
            cursor: "pointer",
            "&:hover": {
              color: "#ff6b6b",
            },
          }}
          onClick={() => onDeletedChore(chore.id)}
        />
      </div>

      <p className="text-gray-300 mb-3">{chore.description}</p>
      <p className="text-gray-400 mb-3">⏳ {chore.cadence}</p>

      {userName ? (
        <div className="space-y-3">
          <p className="text-gray-300">👤 {userName}</p>
          <p className="text-gray-400">⏰ {parsedDueDate}</p>
          <button
            onClick={() => {
              onRemindUser(chore.id);
              toast.success("Reminder sent successfully!");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Send Reminder
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAssignFormVisible(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          Assign Chore
        </button>
      )}

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

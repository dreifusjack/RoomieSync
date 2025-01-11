import React, { useEffect, useState } from "react";
import "./list.css";
import { useGetChoreAssignees } from "@/hooks/ChoreHooks";
import { useAllGroupUsers, useUserById } from "@/hooks/UserHooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Modal } from "@mui/material";
import AssignChoreForm from "../AssignChoreForm";
import DeleteIcon from "@mui/icons-material/Delete";

interface Chore {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
}

interface ChoreAssignee {
  user_id: string;
  due_date: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface ChoreCardProps {
  chore: Chore;
  onRemindUser: (choreId: string) => void;
  onDeletedChore: (choreId: string) => void;
  onChoreAssigned: () => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({
  chore,
  onRemindUser,
  onDeletedChore,
  onChoreAssigned,
}) => {
  const { getChoreAssigneesFromId } = useGetChoreAssignees();
  const [assignee, setAssignee] = useState<ChoreAssignee>();
  const [users, setUsers] = useState<User[]>([]);
  const [isAssignFormVisible, setAssignFormVisible] = useState(false);
  const { getAllGroupUsers } = useAllGroupUsers();

  const handleGetAssignee = async () => {
    const assignee = await getChoreAssigneesFromId(chore.id);
    setAssignee(assignee[0]);
  };

  const fetchGroupMembers = async () => {
    const groupUsers = await getAllGroupUsers();
    setUsers(groupUsers || []);
  };

  useEffect(() => {
    handleGetAssignee();
    fetchGroupMembers();
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
          onClick={() => {
            setAssignFormVisible(true);
          }}
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
      ></DeleteIcon>

      <Modal
        open={isAssignFormVisible}
        onClose={() => setAssignFormVisible(false)}
        aria-labelledby="assign-chore-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            backgroundColor: "#000000",
          }}
        >
          <AssignChoreForm
            chore={chore}
            users={users}
            onChoreAssigned={onChoreAssigned}
          />
        </Box>
      </Modal>
    </div>
  );
};

interface ChoresListProps {
  chores: Chore[];
  onRemindUser: (choreId: string) => void;
  onDeletedChore: (choreId: string) => void;
  onChoreAssigned: () => void;
}

const ChoresList: React.FC<ChoresListProps> = ({
  chores,
  onRemindUser,
  onDeletedChore,
  onChoreAssigned,
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
            onChoreAssigned={onChoreAssigned}
          />
        ))}
      </div>
    </div>
  );
};

export default ChoresList;

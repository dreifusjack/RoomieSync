import "./list.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chore } from "@/types/chore-types";
import ChoreCard from "./ChoreCard";

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

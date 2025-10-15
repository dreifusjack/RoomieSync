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
      <div className="bg-white rounded-lg p-2 md:p-6">
        {chores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {chores.map((chore) => (
              <ChoreCard
                key={chore.id}
                chore={chore}
                onRemindUser={onRemindUser}
                onDeletedChore={onDeletedChore}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No household chores set
          </p>
        )}
      </div>
    </div>
  );
};

export default ChoresList;

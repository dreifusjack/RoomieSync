import { useDeleteAlarm } from "@/hooks/alarms.hooks";
import { useUserById } from "@/hooks/users.hooks";
import { Alarm } from "@/types/alarm-types";
import DeleteIcon from "@mui/icons-material/Delete";

interface AlarmCardProps {
  alarm: Alarm;
  isGroup?: boolean;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, isGroup }) => {
  const deleteAlarmMutation = useDeleteAlarm();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      deleteAlarmMutation.mutate({ alarmId: alarm.id });
    } catch (err) {
      console.error("Error in deleting alarm", err);
    }
  };

  const { data: user, isLoading } = useUserById(alarm.userId);
  const hour = parseInt(alarm?.time.substring(0, 2));
  const min = alarm?.time.substring(2, 5);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const parsedTime = `${formattedHour}${min} ${ampm}`;

  if (isLoading) return <div className="text-gray-500 p-4">Loading...</div>;

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
      key={alarm.id || Math.random()}
    >
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white mb-2">
          {alarm?.name || "Unnamed Alarm"}
        </h3>
        {isGroup && (
          <p className="text-gray-300">
            👤 {user?.firstName || "Unknown User"}
          </p>
        )}
        <div className="flex justify-between items-center">
          <p className="text-gray-400">⏰ {parsedTime || "Unknown Time"}</p>
          {!isGroup && (
            <DeleteIcon
              sx={{
                color: "#ffffff",
                cursor: "pointer",
                "&:hover": {
                  color: "#ff6b6b",
                },
              }}
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;

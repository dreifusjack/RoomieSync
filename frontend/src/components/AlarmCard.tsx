import { useDeleteAlarm } from "@/hooks/alarms.hooks";
import { useUserById } from "@/hooks/users.hooks";
import styles from "@/styles/Feature.module.css";
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

  const { data: user, isLoading, error } = useUserById(alarm.userId);
  const hour = parseInt(alarm?.time.substring(0, 2));
  const min = alarm?.time.substring(2, 5);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12;
  const parsedTime = `${formattedHour}${min} ${ampm}`;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  // test
  return (
    <div className={styles.alarmList}>
      <div className={styles.alarmCard} key={alarm.id || Math.random()}>
        <div className={styles.alarmInfo}>
          <h3 className={styles.alarmName}>{alarm?.name || "Unnamed Alarm"}</h3>
          {isGroup && (
            <p className={styles.alarmUser}>
              👤 {user?.firstName || "Unknown User"}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={styles.alarmTime}>
              ⏰ {parsedTime || "Unknown Time"}
            </p>
            {!isGroup && (
              <DeleteIcon
                sx={{
                  color: "#ffffff",
                  cursor: "pointer",
                }}
                onClick={handleDelete}
              ></DeleteIcon>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;

import { useUserById } from "@/hooks/UserHooks";
import styles from "@/styles/Feature.module.css";
import { Alarm } from "@/types/alarm-types";
import DeleteIcon from "@mui/icons-material/Delete";

interface AlarmCardProps {
  alarm: Alarm;
  deleteAlarm: (alarm_id: string) => Promise<any>;
  onDeleted: () => void;
  isGroup?: boolean;
}

const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  deleteAlarm,
  onDeleted,
  isGroup,
}) => {
  const { userName, loading, error } = useUserById(alarm.userId);
  const hour = parseInt(alarm?.time.substring(0, 2));
  const min = alarm?.time.substring(2, 5);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12;
  const parsedTime = `${formattedHour}${min} ${ampm}`;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className={styles.alarmList}>
      <div className={styles.alarmCard} key={alarm.id || Math.random()}>
        <div className={styles.alarmInfo}>
          <h3 className={styles.alarmName}>{alarm?.name || "Unnamed Alarm"}</h3>
          {isGroup && (
            <p className={styles.alarmUser}>👤 {userName || "Unknown User"}</p>
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
                onClick={() => {
                  deleteAlarm(alarm.id);
                  onDeleted();
                }}
              ></DeleteIcon>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;

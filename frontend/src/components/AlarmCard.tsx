import { useUserById } from "@/hooks/UserHooks";
import styles from "@/styles/Explore.module.css";

interface AlarmCardProps {
  alarm: Alarm;
  isGroup?: boolean;
}

interface Alarm {
  id: string;
  user_id: string;
  name: string;
  time: string;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, isGroup }) => {
  const { userName, loading, error } = useUserById(alarm.user_id);
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
          <p className={styles.alarmTime}>⏰ {parsedTime || "Unknown Time"}</p>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;

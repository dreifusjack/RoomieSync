import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styles from '@/styles/Explore.module.css';
import "./styles.css";

type Alarm = {
    id: string;
    time: string;
    name: string;
    user_id: string;
};
type User = {
    id: string;
    group_id: string;
    name: string;
    email: string;
};
const BASE_URL = 'http://127.0.0.1:3000';

export const fetchUserDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user details');
    }

    return await response.json();
};

function AlarmsPage() {
    const [newAlarmName, setNewAlarmName] = useState('');
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [userAlarms, setUserAlarms] = useState<Alarm[]>([]);
    const [groupAlarms, setGroupAlarms] = useState<Alarm[]>([]);
    const [user, setUser] = useState({} as User);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user details
                const userData = await fetchUserDetails();
                setUser(userData);

                // Fetch user's own alarms
                const userAlarmsResponse = await fetch(`${BASE_URL}/alarm/user/${userData.id}`);
                const userAlarmsData = await userAlarmsResponse.json();
                setUserAlarms(userAlarmsData);

                // Fetch alarms for the user's group
                const groupAlarmsResponse = await fetch(`${BASE_URL}/alarm/groups/${userData.group_id}`);
                const groupAlarmsData = await groupAlarmsResponse.json();
                setGroupAlarms(groupAlarmsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCreateAlarm = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newAlarm = {
            time: newAlarmTime,
            name: newAlarmName,
        };

        fetch(`${BASE_URL}/alarm/user/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAlarm),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                // Add the new alarm to the user's alarms
                if (data[0]) {
                    setUserAlarms([...userAlarms, data[0]]);
                    setGroupAlarms([...groupAlarms, data[0]]);
                }

                // Reset the form
                setNewAlarmName('');
                setNewAlarmTime('');
            })
            .catch((error) => console.error('Error creating alarm:', error));
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>Alarms</h1>

                <h2 className={styles.subheading}>Create New Alarm</h2>
                <form className={styles.form} onSubmit={handleCreateAlarm}>
                    <div>
                        <label className={styles.label}>
                            Alarm Name:
                            <input
                                className={styles.input}
                                type="text"
                                value={newAlarmName}
                                onChange={(e) => setNewAlarmName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Alarm Time:
                            <input
                                className={styles.input}
                                type="time"
                                value={newAlarmTime}
                                onChange={(e) => setNewAlarmTime(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button className={styles.button} type="submit">Create Alarm</button>
                </form>

                <h2 className={styles.subheading}>Your Alarms</h2>
                <div className={styles.alarmList}>
                    {(Array.isArray(userAlarms) ? userAlarms : []).map((alarm) => (
                        <div className={styles.alarmCard} key={alarm.id || Math.random()}>
                            <div className={styles.alarmInfo}>
                                <h3 className={styles.alarmName}>{alarm?.name || "Unnamed Alarm"}</h3>
                                <p className={styles.alarmTime}>⏰ {alarm?.time || "Unknown Time"}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className={styles.subheading}>Group Alarms</h2>
                <div className={styles.alarmList}>
                    {(Array.isArray(groupAlarms) ? groupAlarms : []).map((alarm) => (
                        <div className={styles.alarmCard} key={alarm.id || Math.random()}>
                            <div className={styles.alarmInfo}>
                                <h3 className={styles.alarmName}>{alarm?.name || "Unnamed Alarm"}</h3>
                                <p className={styles.alarmTime}>⏰ {alarm?.time || "Unknown Time"}</p>
                                <p className={styles.alarmUser}>👤 Created by User ID: {alarm?.user_id || "Unknown User"}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default AlarmsPage;
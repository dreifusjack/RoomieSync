import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Explore.module.css';

type Alarm = {
    id: string;
    time: string;
    name: string;
    user_id: string;
};
type User = {
    id: string;
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

export const fetchUserGroups = async (userId: string) => {
    const response = await fetch(`${BASE_URL}/group/user/${userId}`);
    return await response.json();
}

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

                // Fetch group IDs from user data
                const groupIds = userData.groupIds || []; // Ensure groupIds is an array

                // Fetch alarms for each group the user belongs to
                const groupsAlarms = await Promise.all(
                    groupIds.map(async (groupId: number) => {
                        const response = await fetch(`${BASE_URL}/alarm/groups/${groupId}`);
                        const data = await response.json();
                        return data.alarms || [];
                    })
                );

                const allGroupAlarms = groupsAlarms.flat();
                setGroupAlarms(allGroupAlarms);
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
                setUserAlarms([...userAlarms, data[0]]);

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
                <h1>Alarms</h1>

                <h2>Create New Alarm</h2>
                <form onSubmit={handleCreateAlarm}>
                    <div>
                        <label>
                            Alarm Name:
                            <input
                                type="text"
                                value={newAlarmName}
                                onChange={(e) => setNewAlarmName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Alarm Time:
                            <input
                                type="time"
                                value={newAlarmTime}
                                onChange={(e) => setNewAlarmTime(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">Create Alarm</button>
                </form>

                <h2>Your Alarms</h2>
                <ul>
                    {(userAlarms || [] as Alarm[]).map((alarm) => (
                        <li key={alarm?.id || ""}>
                            {alarm?.name || "Unnamed Alarm"} at {alarm?.time || "Unknown Time"}
                        </li>
                    ))}
                </ul>

                <h2>Group Alarms</h2>
                <ul>
                    {(groupAlarms || [] as Alarm[]).map((alarm) => (
                        <li key={alarm?.id || ""}>
                            {alarm?.name || "Unnamed Alarm"} at {alarm?.time || "Unknown Time"} by {alarm?.user_id || "Unknown User"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AlarmsPage;
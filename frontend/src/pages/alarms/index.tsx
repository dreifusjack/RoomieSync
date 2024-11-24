import React, { useState, useEffect } from 'react';

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

function AlarmsPage() {
    const [newAlarmName, setNewAlarmName] = useState('');
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [userAlarms, setUserAlarms] = useState([] as Alarm[]);
    const [groupAlarms, setGroupAlarms] = useState([] as Alarm[]);
    const [user, setUser] = useState({} as User);

    useEffect(() => {
        // Fetch user details
        fetchUserDetails()
            .then((data) => setUser(data))
            .catch((error) => console.error('Error fetching user details:', error));

        // Fetch user's own alarms
        fetch(`${BASE_URL}/alarm/user/${user.id}`)
            .then((response) => response.json())
            .then((data) => setUserAlarms(data))
            .catch((error) => console.error('Error fetching user alarms:', error));

        // Fetch alarms for each group the user belongs to
        Promise.all(
            groupIds.map((groupId) =>
                fetch(`/alarm/groups/${groupId}`)
                    .then((response) => response.json())
                    .then((data) => data.alarms || [])
            )
        )
            .then((groupsAlarms) => {
                const allGroupAlarms = groupsAlarms.flat();
                setGroupAlarms(allGroupAlarms);
            })
            .catch((error) => console.error('Error fetching group alarms:', error));
    }, []);

    const handleCreateAlarm = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newAlarm = {
            time: newAlarmTime,
            name: newAlarmName,
        };

        fetch(`${BASE_URL}/alarm/user/${userId}`, {
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
        <div>
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
                {(userAlarms || []).map((alarm) => (
                    <li key={alarm?.id || ""}>
                        {alarm?.name || "Unnamed Alarm"} at {alarm?.time || "Unknown Time"}
                    </li>
                ))}
            </ul>

            <h2>Group Alarms</h2>
            <ul>
                {(groupAlarms || []).map((alarm) => (
                    <li key={alarm?.id || ""}>
                        {alarm?.name || "Unnamed Alarm"} at {alarm?.time || "Unknown Time"} by {alarm?.user_id || "Unknown User"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AlarmsPage;
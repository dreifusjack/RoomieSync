import React, { useEffect, useState } from "react";
import axios from "axios";
import ChoresList from "@/components/ChoresList";
import AssignChoreForm from "@/components/AssignChoreForm";
import CreateChoreForm from "@/components/CreateChoreForm";

interface Chore {
  id: string;
  groupId: string;
  name: string;
  description: string;
  cadence: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
}

interface ChoresPageProps {
  groupId: string;
}

const ChoresPage: React.FC<ChoresPageProps> = ({ groupId }) => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    try {
      // Fetch chores for the current group
      const choresResponse = await axios.get<Chore[]>(
        `/chore/group/${groupId}`
      );
      const choresData = choresResponse.data;

      // TODO: create endpoint to fetch users from group

      // Set the state with the fetched data
      setChores(choresData);
      // setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const remindUser = async (choreId: string) => {
    try {
      await axios.post(`/chore/${choreId}/reminder`);
      alert("Reminder sent successfully!");
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  const deleteChore = async (choreId: string) => {
    try {
      await axios.delete(`/chore/${choreId}`);
      alert("Chore deleted successfully!");
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Error deleting chore:", error);
    }
  };

  useEffect(() => {
    const mockChores: Chore[] = [
      {
        id: "1",
        groupId: groupId,
        name: "Vacuum the living room",
        description: "Vacuum the carpet and mop the floor.",
        cadence: "Weekly",
        createdAt: "11/24/2024",
        updatedAt: "11/24/2024",
      },
      {
        id: "2",
        groupId: groupId,
        name: "Take out the trash",
        description: "Empty all trash bins and take the bags to the curb.",
        cadence: "Weekly",
        createdAt: "11/24/2024",
        updatedAt: "11/24/2024",
      },
    ];
    setChores(mockChores);

    const mockUsers: User[] = [
      {
        id: "1",
        name: "Jack",
      },
    ];
    setUsers(mockUsers);
  }, []);

  return (
    <div className="chores-page">
      <h1>Chores</h1>
      <ChoresList
        chores={chores}
        onRemindUser={remindUser}
        onDeletedChore={deleteChore}
      />
      <CreateChoreForm groupId={groupId} onChoreCreated={fetchData} />
      <AssignChoreForm
        chores={chores}
        users={users}
        onChoreAssigned={fetchData}
      />
    </div>
  );
};

export default ChoresPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import ChoresList from "@/components/ChoresList";
import AssignChoreForm from "@/components/AssignChoreForm";

interface Chore {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

interface User {
  id: string;
  name: string;
}

const ChoresPage: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    // need to fetch users in the group and chores in the group
    // set them to corresponding consts
  };

  useEffect(() => {
    fetchData();
  });

  const remindUser = (choreId: string) => {
    // logic for sending reminder
  };

  const deleteChore = (choreId: string) => {
    // logic for deleting chore
  };

  const assignChore = () => {
    // logic for assign chore
  };

  useEffect(() => {
    const mockChores: Chore[] = [
      {
        id: "1",
        name: "Vacuum the living room",
        description: "Vacuum the carpet and mop the floor.",
        assignedTo: "Alice",
        dueDate: "2024-11-25",
      },
      {
        id: "2",
        name: "Take out the trash",
        description: "Empty all trash bins and take the bags to the curb.",
        assignedTo: "Bob",
        dueDate: "2024-11-26",
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
        remindUserFunc={remindUser}
        deleteChoreFunc={deleteChore}
      />
      <AssignChoreForm
        chores={chores}
        users={users}
        assignChoreFunc={fetchData}
      />
    </div>
  );
};

export default ChoresPage;

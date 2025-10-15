import React, { useState } from "react";
import { User } from "@/types/user-types";
import { useAssignChore } from "@/hooks/chores.hooks";
import { Chore } from "@/types/chore-types";

interface AssignChoreFormProps {
  chore: Chore;
  users: User[];
  onChoreAssigned: () => void;
}

const AssignChoreForm: React.FC<AssignChoreFormProps> = ({
  chore,
  users,
  onChoreAssigned,
}) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");

  const assignChoreMutation = useAssignChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dueDateISO = new Date(selectedDueDate).toISOString();

    assignChoreMutation.mutate(
      {
        choreId: chore.id,
        payload: { userId: selectedUser, dueDate: dueDateISO },
      },
      {
        onSuccess: () => {
          onChoreAssigned();
          setSelectedUser("");
          setSelectedDueDate("");
        },
        onError: (error) => {
          console.error("Error assigning chore:", error);
        },
      }
    );
  };

  return (
    <div className="w-96 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {assignChoreMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {assignChoreMutation.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 appearance-none"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName + " " + user.lastName}
              </option>
            ))}
          </select>
          <label
            htmlFor="user"
            className="absolute left-4 top-3 text-gray-500 text-sm transition-all duration-200 pointer-events-none"
          >
            User
          </label>
        </div>

        <div className="relative">
          <input
            type="date"
            id="dueDate"
            value={selectedDueDate}
            onChange={(e) => setSelectedDueDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
          />
          <label
            htmlFor="dueDate"
            className="absolute left-4 top-3 text-gray-500 text-sm transition-all duration-200 pointer-events-none"
          >
            Due Date
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={assignChoreMutation.isPending}
        >
          {assignChoreMutation.isPending ? "Assigning..." : "Assign Chore"}
        </button>
      </form>
    </div>
  );
};

export default AssignChoreForm;

import React, { useState } from "react";
import { useCreateChore } from "@/hooks/chores.hooks";

interface CreateChoreFormProps {
  onChoreCreated: () => void;
}

const CreateChoreForm: React.FC<CreateChoreFormProps> = ({
  onChoreCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cadence, setCadence] = useState("");
  const createChoreMutation = useCreateChore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createChoreMutation.mutate(
      {
        name,
        description,
        cadence,
      },
      {
        onSuccess: () => {
          onChoreCreated();
          setName("");
          setDescription("");
          setCadence("");
        },
        onError: (error) => {
          console.error("Error creating chore:", error);
        },
      }
    );
  };

  return (
    <div className="w-96 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {createChoreMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {createChoreMutation.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
            placeholder="Chore Name"
          />
          <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
            Chore Name
          </label>
        </div>

        <div className="relative">
          <textarea
            id="description"
            className="peer w-full px-4 py-3 pt-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Description"
          />
          <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600">
            Description
          </label>
        </div>

        <div className="relative">
          <input
            id="cadence"
            type="text"
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
            value={cadence}
            onChange={(e) => setCadence(e.target.value)}
            required
            placeholder="Cadence"
          />
          <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
            Cadence
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Create Chore
        </button>
      </form>
    </div>
  );
};

export default CreateChoreForm;

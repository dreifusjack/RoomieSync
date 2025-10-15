import React, { useState } from "react";
import { useCreateAlarm } from "@/hooks/alarms.hooks";

interface CreateAlarmFormProps {
  onAlarmCreated: () => void;
}

const CreateAlarmForm: React.FC<CreateAlarmFormProps> = ({
  onAlarmCreated,
}) => {
  const [alarmName, setAlarmName] = useState("");
  const [alarmTime, setAlarmTime] = useState("");
  const createAlarmMutation = useCreateAlarm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(alarmTime);
    try {
      createAlarmMutation.mutate({
        payload: { name: alarmName, time: alarmTime },
      });
      onAlarmCreated();
      setAlarmName("");
      setAlarmTime("");
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };

  const error = createAlarmMutation.error;

  return (
    <div className="w-96 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error.message}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
            required
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
            placeholder="Alarm Name"
          />
          <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
            Alarm Name
          </label>
        </div>

        <div className="relative">
          <input
            type="time"
            id="alarmTime"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            required
            className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
            placeholder="Alarm Time"
          />
          <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
            Alarm Time
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateAlarmForm;

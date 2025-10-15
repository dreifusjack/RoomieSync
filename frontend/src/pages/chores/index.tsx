import React, { useState } from "react";
import ChoresList from "@/components/ChoresList/ChoresList";
import CreateChoreForm from "@/components/CreateChoreForm";
import Sidebar from "@/components/Sidebar";
import CustomModal from "@/components/Modal";
import { Chore } from "@/types/chore-types";
import {
  useGroupChores,
  useSendReminder,
  useDeleteChore,
} from "@/hooks/chores.hooks";

const ChoresPage: React.FC = () => {
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { data: groupChores, isLoading, isError } = useGroupChores();
  const { mutate: sendReminder } = useSendReminder();
  const { mutate: deleteChore } = useDeleteChore();

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-28 p-4 md:p-8 pt-20 md:pt-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error fetching user chores
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !groupChores) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-28 p-4 md:p-8 pt-20 md:pt-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading chores...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-28 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Chores
              </h1>
              <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm"
              onClick={() => setCreateFormVisible(true)}
            >
              Create New Chore
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <ChoresList
              chores={groupChores}
              onRemindUser={sendReminder}
              onDeletedChore={deleteChore}
            />
          </div>

          <CustomModal
            form={
              <CreateChoreForm
                onChoreCreated={() => {
                  setCreateFormVisible(false);
                }}
              />
            }
            open={isCreateFormVisible}
            onClose={() => setCreateFormVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChoresPage;

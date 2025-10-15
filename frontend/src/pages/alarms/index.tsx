import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import AlarmCard from "@/components/AlarmCard";
import CreateAlarmForm from "@/components/CreateAlarmForm";
import CustomModal from "@/components/Modal";
import { useGroupAlarms, useUserAlarms } from "@/hooks/alarms.hooks";
import { useCurrentUser } from "@/hooks/auth.hooks";

function AlarmsPage() {
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { data: groupAlarms, isLoading: groupAlarmsLoading } = useGroupAlarms(
    user?.groupId || ""
  );

  const roomateAlarms = groupAlarms?.filter(
    (alarm) => alarm.userId != user?.id
  );

  const { data: userAlarms, isLoading: userAlarmsLoading } = useUserAlarms();

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-28 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading user data...</span>
          </div>
        </div>
      </div>
    );
  }

  const loading = userAlarmsLoading || groupAlarmsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-28 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading alarms...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-28 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alarms</h1>
              <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm"
              onClick={() => setCreateFormVisible(true)}
            >
              Create New Alarm
            </button>
          </div>

          {/* Your Alarms */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Alarms
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {Array.isArray(userAlarms) && userAlarms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                  {userAlarms.map((alarm) => (
                    <AlarmCard key={alarm.id} alarm={alarm} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No personal alarms set
                </p>
              )}
            </div>
          </div>

          {/* Group Alarms */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Roommate Alarms
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {Array.isArray(roomateAlarms) && roomateAlarms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                  {roomateAlarms.map((alarm) => (
                    <AlarmCard key={alarm.id} alarm={alarm} isGroup={true} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No roommate alarms set
                </p>
              )}
            </div>
          </div>

          <CustomModal
            form={
              <CreateAlarmForm
                onAlarmCreated={() => {
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
}

export default AlarmsPage;

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/auth.hooks";
import { useCreateGroup, useJoinGroup } from "@/hooks/groups.hooks";

const LandingPage: React.FC = () => {
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showGroupCode, setShowGroupCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdGroupCode, setCreatedGroupCode] = useState("");

  const router = useRouter();

  // current user + group hooks
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const createGroupMutation = useCreateGroup();
  const joinGroupMutation = useJoinGroup();

  const loading = createGroupMutation.isPending || joinGroupMutation.isPending;
  const error =
    createGroupMutation.error?.message ||
    joinGroupMutation.error?.message ||
    null;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
            Error loading user data. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isCreating) {
        const result = await createGroupMutation.mutateAsync(groupName);
        if (result?.groupCode) {
          setCreatedGroupCode(result.groupCode);
          setShowGroupCode(true);
        }
      } else {
        await joinGroupMutation.mutateAsync(groupCode);
        handleContinue();
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(createdGroupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleContinue = () => {
    router.push("/alarms");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {showGroupCode ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Group Created Successfully!
                </h2>
                <p className="text-gray-600">
                  Share this code with your roommates:
                </p>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={createdGroupCode}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-center text-lg font-mono text-gray-900"
                  />
                </div>
                <button
                  onClick={handleCopyCode}
                  className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to RoomieSync, {user.firstName}!
                </h2>
                <p className="text-gray-600">
                  {isCreating ? "Create a new group" : "Join an existing group"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {isCreating ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                      className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
                      placeholder="Group Name"
                    />
                    <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
                      Group Name
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      required
                      className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-transparent"
                      placeholder="Group Code"
                    />
                    <label className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600">
                      Group Code
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : isCreating
                    ? "Create Group"
                    : "Join Group"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreating(!isCreating)}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  {isCreating
                    ? "Join an existing group instead?"
                    : "Need to create a new group?"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

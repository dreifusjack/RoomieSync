import { 
  createChore, 
  assignChore, 
  getChores, 
  getAssignments, 
  deleteChore, 
  sendReminder,
  CreateChoreRequestPayload,
  AssignChoreRequestPayload,
} from "@/apis/chores.api"
import { Chore, ChoreAssignment } from "@/types/chore-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateChore = () => {
  const queryClient = useQueryClient();

  return useMutation<Chore, Error, { groupId: string; payload: CreateChoreRequestPayload }>({
    mutationFn: async ({ groupId, payload }) => {
      const { data } = await createChore(groupId, payload);
      return data;
    },
    onSuccess: (chore, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['chores', groupId] });
      queryClient.setQueryData(['chores', chore.id], chore);
    }
  });
};

export const useAssignChore = () => {
  const queryClient = useQueryClient();

  return useMutation<ChoreAssignment, Error, { choreId: string; payload: AssignChoreRequestPayload }>({
    mutationFn: async ({ choreId, payload }) => {
      const { data } = await assignChore(choreId, payload);
      return data;
    },
    onSuccess: ({ choreId }) => {
      queryClient.invalidateQueries({ queryKey: ['choreAssignments', choreId] });
    }
  });
};

export const useAllChores = (groupId: string) => {
  return useQuery<Chore[], Error>({
    queryKey: ['chores', groupId],
    queryFn: async () => {
      const { data } = await getChores(groupId);
      return data;
    },
    enabled: !!groupId, // Only run if groupId exists
  });
};

export const useChoreAssignments = (choreId: string) => {
  return useQuery<ChoreAssignment[], Error>({
    queryKey: ['choreAssignments', choreId],
    queryFn: async () => {
      const { data } = await getAssignments(choreId);
      return data;
    },
    enabled: !!choreId, // Only run if choreId exists
  });
};

export const useDeleteChore = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, { choreId: string; groupId: string }>({
    mutationFn: async ({ choreId }) => {
      const { data } = await deleteChore(choreId);
      return data;
    },
    onSuccess: (message, { choreId, groupId }) => {
      queryClient.removeQueries({ queryKey: ['chores', choreId] });
      queryClient.invalidateQueries({ queryKey: ['chores', groupId] });
      queryClient.removeQueries({ queryKey: ['choreAssignments', choreId] });
    }
  });
};

export const useSendReminder = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (choreId: string) => {
      const { data } = await sendReminder(choreId);
      return data;
    },
    onSuccess: (message) => {
      console.log('Reminder sent:', message);
    }
  });
};
import { createAlarm, CreateAlarmPayload, deleteAlarm, getGroupAlarms, getUserAlarms } from "@/apis/alarms.api";
import { Alarm } from "@/types/alarm-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateAlarm = () => {
  const queryClient = useQueryClient();

  return useMutation<Alarm, Error, { payload: CreateAlarmPayload}>({
    mutationFn: async ({ payload }) => {
      const { data } = await createAlarm(payload)
      return data;
    },
    onSuccess: (alarm) => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
      queryClient.invalidateQueries({ queryKey: ['user-alarms'] });
      queryClient.invalidateQueries({ queryKey: ['group-alarms'] });
    }
  })
}

export const useGroupAlarms = (groupId: string) => {
  return useQuery<Alarm[], Error>({
    queryKey: ['group-alarms', groupId], 
    queryFn: async () => {
      const { data } = await getGroupAlarms(groupId)
      return data;
    },
    enabled: !!groupId // Only run query if groupId exists
  })
} 

export const useUserAlarms = () => {
  return useQuery<Alarm[], Error>({
    queryKey: ['user-alarms'],
    queryFn: async () => {
      const { data } = await getUserAlarms()
      return data;
    }
  })
}

export const useDeleteAlarm = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { alarmId: string}>({
    mutationFn: async ({alarmId}) => {
      await deleteAlarm(alarmId);
    },
    onSuccess: (_, { alarmId }) => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
      queryClient.invalidateQueries({ queryKey: ['user-alarms'] });
      queryClient.invalidateQueries({ queryKey: ['group-alarms'] });
    }
  })
}
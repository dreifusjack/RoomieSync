import { createGroup, getAllGroups, getGroupById, getGroupUsers, joinGroup } from "@/apis/groups.api"
import { Group } from "@/types/group-types"
import { User } from "@/types/user-types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation<Group, Error, string>({
    mutationFn: async (groupName: string) => {
      const { data } = await createGroup(groupName)
      return data
    },
    onSuccess: (group) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.setQueryData(['groups'], group);
    }
  })
}

export const useJoinGroup = () => {
  const queryClient = useQueryClient()

  return useMutation<Group, Error, string>({
    mutationFn: async (groupCode: string) => {
      const { data } = await joinGroup(groupCode)
      return data 
    },
    onSuccess: (group) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.setQueryData(['groups'], group)
    }
  })
}

export const useGroupById = (id: string) => {
  return useQuery<Group, Error>({
    queryKey: ['groups', id],
    queryFn: async () => {
      const { data } = await getGroupById(id)
      return data
    }
  })
}

export const useAllGroups = () => {
  return useQuery<Group[], Error>({
    queryKey: ['groups'],
    queryFn: async () => {
      const {data } = await getAllGroups()
      return data
    }
  })
}

export const useGroupUsers = (id: string) => {
  return useQuery<User[], Error>({
    queryKey: ['groups', id],
    queryFn: async () => {
      const { data } = await getGroupUsers(id)
      return data
    }
  })
}
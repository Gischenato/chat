import { useQuery } from '@tanstack/react-query'
import { findUser } from '@util/api/users/findUser'
import IChat from '@interfaces/IChat'
import IUser from '@interfaces/IUser'

export const useFetchUser = (chat:IChat, user:IUser) => {
    const recipientId = chat.members.find((id) => id !== user._id)

    const query = useQuery<{_id: string, name:string}>({
        queryKey: ['chat', user._id, chat._id],
        queryFn: () => findUser(recipientId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    return {
        data: query.data,
        isLoading: query.isLoading,
        status: query.status
    }
}
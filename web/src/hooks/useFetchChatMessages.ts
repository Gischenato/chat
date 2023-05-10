import { useQuery } from '@tanstack/react-query'
import { getChat } from '@util/api/chats/getUserChat'

export const useFetchChat = (chatId: string | undefined) => {
    const query = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () => getChat(chatId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    return {
        data: query.data,
        isLoading: query.isLoading,
        status: query.status
    }
}
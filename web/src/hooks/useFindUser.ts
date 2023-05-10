import IUser from '@interfaces/IUser'
import { useQuery } from '@tanstack/react-query'
import { findUser } from '@util/api/users/findUser'

export const useFindUser = (userId: string | undefined) => {
    const query = useQuery<IUser>({
        queryKey: ['otherUser', userId],
        queryFn: () => findUser(userId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    return {
        data: query.data,
        isLoading: query.isLoading,
        status: query.status
    }
}
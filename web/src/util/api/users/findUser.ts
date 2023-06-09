import axios from 'axios'
import { baseUrl } from '@util/services'

export const findUser = async (userId?: string) => {
    const response = await axios.get(`${baseUrl}/users/find/${userId}`)
    return response.data
}
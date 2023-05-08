import axios from 'axios'
import { baseUrl } from '../../services'

export const getAllUsers = async () => {
    const response = await axios.get(`${baseUrl}/users/all`)
    return response.data
}
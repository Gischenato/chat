import axios, { AxiosError } from 'axios'
import IRegister from '../../../interfaces/IRegister'
import { baseUrl } from '../../services'

export const register = async ({name, password}: IRegister) => {
    const response = await axios.post(`${baseUrl}/users/register`, {
        name,
        password,
    })
    return response.data
}
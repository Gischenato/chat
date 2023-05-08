import axios from "axios";
import { baseUrl } from "../../services";

export const refresh = async ({id}: {id: string}) => {
    const response = await axios.post(`${baseUrl}/auth/refresh`, {
        id
    });
    return response.data;
};
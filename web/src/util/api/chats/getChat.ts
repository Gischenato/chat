import axios from "axios";
import { baseUrl } from "@util/services";

export const getChat = async (chatId: string) => {
    const response = await axios.get(`${baseUrl}/chat/${chatId}`);
    return response.data;
};
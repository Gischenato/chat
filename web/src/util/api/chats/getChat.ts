import axios from "axios";
import { baseUrl } from "@util/services";
import IGetChatResponse from "@interfaces/IGetChatResponse";

export const getChat = async (chatId: string) => {
    const response = await axios.get<IGetChatResponse>(`${baseUrl}/chat/${chatId}`);
    return response.data;
};
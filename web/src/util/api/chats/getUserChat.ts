import axios from "axios";
import { baseUrl } from "@util/services";
import IgetUserChatsResponse from "@interfaces/IGetUserChatsResponse";

export const getChat = async (chatId: string | undefined) => {
    const response = await axios.get<IgetUserChatsResponse>(`${baseUrl}/chat/${chatId}`);
    return response.data;
};
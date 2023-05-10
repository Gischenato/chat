import axios from "axios";
import { baseUrl } from "@util/services";
import IGetMessagesResponse from "@interfaces/IGetMessagesResponse";

export const getMessages = async (chatId: string | undefined) => {
    const response = await axios.get<IGetMessagesResponse>(`${baseUrl}/messages/${chatId}`);
    return response.data;
}

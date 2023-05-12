import axios from "axios";
import { baseUrl } from "@util/services";
import IGetMessagesResponse from "@interfaces/IGetMessagesResponse";

export const getMessages = async (chatId: string | undefined, page:number) => {
    const response = await axios.get<IGetMessagesResponse>(`${baseUrl}/messages/${chatId}/${page}`);
    return response.data;
}

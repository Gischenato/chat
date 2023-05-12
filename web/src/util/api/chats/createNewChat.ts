import axios from "axios";
import { baseUrl } from "@util/services";
import IPostNewChat from "@interfaces/IPostNewChat";
import IPostNewChatResponse from "@interfaces/IPostNewChatResponse";

export const postNewChat = async (body: IPostNewChat) => {
    const response = await axios.post<IPostNewChatResponse>(`${baseUrl}/chat/create`, body);
    return response.data;
}
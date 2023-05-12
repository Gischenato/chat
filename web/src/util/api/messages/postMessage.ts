import axios from "axios";
import IPostMessage from "@interfaces/IPostMessage";
import IPostMessageResponse from "@interfaces/IPostMessageResponse";
import { baseUrl } from "@util/services";

export const postMessage = async (body: IPostMessage) => {
    const response = await axios.post<IPostMessageResponse>(`${baseUrl}/messages`, body);
    return response.data;
}
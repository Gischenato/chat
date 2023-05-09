import axios from "axios";
import { baseUrl } from "../../services";
import IPostNewChat from "../../../interfaces/IPostNewChat";

export const postNewChat = async (body: IPostNewChat) => {
    const response = await axios.post(`${baseUrl}/chat/create`, body);
    return response.data;
}

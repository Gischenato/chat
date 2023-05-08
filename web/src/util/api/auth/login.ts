import axios from "axios";
import { baseUrl } from "../../services";
import IRegister from "../../../interfaces/IRegister";

export const login = async ({name, password}: IRegister) => {
    const response = await axios.post(`${baseUrl}/auth/login`, {
        name,
        password
    });
    return response.data;
};
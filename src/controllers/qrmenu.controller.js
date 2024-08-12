import axios from "axios";
import { API } from "../config/config";

export async function getQRMenuInit(qrcode) {
    axios.defaults.withCredentials = true;
    try {
        const response = await axios.get(`${API}/qrmenu/${qrcode}`);
        return response;
    } catch (error) {
        throw error;
    }
}
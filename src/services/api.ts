import axios from "axios";
import { Location } from "../model/location";

const LOCATIONS_URL = import.meta.env.VITE_BACKEND_URL + '/locations';

export async function getLocations() {
    const url = LOCATIONS_URL;
    const response = await axios.get(url);


    return response.data as Array<Location>;

}

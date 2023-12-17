import axios from "axios";
// import {raiseFailure, raiseSuccess, Result} from '@mondopower/result-types'

const USERS_URL = import.meta.env.VITE_BACKEND_URL + "/users";

export async function get_user(): Promise<string> {
    const url = `${USERS_URL}`;
    const response = await axios.get(url);

    if(response.status > 299) {
        throw new Error(`Could Not find User, got error code: ${response.status}`);
    } else {
        return response.data;
    }
}

export async function subscribe_to_location_request(uuid: string): Promise<string> {
    const url = `${USERS_URL}/subscribe-location/${uuid}`;
    const response = await axios.patch(url);

    if (response.status > 299) {
        throw new Error(`Could not subscribe to location, got error code: ${response.status}`);
    } else {
        return "Subscribed to location!";
    }
}

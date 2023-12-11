import axios from "axios";

class LocationDto {
    uuid: string;
    topLeft: google.maps.LatLng;
    bottomRight: google.maps.LatLng;
    measurements: string;
}

const LOCATIONS_URL = import.meta.env.VITE_BACKEND_URL + '/locations';

export async function get_locations() {
    const url = LOCATIONS_URL;
    const response = await axios.get(url);
    return response.data as Array<Location>;
}

export async function get_location(location_uuid: string): Promise<LocationDto> {
    const url = `${LOCATIONS_URL}/${location_uuid}`;
    const response = await axios.get(url);
    return response.data as LocationDto;
}

export async function get_location_historical(location_uuid: string): Promise<string> {
    const url = `${LOCATIONS_URL}/${location_uuid}/historical`;
    const response = await axios.get(url);
    console.log(response.data);
    return "hello"
}

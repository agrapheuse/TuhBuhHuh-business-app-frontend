import axios from "axios";


export function add_access_token_to_auth_header(token: string | undefined) {
    if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else {
        remove_access_token_from_auth_header();
    }
}

export function remove_access_token_from_auth_header() {
    delete axios.defaults.headers.common['Authorization'];
}

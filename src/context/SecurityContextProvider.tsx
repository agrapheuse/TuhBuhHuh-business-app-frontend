import Keycloak from "keycloak-js"
import { Show, createEffect, createSignal } from "solid-js";
import {  add_access_token_to_auth_header, remove_access_token_from_auth_header } from "../services/auth";
import SecurityContext from "./securityContext";
import { jwtDecode } from "jwt-decode";

const keycloakConfig = {
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID
}
const keycloak: Keycloak = new Keycloak(keycloakConfig);

export default function SecurityContextProvider(props) {
    const [is_logged_in, set_is_logged_in] = createSignal(null);
    const [logged_in_user, set_logged_in_user] = createSignal('');

    createEffect(() => {
        try {
            keycloak.init({ onLoad: 'login-required' });
        } catch (error) {
            console.error("error : " + error);
        }
    });

    keycloak.onAuthSuccess = () => {
        add_access_token_to_auth_header(keycloak.token);
        set_logged_in_user(keycloak.idTokenParsed?.name);
        set_is_logged_in(true);
    }

    keycloak.onAuthLogout = () => {
        remove_access_token_from_auth_header();
    }
    keycloak.onAuthError = () => {
        remove_access_token_from_auth_header();
    }
    keycloak.onTokenExpired = () => {
        keycloak.updateToken(-1).then(function() {
            add_access_token_to_auth_header(keycloak.token);
            set_logged_in_user(keycloak.idTokenParsed?.name);
        });
    }

    function logout() {
        const logout_options = { redirectUri: import.meta.env.VITE_SOLID_APP_URL };
        keycloak.logout(logout_options);
    }
    function is_expired(token: string) {
        const decoded = jwtDecode(token);

        if(decoded.exp >= Date.now()){
            return true;
        }
        return false;
    }
    function is_authenticated() {
        if (keycloak.token) {
            return !is_expired(keycloak.token);
        }
        return false;
    }
    
    return (
        <>
            <Show when={is_logged_in()}>
                <SecurityContext.Provider
                    value={{
                        is_authenticated,
                        logged_in_user,
                        logout,
                    }}
                >
                    {props.children}
                </SecurityContext.Provider>
            </Show >
        </>
    )
}

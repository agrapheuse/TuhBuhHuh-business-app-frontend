import Keycloak from "keycloak-js"
import { Show, createEffect, createSignal } from "solid-js";
import { addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader } from "../services/auth";
import SecurityContext from "./securityContext";
import { jwtDecode } from "jwt-decode";

const keycloakConfig = {
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID
}
const keycloak: Keycloak = new Keycloak(keycloakConfig);

export default function SecurityContextProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = createSignal(null);
    const [loggedInUser, setLoggedInUser] = createSignal('');

    createEffect(() => {
        try {
            keycloak.init({ onLoad: 'login-required' });
        } catch (error) {
            console.error("error : " + error);
        }
    });

    keycloak.onAuthSuccess = () => {
        addAccessTokenToAuthHeader(keycloak.token);
        setLoggedInUser(keycloak.idTokenParsed?.name);
        setIsLoggedIn(true);
    }

    keycloak.onAuthLogout = () => {
        removeAccessTokenFromAuthHeader();
    }
    keycloak.onAuthError = () => {
        removeAccessTokenFromAuthHeader();
    }
    keycloak.onTokenExpired = () => {
        keycloak.updateToken(-1).then(function() {
            addAccessTokenToAuthHeader(keycloak.token);
            setLoggedInUser(keycloak.idTokenParsed?.name);
        });
    }

    function logout() {
        const logoutOptions = { redirectUri: import.meta.env.VITE_SOLID_APP_URL };
        keycloak.logout(logoutOptions);
    }
    function isExpired(token) {
        const decoded = jwtDecode(token);

        if(decoded.exp >= Date.now()){
            return true;
        }
        return false;
    }
    function isAuthenticated() {
        if (keycloak.token) {
            return !isExpired(keycloak.token);
        }
        return false;
    }
    
    return (
        <>
            <Show when={isLoggedIn()}>
                <SecurityContext.Provider
                    value={{
                        isAuthenticated,
                        loggedInUser,
                        logout,
                    }}
                >
                    {props.children}
                </SecurityContext.Provider>
            </Show >
        </>
    )
}

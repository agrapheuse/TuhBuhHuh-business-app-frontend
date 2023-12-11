import { Accessor, createContext } from "solid-js";


export interface ISecurityContext {
    is_authenticated: () => boolean;
    logged_in_user: Accessor<string> | undefined;
    logout: () => void;
}

export default createContext<ISecurityContext>({
    is_authenticated: () => false,
    logged_in_user: undefined,
    logout: () => {},
})

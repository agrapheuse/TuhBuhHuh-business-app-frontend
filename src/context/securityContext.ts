import { Accessor, createContext } from "solid-js";


export interface ISecurityContext {
    isAuthenticated: () => boolean;
    loggedInUser: Accessor<string> | undefined;
    logout: () => void;
}

export default createContext<ISecurityContext>({
    isAuthenticated: () => false,
    loggedInUser: undefined,
    logout: () => {},
})

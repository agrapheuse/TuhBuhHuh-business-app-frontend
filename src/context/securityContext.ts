import { createContext } from "solid-js";


export interface ISecurityContext {
    is_authenticated: () => boolean;
    logout: () => void;
}

export default createContext<ISecurityContext>({
    is_authenticated: () => false,
    logout: () => {},
})

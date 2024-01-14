import { useContext } from "solid-js";
import SecurityContext from '../context/securityContext';

export interface RouteGuardProps {
    component
}

export default function RouteGuard({component}: RouteGuardProps) {
    const { is_authenticated } = useContext(SecurityContext)

    if(is_authenticated()) {
        return component;
    } else {
        return ( <h1>Not Authenticated </h1> )
    }
}





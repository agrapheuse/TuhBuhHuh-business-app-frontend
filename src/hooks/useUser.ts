import { useContext } from "solid-js";
import SecurityContext from "../context/securityContext";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { subscribe_to_location_request } from "../services/api/user";


export function subscribe_to_location() {
    const { is_authenticated } = useContext(SecurityContext);
    const query_client = useQueryClient();

    return createMutation(() => ({
        mutationFn: (uuid: string) => {
            return subscribe_to_location_request(uuid)
        }
    }));
}

import { useContext } from "solid-js";
import SecurityContext from "../context/securityContext";
import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { get_user, subscribe_to_location_request } from "../services/api/user";

export function use_user() {
    const { is_authenticated } = useContext(SecurityContext);
    const query_client = useQueryClient();;

    return createQuery(() => ({
        queryKey: ['user'],
        queryFn: () =>  get_user(),
        enabled: is_authenticated(),
    }));
}

export function subscribe_to_location() {
    const { is_authenticated } = useContext(SecurityContext);
    const query_client = useQueryClient();

    return createMutation(() => ({
        mutationFn: (uuid: string) => {
            return subscribe_to_location_request(uuid)
        }
    }));
}


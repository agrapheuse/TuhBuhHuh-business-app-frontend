import { useContext } from "solid-js";
import SecurityContext from "../context/securityContext";
import {  createQuery, useQueryClient } from "@tanstack/solid-query";
import { get_location, get_location_historical, get_locations } from "../services/api/location";

export function use_locations() {
    const { is_authenticated } = useContext(SecurityContext);
    const query_client = useQueryClient();

    return createQuery(() => ({
        queryKey: ['locations'],
        queryFn: get_locations,
        enabled: is_authenticated(),
    }));
}


export function use_location(uuid: string) {
    const { is_authenticated } = useContext(SecurityContext);
    const query_client = useQueryClient();

    return createQuery(() => ({
        queryKey: [`location_${uuid}`],
        queryFn: () => get_location(uuid),
        enabled: is_authenticated(),
    }));
}

export function use_location_historical(uuid: string) {
    const { is_authenticated } = useContext(SecurityContext);
    const query_client = useQueryClient();

    return createQuery(() => ({
        queryKey: [`location_${uuid}_historical_${Math.random()}`],
        queryFn: () => get_location_historical(uuid),
        enabled: is_authenticated(),
    }));
}

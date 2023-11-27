import { useContext } from "solid-js";
import SecurityContext from "../context/securityContext";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { getLocations } from "../services/api";

export function useLocations() {
    const { isAuthenticated } = useContext(SecurityContext);
    const queryClient = useQueryClient();

    const {
        isLoading: isDoingGet,
        isError: isErrorGet,
        data: locations,
    } =  createQuery(() => ({
        queryKey: ['locations'],
        queryFn: getLocations,
        enabled: isAuthenticated(),
    }));

    return {
        isLoading: isDoingGet,
        isError: isErrorGet,
        locations
    }
}

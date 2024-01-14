import { Match, Show, Switch, useContext } from "solid-js";
import SecurityContext from '../context/securityContext';
import { Button, Separator } from "@kobalte/core";
import UserContext from "../context/userContext";
import { use_user } from "../hooks/useUser";

export function AuthHeader() {
    const { is_authenticated, logout } = useContext(SecurityContext);
    const userQuery = use_user();

    return (
        <Show when={is_authenticated() && userQuery.isSuccess}>
            <div class="flex justify-center gap-3">
                <NamePresentUser user={userQuery.data} />

                <Button.Root type="submit" onclick={logout}>
                    Log Out
                </Button.Root>
            </div>
        </Show >
    )
}

const NamePresentUser = ({ user }) => {
    return (
        <h1> Hello {user.firstName} {user.lastName}</h1>
    )
}

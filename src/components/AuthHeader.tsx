import { Match, Show, Switch, useContext } from "solid-js";
import SecurityContext from '../context/securityContext';
import { Button, Separator } from "@kobalte/core";

export function AuthHeader() {
    const { is_authenticated, logout, logged_in_user } = useContext(SecurityContext);
    return (
        <Show when={is_authenticated()}>
            <div class="flex justify-center gap-3">
                <Switch fallback={<NameMissingUser />}>
                    <Match when={logged_in_user()}>
                        <NamePresentUser user={logged_in_user()} />
                    </Match>
                </Switch>

                <Button.Root type="submit" onclick={logout}>
                    Log Out
                </Button.Root>
            </div>
        </Show>
    )
}



const NameMissingUser = () => {
    return (
        <h1> Welcome to our site! </h1>
    )
}

const NamePresentUser = ({ user }) => {
    return (
        <h1> Hello {user}</h1>
    )
}

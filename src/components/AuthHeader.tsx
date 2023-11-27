import { Show, useContext } from "solid-js";
import SecurityContext from '../context/securityContext';
import { Button, Separator } from "@kobalte/core";

export function AuthHeader() {
    const { isAuthenticated, logout, loggedInUser } = useContext(SecurityContext);
    return (
        <>
            {
                isAuthenticated() && 
                (
                    <>
                        <h1> Hello {loggedInUser()}</h1>
                        <Separator.Root class="separator" />
                        <Button.Root type="submit" onclick={logout}>
                            Log Out
                        </Button.Root>
                    </>
                )
            }
        </>
    )
}

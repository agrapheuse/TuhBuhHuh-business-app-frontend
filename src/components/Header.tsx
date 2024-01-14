import { Component } from "solid-js";
import { AuthHeader } from "./AuthHeader";
import { A, Link } from "@solidjs/router";


export const Header: Component = () => {
    return (
        <header class="
            z-20 mb-2 p-4 flex justify-between relative bg-white rounded-b-lg
        ">
            <nav class="flex justify-between gap-3">
                <A href="/">Map</A>
                <A href="/settings">Settings</A>
            </nav>
            <AuthHeader /> 
        </header>
    )
}

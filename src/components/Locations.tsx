import { For } from "solid-js";
import { use_locations } from "../hooks/useLocations";


export function Locations() {
    const { locations } = use_locations(); 
    return(
        <>
            <p>this is the Locations</p>
            <ul>
                <For each={locations}>{(location, i) =>
                    <li>
                        <p>{i() + 1}: {location.uuid}</p>
                    </li>
                }</For>
            </ul>
        </>
    ); 
    
}

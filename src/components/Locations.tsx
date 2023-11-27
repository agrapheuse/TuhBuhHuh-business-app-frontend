import { For } from "solid-js";
import { useLocations } from "../hooks/useLocations";


export function Locations() {
    const { locations } = useLocations(); 
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

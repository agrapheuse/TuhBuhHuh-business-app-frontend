import { Component, Context, Resource, Signal, createContext, createResource, createSignal, onMount, useContext } from "solid-js";
import { initMap } from "../services/map";
import { LocationView } from "./LocationView";
import { Grid, Location } from "../model/grid";

export const DataMapView: Component = () => {

    return (
        <div class="w-screen h-screen absolute top-0 left-0">
            <LocationViewControlProvider>
                <DataMap />
            </LocationViewControlProvider>
        </div>
    )
}

const LocationViewControlContext = createContext();

//INFO: This can be removed technically since its not beeing used
// but since it could be useful in the future im not deleting it
function LocationViewControlProvider(props) {
    const location_open_signal = createSignal(null as null|Location);


    return (
        <LocationViewControlContext.Provider value={
            location_open_signal
        }>
            {props.children}
        </LocationViewControlContext.Provider>
    );
}

export function useLocationViewControlContext(): Signal<null|Location> {
    return useContext(LocationViewControlContext) as Signal<null|Location>;
}



function DataMap() {

    const location_open_signal = useLocationViewControlContext();
    const [location_open, set_location_open] = location_open_signal;
    
    let controls: HTMLDivElement;
    let map: HTMLDivElement;

    let grid_resource: Resource<Grid>|undefined;

    const create_grid = async (): Promise<Grid> => {
        const grid = await initMap(map, controls);

        grid.set_on_clicks(set_location_open);

        return grid;
    };

    onMount(async () => {
        grid_resource = createResource(create_grid)[0];
    });

    return (<>
        <div ref={controls} class="absolute bottom-0 left-0 right-0 z-20">
            <GridControls />
        </div>
        <div
            classList={{ hidden: !location_open() }}
            class="
                    absolute top-0 left-0 h-full w-full bg-slate-700/50 z-10
                    flex justify-center items-center
                "
        >
            <div class="
                    flex justify-center items-center flex-col bg-white p-8 m-2
                    rounded-lg
                ">
                <LocationView location_signal={location_open_signal} />
            </div>
        </div>
        <div ref={map} class="z-0 h-full relative" />
    </>)
}


function GridControls() {

    return (<>
        <button
            type="button"
            id="jump-center-button"
            class="m-2 p-2 bg-white rounded-md text-md"
        >
            jump to center
        </button>
        <button
            type="button"
            id="change-color-button"
            class="m-2 p-2 bg-white rounded-md text-md"
        >
            change color
        </button>
    </>);
}

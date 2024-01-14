import axios from "axios";
import { Grid, Location } from "../model/grid";
import { Loader } from "@googlemaps/js-api-loader";

const LOCATIONS_URL = import.meta.env.VITE_BACKEND_URL + '/locations';

export async function initMap(
    container: HTMLDivElement,
    controls: HTMLDivElement
): Promise<Grid> {

    const loader = new Loader({
        apiKey: "AIzaSyCeYvglwV2frB_e8sTi4pVt1ZbncBko8L4",
        version: "weekly",
        libraries: []
    });
    const google_maps_lib = await loader.importLibrary('maps');
    const google_core_lib = await loader.importLibrary('core');


    const grid: Grid = await getGrid(google_maps_lib);

    const map_options: google.maps.MapOptions = {
        clickableIcons: false,
        disableDefaultUI: true,
        mapTypeId: "roadmap",
    };
    const map = new google_maps_lib.Map(container, map_options);
    map.fitBounds(new google_core_lib.LatLngBounds(grid.get_edges()));


    controls.querySelector("#jump-center-button").addEventListener("click", () => {
        map.fitBounds(new google_core_lib.LatLngBounds(grid.get_edges()));
    });

    controls.querySelector("#change-color-button").addEventListener("click", () => {
        grid.change_color("yellow");
    });

    grid.draw_rectangles(map);
    return grid;
}

async function getGrid(lib: google.maps.MapsLibrary): Promise<Grid> {
    const response = await axios.get(LOCATIONS_URL);
    const squares: Array<Location> = response.data
        .map((e) => new Location(
            e.uuid,
            e.bottomRight.lat,
            e.bottomRight.lng,
            e.topLeft.lat,
            e.topLeft.lng,
            e.subbed,
        ));

    let grid = new Grid(squares , lib)
    return grid;
}

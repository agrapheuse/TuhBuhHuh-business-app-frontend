import { For, Match, Show, Signal, Switch, createContext, createSignal, useContext } from "solid-js";
import { unsubscribe_from_location, update_threshold, use_user } from "../../hooks/useUser";
import { use_location } from "../../hooks/useLocations";
import { subscribe_to_location_request, unsubscribe_from_location_request } from "../../services/api/user";

export interface UserLocationsProps {
    locations: Array<Location>;
}

export function UserLocations({ locations }: UserLocationsProps) {
    console.log(locations);
    return (
        <div >
            <h1>Subscribed Locations</h1>
            <ul>
                <For each={locations}>{(location) =>
                    <li>
                        <UserLocation location={location.uuid} />
                    </li>
                }</For>
            </ul>
        </div>
    )
}

interface UserLocationsProp {
    location: string;
}

function UserLocation({ location }: UserLocationsProp) {
    const locationMutation = unsubscribe_from_location()
    const locationQuery = use_location(location);
    const valueTypes = ["TEMPERATURE", "HUMIDITY", "PM10", "PM25", "OZONE"];
    return (
        <Switch>
            <Match when={locationQuery.isSuccess} >
                <div
                    class="
                        flex rounded-lg max-w-75 bg-gray-50 border-2 
                        border-gray-800 m-10 p-5
                    ">
                    <div
                        class="
                            rounded-md bg-gray-800 w-16 h-16 rotate-45
                        ">
                        &nbsp;
                    </div>
                    <div
                        class="
                            p-5
                        ">
                        <p>{locationQuery.data.uuid}</p>
                        <div
                            class="
                                flex
                            ">
                            <Measurement
                                type="PM10"
                                measurement={locationQuery.data.measurements.PM10}
                            />
                            <Measurement
                                type="PM25"
                                measurement={locationQuery.data.measurements.PM25}
                            />
                            <Measurement
                                type="Ozone"
                                measurement={locationQuery.data.measurements.OZONE}
                            />
                        </div>
                    </div>
                    <div>
                        <button onclick={() => locationMutation.mutate(locationQuery.data.uuid)}>Unsubscribe</button>
                    </div>
                </div>
            </Match>
        </Switch>
    )
}

interface MeasurementProps {
    type: string;
    measurement: string;
}

function Measurement({ type, measurement }: MeasurementProps) {
    return (
        <div class="">
            <span class="px-5">{type}:</span>
            <span>{measurement}</span>
        </div>

    )
}

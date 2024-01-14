import { Match, Show, Signal, Switch, createEffect, createResource } from "solid-js";
import { use_location, use_location_historical, use_location_snapshot } from "../hooks/useLocations";
import { Location } from "../model/grid";
import { subscribe_to_location } from "../hooks/useUser";
import { CreateQueryResult } from "@tanstack/solid-query";
import { get_location_snapshot } from "../services/api/location";

interface LocationViewProps {
    location_signal: Signal<null | Location>
}

export function LocationView({ location_signal }: LocationViewProps) {
    const [location, _] = location_signal;

    const [snapshot_data] = createResource(location, async (location) => {
        return await get_location_snapshot(location.uuid)
    });

    const mutation = subscribe_to_location();
    return (
        <Switch>
            <Match when={location() == null}>
                Location is null
            </Match>
            <Match when={location() != null}>
                <div class="bg-white rounded-lg">
                    <h3 class="p-2">
                        {location().uuid}
                    </h3>


                    <Show when={snapshot_data.state === "ready"}>
                        <SnapshotData snapshot_data={snapshot_data()} />
                    </Show>
                    <Show when={!location().subbed}>

                        Would you like to subscribe to this location?<br />
                        <button
                            type="button"
                            class="bg-black text-white p-2 rounded-md"
                            onClick={() => mutation.mutate(location().uuid)}
                        >
                            subscribe
                        </button>
                    </Show>
                </div>
            </Match>
        </Switch>
    );
}

interface SnapshotDataProps {
    snapshot_data: CreateQueryResult<string, Error>
}

function SnapshotData({ snapshot_data }: SnapshotDataProps) {
    return (
        <div>
            <h1>measurements</h1>
            <table class="table-auto">
                <thead>
                    <tr>
                        <th></th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>PM10</th>
                        <th>PM2.5</th>
                        <th>Ozone</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1 Hour ago</td>
                        <td>{parseFloat(snapshot_data.measurements["1hour"].TEMPERATURE).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1hour"].HUMIDITY).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1hour"].PM10).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1hour"].PM25).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1hour"].OZONE).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>1 Day ago</td>
                        <td>{parseFloat(snapshot_data.measurements["1day"].TEMPERATURE).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1day"].HUMIDITY).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1day"].PM10).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1day"].PM25).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["1day"].OZONE).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>3 Days ago</td>
                        <td>{parseFloat(snapshot_data.measurements["3days"].TEMPERATURE).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["3days"].HUMIDITY).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["3days"].PM10).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["3days"].PM25).toFixed(2)}</td>
                        <td>{parseFloat(snapshot_data.measurements["3days"].OZONE).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <br />
            <h1>Predictions</h1>
            <table class="table-auto">
                <thead>
                    <tr>
                        <th></th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>PM10</th>
                        <th>PM2.5</th>
                        <th>Ozone</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1 Hour</td>
                        <td>{snapshot_data.predictions["1hour"].TEMPERATURE}</td>
                        <td>{snapshot_data.predictions["1hour"].HUMIDITY}</td>
                        <td>{snapshot_data.predictions["1hour"].PM10}</td>
                        <td>{snapshot_data.predictions["1hour"].PM25}</td>
                        <td>{snapshot_data.predictions["1hour"].OZONE}</td>
                    </tr>
                    <tr>
                        <td>1 Day</td>
                        <td>{snapshot_data.predictions["1day"].TEMPERATURE}</td>
                        <td>{snapshot_data.predictions["1day"].HUMIDITY}</td>
                        <td>{snapshot_data.predictions["1day"].PM10}</td>
                        <td>{snapshot_data.predictions["1day"].PM25}</td>
                        <td>{snapshot_data.predictions["1day"].OZONE}</td>
                    </tr>
                    <tr>
                        <td>3 Days</td>
                        <td>{snapshot_data.predictions["3days"].TEMPERATURE}</td>
                        <td>{snapshot_data.predictions["3days"].HUMIDITY}</td>
                        <td>{snapshot_data.predictions["3days"].PM10}</td>
                        <td>{snapshot_data.predictions["3days"].PM25}</td>
                        <td>{snapshot_data.predictions["3days"].OZONE}</td>
                    </tr>
                </tbody>
            </table>
        </div>    
    );
}



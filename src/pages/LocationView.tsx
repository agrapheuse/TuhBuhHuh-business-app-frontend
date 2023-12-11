import { Match, Show, Signal, Switch, createEffect, createResource } from "solid-js";
import { use_location, use_location_historical } from "../hooks/useLocations";
import { Location } from "../model/grid";
import { subscribe_to_location } from "../hooks/useUser";
import { CreateQueryResult } from "@tanstack/solid-query";

interface LocationViewProps {
    location_signal: Signal<null | Location>
}

export function LocationView({ location_signal }: LocationViewProps) {
    const [location, _] = location_signal;

    const [historical_data] = createResource(location, () => {
        const current_location = location();
        if (!current_location) {
            return;
        }
        const location_query = use_location_historical(current_location.uuid);
        return location_query;
    });

    const mutation = subscribe_to_location();
    return (
        <Switch>
            <Match when={location() == null}>
                Location is null
            </Match>
            <Match when={location() != null}>
                <div>
                    <h3 class="p-2">
                        Would you like to subscribe to this location?<br />
                        {location().uuid}
                    </h3>
                    <button
                        type="button"
                        class="bg-black text-white p-2 rounded-md"
                        onClick={() => mutation.mutate(location().uuid)}
                    >
                        subscribe
                    </button>
                </div>
                <Show when={historical_data.state === "ready"}>
                    <HistoricalData historical_data={historical_data()} />
                </Show>
            </Match>
        </Switch>
    );
}

interface HistoricalDataProps {
    historical_data: CreateQueryResult<string, Error>
}

function HistoricalData({historical_data}: HistoricalDataProps) {
    return (<>
        <Switch>
            <Match when={historical_data.isPending}>
                Loading historical data...
            </Match>
            <Match when={historical_data.isError}>
                Error has occured while loading historical data
            </Match>
            <Match when={historical_data.isSuccess}>
                {historical_data.data}
            </Match>
        </Switch>
    </>);
}

import { For, Match, Show, Signal, Switch, createContext, createSignal, useContext } from "solid-js";
import { unsubscribe_from_location, update_threshold, use_user } from "../hooks/useUser";
import { use_location } from "../hooks/useLocations";
import { subscribe_to_location_request, unsubscribe_from_location_request } from "../services/api/user";
import { document } from "postcss";

export default function UserView() {
    const [userPage, setUserPage] = createSignal("profile");


    return (
        <UserViewControlProvider>
            <UserSidebar />
            <UserContent />

        </UserViewControlProvider>
    )
}

const UserViewControlContext = createContext();

function UserViewControlProvider(props) {
    const user_page_signal = createSignal("profile");

    return (
        <UserViewControlContext.Provider value={
            user_page_signal
        }>
            {props.children}
        </UserViewControlContext.Provider>
    )
}

function useUserViewControlContext(): Signal<null | String> {
    return useContext(UserViewControlContext) as Signal<null | String>;
}

function UserContent() {
    const user_page_signal = useUserViewControlContext();
    const [userPage, _] = user_page_signal;


    const userQuery = use_user();

    return (
        <div class="p-4 sm:ml-64">
            <Switch>
                <Match when={userQuery.isSuccess} >
                    <Switch>
                        <Match when={userPage() == "profile"}>
                            <Profile user={userQuery.data} />
                        </Match>
                        <Match when={userPage() == "locations"}>
                            <UserLocations locations={userQuery.data.locations} />
                        </Match>
                        <Match when={userPage() == "thresholds"}>
                            <UserThresholds thresholds={userQuery.data.thresholds} />
                        </Match>
                    </Switch>
                </Match>
            </Switch>
        </div>
    )
}

function UserSidebar() {
    const user_page_signal = useUserViewControlContext();
    const [userPage, setUserPage] = user_page_signal;
    return (
        <aside
            class="
                    fixed top-50 left-0 z-40 w-64 h-screen 
                    transition-transform-translate-x-full sm:translate-x-0
                "
            aria-label="Sidebar"
        >
            <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 
                    dark:bg-gray-800
                    "
            >
                <ul class="space-y-2 font-medium">
                    <li>
                        <a href="#" onClick={() => setUserPage("profile")} class="
                                flex items-center p-2 text-gray-900 rounded-lg 
                                dark:text-white hover:bg-gray-100 
                                dark:hover:bg-gray-700 group
                                "
                        >
                            <span class="ms-3">Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setUserPage("locations")} class="
                                flex items-center p-2 text-gray-900 rounded-lg 
                                dark:text-white hover:bg-gray-100 
                                dark:hover:bg-gray-700 group
                            "
                        >
                            <span class="ms-3">Locations</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setUserPage("thresholds")} class="
                                flex items-center p-2 text-gray-900 rounded-lg 
                                dark:text-white hover:bg-gray-100 
                                dark:hover:bg-gray-700 group
                            "
                        >
                            <span class="ms-3">Thresholds</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}


function Profile() {
    return (
        <div >
            <h1>Profile</h1>
        </div>
    )
}
interface UserThresholdProps {
    threshold: string;
    value: number;
}
function UserThreshold({ threshold, value }: UserThresholdProps) {
    const [thresholdValue, setThresholdValue] = createSignal(value);
    const thresholdMutation = update_threshold();

    return (
        <div class="sm:col-span-4">
            <label for={threshold} class="block text-sm font-medium leading-6 text-gray-900">{threshold}</label>
            <div class="mt-2">
                <div
                    class="
                                    flex rounded-md shadow-sm ring-1 ring-inset 
                                    ring-gray-300 focus-within:ring-2 
                                    focus-within:ring-inset focus-within:ring-indigo-600 
                                    sm:max-w-md
                                "
                >
                    <input type="range" name={threshold} id={threshold}
                        value={thresholdValue() || 0} min="1" max="100"
                        oninput={(e) => setThresholdValue(parseInt(e.currentTarget.value))}
                        onchange={() => thresholdMutation.mutate({threshold:threshold, value:thresholdValue()})}
                        class="
                                        block flex-1 border-0 bg-transparent 
                                        py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 
                                        focus:ring-0 sm:text-sm sm:leading-6
                                    "
                    />
                    <output>{thresholdValue()}</output>
                </div>
            </div>
        </div>
    )
}
interface UserThresholdsProps {
    thresholds: Map<String, number>;
}
function UserThresholds({ thresholds }: UserThresholdsProps) {
    const valueTypes = ["TEMPERATURE", "HUMIDITY", "PM10", "PM25", "OZONE"];
    return (
        <div class="max-width-800 left-50">
            <h2 class="text-base font-semibold leading-7 text-gray-900">Thresholds</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">
                if any of these thresholds are broken in one of your subscribed locations you will be notified
            </p>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <For each={valueTypes}>{(valueType) =>
                   <UserThreshold threshold={valueType} value={thresholds[valueType]}/> 
                }</For>
            </div>
            <div class="mt-6 flex items-center justify-end gap-x-6">
                
            </div>
        </div>
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
interface UserLocationsProps {
    locations: Array<Location>;
}
function UserLocations({ locations }: UserLocationsProps) {
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

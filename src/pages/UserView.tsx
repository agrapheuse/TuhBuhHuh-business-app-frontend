import { For, Match, Show, Signal, Switch, createContext, createSignal, useContext } from "solid-js";
import { unsubscribe_from_location, update_threshold, use_user } from "../hooks/useUser";
import { use_location } from "../hooks/useLocations";
import { subscribe_to_location_request, unsubscribe_from_location_request } from "../services/api/user";
import { document } from "postcss";
import { UserThresholds } from "./userviews/UserThresholds";
import { Profile } from "./userviews/UserProfile";
import { UserLocations } from "./userviews/UserLocations";
import { UserNotifications } from "./userviews/UserNotifications";

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
                        <Match when={userPage() == "notifications"}>
                            <UserNotifications 
                                currentNotifications={userQuery.data.currentNotifications}
                                predictedNotifications={userQuery.data.predictedNotifications}
                            />
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
                    <li>
                        <a href="#" onClick={() => setUserPage("notifications")} class="
                                flex items-center p-2 text-gray-900 rounded-lg 
                                dark:text-white hover:bg-gray-100 
                                dark:hover:bg-gray-700 group
                            "
                        >
                            <span class="ms-3">Notifications</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

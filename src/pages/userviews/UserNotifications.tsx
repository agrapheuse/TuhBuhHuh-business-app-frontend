import { For, Match, Show, Switch, createSignal } from "solid-js";
import { Notification } from "../../model/domain";

export interface NotificationsMap {
	TEMPERATURE: Notification | null;
	HUMIDITY: Notification | null;
	PM10: Notification | null;
	PM25: Notification | null;
	OZONE: Notification | null;
	CAR: Notification | null;
	HEAVY: Notification | null;
	BIKE: Notification | null;
	PEDESTRIAN: Notification | null;
	V85: Notification | null;
}

export interface UserNotificationsProps {
	currentNotifications: NotificationsMap;
	predictedNotifications: NotificationsMap;
}

export function UserNotifications({
	currentNotifications,
	predictedNotifications,
}: UserNotificationsProps) {
	const [show_current_data, set_show_current_data] = createSignal(true);

	return (
		<>
			<div class="flex justify-evenly content-strech">
				<div
					class="rounded-md p-2 m-2"
					classList={{
						"bg-gray-50 dark:bg-gray-800 text-white": show_current_data(),
					}}
				>
					<button onclick={() => set_show_current_data(true)}>
						Show current data notifications
					</button>
				</div>
				<div
					class="rounded-md p-2 m-2"
					classList={{
						"bg-gray-50 dark:bg-gray-800 text-white": !show_current_data(),
					}}
				>
					<button onclick={() => set_show_current_data(false)}>
						Show predicted data notifications
					</button>
				</div>
			</div>
			<div>
				<Switch>
					<Match when={show_current_data()}>
						<NotificationList notificationList={currentNotifications} />
					</Match>
					<Match when={!show_current_data()}>
						<NotificationList notificationList={predictedNotifications} />
					</Match>
				</Switch>
			</div>
		</>
	);
}

function NotificationList({ notificationList }) {
	const entries = Object.entries(notificationList);

	let all_empty = true;
	for (const entry in entries) {
		if (entry[1] != null) {
			all_empty = false;
		}
	}

	return (
		<>
			<Switch>
                <Match when={all_empty}>
                    <UserNotificationsEmpty />
                </Match>
				<Match when={!all_empty}>
					<For each={entries} fallback={<UserNotificationsEmpty />}>
						{(item, index) => {
							<div data-index={index()}>
								<TypeNotification item={item} />
							</div>;
						}}
					</For>
				</Match>
			</Switch>
		</>
	);
}

function TypeNotification({ item }) {
	console.log(item);
	return <Show when={item[1] != null}>{JSON.stringify(item[1])}</Show>;
}

function UserNotificationsEmpty() {
	return (
		<>
			<div>There are currently no notifications!</div>
		</>
	);
}

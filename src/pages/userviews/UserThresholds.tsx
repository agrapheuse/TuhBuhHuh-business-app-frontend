import { For, createSignal } from "solid-js";
import {  update_threshold } from "../../hooks/useUser";

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

export function UserThresholds({ thresholds }: UserThresholdsProps) {
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

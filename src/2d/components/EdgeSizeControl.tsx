import { onMount } from "solid-js";
import { Popover } from "../../components/Popover";
import { Vertex } from "../../vertex";

type Props = {
  position: Vertex;
  direction: "horizontal" | "vertical";
  onApplyPrimary: () => void;
  onApplySecondary: () => void;
  primaryLabel: string;
  secondaryLabel: string;

  value: number;
  setValue: (value: number) => void;
};

export function EdgeSizeControl(props: Props) {
  let inputRef: HTMLInputElement | null;
  onMount(() => {
    setTimeout(() => {
      inputRef?.focus();
    }, 1);
  });
  return (
    <Popover position={props.position}>
      <div
        class="flex items-center p-2 "
        classList={{
          "flex-col": props.direction === "vertical",
          "flex-row": props.direction === "horizontal",
          "space-y-2": props.direction === "vertical",
          "space-x-2": props.direction === "horizontal",
        }}
      >
        <button
          type="button"
          class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={props.onApplyPrimary}
        >
          {props.primaryLabel}
        </button>

        <input
          type="number"
          class="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          ref={(el) => (inputRef = el)}
          value={props.value}
          onChange={(e) => props.setValue(+e.target.value)}
        ></input>
        <button
          onClick={props.onApplySecondary}
          type="button"
          class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {props.secondaryLabel}
        </button>
      </div>
    </Popover>
  );
}

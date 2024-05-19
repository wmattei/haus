import { Accessor, createEffect } from "solid-js";

type Props = {
  zoom: Accessor<number>;
  onIncrement?: () => void;
  onDecrement?: () => void;
  visible?: boolean;
};

export function ZoomInput(props: Props) {
  return (
    <div
      class="absolute bottom-2 z-10 left-2"
      classList={{ hidden: !props.visible }}
    >
      <div class=" bg-primary-100 rounded-md text-primary-700 tabular-nums flex flex-row items-center">
        <button
          disabled={!props.onDecrement}
          onClick={props.onDecrement}
          class="mr-2 p-2 px-4 rounded-md hover:bg-primary-200 disabled:opacity-50 disabled:bg-primary-100"
        >
          -
        </button>
        <span class="text-center w-12">{(props.zoom() * 100).toFixed()}%</span>
        <button
          disabled={!props.onIncrement}
          onClick={props.onIncrement}
          class="ml-2 p-2 px-4 rounded-md hover:bg-primary-200 disabled:opacity-50 disabled:bg-primary-100"
        >
          +
        </button>
      </div>
    </div>
  );
}

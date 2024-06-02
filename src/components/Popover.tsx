import { JSX } from "solid-js/jsx-runtime";
import { Vertex } from "../vertex";

type PopoverProps = {
  position: Vertex;
  children: JSX.Element;
};

export function Popover(props: PopoverProps) {
  return (
    <>
      <div
        style={{ left: `${props.position.x}px`, top: `${props.position.y}px` }}
        role="tooltip"
        class="absolute z-10 inline-block  text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
      >
        {props.children}
      </div>
    </>
  );
}

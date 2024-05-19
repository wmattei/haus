import { JSX, createContext, createSignal, useContext } from "solid-js";

type GuidanceContext = {
  setMessage: (message: JSX.Element) => void;
};

const GuidanceContext = createContext<GuidanceContext>();

export function useGuidanceContext() {
  return useContext(GuidanceContext);
}

type Props = {
  children: JSX.Element;
};

export function GuidanceProvider(props: Props) {
  const [message, setMessage] = createSignal<JSX.Element>("");

  return (
    <GuidanceContext.Provider value={{ setMessage }}>
      {message() && (
        <div class="text-black font-bold py-4 px-8 absolute top-12 z-10 left-8 flex flex-row items-center justify-center duration-150 bg-clip-padding backdrop-filter backdrop-blur-sm border-gray-100 shadow border rounded-md bg-primary-400 bg-opacity-50">
          {message()}
        </div>
      )}
      {props.children}
    </GuidanceContext.Provider>
  );
}

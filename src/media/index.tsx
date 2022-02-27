import { Component, Show } from "solid-js";

import { MediaBar } from "./MediaBar";
import { useMediaContext } from "./context";

export * from "./context";

export const MediaControls: Component = () => {
  const [state] = useMediaContext();
  return (
    <Show when={state.status !== "idle"}>
      <MediaBar />
    </Show>
  );
};

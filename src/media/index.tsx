import { Component } from "solid-js";
import { Transition } from "solid-transition-group";

import { MediaBar } from "./MediaBar";
import { useMediaContext } from "./context";
import { PlaylistView } from "./PlaylistView";

export * from "./context";

export const MediaControls: Component = () => {
  const [state] = useMediaContext();
  return (
    <>
      <Transition
        enterClass="translate-y-full"
        enterToClass="translate-y-0"
        exitClass="translate-y-0"
        exitToClass="translate-y-full"
      >
        {state.showPlaylist && <PlaylistView />}
      </Transition>
      <Transition
        enterClass="translate-y-24"
        enterToClass="translate-y-0"
        exitClass="translate-y-0"
        exitToClass="translate-y-24"
      >
        {state.status !== "idle" && <MediaBar />}
      </Transition>
    </>
  );
};

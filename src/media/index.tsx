import { Component, For } from "solid-js";
import { Transition } from "solid-transition-group";

import { MediaBar } from "./MediaBar";
import { useMediaContext } from "./context";

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
        {state.showPlaylist && (
          <div class="fixed z-10 top-0 left-0 right-0 bottom-0 bg-slate-900 transition-transform">
            Playlist View
            <For each={state.playlist}>
              {(episode) => <div>{episode.title}</div>}
            </For>
          </div>
        )}
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

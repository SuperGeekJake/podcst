import { Component, For } from "solid-js";

import { useMediaContext } from "./context";

export const PlaylistView: Component = () => {
  const [state] = useMediaContext();
  return (
    <div
      data-component="PlaylistView"
      class="fixed z-10 top-0 left-0 right-0 bottom-0 bg-slate-900 transition-transform"
    >
      <h3>Playlist View</h3>
      <For each={state.playlist}>{(episode) => <div>{episode.title}</div>}</For>
    </div>
  );
};

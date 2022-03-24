import { Component, createMemo, For } from "solid-js";

import { ListItem } from "./ListItem";
import { useMediaContext } from "./context";

export const PlaylistView: Component = () => {
  const [state, actions] = useMediaContext();
  const currentArt = createMemo(() => {
    const episode = state.playlist[state.track];
    return (episode.episodeArt || episode.cover) as string;
  });
  const onSelect = (index: number) => () => {
    return index === state.track ? actions.toggle() : actions.track(index);
  };
  return (
    <div
      data-component="PlaylistView"
      class="fixed z-10 top-0 left-0 right-0 bottom-0 px-16 py-24 bg-slate-900 transition-transform"
    >
      <div class="grid grid-cols-2 gap-8 h-full">
        <div class="flex">
          <img
            class="w-full h-auto m-auto max-w-3xl rounded-lg"
            src={currentArt()}
            alt="Currently playing episode cover"
            width={1400}
            height={1400}
          />
        </div>
        <ul class="h-full overflow-y-auto divide-y divide-gray-700">
          <For each={state.playlist}>
            {(episode, index) => (
              <li>
                <ListItem
                  current={state.track === index()}
                  art={(episode.episodeArt || episode.cover) as string}
                  title={episode.title}
                  author={episode.author as string}
                  duration={episode.duration as number}
                  onSelect={onSelect(index())}
                />
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
};

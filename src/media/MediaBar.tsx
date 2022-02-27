import { Component, createMemo, Match, onMount, Show, Switch } from "solid-js";

import {
  PlaySvg,
  PauseSvg,
  CycleSvg,
  PreviousSvg,
  NextSvg,
  PlaylistSvg,
  VolumeUpSvg,
  VolumeOffSvg,
  VolumeDownSvg,
} from "@src/svg";
import { FormattedDuration } from "@src/formatting";
import { Slider } from "@src/Slider";
import { createMountSignal } from "@src/utils";

import { SeekBar } from "./SeekBar";
import { useMediaContext } from "./context";

export const MediaBar: Component = () => {
  let playRef: HTMLButtonElement | undefined;
  const isMounted = createMountSignal();
  const [state, actions] = useMediaContext();

  const track = createMemo<App.Episode | undefined>(
    () => state.playlist[state.track]
  );
  const hasLoadedTrack = createMemo(() => state.status !== "loading");
  const hasPreviousTrack = createMemo(() => !!state.playlist[state.track - 1]);
  const hasNextTrack = createMemo(() => !!state.playlist[state.track + 1]);
  const artSrc = createMemo(
    () => track()?.episodeArt || track()?.cover || undefined
  );

  onMount(() => {
    (playRef as HTMLButtonElement).focus();
  });

  return (
    <div
      data-component="MediaBar"
      class="fixed bottom-0 left-0 right-0 z-10 flex justify-center items-stretch w-full h-24 bg-black transition-transform"
      classList={{
        "translate-y-24": !isMounted(),
        "translate-y-0": isMounted(),
      }}
    >
      <div class="flex-1 flex items-center">
        <Show when={!!artSrc()}>
          <img
            class="block w-24 h-24 object-fill mr-2"
            src={artSrc()}
            alt="Episode Art"
          />
        </Show>
        <div>
          <div class="mb-1 font-display text-lg">{track()?.title}</div>
          {/* // TODO: Update endpoint to return podcast title in episode data */}
          <div class="text-sm">{track()?.author}</div>
        </div>
      </div>

      <div class=" flex-none flex justify-end items-center">
        <button
          class="group p-1"
          aria-label="Previous song"
          title="Previous song"
          disabled={!hasPreviousTrack()}
          onClick={() => actions.back()}
        >
          <PreviousSvg class="block fill-stone-400 group-hover:fill-white group-disabled:fill-stone-600 transition-all" />
        </button>
        <button
          class="group flex justify-center items-center p-1 mx-4"
          ref={(ref) => (playRef = ref)}
          onClick={actions.toggle}
          disabled={!hasLoadedTrack()}
          aria-label="Play"
          title="Play"
        >
          <Switch
            fallback={
              <CycleSvg class="block fill-stone-400 group-hover:fill-white group-disabled:fill-stone-600 transition-all animate-spin w-auto h-8" />
            }
          >
            <Match when={state.status === "paused"}>
              <PlaySvg class="block fill-stone-400 group-hover:fill-white group-disabled:fill-stone-600 transition-all w-auto h-8" />
            </Match>
            <Match when={state.status === "playing"}>
              <PauseSvg class="block fill-stone-400 group-hover:fill-white group-disabled:fill-stone-600 transition-all w-auto h-8" />
            </Match>
          </Switch>
        </button>
        <button
          class="group p-1"
          disabled={!hasNextTrack()}
          aria-label="Next song"
          title="Next song"
          onClick={() => actions.next()}
        >
          <NextSvg class="block fill-stone-400 group-hover:fill-white group-disabled:fill-stone-600 transition-all" />
        </button>
      </div>

      <div class="flex-1 gap-2 flex justify-end items-center mr-1 space-x1">
        <div class="group flex flex-row-reverse">
          <button
            class="p-1"
            aria-label="Mute"
            title="Mute"
            aria-pressed={!state.volume}
            onClick={() => {
              actions.volume(state.volume ? 0 : 1);
            }}
          >
            <Switch>
              <Match when={state.volume === 0}>
                <VolumeOffSvg class="block fill-stone-400 group-hover:fill-white transition-all" />
              </Match>
              <Match when={state.volume >= 0.5}>
                <VolumeUpSvg class="block fill-stone-400 group-hover:fill-white transition-all" />
              </Match>
              <Match when={state.volume < 0.5}>
                <VolumeDownSvg class="block fill-stone-400 group-hover:fill-white transition-all" />
              </Match>
            </Switch>
          </button>
          <Slider
            class="w-28 mr-3 opacity-0 group-hover:opacity-100 focus:opacity-100"
            name="volume"
            value={state.volume}
            onInput={actions.volume}
          />
        </div>
        <button
          class="group p-1"
          role="switch"
          aria-checked="true"
          aria-label="View Playlist"
          title="View Playlist"
        >
          <PlaylistSvg class="block fill-stone-400 group-hover:fill-white group-disabled:fill-stone-600 transition-all" />
        </button>
      </div>

      <Show when={hasLoadedTrack()}>
        <div class="absolute top-0 right-0 mt-2 mr-2 text-sm font-display">
          <FormattedDuration value={state.seek} />
          {" / "}
          <FormattedDuration value={state.duration} />
        </div>

        <SeekBar
          seek={state.seek as number}
          duration={state.duration as number}
          onChange={actions.seek}
        />
      </Show>
    </div>
  );
};

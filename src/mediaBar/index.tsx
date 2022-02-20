import {
  Component,
  createEffect,
  createMemo,
  JSX,
  Match,
  Show,
  Switch,
} from "solid-js";

import { useMediaContext } from "@src/mediaContext";
import {
  PlaySvg,
  PauseSvg,
  CycleSvg,
  PreviousSvg,
  NextSvg,
  VolumeSvg,
  PlaylistSvg,
} from "@src/svg";
import { FormattedDuration } from "@src/formatting";

import { SeekBar } from "./SeekBar";

export const MediaBar: Component = () => {
  let playRef: HTMLButtonElement;
  const [state, actions] = useMediaContext();
  const track = createMemo<App.Episode | undefined>(
    () => state.playlist[state.track]
  );
  const hasLoadedTrack = createMemo(
    () => state.status === "playing" || state.status === "paused"
  );
  const hasPreviousTrack = createMemo(() => !!state.playlist[state.track - 1]);
  const hasNextTrack = createMemo(() => !!state.playlist[state.track + 1]);
  const volumeScaled = createMemo(() => state.volume * VOLUME_SCALE);
  const artSrc = createMemo(
    () => track()?.episodeArt || track()?.cover || undefined
  );
  const handleVolumeChange: JSX.EventHandler<HTMLInputElement, Event> = (
    evt
  ) => {
    const value = parseInt(evt.currentTarget.value) / VOLUME_SCALE;
    actions.volume(value);
  };
  createEffect(() => {
    if (state.status === "loading") playRef.focus();
  });
  return (
    <div
      class="fixed bottom-0 left-0 right-0 z-10 flex justify-center items-stretch w-full h-24 bg-black transition-all"
      classList={{
        "hidden translate-y-24": state.status === "idle",
        "visible translate-y-0": state.status !== "idle",
      }}
      data-component="MediaBar"
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
        >
          <PreviousSvg class="block fill-stone-300 group-hover:fill-white group-disabled:fill-stone-600 transition-all" />
        </button>
        <button
          class="group flex justify-center items-center p-1 mx-4"
          ref={(ref: any) => (playRef = ref)}
          onClick={actions.toggle}
          disabled={!hasLoadedTrack()}
          aria-label="Play"
          title="Play"
        >
          <Switch
            fallback={
              <CycleSvg class="block fill-stone-300 group-hover:fill-white group-disabled:fill-stone-600 transition-all animate-spin w-auto h-8" />
            }
          >
            <Match when={state.status === "paused"}>
              <PlaySvg class="block fill-stone-300 group-hover:fill-white group-disabled:fill-stone-600 transition-all w-auto h-8" />
            </Match>
            <Match when={state.status === "playing"}>
              <PauseSvg class="block fill-stone-300 group-hover:fill-white group-disabled:fill-stone-600 transition-all w-auto h-8" />
            </Match>
          </Switch>
        </button>
        <button
          class="group p-1"
          disabled={!hasNextTrack()}
          aria-label="Next song"
          title="Next song"
        >
          <NextSvg class="block fill-stone-300 group-hover:fill-white group-disabled:fill-stone-600 transition-all" />
        </button>
      </div>

      <div class="flex-1 flex justify-end items-center mr-1 space-x1">
        <label
          class="group relative p-1 cursor-pointer"
          aria-label="Volume"
          title="Volume"
        >
          <VolumeSvg class="block fill-stone-300 group-hover:fill-white transition-all" />
          <input
            class="opacity-0 focus:opacity-100 w-0 focus:w-auto absolute top-1/2 right-full -translate-y-1/2 mr-1 transition-all"
            type="range"
            id="volume"
            name="volume"
            min="0"
            max={VOLUME_SCALE}
            value={volumeScaled()}
            onChange={handleVolumeChange}
          />
        </label>
        <button
          class="group p-1"
          role="switch"
          aria-checked="true"
          aria-label="View Playlist"
          title="View Playlist"
        >
          <PlaylistSvg class="block fill-stone-300 group-hover:fill-white group-disabled:fill-stone-600 transition-all" />
        </button>
      </div>

      <div class="absolute top-0 right-0 mt-2 mr-2 text-sm font-[monospace]">
        <FormattedDuration value={state.seek} />
        {" / "}
        <FormattedDuration value={state.duration} />
      </div>

      <Show when={hasLoadedTrack()}>
        <SeekBar
          seek={state.seek as number}
          duration={state.duration as number}
          onChange={actions.seek}
        />
      </Show>
    </div>
  );
};

const VOLUME_SCALE = 100;

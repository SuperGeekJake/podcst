import { Component, Match, Switch, Show } from "solid-js";

import { FormattedDuration } from "@src/formatting";
import { PauseSvg, PlaySvg, VolumeUpSvg, CycleSvg } from "@src/svg";
import { useMediaContext } from "@src/media";

export const ListItem: Component<{
  current: boolean;
  art: string;
  title: string;
  author: string;
  duration: number;
  onSelect: () => void;
}> = (props) => {
  const [state] = useMediaContext();
  return (
    <div
      class="flex w-full h-16 items-center px-4 space-x-4"
      classList={{
        "bg-slate-800": props.current,
      }}
    >
      <button
        class="relative group"
        onClick={props.onSelect}
        disabled={props.current && state.status === "loading"}
      >
        <img
          class="flex-none w-auto h-9 rounded-sm"
          src={props.art}
          alt="Episode Art"
          width="36"
          height="36"
        />
        <span
          class="absolute top-0 right-0 bottom-0 left-0 flex group-hover:bg-black/50"
          classList={{
            "bg-black/50": props.current,
            "bg-black/0": !props.current,
          }}
        >
          <Show when={props.current}>
            <Switch>
              <Match when={state.status === "loading"}>
                <CycleSvg class="m-auto fill-white animate-spin" />
              </Match>
              <Match when={state.status === "playing"}>
                <VolumeUpSvg class="m-auto fill-white group-hover:hidden" />
              </Match>
              <Match when={state.status === "paused"}>
                <PlaySvg class="m-auto fill-white" />
              </Match>
            </Switch>

            <Switch>
              <Match when={state.status === "playing"}>
                <PauseSvg class="hidden m-auto fill-white group-hover:block" />
              </Match>
            </Switch>
          </Show>

          <Show when={!props.current}>
            <PlaySvg class="hidden m-auto fill-white group-hover:block" />
          </Show>
        </span>
      </button>
      <div class="flex-1 flex flex-col justify-center leading-tight">
        <div class="font-display">{props.title}</div>
        <div class="text-sm text-gray-300">{props.author}</div>
      </div>
      <div class="flex-none">
        <FormattedDuration value={props.duration} />
      </div>
    </div>
  );
};

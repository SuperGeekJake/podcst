import { genres } from "@src/genres";
import { useMediaContext } from "@src/mediaContext";
import { ExplicitSvg } from "@src/svg";
import { Howl } from "howler";
import {
  Component,
  createEffect,
  createMemo,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { registerDirectives, floating, fullsize } from "@src/directives";

registerDirectives(floating, fullsize);
export const Modal: Component<{
  target: HTMLElement;
  listing: App.EpisodeListing;
  podcast: App.Podcast;
  onMouseLeave: () => void;
}> = (props) => {
  const [mediaState] = useMediaContext();
  const categories = createMemo(() =>
    props.podcast.categories.map((id) => genres[id]).filter((n) => !!n)
  );

  let howl: Howl | null;
  onMount(() => {
    if (mediaState.status !== "idle") return;
    const episode = props.listing.episodes[0];
    // Start podcast preview audio
    howl = new Howl({
      src: episode.file.url,
      html5: true,
      autoplay: true,
      sprite: {
        preview: calcMiddleSprite(episode.duration || 0),
      },
    });
    // TODO: Requires interaction with the page first
    howl.play("preview");
  });

  createEffect(() => {
    if (!howl || mediaState.status === "idle") return;
    // Kill podcast preview audio
    howl.unload();
    howl = null;
  });

  onCleanup(() => {
    if (!howl) return;
    // Kill podcast preview audio
    howl.unload();
    howl = null;
  });

  return (
    <div class="fixed top-0 left-0 w-screen h-screen">
      <div
        class="absolute z-20 w-[20%] translate-x-[-9999px] bg-slate-800"
        onMouseLeave={props.onMouseLeave}
        use:floating={props.target}
      >
        <img
          class="w-full h-[75%]"
          src={props.podcast.cover}
          alt={props.listing.title}
          title={props.listing.title}
          width="600"
          height="600"
          use:fullsize={props.listing.cover}
        />
        <div class="flex flex-row flex-nowrap p-1 max-w-full">
          <ul class="flex-1 flex flex-row flex-nowrap gap-1 overflow-hidden">
            <For each={categories()}>
              {(category) => (
                <li class="text-xs font-display font-bold uppercase bg-white/20 rounded-full px-2 py-1 whitespace-nowrap">
                  {category}
                </li>
              )}
            </For>
          </ul>
          <Show when={props.listing.explicit}>
            <ExplicitSvg class="flex-none w-auto h-6 fill-white" />
          </Show>
        </div>
      </div>
    </div>
  );
};

const PREVIEW_DURATION = 30;
const calcMiddleSprite = (duration: number): [number, number] => {
  const center = Math.round(duration / 2);
  const start = Math.max(0, center - PREVIEW_DURATION / 2) * 1000;
  const end = Math.min(duration, center + PREVIEW_DURATION / 2) * 1000;
  return [start, end - start];
};

import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  batch,
} from "solid-js";
import { Link } from "solid-app-router";
import { Howl } from "howler";
import { getScrollParents } from "@floating-ui/dom";

import { registerDirectives, fullsize } from "@src/directives";
import { genres } from "@src/genres";
import { useMediaContext } from "@src/media";
import { ExplicitSvg, PlaySvg } from "@src/svg";

registerDirectives(fullsize);
export const Modal: Component<{
  target: HTMLElement;
  listing: App.EpisodeListing;
  podcast: App.Podcast;
  onMouseLeave: () => void;
}> = (props) => {
  const [mediaState, mediaActions] = useMediaContext();
  const categories = createMemo(() =>
    props.podcast.categories?.map((id) => genres[id]).filter((n) => !!n)
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

  let container: HTMLDivElement | undefined;
  let scrollParents: (Element | Window | VisualViewport)[];
  const [offset, setOffset] = createSignal<number>(0);
  const [coords, setCoords] = createSignal<[number, number] | undefined>();
  function update() {
    const offset =
      (props.target.nextElementSibling &&
        !isInViewport(props.target.nextElementSibling) &&
        1) ||
      (props.target.previousElementSibling &&
        !isInViewport(props.target.previousElementSibling) &&
        -1) ||
      0;
    const refRect = props.target.getBoundingClientRect();
    const elRect = (container as HTMLDivElement).getBoundingClientRect();
    const x =
      offset === 0
        ? Math.round(refRect.x + (refRect.width - elRect.width) / 2)
        : offset === 1
        ? refRect.right - elRect.width
        : refRect.x;
    const y = Math.round(refRect.y + (refRect.height - elRect.height) / 2);
    batch(() => {
      setOffset(offset);
      setCoords([x, y]);
    });
  }

  onMount(() => {
    scrollParents = [
      ...getScrollParents(props.target),
      ...getScrollParents(container as HTMLDivElement),
    ];
    scrollParents.forEach((el) => {
      el.addEventListener("scroll", update);
      el.addEventListener("resize", update);
    });

    update();
  });

  onCleanup(() => {
    scrollParents.forEach((el) => {
      el.removeEventListener("scroll", update);
      el.removeEventListener("resize", update);
    });
  });

  return (
    <div
      data-component="Preview.Modal.overlay"
      class="fixed top-0 left-0 w-screen h-screen"
    >
      <div
        data-component="Preview.Modal.container"
        ref={(ref) => (container = ref)}
        class="absolute z-20 w-1/5 aspect-square"
        style={getContainerStyles(coords())}
      >
        <div
          data-component="Preview.Modal.base"
          class="w-full h-full overflow-hidden rounded-xl transition-transform"
          classList={{
            "scale-75": !coords(),
            "scale-100": !!coords(),
            "origin-center": offset() === 0,
            "origin-right": offset() === 1,
            "origin-left": offset() === -1,
          }}
          onMouseLeave={props.onMouseLeave}
        >
          <Link href={`/episodes?feed=${props.podcast.feed}`}>
            <img
              class="object-cover w-full h-full"
              src={props.podcast.cover}
              alt={props.listing.title}
              width="600"
              height="600"
              use:fullsize={props.listing.cover}
            />
          </Link>
          <div class="absolute right-0 bottom-0 left-0 flex flex-row flex-nowrap p-1 bg-black/50">
            <ul class="flex-1 flex flex-row flex-nowrap gap-1 overflow-hidden">
              <For each={categories()}>
                {(category) => (
                  <li class="text-xs font-display font-bold uppercase bg-black/20 rounded-full px-2 py-1 whitespace-nowrap">
                    {category}
                  </li>
                )}
              </For>
            </ul>
            <Show when={props.listing.explicit}>
              <ExplicitSvg class="flex-none w-auto h-6 fill-white" />
            </Show>
          </div>
          <button
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group flex justify-center items-center w-24 h-24 bg-black/50 hover:bg-black focus:bg-black rounded-full transition-all"
            aria-label="Play"
            title="Play"
            onClick={() => {
              if (howl) {
                howl.unload();
                howl = null;
              }

              mediaActions.load(props.listing.episodes);
              props.onMouseLeave();
            }}
          >
            <PlaySvg class="w-auto h-14 fill-white/50 group-hover:fill-white group-focus:fill-white" />
          </button>
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

const getContainerStyles = (coords?: [number, number]) => {
  if (!coords) return "transform: translate(-100%, -100%)";
  return `transform: translate(${coords[0]}px, ${coords[1]}px)`;
};

const isInViewport = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

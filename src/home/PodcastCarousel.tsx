import { Component, createMemo, createSignal, For } from "solid-js";
import { DeepReadonly } from "solid-js/store";

import { ChevronLeftSvg, ChevronRightSvg } from "@src/svg";
import { Preview } from "@src/preview";

export const PodcastCarousel: Component<{
  title: string;
  podcasts: DeepReadonly<App.Podcast[]>;
}> = (props) => {
  let carousel: HTMLDivElement;
  let articles: HTMLElement[] = [];
  const [pagination, setPagination] = createSignal<number>(0);

  const handleChange = (direction: -1 | 1) => {
    const index = Math.max(
      Math.min(
        pagination() + direction * COLUMN_COUNT,
        props.podcasts.length - 1
      ),
      0
    );
    if (index === pagination()) return;

    const element = articles[index];
    const offset = articles[0].offsetLeft;
    carousel.scrollBy({
      top: 0,
      left: element.offsetLeft - offset - carousel.scrollLeft,
    });
    setPagination(index);
  };

  const showLeftNavigation = createMemo(() => pagination() > 0);
  const showRightNavigation = createMemo(
    () => pagination() < props.podcasts.length - 1
  );

  return (
    <div class="group">
      <h3 class="font-display text-2xl ml-12 mb-4">{props.title}</h3>
      <div class="relative mb-12">
        <button
          classList={{
            hidden: !showLeftNavigation(),
            block: showLeftNavigation(),
          }}
          class="absolute z-10 top-0 left-0 w-12 h-full bg-slate-900/40 group-hover:bg-slate-900/60 transition-all"
          onClick={() => handleChange(-1)}
        >
          <ChevronLeftSvg class="block h-12 w-auto fill-white opacity-0 group-hover:opacity-100 transition-all" />
        </button>
        <div
          ref={(ref) => (carousel = ref)}
          class="flex flex-nowrap overflow-x-hidden scroll-smooth px-12 gap-[1%]"
        >
          <For each={props.podcasts}>
            {(podcast, index) => (
              <Preview
                ref={(ref) => (articles[index()] = ref)}
                podcast={podcast as App.Podcast}
              />
            )}
          </For>
        </div>
        <button
          classList={{
            hidden: !showRightNavigation(),
            block: showRightNavigation(),
          }}
          class="absolute z-10 top-0 right-0 w-12 h-full bg-slate-900/40 group-hover:bg-slate-900/60 transition-all"
          onClick={() => handleChange(1)}
        >
          <ChevronRightSvg class="block h-12 w-auto fill-white opacity-0 group-hover:opacity-100 transition-all" />
        </button>
      </div>
    </div>
  );
};

const COLUMN_COUNT = 6;

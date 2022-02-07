import { Component, Suspense, createResource, createMemo } from "solid-js";

import { useMediaContext } from "@src/mediaContext";
import { PlaySvg } from "@src/svg";
import { getTopEpisode } from "@src/api";
import { getTextContent } from "@src/utils";

export const Hero: Component = () => {
  const [data] = createResource(() => getTopEpisode());
  const [, playerActions] = useMediaContext();
  const summary = createMemo(() =>
    getTextContent(data()?.summary || data()?.showNotes)
  );
  const handlePlay = () => {
    const episode = data();
    // Shouldn't happen as UI won't be visible
    if (!episode) return;
    playerActions.load([episode]);
  };
  return (
    <div
      class="relative h-96 md:h-[36rem] lg:h-[48rem] mb-12"
      data-component={Hero.name}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <img
          class="object-cover w-full h-full opacity-30"
          src={data()?.cover || undefined}
          alt={data()?.title}
        />
        <div class="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-start justify-end px-12">
          <h3 class="font-display text-4xl">{data()?.title}</h3>
          <h4 class="font-display text-2xl mb-4">{data()?.author}</h4>
          <p class="line-clamp-3 w-5/6 max-w-3xl mb-8 text-white text-lg">
            {summary()}
          </p>
          <ul class="flex flex-row items-center mb-8 space-x-4">
            <li>
              <button
                class="group flex justify-center items-center w-14 h-14 bg-amber-700 hover:bg-amber-600 focus:bg-amber-600 rounded-full transition-all"
                aria-label="Play"
                onClick={handlePlay}
              >
                <PlaySvg class="w-auto h-7 fill-white" />
              </button>
            </li>
            <li>
              <a class="flex justify-center items-center h-10 px-6 text-white text-sm font-bold font-display uppercase tracking-wide bg-white/20 rounded-full">
                More Info
              </a>
            </li>
          </ul>
        </div>
      </Suspense>
    </div>
  );
};

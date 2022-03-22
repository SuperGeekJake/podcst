import { Component, createMemo, createResource, Suspense } from "solid-js";
import { useSearchParams } from "solid-app-router";

import { getPodcast } from "@src/api";
import { getTextContent } from "@src/utils";
import { Button } from "@src/ui/buttons";
import { SubscribeButton } from "@src/subscriptions";

export const Episodes: Component = () => {
  const [searchParams] = useSearchParams();
  const [data] = createResource(() => getPodcast(searchParams.feed));
  const description = createMemo(() => getTextContent(data()?.description));
  return (
    <main class="flex flex-row px-12 pt-36" data-component="Episodes">
      <Suspense fallback={<div>Loading...</div>}>
        <img
          class="w-1/3 h-auto flex-none mr-8"
          src={data()?.cover}
          alt={data()?.cover}
          title={data()?.cover}
        />
        <div class="flex flex-1 flex-col gap-4">
          <h1 class="text-6xl font-display font-bold">{data()?.title}</h1>
          <h2 class="text-4xl font-display">{data()?.author}</h2>
          <div class="max-w-[70ch]">{description()}</div>
          <div class="flex gap-4">
            <SubscribeButton feed={searchParams.feed} podcast={data()!} />
            <Button>Share</Button>
          </div>
        </div>
      </Suspense>
    </main>
  );
};

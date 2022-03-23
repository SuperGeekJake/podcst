import { Component, Show } from "solid-js";

import { PodcastCarousel } from "./PodcastCarousel";
import { useSubscriptionsContext } from "@src/subscriptions";

export const CategorySubs: Component = () => {
  const [state] = useSubscriptionsContext();
  return (
    <Show when={state.subscriptionList.length > 0}>
      <PodcastCarousel
        title="Subscriptions"
        podcasts={state.subscriptionList}
      />
    </Show>
  );
};

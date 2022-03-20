import {
  Component,
} from "solid-js";

import { PodcastsGrid } from "./PodcastsGrid";
import { useSubscriptionsContext } from "@src/subscriptions";

export const CategorySubs: Component = () => {
  const store = useSubscriptionsContext();
  const { subscriptionList } = store;
  return (
    <PodcastsGrid title="Subscriptions" podcasts={subscriptionList()} />
  );
};

import {
  Component,
  createResource,
} from "solid-js";

import { getTopPodcasts } from "@src/api";
import { PodcastsGrid } from "./PodcastsGrid";

export const CategorySubs: Component = () => {
  const [data] = createResource(getTopPodcasts);
  return (
    <PodcastsGrid title="Subscriptions" podcasts={data} />
  );
};

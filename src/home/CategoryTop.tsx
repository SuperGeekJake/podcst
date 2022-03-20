import {
  Component,
  createResource,
} from "solid-js";

import { getTopPodcasts } from "@src/api";
import { PodcastsGrid } from "./PodcastsGrid";

export const CategoryTop: Component = () => {
  const [data] = createResource(getTopPodcasts);
  return (
    <PodcastsGrid title="Popular" podcasts={data() || []} />
  );
};

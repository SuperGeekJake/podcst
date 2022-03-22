import { Component, createResource } from "solid-js";

import { getTopPodcasts } from "@src/api";
import { PodcastCarousel } from "./PodcastCarousel";

export const CategoryTop: Component = () => {
  const [data] = createResource(getTopPodcasts);
  return <PodcastCarousel title="Popular" podcasts={data() || []} />;
};

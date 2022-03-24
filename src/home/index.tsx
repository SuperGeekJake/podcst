import { Component } from "solid-js";

import { useMediaContext } from "@src/media";

import { Hero } from "./Hero";
import { CategorySubs } from "./CategorySubs";
import { CategoryTop } from "./CategoryTop";

export const Home: Component = () => {
  const [state] = useMediaContext();
  return (
    <main
      data-component="Home"
      classList={{
        hidden: state.showPlaylist,
      }}
    >
      <Hero />
      <CategorySubs />
      <CategoryTop />
    </main>
  );
};

import { Component } from "solid-js";

import { Hero } from "./Hero";
import { CategorySubs } from "./CategorySubs";
import { CategoryTop } from "./CategoryTop";

export const Home: Component = () => (
  <main data-component="Home">
    <Hero />
    <CategorySubs />
    <CategoryTop />
  </main>
);

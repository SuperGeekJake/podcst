import { Component } from "solid-js";

import { Hero } from "./Hero";
import { CategoryTop } from "./CategoryTop";

export const Home: Component = () => (
  <main data-component="Home">
    <Hero />
    <CategoryTop />
  </main>
);

import { Component, createSignal } from "solid-js";

import { HamburgerSvg, MagnifySvg } from "./svg";

export const Header: Component = () => {
  const [menuVisiblity, setMenuVisiblity] = createSignal<boolean>(false);
  const [searchVisiblity, setSearchVisiblity] = createSignal<boolean>(false);
  return (
    <header
      class="fixed top-0 left-0 z-10 flex items-center justify-start w-screen h-16 px-12 bg-bla hover:bg-black/95 transition-all"
      data-component="Header"
    >
      <div class="absolute top-0 bottom-0 left-1/2 right-auto -translate-x-1/2 flex justify-center items-center">
        <a class="font-bold text-xl text-white uppercase" href="/">
          Podcst
        </a>
      </div>
      <button
        class="group p-1 mr-6"
        aria-expanded={menuVisiblity().toString() as "true" | "false"}
        aria-controls="menu"
        aria-label="Navigation Menu"
        title="Navigation Menu"
        onClick={() => setMenuVisiblity(!menuVisiblity())}
      >
        <HamburgerSvg class="block w-5 h-auto fill-stone-300 group-hover:fill-white" />
      </button>
      <button
        class="group p-1 mr-6"
        aria-expanded={searchVisiblity().toString() as "true" | "false"}
        aria-controls="search"
        aria-label="Search"
        title="Search"
        onClick={() => setSearchVisiblity(!searchVisiblity())}
      >
        <MagnifySvg class="block w-5 h-auto fill-stone-300 group-hover:fill-white" />
      </button>
      <button class="ml-auto font-display text-sm uppercase tracking-wide text-stone-300 hover:text-white">
        Sign In
      </button>
    </header>
  );
};

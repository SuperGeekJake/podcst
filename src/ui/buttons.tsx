import { Component, JSX } from "solid-js";
import { generateClass } from "@src/utils";

export const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => (
  <button
    {...props}
    class={generateClass(
      "relative flex justify-center items-center h-10 px-6 text-white text-sm font-bold font-display uppercase tracking-wide rounded-md before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-white/20 hover:before:bg-white/40 before:active:scale-95 before:rounded-md transition-transform",
      props.class
    )}
  />
);

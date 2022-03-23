import { Component, JSX } from "solid-js";
import { generateClass } from "@src/utils";

export const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => (
  <button
    {...props}
    class={generateClass(
      "flex justify-center items-center h-10 px-6 text-white text-sm font-bold font-display uppercase tracking-wide bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-md",
      props.class
    )}
  />
);

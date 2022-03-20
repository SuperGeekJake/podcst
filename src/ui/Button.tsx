import { Component, JSX } from "solid-js";
import { generateClass } from "@src/utils";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  'data-is-active'?: boolean;
}

export const Button: Component<ButtonProps> = (props) => (
  <button
    class={generateClass(
      'rounded-sm text-base inline-block p-2 outline-none border-2 border-amber-500 min-w-[7.5rem]',
      props["data-is-active"]
        ? 'bg-amber-500 hover:bg-transparent text-slate-900 hover:text-amber-50'
        : 'bg-transparent hover:bg-amber-500 text-amber-50 hover:text-slate-900',
      props.class
    )}
    {...props}
  />
);

import { Component, createEffect, createSignal, splitProps } from "solid-js";
import { Portal, Show } from "solid-js/web";
import { computePosition } from "@floating-ui/dom";

import type {
  ClientRectObject,
  ComputePositionConfig,
} from ".pnpm/@floating-ui+core@0.3.1/node_modules/@floating-ui/core";

import { generateClass } from "./utils";

export const Popup: Component<{
  target:
    | Element
    | {
        getBoundingClientRect(): ClientRectObject;
        contextElement?: Element | undefined;
      };
  options?: Partial<ComputePositionConfig>;
  when?: boolean;
  class?: string;
}> = (props) => {
  let root: HTMLDivElement | undefined;
  const [local, rest] = splitProps(props, [
    "target",
    "children",
    "class",
    "options",
    "when",
  ]);
  const [cords, setCords] = createSignal<[number, number]>([0, 0]);

  createEffect(() => {
    if (!local.when) return;
    computePosition(local.target, root as HTMLDivElement, local.options).then(
      ({ x, y }) => {
        setCords([x, y]);
      }
    );
  });

  return (
    <Show when={local.when}>
      <Portal>
        <div
          {...rest}
          ref={(ref) => (root = ref)}
          class={generateClass("absolute top-0 left-0", local.class)}
          style={`transform: translate(${cords()[0]}px, ${cords()[1]}px)`}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

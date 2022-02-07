import { getScrollParents } from "@floating-ui/dom";
import { Accessor, onCleanup, onMount } from "solid-js";

type Directive = typeof floating | typeof fullsize | typeof forwardRef;

export function registerDirectives(...directives: Directive[]) {}

export function floating(
  element: HTMLElement,
  reference: Accessor<HTMLElement>
) {
  function update() {
    const refRect = reference().getBoundingClientRect();
    const elRect = element.getBoundingClientRect();
    const x = Math.round(refRect.x + (refRect.width - elRect.width) / 2);
    const y = Math.round(refRect.y + (refRect.height - elRect.height) / 2);
    Object.assign(element.style, {
      top: "0",
      left: "0",
      transform: `translate(${x}px,${y}px)`,
    });
  }

  let scrollParents: (Element | Window | VisualViewport)[];
  onMount(() => {
    scrollParents = [
      ...getScrollParents(reference()),
      ...getScrollParents(element),
    ];
    scrollParents.forEach((el) => {
      el.addEventListener("scroll", update);
      el.addEventListener("resize", update);
    });
    update();
  });

  onCleanup(() => {
    scrollParents.forEach((el) => {
      el.removeEventListener("scroll", update);
      el.removeEventListener("resize", update);
    });
  });
}

export function fullsize(
  element: HTMLImageElement,
  fullsizeSrc: Accessor<string>
) {
  const mockImage = new Image();
  mockImage.onload = () => {
    element.src = mockImage.src;
  };

  mockImage.src = fullsizeSrc();
}

export function forwardRef(
  ref: HTMLElement,
  callback: (ref: HTMLElement) => void
) {
  callback(ref);
}

import { Accessor } from "solid-js";

type Directive = typeof fullsize | typeof forwardRef;

export function registerDirectives(...directives: Directive[]) {}

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

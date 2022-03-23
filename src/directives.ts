import { Accessor } from "solid-js";

type Directive = typeof fullsize;

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

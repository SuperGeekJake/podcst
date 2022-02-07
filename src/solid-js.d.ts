import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      floating: HTMLElement;
      fullsize: string;
      forwardRef: (ref: HTMLAnchorElement) => void;
    }
  }
}

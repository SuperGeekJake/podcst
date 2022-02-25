import {
  Component,
  createSignal,
  splitProps,
  createMemo,
  batch,
} from "solid-js";

import { generateClass, minMax, createMountSignal } from "./utils";

export const Slider: Component<{
  class?: string;
  name: string;
  value: number;
  onInput: (value: number) => void;
}> = (props) => {
  let root: HTMLDivElement | undefined;
  let track: HTMLDivElement | undefined;
  const isMounted = createMountSignal();
  const [isDragging, setIsDragging] = createSignal(false);
  const [pointer, setPointer] = createSignal(0);
  const [local, rest] = splitProps(props, [
    "class",
    "name",
    "value",
    "onInput",
  ]);

  const onPointerDown = (event: PointerEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    // Avoid text selection
    event.preventDefault();
    (root as HTMLDivElement).focus();
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    batch(() => {
      setIsDragging(true);
      setPointer(event.clientX);
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    setPointer(event.clientX);
    const rect = (track as HTMLDivElement).getBoundingClientRect();
    const percentage = minMax((event.clientX - rect.x) / rect.width, 0, 1);
    local.onInput(percentage);
  };

  const onPointerUp = (event: PointerEvent) => {
    event.preventDefault();
    const rect = (track as HTMLDivElement).getBoundingClientRect();
    const percentage = minMax((pointer() - rect.x) / rect.width, 0, 1);
    local.onInput(percentage);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    setIsDragging(false);
  };

  /**
   * Handle seek bar positioning
   */
  const progress = createMemo(() => {
    if (!isDragging()) return local.value;
    const rect = (track as HTMLDivElement).getBoundingClientRect();
    return minMax((pointer() - rect.x) / rect.width, 0, 1);
  });

  /**
   * Handle seek thumb positioning
   */
  const thumbPosition = createMemo(() => {
    if (!isMounted()) return 0;
    return progress() * (track as HTMLDivElement).getBoundingClientRect().width;
  });

  return (
    <div
      {...rest}
      data-component="Slider"
      class={generateClass(
        "group flex h-8 px-[0.375rem] cursor-pointer",
        local.class
      )}
      ref={(ref) => (root = ref)}
      tabIndex={0}
      onPointerDown={onPointerDown}
    >
      <div
        data-component="Slider.container"
        class="relative w-full h-[0.1875rem] my-auto"
      >
        <div
          ref={(ref) => (track = ref)}
          data-component="Slider.track"
          class="absolute top-0 right-0 bottom-0 left-0 bg-neutral-700 rounded-full"
        />
        <div
          data-component="Slider.progess"
          class="absolute top-0 bottom-0 left-0 w-full bg-amber-600 rounded-full"
          style={`width: ${progress() * 100}%`}
        />
        <div
          data-component="Slider.thumb"
          class="absolute top-[-0.3125rem] left-[-0.375rem] w-[0.8125rem] h-[0.8125rem] bg-amber-500 rounded-full transition-opacity"
          style={`transform: translateX(${thumbPosition()}px)`}
        />
      </div>
      <input
        class="sr-only"
        type="range"
        id={local.name}
        name={local.name}
        min={0}
        max={1}
        step={0.01}
        value={local.value}
        onInput={(evt) => local.onInput?.(parseInt(evt.currentTarget.value))}
      />
    </div>
  );
};

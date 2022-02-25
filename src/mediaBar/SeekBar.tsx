import {
  Component,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { shift } from "@floating-ui/dom";

import { FormattedDuration } from "@src/formatting";
import { minMax, createPointerElement } from "@src/utils";
import { Popup } from "@src/Popup";

export const SeekBar: Component<{
  seek: number;
  duration: number;
  onChange: (val: number) => void;
}> = (props) => {
  let root: HTMLDivElement | undefined;
  const [isHovering, setHovering] = createSignal(false);
  const [isDragging, setDragging] = createSignal(false);
  const hasInteraction = createMemo(() => isHovering() || isDragging());

  const onPointerDown = (event: PointerEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    // Avoid text selection
    event.preventDefault();
    document.addEventListener("pointerup", onDocumentPointerUp);
    setDragging(true);
  };
  const onDocumentPointerUp = (event: PointerEvent) => {
    event.preventDefault();
    const rect = (root as HTMLDivElement).getBoundingClientRect();
    const percentage = minMax((pointerPosition() - rect.x) / rect.width, 0, 1);
    props.onChange(percentage * props.duration);
    document.removeEventListener("pointerup", onDocumentPointerUp);
    setDragging(false);
  };

  /**
   * Handle and set pointer position
   */
  const [pointerPosition, setPointerPosition] = createSignal<number>(0);
  const onPointerMove = (event: PointerEvent) => {
    if (!hasInteraction()) return;
    setPointerPosition(event.clientX);
  };
  onMount(() => document.addEventListener("pointermove", onPointerMove));
  onCleanup(() => document.removeEventListener("pointermove", onPointerMove));

  /**
   * Handle preview positioning
   */
  const virtualElement = createMemo(() =>
    createPointerElement(pointerPosition(), root?.getBoundingClientRect().top)
  );

  /**
   * Handle seek bar positioning
   */
  const seekProgress = createMemo(() => {
    if (!isDragging()) return props.seek / props.duration;
    const rect = (root as HTMLDivElement).getBoundingClientRect();
    return minMax((pointerPosition() - rect.x) / rect.width, 0, 1);
  });

  /**
   * Handle seek thumb positioning
   */
  const thumbPosition = createMemo(
    () => seekProgress() * (root?.getBoundingClientRect().width ?? 0)
  );

  /**
   * Handle seek preview
   */
  const seekPreviewValue = createMemo(() => {
    if (!hasInteraction()) return 0;
    const rect = (root as HTMLDivElement).getBoundingClientRect();
    const percentage = minMax((pointerPosition() - rect.x) / rect.width, 0, 1);
    return percentage * props.duration;
  });

  return (
    <>
      <div
        data-component="SeekBar"
        class="group absolute top-[-0.875rem] left-24 right-0 h-8 cursor-pointer"
        ref={(ref) => (root = ref)}
        tabIndex={0}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onPointerDown={onPointerDown}
      >
        <div
          data-component="Seekbar.container"
          class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem]"
        >
          <div
            data-component="Seekbar.track"
            class="absolute top-0 right-0 bottom-0 left-0 bg-neutral-700 origin-[center_left]"
          />
          <div
            data-component="SeekBar.progess"
            class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem] bg-amber-600 origin-[center_left]"
            style={`transform: scaleX(${seekProgress()})`}
          />
        </div>
        <div
          data-component="SeekBar.thumb"
          class="absolute top-[9px] left-[-6px] w-[13px] h-[13px] bg-amber-500 rounded-full transition-opacity"
          classList={{
            "opacity-100": hasInteraction(),
            "opacity-0": !hasInteraction(),
          }}
          style={`transform: translateX(${thumbPosition()}px)`}
        />
      </div>
      <Popup
        data-component="Seekbar.preview"
        class="absolute top-0 left-0 w-20 bg-black px-2 py-1 rounded-sm text-sm text-center"
        when={hasInteraction()}
        target={virtualElement()}
        options={previewConfig}
      >
        <FormattedDuration value={seekPreviewValue()} />
      </Popup>
    </>
  );
};

const previewConfig = {
  placement: "top" as const,
  middleware: [shift()],
};

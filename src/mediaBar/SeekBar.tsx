import {
  Component,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { shift } from "@floating-ui/dom";

import { FormattedDuration } from "@src/formatting";
import { minMax, createMouseElement } from "@src/utils";
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

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    document.addEventListener("mouseup", onDocumentMouseUp);
    setDragging(true);
  };
  const onDocumentMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    const rect = (root as HTMLElement).getBoundingClientRect();
    const percentage = minMax((mousePosition() - rect.x) / rect.width, 0, 1);
    props.onChange(percentage * props.duration);
    document.removeEventListener("mouseup", onDocumentMouseUp);
    setDragging(false);
  };

  /**
   * Handle and set mouse position
   */
  const [mousePosition, setMousePosition] = createSignal<number>(0);
  const onMouseMove = (event: MouseEvent) => {
    if (!hasInteraction()) return;
    setMousePosition(event.clientX);
  };
  onMount(() => document.addEventListener("mousemove", onMouseMove));
  onCleanup(() => document.removeEventListener("mousemove", onMouseMove));

  /**
   * Handle preview positioning
   */
  const virtualElement = createMemo(() =>
    createMouseElement(mousePosition(), root?.getBoundingClientRect().top)
  );

  /**
   * Handle seek bar positioning
   */
  const seekProgress = createMemo(() => {
    if (!isDragging()) return props.seek / props.duration;
    const rect = (root as HTMLElement).getBoundingClientRect();
    return minMax((mousePosition() - rect.x) / rect.width, 0, 1);
  });

  /**
   * Handle seek knob positioning
   */
  const knobPosition = createMemo(
    () => seekProgress() * (root?.getBoundingClientRect().width ?? 0)
  );

  /**
   * Handle seek preview
   */
  const seekPreviewValue = createMemo(() => {
    if (!hasInteraction()) return 0;
    const rect = (root as HTMLElement).getBoundingClientRect();
    const percentage = minMax((mousePosition() - rect.x) / rect.width, 0, 1);
    return percentage * props.duration;
  });

  return (
    <>
      <div
        class="group absolute top-[-0.875rem] left-24 right-0 h-8 cursor-pointer"
        ref={(ref) => (root = ref)}
        tabIndex={0}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseDown={onMouseDown}
        data-component="SeekBar"
      >
        <div class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem]">
          <div class="absolute top-0 right-0 bottom-0 left-0 bg-neutral-700 origin-[center_left]" />
          <div
            class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem] bg-amber-600 origin-[center_left]"
            style={`transform: scaleX(${seekProgress()})`}
            data-component="SeekBar.progress"
          />
        </div>
        <div
          class="absolute top-[9px] left-[-6px] w-[13px] h-[13px] bg-amber-500 rounded-full transition-opacity"
          classList={{
            "opacity-100": hasInteraction(),
            "opacity-0": !hasInteraction(),
          }}
          style={`transform: translateX(${knobPosition()}px)`}
          data-component="SeekBar.knob"
        />
      </div>
      <Popup
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

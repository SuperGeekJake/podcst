import { Component, createEffect, createMemo, createSignal } from "solid-js";

import { FormattedDuration } from "@src/formatting";
import { computePosition, shift } from "@floating-ui/dom";
import { minMax } from "@src/utils";

export const SeekBar: Component<{
  seek: number;
  duration: number;
  onChange: (val: number) => void;
}> = (props) => {
  let root: HTMLDivElement | undefined;
  let seekPreview: HTMLDivElement | undefined;
  const [isDragging, setDragging] = createSignal(false);
  const [mouseSeek, setMouseSeek] = createSignal<number>(0);

  const percentage = createMemo(
    () => (isDragging() ? mouseSeek() : props.seek) / props.duration
  );
  const position = createMemo(
    () => percentage() * (root?.getBoundingClientRect().width ?? 0)
  );

  const setSeek = (clientX: number, sink: (seek: number) => void) => {
    const rect = root?.getBoundingClientRect();
    if (!rect) return;
    const currentPosition = clientX - rect.x;
    const percentage = minMax(currentPosition / rect.width, 0, 100);
    const numOfSeconds = percentage * props.duration;
    sink(numOfSeconds);
  };

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    document.addEventListener("mouseup", onDocumentMouseUp);
    document.addEventListener("mousemove", onDocumentMouseMove);
    setDragging(true);
  };
  const onDocumentMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    setSeek(event.clientX, props.onChange);
    document.removeEventListener("mouseup", onDocumentMouseUp);
    document.removeEventListener("mousemove", onDocumentMouseMove);
    setDragging(false);
  };
  const onDocumentMouseMove = (event: MouseEvent) => {
    setSeek(event.clientX, setMouseSeek);
  };

  const [isHovering, setHovering] = createSignal(false);
  const onMouseEnter = (e: MouseEvent) => {
    setHovering(true);
    document.addEventListener("mousemove", onDocumentMouseMove);
  };
  const onMouseLeave = () => {
    setHovering(false);
    document.removeEventListener("mousemove", onDocumentMouseMove);
  };

  const [mousePosition, setMousePosition] = createSignal<number>(0);
  const onMouseMove = (event: MouseEvent) => {
    setMousePosition(event.clientX);
  };
  const [previewPosition, setPreviewPosition] = createSignal<string>(
    `transform: translate(0px, 0px)`
  );
  const virtualElement = createMemo(() => ({
    getBoundingClientRect: () => {
      const x = mousePosition();
      const y = root?.getBoundingClientRect().top ?? 0;
      return {
        x,
        y,
        top: y,
        left: x,
        bottom: y,
        right: x,
        width: 0,
        height: 0,
      };
    },
  }));
  createEffect(() => {
    computePosition(
      virtualElement(),
      seekPreview as HTMLDivElement,
      previewConfig
    ).then(({ x, y }) => {
      setPreviewPosition(`transform: translate(${x}px, ${y}px)`);
    });
  });

  return (
    <div
      class="group absolute top-[-0.875rem] left-24 right-0 h-8 cursor-pointer"
      ref={(ref) => (root = ref)}
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      data-component="SeekBar"
    >
      <div class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem]">
        <div class="absolute top-0 right-0 bottom-0 left-0 bg-neutral-700 origin-[center_left]" />
        <div
          ref={(ref) => (seekPreview = ref)}
          class="absolute top-0 left-0 w-20 bg-black px-2 py-1 rounded-sm text-sm text-center"
          classList={{
            visible: isHovering(),
            invisible: !isHovering(),
          }}
          style={previewPosition()}
        >
          <FormattedDuration value={mouseSeek()} />
        </div>
        <div
          class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem] bg-amber-600 origin-[center_left]"
          style={`transform: scaleX(${percentage()})`}
          data-component="SeekBar.progress"
        />
      </div>
      <div
        class="invisible group-hover:visible group-focus:visible absolute top-[9px] left-[-6px] w-[13px] h-[13px] bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
        style={`transform: translateX(${position()}px)`}
        data-component="SeekBar.knob"
      />
    </div>
  );
};

const previewConfig = {
  placement: "top" as const,
  middleware: [shift()],
};

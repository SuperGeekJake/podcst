import { Component, createMemo, createSignal } from "solid-js";

export const SeekBar: Component<{
  seek: number;
  duration: number;
  onChange: (val: number) => void;
}> = (props) => {
  let root: HTMLDivElement | undefined;
  const percentage = createMemo(() => props.seek / props.duration);
  const position = createMemo(
    () => percentage() * (root?.getBoundingClientRect().width ?? 0)
  );

  const handleClick = (e: MouseEvent) => {
    const rect = root?.getBoundingClientRect();
    if (!rect) return;
    const position = e.clientX - rect.x;
    const percentage = position / rect.width;
    const numOfSeconds = percentage * props.duration;
    props.onChange(numOfSeconds);
  };

  const [hoverPercentage, setHoverPercentage] = createSignal<number>(0);
  const handleMouseMove = (e: MouseEvent) => {
    const rect = root?.getBoundingClientRect();
    if (!rect) return;
    const position = e.clientX - rect.x;
    const percentage = position / rect.width;
    setHoverPercentage(percentage);
  };
  const handleMouseLeave = () => {
    setHoverPercentage(0);
  };
  return (
    <div
      class="group absolute top-[-0.875rem] left-24 right-0 h-8 cursor-pointer"
      ref={(ref) => {
        root = ref;
      }}
      tabIndex={0}
      data-component={SeekBar.name}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem]">
        <div class="absolute top-0 right-0 bottom-0 left-0 bg-neutral-700 origin-[center_left]" />
        <div
          class="invisible group-hover:visible group-focus:visible absolute top-0 right-0 bottom-0 left-0 bg-neutral-500 origin-[center_left] opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
          style={`transform: scaleX(${hoverPercentage()})`}
        />
        <div
          class="absolute top-1/2 left-0 w-full h-[0.1875rem] mt-[-0.125rem] bg-amber-600 origin-[center_left]"
          style={`transform: scaleX(${percentage()})`}
        />
      </div>
      <div
        class="invisible group-hover:visible group-focus:visible absolute top-[9px] left-[-6px] w-[13px] h-[13px] bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
        style={`transform: translateX(${position()}px)`}
      />
    </div>
  );
};

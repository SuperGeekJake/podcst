import { Component, createMemo } from "solid-js";

const formatNumber = (value: number) =>
  value < 10 ? `0${value}` : value.toString();

const formatDuration = (valueInSeconds: number) => {
  const hours = Math.floor(valueInSeconds / 3600);
  const minutes = Math.floor((valueInSeconds - hours * 3600) / 60);
  const seconds = Math.floor(valueInSeconds - hours * 3600 - minutes * 60);
  return [hours, minutes, seconds].map((num) => formatNumber(num)).join(":");
};

export const FormattedDuration: Component<{ value?: number }> = (props) => {
  const text = createMemo(() =>
    props.value !== undefined ? formatDuration(props.value) : "--"
  );
  return <>{text}</>;
};

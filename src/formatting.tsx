import { Component, createMemo } from "solid-js";

export const FormattedDuration: Component<{ value?: number }> = (props) => {
  const text = createMemo(() =>
    props.value !== undefined ? formatDuration(props.value) : "--"
  );
  return <>{text}</>;
};

const formatNumber = (value: number) =>
  value < 10 ? `0${value}` : value.toString();

export const formatDuration = (valueInSeconds: number) => {
  const hours = Math.floor(valueInSeconds / 3600);
  const minutes = Math.floor((valueInSeconds - hours * 3600) / 60);
  const seconds = Math.floor(valueInSeconds - hours * 3600 - minutes * 60);
  return [hours, minutes, seconds]
    .reduce((result, value, index) => {
      if (!index && !value) return result;
      if (!result.length) return [...result, value.toString()];
      return [...result, formatNumber(value)];
    }, [] as string[])
    .join(":");
};

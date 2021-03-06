import { Component, createSignal, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Link } from "solid-app-router";

import { getPodcast } from "@src/api";
import { Modal } from "./Modal";

export const Preview: Component<{
  ref: (ref: HTMLAnchorElement) => void;
  podcast: App.Podcast;
}> = (props) => {
  let root: HTMLAnchorElement;
  let isActive: boolean = false;
  const [modelData, setModalData] = createSignal<
    App.EpisodeListing | undefined
  >();

  const handleMouseEnter = async () => {
    isActive = true;
    const data = await getPodcast(props.podcast.feed);
    if (!isActive) return;
    setModalData({ ...data, categories: props.podcast.categories });
  };

  const handleMouseLeave = () => {
    isActive = false;
  };

  onCleanup(() => {
    isActive = false;
  });

  return (
    <>
      <Link
        ref={(ref) => {
          root = ref;
          props.ref(ref);
        }}
        class="flex-none h-full w-[calc(95%/6)]"
        href={`/episodes?feed=${props.podcast.feed}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          class="rounded-lg"
          src={props.podcast.cover}
          alt={props.podcast.title}
          title={props.podcast.title}
        />
      </Link>
      <Show when={modelData()}>
        <Portal>
          <Modal
            // @ts-ignore
            target={root}
            listing={modelData() as App.EpisodeListing}
            podcast={props.podcast}
            onMouseLeave={() => setModalData()}
          />
        </Portal>
      </Show>
    </>
  );
};

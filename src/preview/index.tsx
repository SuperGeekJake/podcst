import { Component, createSignal, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { getPodcast } from "@src/api";
import { useMediaContext } from "@src/mediaContext";
import { Modal } from "./Modal";
import { registerDirectives, forwardRef } from "@src/directives";

registerDirectives(forwardRef);
export const Preview: Component<{
  ref: (ref: HTMLAnchorElement) => void;
  podcast: App.Podcast;
}> = (props) => {
  let root: HTMLAnchorElement;
  let isActive: boolean = false;

  const [mediaState] = useMediaContext();
  const [showModal, setModalVisibility] = createSignal<
    App.EpisodeListing | undefined
  >();

  const handleMouseEnter = async () => {
    isActive = true;
    if (mediaState.status !== "idle") return;
    const data = await getPodcast(props.podcast.feed);
    if (!isActive) return;
    setModalVisibility({ ...data, categories: props.podcast.categories });
  };

  const handleMouseLeave = () => {
    isActive = false;
  };

  onCleanup(() => {
    isActive = false;
  });

  return (
    <>
      <a
        ref={(ref) => {
          root = ref;
          props.ref(ref);
        }}
        class="flex-none h-full w-[calc(95%/6)]"
        href="#"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        use:forwardRef={props.ref}
      >
        <img
          src={props.podcast.cover}
          alt={props.podcast.title}
          title={props.podcast.title}
        />
      </a>
      <Show when={showModal()}>
        <Portal>
          <Modal
            // @ts-ignore
            target={root}
            listing={showModal() as App.EpisodeListing}
            podcast={props.podcast}
            onMouseLeave={() => setModalVisibility()}
          />
        </Portal>
      </Show>
    </>
  );
};

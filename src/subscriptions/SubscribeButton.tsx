import { Component, createMemo } from "solid-js";
import { useSubscriptionsContext } from "./context";

export const SubscribeButton: Component<{
  feed: string;
  podcast: App.EpisodeListing;
}> = (props) => {
  const [state, actions] = useSubscriptionsContext();
  const isSubscribed = createMemo(() => props.feed in state.subs);
  const handleClick = () =>
    actions.toggleSubscription(props.feed, props.podcast);
  return (
    <button
      class="flex justify-center items-center py-2 px-6 text-white text-sm font-bold font-display uppercase tracking-wide rounded-md"
      classList={{
        "bg-red-700 hover:bg-red-600 focus:bg-red-600": isSubscribed(),
        "bg-amber-700 hover:bg-amber-600 focus:bg-amber-600": !isSubscribed(),
      }}
      onClick={handleClick}
    >
      {isSubscribed() ? "Unsubscribe" : "Subscribe"}
    </button>
  );
};

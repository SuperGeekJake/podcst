import { Component } from "solid-js";
import { Button, ButtonProps } from "@src/ui/Button";
import { useSubscriptionsContext } from "./context";

export interface SubscribeButtonProps
  extends Omit<ButtonProps, "onClick" | "data-is-active"> {
  class?: string;
  feed: string;
  podcast: App.EpisodeListing;
}

export const SubscribeButton: Component<SubscribeButtonProps> = (props) => {
  const { subs, toggleSubscription } = useSubscriptionsContext();
  const isSubscribed = props.feed in subs;
  const handleClick = () => toggleSubscription(props.feed, props.podcast);
  return (
    <Button
      class={props.class}
      data-is-active={isSubscribed}
      onClick={handleClick}
      {...props}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

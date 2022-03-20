import {
  Accessor,
  Component,
  createContext,
  createMemo,
  onMount,
  useContext,
} from "solid-js";
import { createStore, DeepReadonly } from "solid-js/store";

import { subscriptions, SubscriptionsState } from "./subscriptions";

interface SubscriptionsContextValue extends SubscriptionsState {
  subscriptionList: Accessor<DeepReadonly<App.PodcastEpisodesSubInfo[]>>;
}

type ContextValue = DeepReadonly<SubscriptionsContextValue>;

export const SubscriptionsContext = createContext<ContextValue | undefined>(
  undefined
);

export const useSubscriptionsContext = () => {
  const context = useContext(SubscriptionsContext);
  if (!context)
    throw new Error("useSubscriptionsContext has been used outside provider");
  return context;
};

export const SubscriptionsProvider: Component = (props) => {
  const [state, setState] = createStore<SubscriptionsState["subs"]>(
    subscriptions.subs
  );

  const updateState =
    <T extends (...args: any[]) => Promise<App.SubscriptionsMap>>(fn: T) =>
    async (...args: Parameters<T>) => {
      const result = await fn(...args);
      setState(subscriptions.subs);
      return result;
    };

  const subscriptionList = createMemo(() => Object.values(state));

  const value: ContextValue = {
    subs: state,
    lastSync: subscriptions.lastSync,
    init: updateState(subscriptions.init),
    addSubscription: updateState(subscriptions.addSubscription),
    removeSubscription: updateState(subscriptions.removeSubscription),
    toggleSubscription: updateState(subscriptions.toggleSubscription),
    addSubscriptions: updateState(subscriptions.addSubscriptions),
    syncSubscription: updateState(subscriptions.syncSubscription),
    syncAllSubscriptions: updateState(subscriptions.syncAllSubscriptions),
    subscriptionList,
  };

  onMount(value.init);

  return (
    <SubscriptionsContext.Provider value={value}>
      {props.children}
    </SubscriptionsContext.Provider>
  );
};

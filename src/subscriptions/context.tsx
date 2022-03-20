import {
  Component,
  createContext,
  onMount,
  useContext,
} from "solid-js";
import { createStore, DeepReadonly } from "solid-js/store";

import { subscriptions, SubscriptionsState } from "./subscriptions";

type ContextValue = DeepReadonly<SubscriptionsState>;

export const SubscriptionsContext = createContext<ContextValue | undefined>(
  undefined
);

export const useSubscriptionsContext = () => {
  const context = useContext(SubscriptionsContext);
  if (!context)
    throw new Error("usePlayerContext has been used outside provider");
  return context;
};

export const SubscriptionsProvider: Component = (props) => {
  const [state, setState] = createStore<SubscriptionsState["subs"]>(
    subscriptions.subs
  );

  const updateState =
    <T extends (...args: any[]) => Promise<App.SubscriptionsMap>>(fn: T) =>
    (...args: Parameters<T>) => {
      const result = fn(...args);
      setState(subscriptions.subs);
      return result;
    };

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
  };

  onMount(value.init);

  return (
    <SubscriptionsContext.Provider value={value}>
      {props.children}
    </SubscriptionsContext.Provider>
  );
};

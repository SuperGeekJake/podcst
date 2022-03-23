import {
  Component,
  createContext,
  onMount,
  useContext,
  createEffect,
  createMemo,
  Accessor,
} from "solid-js";
import { DeepReadonly, createStore, produce, unwrap } from "solid-js/store";

import { getValue, setValue } from "@src/storage/idb";

interface SubscriptionsState {
  subs: App.SubscriptionsMap;
  subscriptionList: App.PodcastEpisodesSubInfo[];
}

type ContextValue = [
  DeepReadonly<SubscriptionsState>,
  {
    addSubscription: (feed: string, listing: App.EpisodeListing) => void;
    removeSubscription: (feed: string) => void;
    toggleSubscription: (feed: string, listing: App.EpisodeListing) => void;
  }
];

export const SubscriptionsContext = createContext<ContextValue | []>([]);

export const useSubscriptionsContext = () => {
  const context = useContext(SubscriptionsContext);
  if (!context.length)
    throw new Error("useSubscriptionsContext has been used outside provider");
  return context;
};

export const SubscriptionsProvider: Component = (props) => {
  let subscriptionList: Accessor<App.PodcastEpisodesSubInfo[]>;
  const [state, setState] = createStore<SubscriptionsState>({
    subs: {},
    get subscriptionList() {
      return subscriptionList();
    },
  });

  subscriptionList = createMemo(() =>
    Object.values<App.PodcastEpisodesSubInfo>({
      ...state.subs,
    } as App.SubscriptionsMap)
  );

  const value: ContextValue = [
    state,
    {
      addSubscription: (feed, listing) => {
        setState(
          produce((s) => {
            s.subs[feed] = { ...listing, feed };
          })
        );
      },
      removeSubscription: (feed) => {
        setState(
          produce((s) => {
            delete s.subs[feed];
          })
        );
      },
      toggleSubscription: (feed, listing) => {
        const [, { removeSubscription, addSubscription }] = value;
        state.subs[feed]
          ? removeSubscription(feed)
          : addSubscription(feed, listing);
      },
    },
  ];

  onMount(async () => {
    const subs = await getValue("subscriptions");

    if (!subs) return;
    setState("subs", subs);
  });

  createEffect(() => {
    setValue("subscriptions", unwrap(state.subs));
  });

  return (
    <SubscriptionsContext.Provider value={value}>
      {props.children}
    </SubscriptionsContext.Provider>
  );
};

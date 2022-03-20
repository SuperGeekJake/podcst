import { getPodcast } from "@src/api";
import { getValue, setValue } from "@src/storage/idb";

export type SubscriptionsState = {
  subs: App.SubscriptionsMap;
  lastSync: number;
  init: () => Promise<App.SubscriptionsMap>;
  addSubscription: (
    feed: string,
    info: App.EpisodeListing
  ) => Promise<App.SubscriptionsMap>;
  removeSubscription: (feed: string) => Promise<App.SubscriptionsMap>;
  toggleSubscription: (
    feed: string,
    info: App.EpisodeListing
  ) => Promise<App.SubscriptionsMap>;
  addSubscriptions: (
    podcasts: App.PodcastEpisodesSubInfo[]
  ) => Promise<App.SubscriptionsMap>;
  syncSubscription: (
    feed: string,
    info: App.EpisodeListing
  ) => Promise<App.SubscriptionsMap>;
  syncAllSubscriptions: () => Promise<App.SubscriptionsMap>;
};

export const subscriptions: SubscriptionsState = {
  subs: {},
  lastSync: 0,
  init: async () => {
    const subs = await getValue("subscriptions");
    const lastSync = await getValue("lastSync");
    if (subs) {
      subscriptions.subs = subs;
    }
    if (lastSync) {
      subscriptions.lastSync = lastSync;
    }
    return subscriptions.subs;
  },
  addSubscription: async (feed, info) => {
    subscriptions.subs[feed] = { ...info, feed };
    await setValue("subscriptions", subscriptions.subs);
    return subscriptions.subs;
  },
  removeSubscription: async (feed) => {
    delete subscriptions.subs[feed];
    await setValue("subscriptions", subscriptions.subs);
    return subscriptions.subs;
  },
  toggleSubscription: (feed, info) => {
    if (subscriptions.subs[feed]) {
      return subscriptions.removeSubscription(feed);
    }
    return subscriptions.addSubscription(feed, info);
  },
  addSubscriptions: async (podcasts) => {
    const newSubs: App.SubscriptionsMap = {...subscriptions.subs};
    for (const podcast of podcasts) {
      newSubs[podcast.feed] = podcast;
    }
    subscriptions.subs = newSubs;
    await setValue("subscriptions", subscriptions.subs);
    return subscriptions.subs;
  },
  syncSubscription: async (feed, info) => {
    try {
      const latestEpisodes = await getPodcast(feed);
      subscriptions.addSubscription(feed, latestEpisodes);
    } catch (err) {
      console.error("Could not sync subscription", feed, err);
    }
    return subscriptions.subs;
  },
  syncAllSubscriptions: async () => {
    if (!isCacheStale(subscriptions.lastSync)) {
      return subscriptions.subs;
    }
    const latestSubs: App.PodcastEpisodesSubInfo[] = [];

    for (const feed of Object.keys(subscriptions.subs)) {
      try {
        const latestEpisodes = await getPodcast(feed);
        latestSubs.push({ ...latestEpisodes, feed });
      } catch (err) {
        console.error("Could not sync subscription", feed, err);
        // Wait a second in likely case of rate-limit from iTunes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return subscriptions.addSubscriptions(latestSubs);
  },
};

// 1 hour in milliseconds
const CACHE_STALE_DELTA = 60 * 60 * 1000;
const isCacheStale = (lastSyncTime: number) =>
  Date.now() - lastSyncTime > CACHE_STALE_DELTA;

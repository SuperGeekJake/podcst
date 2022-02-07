import axios from "axios";
import memoize from "fast-memoize";

const api = axios.create({
  baseURL: "https://data.podcst.io",
});

export const getTopPodcasts = memoize(() =>
  // TODO: Open issue on https://github.com/shantanuraj/podcst-api
  // API returns empty array when requesting only 1 when not cached
  api.get<App.Podcast[]>("top").then((response) => response.data)
);

export const getPodcast = memoize((podcastUrl: string) =>
  api
    .get<App.EpisodeListing>("feed", {
      params: {
        url: podcastUrl,
      },
    })
    .then((response) => response.data)
);

export const getTopEpisode = memoize(() =>
  getTopPodcasts()
    .then((data) => data[0].feed)
    .then((podcastUrl) => getPodcast(podcastUrl))
    .then((data) => data.episodes[0])
);

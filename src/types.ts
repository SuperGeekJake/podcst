/**
 * Shared Explicit state type
 */
type ExplicitState = "explicit" | "cleaned" | "notExplicit";

/**
 * iTunes typings
 */
declare namespace iTunes {
  /**
   * Search response interface
   */
  interface Response {
    results: Podcast[];
  }
  interface Podcast {
    /**
     * Podcast author name
     */
    artistName: string;
    /**
     * Podcast cover art 100x100 size
     */
    artworkUrl100: string;
    /**
     * Podcast cover art 600x600 size
     */
    artworkUrl600: string;
    /**
     * Censored Podcast name
     */
    collectionCensoredName: string;
    /**
     * Explicit status
     */
    collectionExplicitness: ExplicitState;
    /**
     * Podcast ID
     */
    collectionId: number;
    /**
     * Podcast name
     */
    collectionName: string;
    /**
     * iTunes URL
     */
    collectionViewUrl: string;
    /**
     * RSS feed url
     */
    feedUrl: string;
    /**
     * Podcast categories list numeric string ids
     */
    genreIds: string[];
    /**
     * Podcast categories list
     */
    genres: string[];
    /**
     * Entity type must always be `podcast`
     */
    kind: "podcast";
    /**
     * Primary category
     */
    primaryGenreName: string;
    /**
     * ISO Release date
     */
    releaseDate: string;
    /**
     * Episodes count
     */
    trackCount: number;
  }
  /**
   * Feed Response interface
   */
  interface FeedResponse {
    feed: {
      /**
       * List of feed podcasts
       */
      entry: FeedPodcast[];
    };
  }
  interface FeedPodcast {
    id: {
      attributes: {
        /**
         * Numeric string id
         */
        "im:id": string;
      };
    };
  }
}

/**
 * Application type dependencies
 */
declare namespace App {
  /**
   * Adapted Podcast interface
   */
  interface Podcast {
    /**
     * iTunes id of the podcast
     */
    id: number;
    /**
     * Podcast author
     */
    author: string;
    /**
     * Podcast rss feed
     */
    feed: string;
    /**
     * Podcast title
     */
    title: string;
    /**
     * Podcast large cover art
     */
    cover: string;
    /**
     * Podcast small cover art
     */
    thumbnail: string;
    /**
     * List of categories podcast appears in
     */
    categories: number[];
    /**
     * Podcast's explicitness
     */
    explicit: ExplicitState;
    /**
     * Podcast's episode count
     */
    count: number;
  }

  /**
   * Adapted Episode interface
   */
  interface Episode {
    author: string | null;
    cover: string | null;
    duration: number | null;
    episodeArt: string | null;
    explicit: boolean;
    file: {
      length: number;
      type: string;
      url: string;
    };
    guid: string;
    link: string | null;
    published: number | null;
    showNotes: string;
    summary: string | null;
    title: string;
  }

  /**
   * Episode listing
   */
  interface EpisodeListing {
    author: string;
    cover: string;
    description: string;
    episodes: Episode[];
    explicit: boolean;
    keywords: string[];
    link: string;
    published: number | null;
    title: string;
  }

  /**
   * Podcasts Search result interface
   */
  interface PodcastSearchResult {
    author: string;
    feed: string;
    thumbnail: string;
    title: string;
  }

  /**
   * Search function interface
   */
  type Search = (term: string) => Promise<PodcastSearchResult[]>;

  /**
   * Top podcasts function interface
   */
  type Top = (count: number) => Promise<Podcast[]>;

  /**
   * Feed lookup function interface
   */
  type FeedLookup = (url: string) => Promise<EpisodeListing | null>;

  /**
   * Cache response typewrapper
   */
  type CacheResponse<T> = Promise<App.CachedEntity<T>>;

  interface Cache {
    top: Provider["top"]["cache"];
    feed: Provider["feed"]["cache"];
  }

  /**
   * Redis cached entity with timestamp
   */
  interface CachedEntity<T> {
    timestamp: number;
    entity: T;
  }

  /**
   * Data provider contract
   */
  interface Provider {
    feed: {
      api: (url: string) => Promise<EpisodeListing | null>;
      cache: (url: string) => CacheResponse<EpisodeListing | null>;
      data: (url: string) => CacheResponse<EpisodeListing | null>;
    };

    search: {
      api: (term: string) => Promise<PodcastSearchResult[]>;
      data: (term: string) => Promise<PodcastSearchResult[]>;
    };

    top: {
      api: (count: number) => Promise<Podcast[]>;
      cache: (count: number) => CacheResponse<Podcast[]>;
      data: (count: number) => CacheResponse<Podcast[]>;
    };
  }
}

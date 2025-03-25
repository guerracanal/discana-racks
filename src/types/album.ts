export interface Album {
    _id: string;
    title: string;
    image: string;
    artist: string;
    genre?: string[];
    subgenres?: string[];
    duration?: number;
    tracks?: number;
    mood?: string[];
    compilations?: string[];
    date_release?: string;
    spotify_link?: string;    
    format?: string[];
    country?: string;
    mbid?: string;
    playcount?: number;
    lastfm_link?: string;
    listeners?: number;
    listens?: number;
    percentage_playcount?: number;
    percentage_listeners?: number;
    total_playcount?: number;
    total_listeners?: number;

    discogs_link?: string;
    discogs_id?: string;
}

export interface AlbumCardProps {
    album: Album;
    className?: string;
    filter: "all" | "disc" | "spotify";
}
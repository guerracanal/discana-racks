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

    card_link?: string; // Enlace para la tarjeta del álbum
    card_image?: string; // Imagen de la tarjeta
    scrobbles?: string; // Número de scrobbles
    note?: string; // Nota asociada al álbum
    review?: string; // Reseña del álbum
    tracklist?: string; // Lista de pistas en formato texto
    links?: string; // Enlaces adicionales relacionados con el álbum
    type?: string; // Tipo de álbum (e.g., "album", "single")
    date_last_modification?: string; // Fecha de última modificación

    lastfm?: {
        artist?: string; // Artista desde Last.fm
        name?: string; // Título del álbum desde Last.fm
        tags?: {
            tag?: {
                name: string;
                url: string;
            }[];
        };
        tracks?: {
            track?: {
                name: string;
                url: string;
                duration: number;
            }[];
        };
        image?: {
            size: string;
            "#text": string;
        }[]; // Lista de imágenes desde Last.fm
        url?: string;
        description?: string;
        wiki?: {
            published?: string;
            summary?: string;
            content?: string;
        }; // Nueva propiedad para la wiki de Last.fm
    };

    spotify?: {
        artist?: string; // Artista desde Spotify
        title?: string; // Título del álbum desde Spotify
        image?: string; // Imagen del álbum desde Spotify
        date_release?: string; // Fecha de lanzamiento desde Spotify
        genre?: string[]; // Géneros desde Spotify
        spotify_link?: string; // Enlace a la pista en Spotify
        tracks?: {
            name: string;
            duration: number;
            url?: string;
        }[]; // Lista de pistas desde Spotify
    }; // Nueva propiedad para los datos de Spotify

    discogs?: {
        format?: string;
        discogs_link?: string;
        image?: string; // Imagen del álbum desde Discogs
        date_release?: string; // Fecha de lanzamiento desde Discogs
        genre?: string[]; // Géneros desde Discogs
        tracklist?: {
            name: string;
            duration?: number;
            url?: string;
        }[]; // Lista de pistas desde Discogs
    }; // Extendemos la propiedad para incluir más datos de Discogs
}

export interface AlbumCardProps {
    album: Album;
    className?: string;
    filter: "all" | "disc" | "spotify";
}
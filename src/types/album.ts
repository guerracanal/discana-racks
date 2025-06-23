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
    spotify_id?: string;
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
        listeners?: string; // Oyentes totales en Last.fm
        playcount?: string; // Reproducciones totales en Last.fm
        user_most_listened_track?: {
            name: string; // Nombre de la canción más escuchada por el usuario
            user_playcount: number; // Veces que el usuario escuchó la canción
        };
        total_most_listened_track?: {
            name: string; // Nombre de la canción más escuchada en Last.fm
            total_playcount: number; // Reproducciones totales de la canción
        };
        album_playcount?: number; // Veces que el usuario escuchó el álbum
        user_scrobbles?: number; // Scrobbles totales del usuario
        last_listened_date?: string | null; // Fecha de la última escucha
        recently_listened?: boolean; // Indica si se escuchó recientemente
    };

    spotify?: {
        spotify_id?: string;
        artist?: string; // Artista desde Spotify
        title?: string; // Título del álbum desde Spotify
        image?: string; // Imagen del álbum desde Spotify
        date_release?: string; // Fecha de lanzamiento desde Spotify
        genre?: string[]; // Géneros desde Spotify
        spotify_link?: string; // Enlace a la pista en Spotify
        tracks?: number; // Número total de pistas
        duration?: number; // Duración total del álbum en minutos
        track_details?: {
            disc_number: number; // Número del disco
            duration_ms: number; // Duración de la pista en milisegundos
            explicit: boolean; // Indica si la pista es explícita
            href: string; // Enlace a la API de Spotify para la pista
            id: string; // ID de la pista en Spotify
            is_local: boolean; // Indica si la pista es local
            name: string; // Nombre de la pista
            popularity: number | null; // Popularidad de la pista
            preview_url: string | null; // URL de vista previa de la pista
            track_number: number; // Número de la pista en el álbum
            type: string; // Tipo de recurso (e.g., "track")
            uri: string; // URI de la pista en Spotify
        }[]; // Lista de detalles de las pistas
        popularity?: number; // Popularidad del álbum desde Spotify
        explicit?: boolean; // Indica si el álbum es explícito
        album_type?: string; // Tipo de álbum desde Spotify (e.g., "album", "single")
        release_date?: string; // Fecha de lanzamiento desde Spotify
        external_ids?: {
            isrc?: string; // Código ISRC del álbum
            upc?: string; // Código UPC del álbum
        };
        external_urls?: {
            spotify?: string; // Enlace a la pista en Spotify
        };
        available_markets?: string[]; // Mercados disponibles para el álbum
        album_group?: string; // Grupo de álbumes desde Spotify
        label?: string; // Sello discográfico desde Spotify
        recently_listened?: boolean; // Indica si el álbum ha sido escuchado recientemente
        last_listened_date?: string; // Fecha de la última escucha
        is_saved?: boolean; // Indica si el álbum ha sido escuchado recientemente
    }; // Nueva propiedad para los datos de Spotify

    discogs?: {
        format?: string;
        discogs_link?: string;
        image?: string; // Imagen del álbum desde Discogs
        date_release?: string; // Fecha de lanzamiento desde Discogs
        genre?: string[]; // Géneros desde Discogs
        subgenres?: string[]; // subgenres desde Discogs
        tracklist?: {
            name: string;
            duration?: number;
            url?: string;
        }[]; // Lista de pistas desde Discogs
        formats?: {
            id: number; // ID de la release
            url: string; // URL de la release en Discogs
            formats: {
                name: string; // Nombre del formato (e.g., Vinyl, CD)
                qty?: string; // Cantidad (e.g., "1")
                text?: string; // Texto adicional (e.g., "Blood Red")
                descriptions?: string[]; // Descripciones (e.g., ["LP", "Album"])
            }[];
        }[]; // Lista de formatos en la colección
    }; // Extendemos la propiedad para incluir más datos de Discogs

    musicbrainz?: {
        tags?: {
            tag?: {
                name: string;
                url: string;
            }[];
        };
        genres?: string[]; // Géneros desde MusicBrainz
        release_group?: {
            title?: string; // Título del álbum desde MusicBrainz
            artist?: string; // Artista desde MusicBrainz
            date?: string; // Fecha de lanzamiento desde MusicBrainz
            country?: string; // País de lanzamiento desde MusicBrainz
            type?: string; // Tipo de lanzamiento desde MusicBrainz
            cover_art_archive?: {
                front?: boolean; // Indica si hay una imagen de portada
                back?: boolean; // Indica si hay una imagen de contraportada
                artwork?: boolean; // Indica si hay arte adicional
                images?: {
                    small?: string; // URL de la imagen pequeña
                    large?: string; // URL de la imagen grande
                    [key: string]: string | undefined; // Permite otras propiedades dinámicas
                }[];
            };
            release_events?: {
                date?: string; // Fecha de lanzamiento
                area?: {
                    name?: string; // Nombre del área
                    iso_3166_1?: string; // Código ISO 3166-1 del área
                    disambiguation?: string; // Desambiguación del área
                    [key: string]: string | undefined; // Permite otras propiedades dinámicas
                }[];
                country?: {
                    name?: string; // Nombre del país
                    iso_3166_1?: string; // Código ISO 3166-1 del país
                    disambiguation?: string; // Desambiguación del país
                    [key: string]: string | undefined; // Permite otras propiedades dinámicas
                }[];
                [key: string]: any; // Permite otras propiedades dinámicas
            }[];
            [key: string]: any; // Permite otras propiedades dinámicas
        };
        release?: {
            title?: string; // Título del álbum desde MusicBrainz
            artist?: string; // Artista desde MusicBrainz
            date?: string; // Fecha de lanzamiento desde MusicBrainz
            country?: string; // País de lanzamiento desde MusicBrainz
            type?: string; // Tipo de lanzamiento desde MusicBrainz
            cover_art_archive?: {
                front?: boolean; // Indica si hay una imagen de portada
                back?: boolean; // Indica si hay una imagen de contraportada
                artwork?: boolean; // Indica si hay arte adicional
                images?: {
                    small?: string; // URL de la imagen pequeña
                    large?: string; // URL de la imagen grande
                    [key: string]: string | undefined; // Permite otras propiedades dinámicas
                }[];
                [key: string]: any; // Permite otras propiedades dinámicas
            };
        };
        [key: string]: any; // Permite otras propiedades dinámicas
    };
}

export interface AlbumCardProps {
    album: Album;
    className?: string;
    filter: "all" | "disc" | "spotify";
    albums_collection: string; 
}
export interface Album {
    id: string;
    title: string;
    image: string;
    artist: string;
    genre: string[];
    subgenres: string[];
    duration: string;
    tracks: number;
    mood: string[];
    date_release: string;
    spotify_link: string;
    format: string[];
    country: string;
  }
  
  export interface AlbumCardProps {
    album: Album;
  }
  
/*
  interface Pagination {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }

  */
  
  /*
  interface ApiResponse {
    data: Album[];
    pagination: Pagination;
  }
    */
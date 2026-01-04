interface MovieDetails {
    id: string;
    title: string;
    adult: boolean;
    backdrop_path: string;
    genres: {
        id: number[];
        name: string;
    }[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    runtime: number;
    video: boolean;
    vote_average: number;
    vote_count: number;
}



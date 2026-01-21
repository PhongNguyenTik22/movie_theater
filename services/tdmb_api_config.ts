export const tmdb_api_config = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

export const fetchMovie = async ({query}: {query:string}) => {
    const endpoint = query
        ? `${tmdb_api_config.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=vi`
        : `${tmdb_api_config.BASE_URL}/discover/movie?sort_by=popularity.desc&language=vi`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: tmdb_api_config.headers,
    });

    if (!response.ok) {
        // @ts-ignore
        throw new Error('Lỗi không thể lấy phim từ TMDB', response.statusText);
    }

    const data = await response.json();

    return data.results;
}

export const fetchMovieDetails = async (movieId:string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${tmdb_api_config.BASE_URL}/movie/${movieId}?api_key=${tmdb_api_config.API_KEY}&language=vi`, {
            method: 'GET',
            headers: tmdb_api_config.headers,
        })

        if (!response.ok) {
            throw new Error('Movie details not found');

        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
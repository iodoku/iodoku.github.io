import React, { useState, useEffect, useRef } from 'react';
import { getAPIData } from './API';
import { handleMovieClick, getLikedMovies } from './Like';
import '../CSS-File/Loading.css';
import '../CSS-File/Image.css';
import '../CSS-File/InfiniteScroll.css';

const InfiniteScrollView = () => {
    const { apiKey, IDKey } = getAPIData();

    const envapiKey = process.env.REACT_APP_TMDB_API_KEY;

    const [movies, setMovies] = useState([]);
    const [visibleMovies, setVisibleMovies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const [likedMovies, setLikedMovies] = useState(getLikedMovies(IDKey));

    const fetchMovies = async (currentPage) => {
        try {
            const responses = await Promise.all(
                Array.from({ length: 3 }, (_, i) => 
                    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${envapiKey}&language=ko-KR&page=${currentPage + i}`)
                )
            );
            const data = await Promise.all(responses.map(res => res.json()));
            const newMovies = data.flatMap(pageData => pageData.results);
            setMovies(prev => [...prev, ...newMovies]);
            setVisibleMovies(prev => [...new Set([...prev, ...newMovies], m => m.id)]);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to load movies. Please try again later.');
        }
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !isFetching) {
            setIsFetching(true);
        }
    };

    useEffect(() => {
        if (isFetching) {
            setPage(prev => prev + 3);
            setIsFetching(false);
        }
    }, [isFetching]);

    useEffect(() => {
        fetchMovies(page);
        if (isLoading) setTimeout(() => setIsLoading(false), 100);
    }, [page]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div>
            <div ref={scrollContainerRef} className='container-infinite'>
                {isLoading && <div className="loader" />}
                {error && <div className="error-message">{error}</div>}
                <div className="movie-grid-infinite">
                    {visibleMovies.map(movie => (
                        <div key={movie.id} onClick={() => handleMovieClick(movie.id, movie, likedMovies, setLikedMovies, IDKey)} className="movie-item">
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="movie-image-infinite movie-image-feature"/>
                            {likedMovies.some(likedMovie => likedMovie.id === movie.id) && <span className="liked-icon-infinite">❤️</span>}
                            <span className="movie-title-infinite">{movie.title}</span>
                        </div>
                    ))}
                </div>
                {isFetching && <div className="loader" />}
            </div>
            <button onClick={scrollToTop} className="scroll-top-button">↑</button>
        </div>
    );
};

export default InfiniteScrollView;

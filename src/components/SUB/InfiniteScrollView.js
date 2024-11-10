import React, { useState, useEffect, useRef } from 'react';
import { getAPIData } from './API';
import { handleMovieClick, getLikedMovies } from './Like';
import '../CSS-File/Loading.css';
import '../CSS-File/Image.css';

const InfiniteScrollView = () => {
    const { apiKey, IDKey } = getAPIData();
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
                    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${currentPage + i}`)
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
            <div ref={scrollContainerRef} style={{ height: '1170px', overflowY: 'scroll', padding: '80px', backgroundColor: '#333' }}>
                {isLoading && <div className="loader" />}
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(6, 1fr)' }}>
                    {visibleMovies.map(movie => (
                        <div key={movie.id} onClick={() => handleMovieClick(movie.id, movie, likedMovies, setLikedMovies, IDKey)} style={{ textAlign: 'center', position: 'relative' }}>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '200px', height: '270px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
                            {likedMovies.some(likedMovie => likedMovie.id === movie.id) && <span style={{ position: 'absolute', top: '5px', right: '20px', color: 'red', fontSize: '20px' }}>❤️</span>}
                            <span style={{ display: 'block', fontSize: '14px', color: 'white' }}>{movie.title}</span>
                        </div>
                    ))}
                </div>
                {isFetching && <div className="loader" />}
            </div>
            <button onClick={scrollToTop} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', padding: '10px', backgroundColor: '#fff', color: 'blue', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>↑</button>
        </div>
    );
};

export default InfiniteScrollView;

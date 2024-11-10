import React, { useState, useEffect } from 'react';
import './Loading.css'; // CSS 파일 임포트
import './Image.css'; // CSS 파일 임포트

const TableView = () => {
    
    let apiKey = sessionStorage.getItem('CurEmail') || ''; // sessionStorage에서 값을 가져옴
    let IDKey = sessionStorage.getItem('CurID') || ''; // sessionStorage에서 값을 가져옴

    if (localStorage.getItem('Remembercheck')) {
        apiKey = localStorage.getItem('Remembercheck') || ''; // Remembercheck 값으로 apiKey를 덮어씀
        IDKey = localStorage.getItem('RemembercheckID') || ''; // Remembercheck 값으로 apiKey를 덮어씀
    }

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 좋아요한 영화 목록을 관리하는 상태 (로컬 스토리지에서 불러옴)
    const [likedMovies, setLikedMovies] = useState(
        JSON.parse(localStorage.getItem(IDKey+'likedMovies')) || []
    );


    const handleMovieClick = (movieId, movie) => {
        // 영화가 좋아요 목록에 있는지 확인
        const isMovieLiked = likedMovies.some((likedMovie) => likedMovie.id === movieId);
    
        if (isMovieLiked) {
            // 영화가 좋아요 목록에 있으면 제거
            const updatedMovies = likedMovies.filter((movie) => movie.id !== movieId);
            setLikedMovies(updatedMovies); // 좋아요 목록에서 제거
            localStorage.setItem(IDKey + 'likedMovies', JSON.stringify(updatedMovies)); // localStorage 업데이트
        } else {
            // 영화가 좋아요 목록에 없으면 추가
            const updatedMovies = [...likedMovies, movie];
            setLikedMovies(updatedMovies); // 좋아요 목록에 추가
            localStorage.setItem(IDKey + 'likedMovies', JSON.stringify(updatedMovies)); // localStorage 업데이트
        }
    };

    const fetchMovies = async (currentPage) => {
        try {
            const requests = [];
            for (let i = 0; i < 3; i++) {
                requests.push(fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${currentPage + i}`));
            }
            const responses = await Promise.all(requests);
            const data = await Promise.all(responses.map(response => response.json()));

            const newMovies = data.flatMap(pageData => pageData.results);
            setMovies(newMovies);
            setTotalPages(data[0].total_pages);
        } catch (error) {
            console.error('영화 데이터를 불러오는 중 오류가 발생했습니다:', error);
            setError('영화 데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        fetchMovies(page);
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        }
    }, [page]);

    const handleNextPage = () => {
        setIsFetching(true);
        if (page + 10 <= totalPages) {
            setPage(prevPage => prevPage + 10);
        }
        setTimeout(() => {
            setIsFetching(false);
        }, 100);
    };

    const handlePreviousPage = () => {
        setIsFetching(true);
        if (page <= 10) {
            setPage(1);
        } else {
            setPage(prevPage => prevPage - 10);
        }
        setTimeout(() => {
            setIsFetching(false);
        }, 100);
    };

    const handlePageClick = (pageNumber) => {
        setIsFetching(true);
        setPage(pageNumber);
        setTimeout(() => {
            setIsFetching(false);
        }, 100);
    };


    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: '#333333', padding: '30px' }}>
                {isLoading && <div className="loader"></div>}
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gridTemplateRows: 'repeat(6, 1fr)',
                        gap: '10px',
                        justifyItems: 'center',
                    }}
                >
                    {movies.map((movie, index) => (
                        <div key={`${movie.id}-${index}`} style={{ position: 'relative', textAlign: 'center' }} onClick={() => handleMovieClick(movie.id, movie)}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{
                                    width: '100px',
                                    height: '140px',
                                    marginBottom: '10px',
                                    objectFit: 'cover',
                                }}
                                className="movie-image"
                            />
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    color: 'white',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100px',
                                }}
                            >
                                {movie.title}
                            </span>

                            {/* 좋아요된 영화만 빨간색 하트 표시 */}
                            {likedMovies.some(likedMovie => likedMovie.id === movie.id) && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        color: 'red',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ❤️
                                </span>
                            )}
                        </div>
                    ))}
                    {isFetching && <div className="loader"></div>}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        style={{
                            padding: '10px 20px',
                            margin: '0 10px',
                            backgroundColor: '#555555',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {"< 이전"}
                    </button>

                    {Array.from({ length: Math.min(10, totalPages) }).map((_, index) => {
                        const pageNum = page + index;
                        if (pageNum <= totalPages) {
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageClick(pageNum)}
                                    style={{
                                        padding: '10px 15px',
                                        margin: '0 5px',
                                        backgroundColor: page === pageNum ? '#ff6600' : '#555555',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={handleNextPage}
                        disabled={page + 10 > totalPages}
                        style={{
                            padding: '10px 20px',
                            margin: '0 10px',
                            backgroundColor: '#555555',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: page + 10 > totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {"다음 >"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableView;

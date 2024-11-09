import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; // 하트 아이콘 추가
import './Loading.css'; // CSS 파일 임포트

const InfiniteScrollView = () => {
    let apiKey = sessionStorage.getItem('CurEmail') || 'your_api_key_here';
    if (localStorage.getItem('Remembercheck')) {
        apiKey = localStorage.getItem('Remembercheck') || ''; // Remembercheck 값으로 apiKey를 덮어씀
    }
    const [movies, setMovies] = useState([]);
    const [visibleMovies, setVisibleMovies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1); // 현재 페이지를 관리
    const [error, setError] = useState(null); // 에러 상태 추가
    const scrollContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // 좋아요한 영화 목록 가져오기
    const getLikedMovies = () => {
        return JSON.parse(localStorage.getItem('likedMovies')) || [];
    };

    // 여러 페이지의 데이터를 가져오는 함수
    const fetchMovies = async (currentPage) => {
        try {
            const requests = []; // 여러 페이지 요청을 저장할 배열
            for (let i = 0; i < 3; i++) { // 3개의 페이지를 요청
                requests.push(fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${currentPage + i}`));
            }
            const responses = await Promise.all(requests);
            const data = await Promise.all(responses.map(response => response.json()));

            // 모든 페이지에서 가져온 데이터를 합침
            const newMovies = data.flatMap(pageData => pageData.results);

            // 기존 visibleMovies에 있는 영화와 중복되지 않게 새로운 영화만 추가
            setMovies((prevMovies) => [...prevMovies, ...newMovies]); // 기존 영화 목록에 새 데이터 추가
            setVisibleMovies((prevVisibleMovies) => {
                const uniqueMovies = [...prevVisibleMovies];
                newMovies.forEach((movie) => {
                    if (!uniqueMovies.some((m) => m.id === movie.id)) {
                        uniqueMovies.push(movie); // 중복되지 않으면 추가
                    }
                });
                return uniqueMovies;
            });
        } catch (error) {
            console.error('영화 데이터를 불러오는 중 오류가 발생했습니다:', error);
            setError('영화 데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
        }
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !isFetching) {
            setIsFetching(true);
        }
    };

    const loadMoreMovies = () => {
        setPage((prevPage) => prevPage + 3); // 페이지를 3단위로 증가시켜 다음 데이터를 로드
        setTimeout(() => {
            setIsFetching(false);
        }, 100);
    };

    useEffect(() => {
        fetchMovies(page);
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        }
    }, [page]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        container.addEventListener('scroll', handleScroll);

        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        loadMoreMovies();
    }, [isFetching]);

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLike = (movie) => {
        const likedMovies = getLikedMovies();
        if (likedMovies.some((likedMovie) => likedMovie.id === movie.id)) {
            // 이미 좋아요가 눌린 영화라면 제거
            const updatedMovies = likedMovies.filter((likedMovie) => likedMovie.id !== movie.id);
            localStorage.setItem('likedMovies', JSON.stringify(updatedMovies));
        } else {
            // 좋아요를 눌렀다면 추가
            likedMovies.push(movie);
            localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
        }
    };

    return (
        <div>
            <div
                ref={scrollContainerRef}
                style={{
                    height: '1170px',
                    overflowY: 'scroll',
                    border: '1px solid #ddd',
                    padding: '80px',
                    backgroundColor: '#333333',
                    border: 'none',
                }}
            >
                {isLoading && <div className="loader"></div>}
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>} {/* 오류 메시지 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)', // 가로로 10개씩 배열
                    gridTemplateRows: 'repeat(6, 1fr)', // 세로로 6개씩 배열
                }}>
                    {visibleMovies.map((movie, index) => {
                        const isLiked = getLikedMovies().some((likedMovie) => likedMovie.id === movie.id);
                        return (
                            <div key={`${movie.id}-${index}`} style={{ textAlign: 'center', position: 'relative' }}>                           
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{
                                        width: '200px',
                                        height: '270px',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                {isLiked && ( // 좋아요한 영화에만 하트 아이콘을 표시
                                    <button
                                        onClick={() => handleLike(movie)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px', 
                                            right: '25px', 
                                            background: 'transparent', 
                                            border: 'none', 
                                            color: 'red',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>
                                )}
                                <span style={{ display: 'block', fontSize: '14px', color: 'white' }}>{movie.title}</span>
                            </div>
                        );
                    })}
                </div>

                {/* 로딩 스피너 표시 */}
                {isFetching && <div className="loader"></div>}
            </div>

            <button
                onClick={scrollToTop}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '10px',
                    backgroundColor: '#fff',
                    color: 'blue',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                ↑
            </button>
        </div>
    );
};

export default InfiniteScrollView;

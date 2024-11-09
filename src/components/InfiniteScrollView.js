import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'; // 아이콘 추가
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
    
    // 여러 페이지의 데이터를 가져오는 함수
    const fetchMovies = async (currentPage) => {
        try {
            const requests = []; // 여러 페이지 요청을 저장할 배열
            for (let i = 0; i < 3; i++) { // 5개의 페이지를 요청
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
        setPage((prevPage) => prevPage + 3); // 페이지를 5단위로 증가시켜 다음 데이터를 로드
        setTimeout(() => {
            setIsFetching(false);
        }, 100);
    };

    useEffect(() => {
        fetchMovies(page);
        if(isLoading){
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
                    gridTemplateColumns: 'repeat(10, 1fr)', // 가로로 14개씩 배열
                    gridTemplateRows: 'repeat(6, 1fr)', // 세로로 7개씩 배열
                }}>
                    {visibleMovies.map((movie, index) => (
                        <div key={`${movie.id}-${index}`} style={{ textAlign: 'center' }}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: '120px', height: '160px', margin: '0' }}
                            />
                            <span style={{ display: 'block', fontSize: '14px', color: 'white' }}>{movie.title}</span>
                        </div>
                    ))}
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
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </button>
        </div>
    );
};

export default InfiniteScrollView;

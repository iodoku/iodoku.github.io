import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'; // 아이콘 추가

const InfiniteScrollView = () => {
    const apiKey = sessionStorage.getItem('CurEmail') || 'your_api_key_here';
    const [movies, setMovies] = useState([]);
    const [visibleMovies, setVisibleMovies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1); // 현재 페이지를 관리
    const scrollContainerRef = useRef(null);

    // 여러 페이지의 데이터를 가져오는 함수
    const fetchMovies = async (currentPage) => {
        try {
            const requests = []; // 여러 페이지 요청을 저장할 배열
            for (let i = 0; i < 5; i++) { // 4개의 페이지를 요청
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
        setPage((prevPage) => prevPage + 5); // 페이지를 4단위로 증가시켜 다음 데이터를 로드
        setIsFetching(false);
    };

    useEffect(() => {
        fetchMovies(page);
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
                    padding: '30px',
                    backgroundColor: '#333333'
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(14, 1fr)', // 가로로 14개씩 배열
                    gridTemplateRows: 'repeat(7, 1fr)', // 세로로 7개씩 배열
                }}>
                    {visibleMovies.map((movie, index) => (
                        <div key={`${movie.id}-${index}`} style={{ textAlign: 'center' }}>
                            <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
                                {/* 로딩 중일 때 보여줄 스피너 */}
                                <div className="spinner" style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    visibility: movie.loading ? 'visible' : 'hidden',
                                    animation: movie.loading ? 'spin 1s linear infinite' : 'none',  // 애니메이션 적용
                                }}></div>

                                {/* 이미지를 로딩 전까지 숨기고, 로드되면 표시 */}
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{
                                        width: '130px',
                                        height: '130px',
                                        margin: '0',
                                        visibility: movie.loading ? 'hidden' : 'visible', // 로딩 중에는 이미지 숨김
                                    }}
                                />
                            </div>
                            <span style={{ display: 'block', fontSize: '14px', color: 'white' }}>{movie.title}</span>
                        </div>
                    ))}
                </div>
                {isFetching && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div className="spinner"></div> {/* 로딩 스피너 */}
                    </div>
                )}
            </div>

            <button
                onClick={scrollToTop}
                style={{
                    position: 'absolute', // 스크롤 영역 내에서 고정 위치
                    bottom: '10px', // 하단에 배치
                    left: '50%', // 수평 중앙 배치
                    transform: 'translateX(-50%)', // 정확한 중앙 위치 조정
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

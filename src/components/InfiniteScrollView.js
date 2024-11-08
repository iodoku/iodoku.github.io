import React, { useState, useEffect, useRef } from 'react';

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
                    height: '1150px',
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
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: '130px', height: '130px' , margin:'0'}}
                            />
                            <span style={{ display: 'block', fontSize: '14px' ,color: 'white' }}>{movie.title}</span>
                        </div>
                    ))}
                </div>
                {isFetching && <p>더 많은 영화를 불러오는 중...</p>}
            </div>

            <button
                onClick={scrollToTop}
                style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                ↑ 맨 위로
            </button>
        </div>
    );
};

export default InfiniteScrollView;

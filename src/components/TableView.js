import React, { useState, useEffect } from 'react';
import './Loading.css'; // CSS 파일 임포트

const TableView = () => {
    let apiKey = sessionStorage.getItem('CurEmail') || 'your_api_key_here';
    if (localStorage.getItem('Remembercheck')) {
        apiKey = localStorage.getItem('Remembercheck') || ''; // Remembercheck 값으로 apiKey를 덮어씀
    }
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지를 관리
    const [error, setError] = useState(null); // 에러 상태 추가
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태 추가

    // 페이지별 데이터를 가져오는 함수
    const fetchMovies = async (currentPage) => {
        try {
            const requests = []; // 여러 페이지 요청을 저장할 배열
            for (let i = 0; i < 3; i++) { // 3개의 페이지를 요청하여 60개의 영화를 가져옴
                requests.push(fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${currentPage + i}`));
            }
            const responses = await Promise.all(requests);
            const data = await Promise.all(responses.map(response => response.json()));

            // 모든 페이지에서 가져온 데이터를 합침
            const newMovies = data.flatMap(pageData => pageData.results);
            setMovies(newMovies); // 새 데이터를 현재 페이지 영화로 설정

            // 전체 페이지 수 업데이트
            setTotalPages(data[0].total_pages);
        } catch (error) {
            console.error('영화 데이터를 불러오는 중 오류가 발생했습니다:', error);
            setError('영화 데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        fetchMovies(page);
    }, [page]);

    const handleNextPage = () => {
        if (page + 10 <= totalPages) {
            setPage(prevPage => prevPage + 10); // 10개 단위로 페이지 증가
        }
    };

    const handlePreviousPage = () => {
        if (page <= 10) {
            setPage(1); // 10번 이하일 경우 첫 번째 페이지로 이동
        } else {
            setPage(prevPage => prevPage - 10); // 10개 단위로 페이지 감소
        }
    };

    const handlePageClick = (pageNumber) => {
        setPage(pageNumber); // 사용자가 직접 페이지 번호를 클릭하면 해당 페이지로 이동
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div
                style={{
                    backgroundColor: '#333333',
                    padding: '30px',
                }}
            >
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>} {/* 오류 메시지 */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)', // 가로로 10개씩 배치
                        gridTemplateRows: 'repeat(6, 1fr)', // 세로로 6개씩 배치
                        gap: '10px',
                        justifyItems: 'center',
                    }}
                >
                    {movies.map((movie, index) => (
                        <div key={`${movie.id}-${index}`} style={{ textAlign: 'center' }}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={{
                                    width: '100px', // 이미지 너비를 줄임
                                    height: '150px', // 이미지 높이를 줄임
                                    marginBottom: '10px',
                                    objectFit: 'cover', // 비율에 맞춰 이미지를 잘라서 보여줌
                                }}
                            />
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    color: 'white',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100px', // 제목이 길어지면 자르도록 설정
                                    marginBottom: '10px',
                                }}
                            >
                                {movie.title}
                            </span>
                        </div>
                    ))}
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

                    {/* 페이지 번호 표시 및 클릭 가능하도록 수정 */}
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

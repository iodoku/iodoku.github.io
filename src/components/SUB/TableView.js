import React, { useState, useEffect } from 'react';
import '../CSS-File/Loading.css'; // CSS 파일 임포트
import '../CSS-File/Image.css'; // CSS 파일 임포트
import '../CSS-File/TableView.css'; // CSS 파일 임포트
import { getAPIData } from './API'; 
import { handleMovieClick, getLikedMovies } from './Like';

const TableView = () => {
    const { apiKey, IDKey } = getAPIData();

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 좋아요한 영화 목록을 관리하는 상태 (로컬 스토리지에서 불러옴)
    const [likedMovies, setLikedMovies] = useState(getLikedMovies(IDKey));

    const fetchMovies = async (currentPage) => {
        try {
            const requests = [];
            // 각 페이지마다 API 요청 범위 지정
            const startPage = (currentPage - 1) * 2 + 1;
            const endPage = startPage + 1;

            for (let i = startPage; i <= endPage; i++) {
                requests.push(fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${i}`));
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
        if (page + 2 <= totalPages) {
            setPage(prevPage => prevPage + 2); // 다음 2페이지로 이동
        }
        setTimeout(() => {
            setIsFetching(false);
        }, 100);
    };

    const handlePreviousPage = () => {
        setIsFetching(true);
        if (page > 2) {
            setPage(prevPage => prevPage - 2); // 이전 2페이지로 이동
        } else {
            setPage(1); // 첫 번째 페이지로 돌아가기
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

    // 페이지 번호를 항상 10개씩 묶어서 표시
    const getPageNumbers = () => {
        const startPage = Math.floor((page - 1) / 10) * 10 + 1;
        const endPage = Math.min(startPage + 9, totalPages);
        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    return (
        <div className='container-table '>
            <div className='background-table'>
                {isLoading && <div className="loader"></div>}
                {error && <div className='error-message'>{error}</div>}
                <div className='movie-set-talbe'>
                    {movies.map((movie, index) => (
                        <div key={`${movie.id}-${index}`} className='movie-item' onClick={() => handleMovieClick(movie.id, movie, likedMovies, setLikedMovies, IDKey)}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-image-table movie-image-feature"
                            />
                            <span className="movie-title-table">
                                {movie.title}
                            </span>

                            {/* 좋아요된 영화만 빨간색 하트 표시 */}
                            {likedMovies.some(likedMovie => likedMovie.id === movie.id) && <span className="liked-icon-table">❤️</span>}
                        </div>
                    ))}
                    {isFetching && <div className="loader"></div>}
                </div>
                <div className='pagination-container'>
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className='pagination-button'>
                        {"< 이전"}
                    </button>

                    {getPageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={`page-number ${page === pageNum ? 'active' : ''}`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={handleNextPage}
                        disabled={page + 2 > totalPages}
                        className='pagination-button'>
                        {"다음 >"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableView;

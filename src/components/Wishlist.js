import React, { useState, useEffect, useRef } from 'react';
import './CSS-File/Loading.css';
import './CSS-File/Image.css';
import './CSS-File/Scroll.css';
import './CSS-File/Wishlist.css';
import { getAPIData } from './SUB/API'; 

const Wishlist = () => {
  const { apiKey, IDKey } = getAPIData();
  const [likedMovies, setLikedMovies] = useState([]); // 좋아요한 영화 전체 목록
  const [visibleMovies, setVisibleMovies] = useState([]); // 화면에 표시할 영화들
  const [page, setPage] = useState(1); // 페이지 상태
  const moviesPerPage = 40; // 한 번에 로드할 영화 수
  const containerRef = useRef(null); // 스크롤 컨테이너 참조

  const [isLoading, setIsLoading] = useState(true);


  // 좋아요한 영화 목록을 불러오기 위한 useEffect
  useEffect(() => {
      const storedLikedMovies = JSON.parse(localStorage.getItem(IDKey + 'likedMovies')) || [];
      setLikedMovies(storedLikedMovies);
      setVisibleMovies(storedLikedMovies.slice(0, moviesPerPage)); // 초기 페이지 영화만 표시
  }, [IDKey]);

  // 페이지가 변경될 때마다 visibleMovies 업데이트
  useEffect(() => {
      if (page === 1 || !likedMovies.length) return; // 첫 페이지는 이미 로드되었으므로 건너뜀

      const startIndex = (page - 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      const newMovies = likedMovies.slice(startIndex, endIndex);

      // 새로운 영화만 추가
      setVisibleMovies((prevVisibleMovies) => [
          ...prevVisibleMovies,
          ...newMovies,
      ]);
  }, [page, likedMovies]);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
          setPage((prevPage) => prevPage + 1); // 페이지 증가
      }
  };

  // 영화 클릭 시 좋아요 해제 및 화면에서 해당 영화 제거 처리
  const handleMovieClick = (movieId) => {
      const updatedMovies = likedMovies.filter((movie) => movie.id !== movieId);
      setLikedMovies(updatedMovies); // 좋아요 목록에서 제거
      setVisibleMovies(visibleMovies.filter((movie) => movie.id !== movieId)); // 화면에서 제거
      localStorage.setItem(IDKey + 'likedMovies', JSON.stringify(updatedMovies)); // localStorage 업데이트
  };

    // 스크롤 이벤트 등록
  useEffect(() => {
    if(isLoading){
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <div className="container">
          <div
              ref={containerRef}
              className="scroll-horizontal scroll">
              {isLoading && <div className="loader"></div>}
              <div className="movie-grid">
                  {visibleMovies.map((movie) => (
                      <div
                          key={movie.id}
                          className="movie-item"
                          onClick={() => handleMovieClick(movie.id)} // 클릭 시 좋아요 해제
                      >
                          <img
                              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                              alt={movie.title}
                              className="movie-image movie-image-feature"
                          />
                          {likedMovies.some(likedMovie => likedMovie.id === movie.id) && <span  className='movie-like'>❤️</span>}
                          <span className='movie-title'>
                              {movie.title}
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    );
};

export default Wishlist;

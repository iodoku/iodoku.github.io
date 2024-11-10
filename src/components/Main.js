import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHorizontalScroll } from "./SUB/Scroll"; // 스크롤 훅 임포트
import { getAPIData } from './SUB/API'; 
import { handleMovieClick, getLikedMovies } from './SUB/Like';
import './CSS-File/Image.css'; // CSS 파일 임포트

const Main = () => {
  const { apiKey, IDKey } = getAPIData();
  const [isLoading, setIsLoading] = useState(true);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState(getLikedMovies(IDKey));

  const scrollRefs = [useRef(null), useRef(null), useRef(null)];
  const scrollProps = useHorizontalScroll(); // 수평 스크롤 훅

  const fetchFeaturedMovie = async (apiKey) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      setBannerMovie(response.data.results[0]); // 첫 번째 결과를 배너 영화로 설정
    } catch (error) {
      console.error('Error fetching featured movie:', error);
    }
  };

  // 공통 API 호출 함수
  const fetchMovies = async (url, setter) => {
    try {
      const response = await axios.get(url);
      setter(response.data.results);
    } catch (error) {
      console.error(`Error fetching movies from ${url}:`, error);
    }
  };

  // API 호출하여 영화 데이터 가져오기
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => setIsLoading(false), 100);
    }
    if (apiKey) {
      fetchFeaturedMovie(apiKey); // 배너 영화
      fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`, setPopularMovies); // 인기 영화
      fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=2`, setLatestMovies); // 최신 영화
      fetchMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=ko-KR`, setActionMovies); // 액션 영화
    }
  }, [apiKey, isLoading]);

  // 스크롤 이벤트 리스너 추가 및 제거
  useEffect(() => {
    scrollRefs.forEach(scrollRef => {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener('wheel', scrollProps.onWheel, { passive: false });
      }
    });
    return () => {
      scrollRefs.forEach(scrollRef => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
          scrollContainer.removeEventListener('wheel', scrollProps.onWheel);
        }
      });
    };
  }, [scrollProps]);

  if (!bannerMovie) return null; // 배너 영화가 없으면 아무것도 렌더링하지 않음

  const MovieList = ({ title, movies, scrollRef }) => (
    <div style={{ marginTop: '20px', borderRadius: '8px', padding: '0 50px', color: 'white' }}>
      <h2>{title}</h2>
      <div className="scroll-horizontal" ref={scrollRef}>
        <div style={{ display: 'flex' }}>
          {movies.map((movie) => (
            <div key={movie.id} style={{ margin: '10px', position: 'relative' }} onClick={() => handleMovieClick(movie.id, movie, likedMovies, setLikedMovies, IDKey)}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: '180px', height: '250px', objectFit: 'cover', transition: 'transform 0.3s' }} className="movie-image"/>
              <p>{movie.title}</p>
              {likedMovies.some(likedMovie => likedMovie.id === movie.id) && (<span style={{position: 'absolute', top: '5px', right: '5px', color: 'red', fontSize: '20px', cursor: 'pointer',}}>❤️</span>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="scroll-vertical" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#333333', overflowY: 'auto', height: '1260px' }}>
      {/* 배너 */}
      <div style={{ position: 'relative', height: '750px', padding: '0 50px' }}>
        <img
          src={`https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}`}
          alt={bannerMovie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <h1 style={{ position: 'absolute', bottom: '250px', left: '30px', color: 'white', fontSize: '2.5rem', padding: '0 50px' }}>
          {bannerMovie.title}
        </h1>
        <p style={{ position: 'absolute', bottom: '100px', left: '30px', color: 'white', maxWidth: '400px', lineHeight: '1.5', fontSize: '1rem', padding: '0 50px' }}>
          {bannerMovie.overview}
        </p>
      </div>
      {isLoading && <div className="loader"></div>}
      <MovieList title="인기 영화" movies={popularMovies} scrollRef={scrollRefs[0]} />
      <MovieList title="최신 영화" movies={latestMovies} scrollRef={scrollRefs[1]} />
      <MovieList title="액션 영화" movies={actionMovies} scrollRef={scrollRefs[2]} />
    </div>
  );
};

export default Main;
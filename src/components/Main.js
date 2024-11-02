import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header'; // 헤더 컴포넌트

const Main = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || ''; // API 키 가져오기
  const [bannerMovie, setBannerMovie] = useState(null); // 배너 영화
  const [popularMovies, setPopularMovies] = useState([]); // 인기 영화 목록
  const [latestMovies, setLatestMovies] = useState([]); // 최신 영화 목록
  const [actionMovies, setActionMovies] = useState([]); // 액션 영화 목록

  // API 호출하여 배너 영화 가져오기
  const fetchFeaturedMovie = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      const randomMovie = response.data.results[Math.floor(Math.random() * response.data.results.length)];
      setBannerMovie(randomMovie);
    } catch (error) {
      console.error('Error fetching featured movie:', error);
    }
  };

  // API 호출하여 인기 영화 가져오기
  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${1}`);
      setPopularMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  // API 호출하여 최신 영화 가져오기
  const fetchLatestMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${2}`);
      setLatestMovies(response.data.results); 
    } catch (error) {
      console.error('Error fetching latest movies:', error);
    }
  };

  // API 호출하여 액션 영화 가져오기
  const fetchActionMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=ko-KR`);
      setActionMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching action movies:', error);
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchFeaturedMovie();
    fetchPopularMovies();
    fetchLatestMovies();
    fetchActionMovies();

    const handleScroll = () => {
      const header = document.querySelector('.app-header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [apiKey]);

  if (!bannerMovie) return null; // 배너 영화가 없을 경우 아무것도 렌더링하지 않음

  return (
    <div>
      {/* 배너 */}
      <div style={{ position: 'relative', height: '400px' }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${bannerMovie.backdrop_path}`}
          alt={bannerMovie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <h1 style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'white' }}>
          {bannerMovie.title}
        </h1>
      </div>

      {/* 인기 영화 목록 */}
      <div>
        <h2>인기 영화</h2>
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {popularMovies.map((movie) => (
            <div key={movie.id} style={{ margin: '10px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '150px', height: '225px', objectFit: 'cover' }}
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 최신 영화 목록 */}
      <div>
        <h2>최신 영화</h2>
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {latestMovies.map((movie) => (
            <div key={movie.id} style={{ margin: '10px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '150px', height: '225px', objectFit: 'cover' }}
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 영화 목록 */}
      <div>
        <h2>액션 영화</h2>
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {actionMovies.map((movie) => (
            <div key={movie.id} style={{ margin: '10px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '150px', height: '225px', objectFit: 'cover' }}
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;

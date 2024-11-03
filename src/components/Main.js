import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHorizontalScroll } from "./Scroll";
import './Image.css';

const Main = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';

  const scrollRef1 = useHorizontalScroll();
  const scrollRef2 = useHorizontalScroll();
  const scrollRef3 = useHorizontalScroll();

  const [bannerMovie, setBannerMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  
  // API 호출하여 배너 영화 가져오기
  const fetchFeaturedMovie = async (apiKey) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      setBannerMovie(response.data.results[0]);
    } catch (error) {
      console.error('Error fetching featured movie:', error);
    }
  };

  // API 호출하여 인기 영화 가져오기
  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`);
      setPopularMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  // API 호출하여 최신 영화 가져오기
  const fetchLatestMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=2`);
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
    if (apiKey) {
      fetchFeaturedMovie(apiKey);
      fetchPopularMovies();
      fetchLatestMovies();
      fetchActionMovies();
    }
  }, [apiKey]);

  if (!bannerMovie) return null;

  


  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#E0FFF4'}}>
      {/* 배너 */}
      <div style={{ position: 'relative', height: '750px', padding: '0 50px'}}>
        <img
          src={`https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}`}
          alt={bannerMovie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <h1 style={{ position: 'absolute', bottom: '200px', left: '30px', color: 'white', fontSize: '2.5rem' ,padding: '0 50px' }}>
          {bannerMovie.title}
        </h1>
        <p style={{ position: 'absolute', bottom: '100px', left: '30px', color: 'white', maxWidth: '400px', lineHeight: '1.5', fontSize: '1rem', padding: '0 50px'  }}>
          {bannerMovie.overview}
        </p>
      </div>

      {/* 인기 영화 목록 */}
      <div style={{ flex: 1, marginTop: '2px', borderRadius: '8px', padding: '0 50px' }}>
        <h2>인기 영화</h2>
        <div className="scroll-container" ref={scrollRef1}>
          <div style={{ display: 'flex' }}>
            {popularMovies.map((movie) => (
              <div key={movie.id} style={{ margin: '10px', position: 'relative' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '180px', height: '250px', objectFit: 'cover', transition: 'transform 0.3s' }}
                  className="movie-image"
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최신 영화 목록 */}
      <div style={{ flex: 1, marginTop: '2px', borderRadius: '8px', padding: '0 50px' }}>
        <h2>최신 영화</h2>
        <div className="scroll-container" ref={scrollRef2}>
          <div style={{ display: 'flex' }}>
            {latestMovies.map((movie) => (
              <div key={movie.id} style={{ margin: '5px', position: 'relative' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '180px', height: '250px', objectFit: 'cover', transition: 'transform 0.3s' }}
                  className="movie-image"
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 액션 영화 목록 */}
      <div style={{ flex: 1, marginTop: '2px', borderRadius: '8px', padding: '0 50px' }}>
        <h2>액션 영화</h2>
        <div className="scroll-container" ref={scrollRef3}>
          <div style={{ display: 'flex' }}>
            {actionMovies.map((movie) => (
              <div key={movie.id} style={{ margin: '10px', position: 'relative' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '180px', height: '250px', objectFit: 'cover', transition: 'transform 0.3s' }}
                  className="movie-image"
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .movie-image:hover {
          transform: scale(1.1); // 마우스 오버 시 확대 효과
        }
      `}</style>
    </div>

  );
};

export default Main;

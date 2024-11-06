import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHorizontalScroll } from "./Scroll"; // 스크롤 훅 임포트
import './Image.css'; // CSS 파일 임포트

const Main = () => {
  const apiKey = localStorage.getItem('users') || ''; // TMDb API 키 가져오기
  console.log(apiKey);

  // 스크롤 참조
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollProps = useHorizontalScroll(); // 수평 스크롤 훅

  // 상태 변수 선언
  const [bannerMovie, setBannerMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  // API 호출하여 배너 영화 가져오기
  const fetchFeaturedMovie = async (apiKey) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      setBannerMovie(response.data.results[1]); // 첫 번째 결과를 배너 영화로 설정
    } catch (error) {
      console.error('Error fetching featured movie:', error);
    }
  };

  // API 호출하여 인기 영화 가져오기
  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`);
      setPopularMovies(response.data.results); // 인기 영화 목록 설정
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  // API 호출하여 최신 영화 가져오기
  const fetchLatestMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=2`);
      setLatestMovies(response.data.results); // 최신 영화 목록 설정
    } catch (error) {
      console.error('Error fetching latest movies:', error);
    }
  };

  // API 호출하여 액션 영화 가져오기
  const fetchActionMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=ko-KR`);
      setActionMovies(response.data.results); // 액션 영화 목록 설정
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

  // 스크롤 이벤트 리스너 추가 및 제거
  useEffect(() => {
    const scrollContainers = [scrollRef1, scrollRef2, scrollRef3];
    scrollContainers.forEach(scrollRef => {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener('wheel', scrollProps.onWheel, { passive: false });
      }
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      scrollContainers.forEach(scrollRef => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
          scrollContainer.removeEventListener('wheel', scrollProps.onWheel);
        }
      });
    };
  }, [scrollProps]);

  if (!bannerMovie) return null; // 배너 영화가 없으면 아무것도 렌더링하지 않음

  return (
    <div style={{display: 'flex',flexDirection: 'column', backgroundColor: '#E0FFF4'}}>
      {/* 배너 */}
      <div style={{ position: 'relative', height: '750px', padding: '0 50px' }}>
        <img
          src={`https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}`}
          alt={bannerMovie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <h1 style={{ position: 'absolute', bottom: '200px', left: '30px', color: 'white', fontSize: '2.5rem', padding: '0 50px' }}>
          {bannerMovie.title}
        </h1>
        <p style={{ position: 'absolute', bottom: '100px', left: '30px', color: 'white', maxWidth: '400px', lineHeight: '1.5', fontSize: '1rem', padding: '0 50px' }}>
          {bannerMovie.overview}
        </p>
      </div>

      {/* 인기 영화 목록 */}
      <div style={{ marginTop: '20px', borderRadius: '8px', padding: '0 50px'}}>
        <h2>인기 영화</h2>
        <div className="scroll-horizontal" ref={scrollRef1}>
          <div style={{ display: 'flex'}}>
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
      <div style={{ flex: '0 0 auto', marginTop: '20px', borderRadius: '8px', padding: '0 50px' }}>
        <h2>최신 영화</h2>
        <div className="scroll-horizontal" ref={scrollRef2}>
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
      <div style={{ flex: '0 0 auto', marginTop: '20px', borderRadius: '8px', padding: '0 50px' }}>
        <h2>액션 영화</h2>
        <div className="scroll-horizontal" ref={scrollRef3}>
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
    </div>
  );
};

export default Main;

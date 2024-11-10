import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import './CSS-File/Loading.css';
import './CSS-File/Image.css'; // CSS 파일 임포트
import { getAPIData } from './SUB/API'; 
import { handleMovieClick,  getLikedMovies } from './SUB/Like';

const genreOptions = [
    { id: 0, name: '전체' },
    { id: 28, name: '액션' },
    { id: 12, name: '모험' },
    { id: 35, name: '코미디' },
    { id: 80, name: '범죄' },
    { id: 10751, name: '가족' },
];

const ratingOptions = ['전체', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5','4점 이하'];
const languageOptions = ['전체', '한국어', '영어', '일본어'];

const Search = () => {
    
    const { apiKey, IDKey } = getAPIData();

    const [movies, setMovies] = useState([]);
    const [visibleMovies, setVisibleMovies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isInfinite, setIsInfinite] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [genreFilter, setGenreFilter] = useState(0); // 장르 필터 상태
    const [ratingFilter, setRatingFilter] = useState('전체'); // 평점 필터 상태
    const [languageFilter, setLanguageFilter] = useState('전체'); // 언어 필터 상태
    const [sortOrder, setSortOrder] = useState('none'); // 오름차순/내림차순 상태
    const scrollContainerRef = useRef(null);
    const [Otherfilter, setOtherfilter] = useState('none');  // 새로운 필터 상태 추가

    const [isLoading, setIsLoading] = useState(true);

    const fetchMovies = async (currentPage) => {
        try {
            const requests = Array.from({ length: 3 }, (_, i) =>
                fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${currentPage + i}`)
            );
            const responses = await Promise.all(requests);
            const data = await Promise.all(responses.map(response => response.json()));
            const newMovies = data.flatMap(pageData => pageData.results);

            setMovies((prevMovies) => [...prevMovies, ...newMovies]);
            setVisibleMovies((prevVisibleMovies) => {
                const uniqueMovies = [...prevVisibleMovies];
                newMovies.forEach((movie) => {
                    if (!uniqueMovies.some((m) => m.id === movie.id)) {
                        uniqueMovies.push(movie);
                    }
                });
                return uniqueMovies;
            });
        } catch (error) {
            console.error('영화 데이터를 불러오는 중 오류가 발생했습니다:', error);
            setError('영화 데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
        }
    };

    const [likedMovies, setLikedMovies] = useState(getLikedMovies(IDKey));

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !isFetching) {
          setIsFetching(true);
          setIsInfinite(true);
          setTimeout(() => {
            setIsFetching(false);  // 로딩 완료 상태로 변경
          }, 100);
        }
    };

    const loadMoreMovies = () => {
        setPage((prevPage) => prevPage + 3);
        setIsInfinite(false);
    };

    useEffect(() => {
      if (genreFilter === 0 && ratingFilter === '전체' && languageFilter === '전체'&& sortOrder === 'none'&& Otherfilter === 'none') {
          fetchMovies(page);
          if(isLoading){
            setTimeout(() => {
              setIsLoading(false);
            }, 100);
          }
      }
    }, [genreFilter, ratingFilter, languageFilter, sortOrder, Otherfilter,page]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isInfinite) {
            loadMoreMovies();
        }
    }, [isInfinite]);

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenreChange = (genreId) => {
        setIsFetching(true);
        setGenreFilter(genreId);
        setTimeout(() => {
          setIsFetching(false);  // 로딩 완료 상태로 변경
      }, 100); 
    };

    const handleRatingChange = (rating) => {
      setIsFetching(true);
      setRatingFilter(rating);
      setTimeout(() => {
        setIsFetching(false);  // 로딩 완료 상태로 변경
      }, 100); 
    };

    const handleLanguageChange = (language) => {
      setIsFetching(true);  
      setLanguageFilter(language);
      setTimeout(() => {
        setIsFetching(false);  // 로딩 완료 상태로 변경
      }, 100); 
    };

    const handleSortOrderChange = (order) => {
      setIsFetching(true);
      setSortOrder(order);
      setTimeout(() => {
        setIsFetching(false);  // 로딩 완료 상태로 변경
      }, 100); 
    };

    const handleOtherfilterChange = (value) => {
      setIsFetching(true);
      setOtherfilter(value);
      setTimeout(() => {
        setIsFetching(false);  // 로딩 완료 상태로 변경
      }, 100); 
    };

    const resetFilters = () => {
        setGenreFilter(0);
        setRatingFilter('전체');
        setLanguageFilter('전체');
        setSortOrder('none');
        setOtherfilter('none');
    };

    const filteredMovies = visibleMovies.filter(movie => {
      const matchesGenre = genreFilter === 0 || movie.genre_ids.includes(genreFilter);

      let matchesLanguage;  // 바깥에서 선언하여 범위를 넓힘

      if (languageFilter === '한국어') {
          matchesLanguage = movie.original_language === 'ko';
      } else if (languageFilter === '영어') {
          matchesLanguage = movie.original_language === 'en';
      } else if (languageFilter === '일본어') {
          matchesLanguage = movie.original_language === 'ja';
      } else {
          matchesLanguage = languageFilter === '전체';
      }
      


      // 평점 필터링
      let matchesRating = false;
      if (ratingFilter === '전체') {
          matchesRating = true;
      } else if (ratingFilter === '9~10') {
          matchesRating = movie.vote_average >= 9 && movie.vote_average <= 10;
      } else if (ratingFilter === '8~9') {
          matchesRating = movie.vote_average >= 8 && movie.vote_average < 9;
      } else if (ratingFilter === '7~8') {
          matchesRating = movie.vote_average >= 7 && movie.vote_average < 8;
      } else if (ratingFilter === '6~7') {
          matchesRating = movie.vote_average >= 6 && movie.vote_average < 7;
      } else if (ratingFilter === '5~6') {
          matchesRating = movie.vote_average >= 5 && movie.vote_average < 6;
      } else if (ratingFilter === '4~5') {
          matchesRating = movie.vote_average >= 4 && movie.vote_average < 5;
      } else if (ratingFilter === '4점 이하') {
          matchesRating = movie.vote_average < 4;
      }

      return matchesGenre && matchesRating && matchesLanguage;
    });

    // 오름차순/내림차순 정렬
    const sortedMovies = (() => {
      let moviesToSort = [...filteredMovies];  // 기존 배열을 복사하여 영향을 주지 않도록 함
  
      // Otherfilter에 따른 정렬
      if (Otherfilter === 'popularity_asc') {
          moviesToSort.sort((a, b) => b.popularity - a.popularity);  // 인기순 오름차순
      } else if (Otherfilter === 'release_date_asc') {
          moviesToSort.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));  // 개봉년도 빠른 순
      } else if (Otherfilter === 'release_date_desc') {
          moviesToSort.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));  // 개봉년도 느린 순
      }
  
      // sortOrder에 따른 정렬
      if (sortOrder === 'asc') {
          moviesToSort.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));  // 오름차순
      } else if (sortOrder === 'desc') {
          moviesToSort.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));  // 내림차순
      }
  
      return moviesToSort;
    })();  
      
    return (
        <div>
            <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',  // 오른쪽 정렬
                  alignItems: 'flex-end',      // 아래쪽 정렬
                  backgroundColor: '#333',
                  padding: '20px',
                  position: 'relative',         // 아래쪽 여백 추가 (필요시 조정)
                }}
            >
              {isLoading && <div className="loader"></div>}
              <select
                  value={genreFilter}
                  onChange={(e) => handleGenreChange(Number(e.target.value))}
                  style={buttonStyle}
              >
                  {genreOptions.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                          {genre.name}
                      </option>
                  ))}
              </select>

              <select value={ratingFilter} onChange={(e) => handleRatingChange(e.target.value)} style={buttonStyle}>
                  {ratingOptions.map((rating, index) => (
                      <option key={index} value={rating}>{`평점 (${rating})`}</option>
                  ))}
              </select>

              <select value={languageFilter} onChange={(e) => handleLanguageChange(e.target.value)} style={buttonStyle}>
                  {languageOptions.map((language, index) => (
                      <option key={index} value={language}>{`언어 (${language})`}</option>
                  ))}
              </select>

              <select value={sortOrder} onChange={(e) => handleSortOrderChange(e.target.value)} style={buttonStyle}>
                  <option value="none">선택안함</option> {/* "선택안함" 옵션 추가 */}
                  <option value="asc">오름차순</option>
                  <option value="desc">내림차순</option>
              </select>

              <select value={Otherfilter} onChange={(e) => handleOtherfilterChange(e.target.value)} style={buttonStyle}>
                  <option value="none">선택안함</option>
                  <option value="popularity_asc">인기순</option> {/* 추가된 필터 */}
                  <option value="release_date_asc">최신 개봉</option> {/* 추가된 필터 */}
                  <option value="release_date_desc">오래된 개봉</option> {/* 추가된 필터 */}
              </select>

              <button onClick={resetFilters} style={buttonStyle}>초기화</button>
          </div>

          <div
            ref={scrollContainerRef}
            style={{
                height: '1190px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '80px',
                backgroundColor: '#333333',
                border: 'none',
            }}
        >
            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                }}
            >
                {isFetching && <div className="loader"></div>}
                {sortedMovies.map((movie) => (
                    <div
                        key={movie.id}
                        style={{
                            background: '#1e1e1e',
                            borderRadius: '10px',
                            color: '#fff',
                            padding: '10px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                            position: 'relative', // 포스터 이미지를 기준으로 하트 위치 설정
                        }}
                        onClick={() => handleMovieClick(movie.id, movie, likedMovies, setLikedMovies, IDKey)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '100%', borderRadius: '5px' }}
                            className="movie-image"
                        />
                        {likedMovies.some(likedMovie => likedMovie.id === movie.id) && <span style={{ position: 'absolute', top: '5px', right: '20px', color: 'red', fontSize: '20px' }}>❤️</span>}
                        <h3 style={{ fontSize: '14px', marginTop: '10px' }}>{movie.title}</h3>
                    </div>
                ))}
            </div>
            {isFetching && <div className="loader"></div>}
        </div>


            {visibleMovies.length > 0 && (
                <div
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        right: '30px',
                        bottom: '30px',
                        background: '#333',
                        padding: '10px 15px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: '#fff',
                    }}
                >
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                </div>
            )}
        </div>
    );
};

const buttonStyle = {
    fontSize: '16px',
    padding: '8px',
    margin: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#333',
    color: '#fff',
};

export default Search;
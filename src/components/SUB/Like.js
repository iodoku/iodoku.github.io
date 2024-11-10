export const handleMovieClick = (movieId, movie, likedMovies, setLikedMovies, IDKey) => {
    // 영화가 좋아요 목록에 있는지 확인
    const isMovieLiked = likedMovies.some((likedMovie) => likedMovie.id === movieId);

    if (isMovieLiked) {
        // 영화가 좋아요 목록에 있으면 제거
        const updatedMovies = likedMovies.filter((likedMovie) => likedMovie.id !== movieId);
        setLikedMovies(updatedMovies); // 좋아요 목록에서 제거
        localStorage.setItem(IDKey + 'likedMovies', JSON.stringify(updatedMovies)); // localStorage 업데이트
    } else {
        // 영화가 좋아요 목록에 없으면 추가
        const updatedMovies = [...likedMovies, movie];
        setLikedMovies(updatedMovies); // 좋아요 목록에 추가
        localStorage.setItem(IDKey + 'likedMovies', JSON.stringify(updatedMovies)); // localStorage 업데이트
    }
};

export const getLikedMovies = (IDKey) => {
    return JSON.parse(localStorage.getItem(IDKey + 'likedMovies')) || [];
};



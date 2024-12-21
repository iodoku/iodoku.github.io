import '../CSS-File//Scroll.css';
import { useCallback } from 'react';

export const useHorizontalScroll = () => {
  const onWheel = useCallback((e) => {
    const scrollContainer = e.currentTarget;
    scrollContainer.scrollLeft += e.deltaY*25; // 수직 휠 이동에 따라 수평 스크롤
    e.preventDefault(); // 기본 스크롤 동작 방지
  }, []);

  return { onWheel }; // onWheel을 반환
};
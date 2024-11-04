import { useCallback } from 'react';

export const useVerticalScroll = () => {
  const onWheel = useCallback((e) => {
    const scrollContainer = e.currentTarget;
    scrollContainer.scrollTop += e.deltaY; // 수직 휠 움직임에 따라 스크롤
  }, []);

  return { onWheel };
};
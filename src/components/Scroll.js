import React, { useRef, useEffect } from 'react';
import './Scroll.css';

export const useHorizontalScroll = () => {
    const ref = useRef();

    useEffect(() => {
        const element = ref.current;

        const onWheel = (event) => {
            if (event.deltaY !== 0) {
                event.preventDefault();
                element.scrollBy({
                    left: event.deltaY * 20, // 스크롤 속도 조정
                    behavior: 'smooth',
                });

                // 현재 스크롤 위치 출력
                console.log('Current scroll position:', element.scrollLeft);
            }
        };

        // ref가 설정된 후에 이벤트 리스너 추가
        if (element) {
            element.addEventListener('wheel', onWheel);
        }

        // 클린업 함수
        return () => {
            if (element) {
                element.removeEventListener('wheel', onWheel);
            }
        };
    }, [ref]); // ref를 의존성 배열에 추가

    return ref;
};
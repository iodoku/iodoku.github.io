import React, { useRef, useEffect } from 'react';
import './Scroll.css'; 

export const useHorizontalScroll = () => {
    const ref = useRef();

    useEffect(() => {
        const element = ref.current;
        if (element) {
            const onWheel = (event) => {
                if (event.deltaY !== 0) {
                    event.preventDefault();
                    element.scrollBy({
                        left: event.deltaY * 10, // 스크롤 속도 조정
                        behavior: 'smooth',
                    });
                }
            };
            element.addEventListener('wheel', onWheel);

            return () => {
                element.removeEventListener('wheel', onWheel);
            };
        }
    }, []);

    return ref;
};
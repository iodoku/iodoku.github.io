import React, { useState } from 'react';
import TableView from './SUB/TableView';
import InfiniteScrollView from './SUB/InfiniteScrollView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faList } from '@fortawesome/free-solid-svg-icons';

const Popular = () => {
    const [view, setView] = useState('table'); // 기본 뷰를 'table'로 설정
    const data = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`);

    return (
        <div>
            {/* 배경색 적용 및 가운데 정렬 */}
            <div 
                style={{
                    backgroundColor: '#333333',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px' // 버튼 간 간격 설정
                }}
            >
                {/* Table View 버튼 */}
                <button 
                    onClick={() => setView('table')} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: 'none',
                        outline: 'none',
                        padding: '10px 20px',
                        backgroundColor: '#555555',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    <FontAwesomeIcon icon={faTable} /> {/* 아이콘 추가 */}
                </button>

                {/* Infinite Scroll 버튼 */}
                <button 
                    onClick={() => setView('infinite')} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: 'none',
                        outline: 'none',
                        padding: '10px 20px',
                        backgroundColor: '#555555',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    <FontAwesomeIcon icon={faList} /> {/* 아이콘 추가 */}
                </button>
            </div>

            {/* view에 따라 테이블 또는 무한 스크롤 표시 */}
            {view === 'table' ? <TableView data={data} /> : <InfiniteScrollView data={data} />}
        </div>
    );
};

export default Popular;

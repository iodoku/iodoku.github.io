import React, { useState } from 'react';
import TableView from './TableView';
import InfiniteScrollView from './InfiniteScrollView';

const Popular = () => {
  const [view, setView] = useState('table'); // 기본 뷰를 'table'로 설정
    const data = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`);

    return (
        <div>
            <div>
                <button onClick={() => setView('table')}>Table View</button>
                <button onClick={() => setView('infinite')}>Infinite Scroll</button>
            </div>

            {view === 'table' ? <TableView data={data} /> : <InfiniteScrollView data={data} />}
        </div>
    );
};

export default Popular;
import React from 'react';

const TableView = ({ data }) => (
    <table border="1">
        <thead>
            <tr>
                <th>Index</th>
                <th>Item</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default TableView;
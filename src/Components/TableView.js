import React from 'react';
import { Table } from 'react-bootstrap';
import "../Css/TableView.css";

const TableView = ({ content }) => {
    return (
        <div className="table-responsive full-page">
            <Table bordered hover className="default">
                <thead>
                    <tr>
                        {Object.keys(content[0]).map((key, index) => (
                            <th key={index}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {content.map((element, indexOuter) => (
                        <tr key={indexOuter + 10000}>
                            {Object.keys(element).map((key, index) => (
                                <td key={index + (indexOuter * 100)}>{element[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default TableView
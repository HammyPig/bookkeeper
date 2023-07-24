import React, { useState, useEffect } from "react";

export default function ItemTable() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems();
    }, []);

    function getItems() {
        fetch("/api/items")
            .then(response => response.json())
            .then(items => {
                setItems(items);
            });
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                        <td>{item.code}</td>
                        <td>{item.stock}</td>
                        <td>${parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

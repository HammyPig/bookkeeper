import React from "react";

export default function ItemList({ items, handleAddItem, handleEditItemCode, handleEditItem, handleDeleteItem }) {
    return (
        <section>
            <div className="container items-start">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                                <td><input value={item.code} onChange={(e) => handleEditItemCode(itemIndex, "code", e.target.value)} /></td>
                                <td><input value={item.description} onChange={(e) => handleEditItem(itemIndex, "description", e.target.value)} /></td>
                                <td><input value={item.quantity} onChange={(e) => handleEditItem(itemIndex, "quantity", e.target.value)} /></td>
                                <td><input value={item.price} onChange={(e) => handleEditItem(itemIndex, "price", e.target.value)} /></td>
                                <td className="select-none">${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</td>
                                <td><button onClick={() => handleDeleteItem(itemIndex)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="my-4" onClick={handleAddItem}>Add Item</button>
            </div>
        </section>
    );
}
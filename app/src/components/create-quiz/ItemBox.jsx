import React, { useState } from 'react';
import InputItem from './InputItem';

export default function ItemBox({ item, index, deleteItem, updateItem, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateItem = (updatedItem) => {
        updateItem(index, updatedItem);
        setIsEditing(false);
    };

    return (
        <div className='item-box'>
            <div className='item-header'>
                <h2>Item {index + 1}</h2>
                <div className='item-actions'>
                    <button className='edit-button' onClick={() => onEdit(index)}>
                        <i className="fas fa-edit"></i>
                    </button>
                    <button className='delete-button' onClick={() => deleteItem(index)}>
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
        </div>
    );
}

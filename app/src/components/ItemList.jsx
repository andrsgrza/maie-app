import React from 'react';
import ItemBox from './ItemBox';

export default function ItemList({ items, deleteItem, updateItem }) {
    return (
        <div className='item-list'>
            <h2>Items</h2>
            {items.map((item, index) => (
                <ItemBox 
                    key={index}
                    item={item}
                    index={index}
                    deleteItem={deleteItem}
                    updateItem={updateItem}
                />
            ))}
        </div>
    );
}

import React from 'react';
import ItemBox from './ItemBox';
import InputItem from './InputItem';

export default function ItemList({
    items,
    deleteItem,
    isAddingItem,
    updateItem,
    addItem,
    toggleAddItem,
    keepOpen,
    setKeepOpen,
    handleEditModeToggle,
    hasSubmitted}) {    
    return (
        <div className='item-list'>
            <h2>Items</h2>                      
            {items.map((item, index) => (
                <>                
                { !item.editMode ? (
                    <ItemBox 
                        key={index}
                        item={item}
                        index={index}
                        deleteItem={deleteItem}
                        updateItem={updateItem}
                        onEdit={handleEditModeToggle}
                    />
                ): (
                    <InputItem
                        key={index+1}
                        index={index}
                        item={item}
                        addItem={addItem}
                        updateItem={updateItem}
                        onCancel={handleEditModeToggle}
                        keepOpen={keepOpen}
                        setKeepOpen={setKeepOpen}
                        first={false}
                        edit={true}
                        hasSubmitted={hasSubmitted}
                    />
                )}
                </>
                ))}
                {isAddingItem && (
                    <>                    
                    <InputItem item={null} addItem={addItem} onCancel={toggleAddItem} updateItem={updateItem} keepOpen={keepOpen} setKeepOpen={setKeepOpen} first={false} edit={false}/>
                    </>
                )}                
        </div>
    );
}
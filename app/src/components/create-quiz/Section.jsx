import React, { useState } from 'react';
import InputItem from './InputItem';
import ItemList from './ItemList';

export default function Section({ section, updateSection, deleteSection, hasError, isFirstSection }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [sectionTitle, setSectionTitle] = useState(section.title);
    const [isAddingItem, setIsAddingItem] = useState(section.items.length === 0);
    const [keepOpen, setKeepOpen] = useState(false);
    const [items, setItems] = useState(section.items || []);

    const addItem = (item) => {
        const newItems = [...items, item];
        setItems(newItems);
        updateSection({ ...section, items: newItems });
        if (!keepOpen) {
            setIsAddingItem(false);
        }
    };

    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        updateSection({ ...section, items: newItems });
        if (newItems.length === 0) {
            setIsAddingItem(true);
        }
    };

    const updateItem = (index, updatedItem) => {
        const newItems = items.map((item, i) => (i === index ? updatedItem : item));
        setItems(newItems);
        updateSection({ ...section, items: newItems });
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleAddItem = () => {
        setIsAddingItem(!isAddingItem);
    };

    const handleTitleChange = (event) => {
        setSectionTitle(event.target.value);
    };

    const saveTitle = () => {
        setIsEditingTitle(false);
        updateSection({ ...section, title: sectionTitle });
    };

    return (
        <div className={`section ${hasError ? 'section-error' : ''}`}>
            <div className='section-header'>
                <div className='collapse-icon' onClick={toggleCollapse}>
                    {isCollapsed ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-up"></i>}
                </div>
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={sectionTitle}
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        onKeyPress={(e) => e.key === 'Enter' && saveTitle()}
                        autoFocus
                    />
                ) : (
                    <h2 onClick={() => setIsEditingTitle(true)}>{section.title}</h2>
                )}
                <div className='section-actions'>
                    {!isFirstSection && (
                        <button onClick={deleteSection}><i className="fas fa-trash"></i></button>
                    )}
                </div>
            </div>
            {!isCollapsed && (
                <>
                    {items.length > 0 && <ItemList items={items} deleteItem={deleteItem} updateItem={updateItem} />}
                    {isAddingItem ? (
                        <>
                            <InputItem addItem={addItem} onCancel={toggleAddItem} keepOpen={keepOpen} setKeepOpen={setKeepOpen} />
                            {items.length > 0 && <button className='close-add-item-button' onClick={toggleAddItem}>Close</button>}
                        </>
                    ) : (
                        <button className='add-item-button' onClick={toggleAddItem}>Add Item</button>
                    )}
                </>
            )}
        </div>
    );
}

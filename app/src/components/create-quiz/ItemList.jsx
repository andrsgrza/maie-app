import React, { useState } from "react";
import ItemBox from "./ItemBox";
import InputItem from "./InputItem";

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
  hasSubmitted,
}) {
  return (
    <div className="item-list">
      {items.map((item, index) => {
        const uniqueKey = item.id || index;
        return !item.editMode ? (
          <ItemBox
            key={uniqueKey}
            item={item}
            index={index}
            deleteItem={deleteItem}
            updateItem={updateItem}
            onEdit={handleEditModeToggle}
          />
        ) : (
          <InputItem
            key={`${uniqueKey}-edit`}
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
        );
      })}
      {isAddingItem && (
        <>
          <InputItem
            item={null}
            addItem={addItem}
            onCancel={toggleAddItem}
            updateItem={updateItem}
            keepOpen={keepOpen}
            setKeepOpen={setKeepOpen}
            first={false}
            edit={false}
          />
        </>
      )}
    </div>
  );
}

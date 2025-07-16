import React from "react";
import ResourceList from "../ResourceList";
import ResourceCard from "../ResourceCard";
import { FaKey } from "react-icons/fa";

export default function QuizSelectorPerform({ onSelected, onSelectionChange }) {
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "OWNER":
        return "role-owner";
      case "READ_WRITE":
        return "role-read-write";
      case "READ_ONLY":
        return "role-read-only";
      default:
        return "role-unknown";
    }
  };

  const getRoleTooltip = (role) => {
    switch (role) {
      case "OWNER":
        return "You are the owner";
      case "READ_WRITE":
        return "You can edit";
      case "READ_ONLY":
        return "View only";
      default:
        return "Unknown permission";
    }
  };

  return (
    <ResourceList
      resourceType="quiz"
      editable={false}
      selectable={true}
      onSelectionChange={onSelectionChange}
      renderItem={({ item, isSelected, onSelect }) => (
        <ResourceCard
          key={item.id}
          item={item}
          selectable={true}
          isSelected={isSelected}
          onSelect={onSelect}
          roleBadgeClass={getRoleBadgeClass(item.entitlementRole)}
          roleTooltip={getRoleTooltip(item.entitlementRole)}
          compact={true}
        />
      )}
    />
  );
}

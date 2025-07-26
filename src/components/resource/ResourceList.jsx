import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import useFetchResources from "../../hooks/useFetchResources";
import { MESSAGES } from "../../common/constants";
import { useBanner } from "../../context/BannerContext";
import { useModal } from "../../context/ModalContext";
import "./resource-list.css";

// ---- CONFIGURACIÓN CENTRAL DE SORT Y FILTER POR RECURSO ----
const RESOURCE_SORT_FILTERS = {
  quiz: {
    sortOptions: [
      { label: "Last edited", value: "lastEdited", direction: "desc" },
      { label: "Date created", value: "createdAt", direction: "desc" },
      { label: "Title (A-Z)", value: "title", direction: "asc" },
      { label: "Title (Z-A)", value: "title", direction: "desc" },
    ],
    filterOptions: [
      { label: "All", value: "all" },
      { label: "Owner", value: "OWNER" },
      { label: "Shared with me", value: "shared" },
    ],
  },
  training: {
    sortOptions: [
      { label: "Last edited (Newest)", value: "lastEdited", direction: "desc" },
      { label: "Last performed", value: "lastPerformed", direction: "desc" },
      { label: "Date created (Newest)", value: "createdAt", direction: "desc" },
      { label: "Title (A-Z)", value: "title", direction: "asc" },
      { label: "Title (Z-A)", value: "title", direction: "desc" },
      { label: "Number of sets", value: "setCount", direction: "desc" },
    ],
    filterOptions: [
      { label: "All", value: "all" },
      { label: "Owner", value: "OWNER" },
      { label: "Shared with me", value: "shared" },
      { label: "Recently performed", value: "recently" },
      { label: "Never performed", value: "never" },
    ],
  },
  session: {
    sortOptions: [
      { label: "Created (Newest)", value: "createdAt", direction: "desc" },
      { label: "Created (Oldest)", value: "createdAt", direction: "asc" },
      { label: "Due date (Soonest)", value: "dueDate", direction: "asc" },
      { label: "Due date (Latest)", value: "dueDate", direction: "desc" },
      {
        label: "Training Title (A-Z)",
        value: "trainingTitle",
        direction: "asc",
      },
      { label: "Status", value: "status", direction: "asc" },
    ],
    filterOptions: [
      { label: "All", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "In Progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
      { label: "With Due Date", value: "with_due_date" },
      { label: "Overdue", value: "overdue" },
    ],
  },
};

// ------------ COMPONENTE PRINCIPAL ------------
export default function ResourceList({
  resourceType,
  renderItem,
  selectable = false,
  editable = false,
  onSelectionChange,
  filters = {},
}) {
  // DATA FETCHING
  const {
    resources: fetchedResources,
    setResources: setFetchedResources,
    isLoading: fetchedLoading,
    error: fetchedError,
  } = useFetchResources(resourceType, filters);

  // MOCK para trainings si aplica
  const isTraining = resourceType === "training";
  const items = fetchedResources;

  const setItems = isTraining ? () => {} : setFetchedResources;
  const isLoading = isTraining ? false : fetchedLoading;
  const error = isTraining ? null : fetchedError;

  // UI STATE
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [sortValue, setSortValue] = useState(
    RESOURCE_SORT_FILTERS[resourceType]?.sortOptions?.[0]?.value || ""
  );
  const [sortDirection, setSortDirection] = useState(
    RESOURCE_SORT_FILTERS[resourceType]?.sortOptions?.[0]?.direction || "desc"
  );
  const [filterValue, setFilterValue] = useState(
    RESOURCE_SORT_FILTERS[resourceType]?.filterOptions?.[0]?.value || "all"
  );

  const { addBanner } = useBanner();
  const { configureImportModal, toggleImportModal } = useModal();

  // ---- Selección
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  const handleSelect = (item) => {
    if (!selectable) return;
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  // ---- Delete
  const handleDelete = async (itemId) => {
    if (!editable) return;
    try {
      const client = getClient();
      await client.delete(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("Error deleting item", err);
      throw err;
    }
  };

  // ---- API Client por tipo
  const getClient = () => {
    switch (resourceType) {
      case "quiz":
        return require("../../api/quiz-client").default;
      case "training":
        return require("../../api/training-client").default;
      case "session":
        return require("../../api/session-client").default;
      default:
        throw new Error("Unsuppordted resource type: " + resourceType);
    }
  };

  // ---- Add Button Quiz
  const toggleDropdown = () => setIsDropdownOpen((v) => !v);
  const openImportModal = () => {
    configureImportModal({
      isOpen: true,
      title: "Import Quiz",
      onClose: () => toggleImportModal(),
      postImport: postImportQuiz,
    });
    setIsDropdownOpen(false);
  };

  const postImportQuiz = (res) => {
    addBanner(
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].TYPE,
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].TITLE,
      MESSAGES.API_MESSAGES.POST_QUIZ[res.status].MESSAGE
    );
    if (res.status >= 200 && res.status < 300) {
      toggleImportModal();
      setItems((prevItems) => [...prevItems, res.data]);
    }
  };

  // ----------- SORT & FILTER LOGIC -------------
  const getFilteredAndSortedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    let result = [...items];

    // --- FILTROS POR RECURSO ---
    if (resourceType === "training") {
      if (filterValue === "OWNER") {
        result = result.filter((t) => t.entitlementRole === "OWNER");
      } else if (filterValue === "shared") {
        result = result.filter((t) => t.entitlementRole !== "OWNER");
      } else if (filterValue === "recently") {
        const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
        result = result.filter(
          (t) =>
            t.lastPerformed && new Date(t.lastPerformed).getTime() > twoWeeksAgo
        );
      } else if (filterValue === "never") {
        result = result.filter((t) => !t.lastPerformed);
      }
    } else if (resourceType === "quiz") {
      if (filterValue === "OWNER") {
        result = result.filter((q) => q.entitlementRole === "OWNER");
      } else if (filterValue === "shared") {
        result = result.filter((q) => q.entitlementRole !== "OWNER");
      }
    } else if (resourceType === "session") {
      // Tipos posibles: pending, in_progress, completed, with_due_date, overdue
      if (filterValue === "pending") {
        result = result.filter(
          (s) => (s.status || "").toLowerCase() === "pending"
        );
      } else if (filterValue === "in_progress") {
        result = result.filter(
          (s) => (s.status || "").toLowerCase() === "in progress"
        );
      } else if (filterValue === "completed") {
        result = result.filter(
          (s) => (s.status || "").toLowerCase() === "completed"
        );
      } else if (filterValue === "with_due_date") {
        result = result.filter((s) => !!s.dueDate);
      } else if (filterValue === "overdue") {
        result = result.filter(
          (s) =>
            s.dueDate &&
            new Date(s.dueDate) < new Date() &&
            (s.status || "").toLowerCase() !== "completed"
        );
      }
    }

    // --- SORT ---
    if (sortValue) {
      result.sort((a, b) => {
        let aValue = a[sortValue];
        let bValue = b[sortValue];

        // Especial: trainings
        if (resourceType === "training" && sortValue === "setCount") {
          aValue = a.sets?.length || 0;
          bValue = b.sets?.length || 0;
        }
        // Especial: sesiones por fecha
        if (
          (resourceType === "session" &&
            (sortValue === "dueDate" || sortValue === "createdAt")) ||
          ["createdAt", "lastEdited", "lastPerformed"].includes(sortValue)
        ) {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }
        // Especial: status
        if (resourceType === "session" && sortValue === "status") {
          // Pending < In Progress < Completed
          const order = { pending: 1, "in progress": 2, completed: 3 };
          aValue = order[(aValue || "").toLowerCase()] || 99;
          bValue = order[(bValue || "").toLowerCase()] || 99;
        }
        // Texto: title/trainingTitle
        if (["title", "trainingTitle"].includes(sortValue)) {
          aValue = (aValue || "").toLowerCase();
          bValue = (bValue || "").toLowerCase();
        }

        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        return 0;
      });
    }
    return result;
  }, [items, filterValue, sortValue, sortDirection, resourceType]);

  // ----------- RENDER UI ---------------
  const getContent = () => {
    if (isLoading) return <h3>Loading...</h3>;
    if (error) return <h3>{error}</h3>;
    if (!getFilteredAndSortedItems || getFilteredAndSortedItems.length === 0)
      return <h3>No items found</h3>;

    return (
      <div className="resource-list-items">
        {getFilteredAndSortedItems.map((item) => (
          <React.Fragment key={item.id}>
            {renderItem({
              item,
              isSelected: selectedItems.some((i) => i.id === item.id),
              onSelect: () => handleSelect(item),
              onDelete: () => handleDelete(item.id),
              editable,
              selectable,
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Botón de crear/importar (solo quizzes)
  const renderAddButton = () => {
    if (resourceType !== "quiz" || !editable) return null;
    return (
      <div className="add-resource-wrapper">
        {isDropdownOpen && (
          <div className="add-resource-dropdown">
            <Link to="/quiz-manager" className="add-resource-dropdown-item">
              <i className="fas fa-plus"></i>
              Create New Quiz
            </Link>
            <button
              className="add-resource-dropdown-item"
              onClick={openImportModal}
            >
              <i className="fas fa-file-import"></i>
              Import JSON
            </button>
          </div>
        )}
        <button className="add-resource-button" onClick={toggleDropdown}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  };

  // -------- FILTER & SORT CONTROLS ----------
  const renderControls = () => {
    const config = RESOURCE_SORT_FILTERS[resourceType];
    if (!config) return null;
    return (
      <div className="resource-sort-filter-row">
        {/* FILTER */}
        {config.filterOptions && (
          <select
            className="resource-filter-select"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            {config.filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* SORT */}
        {config.sortOptions && (
          <select
            className="resource-sort-select"
            value={sortValue + "_" + sortDirection}
            onChange={(e) => {
              const [val, dir] = e.target.value.split("_");
              setSortValue(val);
              setSortDirection(dir);
            }}
          >
            {config.sortOptions.map((opt) => (
              <option
                key={opt.value + "_" + opt.direction}
                value={opt.value + "_" + opt.direction}
              >
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // ----------- FINAL RENDER -------------
  return (
    <div className="resource-list-container">
      {renderControls()}
      {getContent()}
      {renderAddButton()}
    </div>
  );
}

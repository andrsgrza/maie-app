import React, { useState, useEffect, useRef } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import {
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineUserAdd,
} from "react-icons/ai"; // Icons for add and delete
import { ResouceEntitlementClient } from "../../api/resource-entitlement-client";
import { UserClient } from "../../api/user-client";
import "./HandleEntitlementModal.css";
import { useModal } from "../../context/ModalContext";
import { formatRoleName } from "../../util/stringParser";

export default function HandleEntitlementModal({ toggleModal, resourceId }) {
  const dropdownRef = useRef(null);
  const [entitlements, setEntitlements] = useState({});
  const [selectedUsers, setSelectedUsers] = useState({});
  const [matchingUsers, setMatchingUsers] = useState({});
  const [roles, setRoles] = useState([]);
  const [userSearch, setUserSearch] = useState({});
  const [usersToAdd, setUsersToAdd] = useState({});
  const [usersToRemove, setUsersToRemove] = useState({});
  const [showInput, setShowInput] = useState({
    role1: false,
    role2: false,
    role3: false,
  });
  const { handleEntitlementState } = useModal();
  const [devView, setDevView] = useState(false);
  const [enableSave, setEnableSave] = useState(false);

  useEffect(() => {
    ResouceEntitlementClient.getRoles()
      .then((response) => {
        if (response.status === 200) {
          const roles = response.data;
          setRoles(roles);
          const initialEntitlements = roles.reduce((acc, role) => {
            acc[role] = [];
            return acc;
          }, {});
          setEntitlements(initialEntitlements);

          ResouceEntitlementClient.getEntitlementForQuiz(
            handleEntitlementState.resourceId
          ).then((entResponse) => {
            if (entResponse.status === 200) {
              setEntitlements((prev) => {
                const fetchedEntitlements = entResponse.data || {};
                return Object.keys(prev).reduce((acc, role) => {
                  acc[role] = fetchedEntitlements[role] || [];
                  return acc;
                }, {});
              });
            } else {
            }
          });
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (
      Object.keys(usersToAdd).length !== 0 ||
      Object.keys(usersToRemove).length !== 0
    ) {
      setEnableSave(true);
    } else {
      setEnableSave(false);
    }
  }, [usersToAdd, usersToRemove]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMatchingUsers({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOnClose = () => {
    toggleModal();
  };

  // Function to handle input changes and simulate user search
  const handleUserSearch = async (e, role) => {
    const query = e.target.value;
    setUserSearch((prev) => ({ ...prev, [role]: query }));
    const fetchedUsers = await UserClient.searchUsers(query);
    const existingUserIds = Object.values(entitlements)
      .flat()
      .map((user) => user.userId);

    // Filter fetched users to remove those already in entitlements
    const filteredFetchedUsers = fetchedUsers.filter(
      (user) => !existingUserIds.includes(user.userId)
    );

    setMatchingUsers((prev) => ({ ...prev, [role]: filteredFetchedUsers }));
  };

  // Function to remove selected users
  const addUsersToRemoveList = (role) => {
    selectedUsers[role].forEach((user) => {
      setUsersToAdd((prevUsersToAdd) => {
        const currentUsersToAdd = prevUsersToAdd[role] || []; // Default to an empty array if undefined
        const userIndex = currentUsersToAdd.findIndex(
          (u) => u.userId === user.userId
        );

        if (userIndex !== -1) {
          // User is present in usersToAdd, remove it
          const updatedUsersToAdd = [...currentUsersToAdd];
          updatedUsersToAdd.splice(userIndex, 1);
          return { ...prevUsersToAdd, [role]: updatedUsersToAdd };
        } else {
          // User is not present in usersToAdd, no change
          return prevUsersToAdd;
        }
      });

      setUsersToRemove((prevUsersToRemove) => {
        const currentUsersToRemove = prevUsersToRemove[role] || []; // Default to an empty array if undefined
        const userIndex = currentUsersToRemove.findIndex(
          (u) => u.userId === user.userId
        );

        // Use the most recent state of usersToAdd
        const currentUsersToAdd = usersToAdd[role] || []; // Access the current state directly

        if (
          userIndex === -1 &&
          !currentUsersToAdd.some((u) => u.userId === user.userId)
        ) {
          // User is not present in usersToRemove, add it
          return {
            ...prevUsersToRemove,
            [role]: [...currentUsersToRemove, user],
          };
        } else {
          // User is already present or in usersToAdd, no change
          return prevUsersToRemove;
        }
      });
      setEntitlements((prevEntitlements) => {
        const currentEntitlements = prevEntitlements[role] || []; // Default to an empty array if undefined
        const updatedEntitlements = currentEntitlements.filter(
          (u) => u.userId !== user.userId
        );
        return { ...prevEntitlements, [role]: updatedEntitlements };
      });
    });
    selectedUsers[role] = [];
  };

  const addUsersToUsersToAdd = (user, role) => {
    setUsersToRemove((prevUsersToRemove) => {
      const currentUsersToRemove = prevUsersToRemove[role] || []; // Default to an empty array if undefined
      const userIndex = currentUsersToRemove.findIndex(
        (u) => u.userId === user.userId
      );

      if (userIndex !== -1) {
        // User is present in usersToRemove, remove it
        const updatedUsersToRemove = [...currentUsersToRemove];
        updatedUsersToRemove.splice(userIndex, 1);
        return { ...prevUsersToRemove, [role]: updatedUsersToRemove };
      } else {
        // User is not present in usersToRemove, no change
        return prevUsersToRemove;
      }
    });

    setUsersToAdd((prevUsersToAdd) => {
      const currentUsersToAdd = prevUsersToAdd[role] || []; // Default to an empty array if undefined
      const userIndex = currentUsersToAdd.findIndex(
        (u) => u.userId === user.userId
      );

      // Use the most recent state of usersToRemove
      const currentUsersToRemove = usersToRemove[role] || []; // Access the current state directly

      if (
        userIndex === -1 &&
        !currentUsersToRemove.some((u) => u.userId === user.userId)
      ) {
        // User is not present in usersToAdd and not in usersToRemove, add it
        return { ...prevUsersToAdd, [role]: [...currentUsersToAdd, user] };
      } else {
        // User is already present or in usersToRemove, no change
        return prevUsersToAdd;
      }
    });
    //TODO: Here add checking if user on list to remove
    setEntitlements((prev) => ({
      ...prev,
      [role]: [...(prev[role] || []), user],
    }));
    setUserSearch("");
    setMatchingUsers([]);
  };

  // Function to toggle input visibility for each role
  const toggleShowInput = (role) => {
    setShowInput((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  // Function to toggle user selection for removal
  const handleSelectUser = (role, user) => {
    setSelectedUsers((prev) => {
      const isSelected = (prev[role] || []).includes(user); // Use fallback
      return {
        ...prev,
        [role]: isSelected
          ? (prev[role] || []).filter((u) => u !== user) // Use fallback
          : [...(prev[role] || []), user], // Use fallback
      };
    });
  };

  const handleSave = () => {
    // Assuming you want to save users for all roles
    Object.keys(usersToAdd).forEach(async (role) => {
      if (usersToAdd[role].length > 0) {
        const res = await ResouceEntitlementClient.addQuizEntitlement(
          handleEntitlementState.resourceId,
          usersToAdd[role],
          role
        );
      }
    });
    Object.keys(usersToRemove).forEach(async (role) => {
      if (usersToRemove[role].length > 0) {
        const res = await ResouceEntitlementClient.removeQuizEntitlement(
          handleEntitlementState.resourceId,
          usersToRemove[role],
          role
        );
      }
    });

    toggleModal();
  };

  return selectedUsers ? (
    <>
      <Modal>
        <ModalHeader title="Manage Role Entitlements" onClose={handleOnClose} />
        <ModalBody>
          {devView && (
            <>
              <p>Entitlement list</p>
              {JSON.stringify(entitlements, null, 2)}
              <p>Selected Users</p>
              {JSON.stringify(selectedUsers, null, 2)}
              {/* <p>Entitlements</p>
              {JSON.stringify(entitlements)} */}
              <p>Matching Users</p>
              {matchingUsers
                ? JSON.stringify(matchingUsers, null, 2)
                : "No matching users"}
              <p>Users to add</p>
              {JSON.stringify(usersToAdd, null, 2)}
              <p>Users to remove</p>
              {JSON.stringify(usersToRemove, null, 2)}
            </>
          )}
          {roles.map((role) => (
            <div className="role-column" key={role}>
              <div className="role-header">
                <h3>{formatRoleName(role)}</h3>
                <button
                  className="remove-icon"
                  onClick={() => addUsersToRemoveList(role)}
                  disabled={!selectedUsers[role]?.length}
                >
                  <AiOutlineDelete />
                </button>
              </div>
              {entitlements[role] && entitlements[role]?.length !== 0 && (
                <div className="user-list">
                  {entitlements[role]?.map((userData) => (
                    <div key={userData.userId} className="user-item">
                      <input
                        disabled={
                          role === "OWNER" && entitlements[role]?.length <= 1
                        }
                        type="checkbox"
                        checked={selectedUsers[role]?.includes(userData)}
                        onChange={() => handleSelectUser(role, userData)}
                      />
                      {userData.username}
                    </div>
                  ))}
                </div>
              )}

              <div className="add-user">
                {!showInput[role] ? (
                  <button
                    onClick={() => toggleShowInput(role)}
                    className="add-user-button"
                  >
                    <AiOutlineUserAdd /> Add User
                  </button>
                ) : (
                  <>
                    <div className="user-input" ref={dropdownRef}>
                      <input
                        key={role}
                        type="text"
                        value={userSearch[role] || ""}
                        onChange={(e) => handleUserSearch(e, role)}
                        placeholder="Type to search..."
                      />

                      {/* Dropdown for matching users */}
                      {matchingUsers[role]?.length > 0 && (
                        <ul className="user-dropdown">
                          {matchingUsers[role].map((user) => (
                            <li
                              key={user.userId}
                              onClick={() => addUsersToUsersToAdd(user, role)}
                            >
                              {user.username}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {/* <button onClick={() => setDevView(!devView)} /> */}
        </ModalBody>
        <ModalFooter>
          {/* TODO: Handle backend request only onSave, the rest should only be only by the UI */}
          <button
            className="save-button"
            disabled={!enableSave}
            onClick={handleSave}
          >
            Save
          </button>
        </ModalFooter>
      </Modal>
    </>
  ) : (
    <h2>loading</h2>
  );
}

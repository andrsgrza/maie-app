import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './Modal';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineUserAdd } from 'react-icons/ai'; // Icons for add and delete
import { ResouceEntitlementClient } from '../../api/resource-entitlement-client';
import { UserClient } from '../../api/user-client';
import './HandleEntitlementModal.css';
import { useModal } from '../../context/ModalContext';
import {formatRoleName} from '../../util/stringParser';

export default function HandleEntitlementModal( { toggleModal, resourceId }) {
  const [entitlements, setEntitlements] = useState({});
  const [selectedUsers, setSelectedUsers] = useState({});
  const [matchingUsers, setMatchingUsers] = useState({});

  const [roles, setRoles] = useState([]);
  const [userSearch, setUserSearch] = useState({});
  

  //const [newUsers, setNewUsers] = useState([]);  // Users selected for addition  
  const [newUsers, setNewUsers] = useState({});  
  const [showInput, setShowInput] = useState({
    role1: false,
    role2: false,
    role3: false
  });
  const {handleEntitlementState } = useModal();
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [devView, setDevView] = useState(false);
  useEffect(() => {
    ResouceEntitlementClient.getRoles()
        .then(response => {
            if (response.status === 200) {
                const roles = response.data;
                setRoles(roles);
                const initialEntitlements = roles.reduce((acc, role) => {
                    acc[role] = [];
                    return acc;
                }, {});
                setEntitlements(initialEntitlements);

                ResouceEntitlementClient.getEntitlementForQuiz(handleEntitlementState.resourceId)
                    .then(entResponse => {
                        if (entResponse.status === 200) {
                            setEntitlements(prev => {
                                const fetchedEntitlements = entResponse.data || {};
                                return Object.keys(prev).reduce((acc, role) => {
                                    acc[role] = fetchedEntitlements[role] || [];
                                    return acc;
                                }, {});
                            });
                        } else {
                            console.error('Error fetching entitlements:', entResponse.message);
                        }
                    });
            } else {
                console.error('Error fetching roles:', response.message);
            }
        })
        .catch(error => {
            console.error('Error fetching roles:', error);
        });
}, []);

  // Mock user data for dropdown (in real app, you'd fetch this from the server)
  const allUsers = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'NewUser1', 'NewUser2'];


  const handleAddUser = (role) => {
    ResouceEntitlementClient.addQuizEntitlement(handleEntitlementState.resourceId, newUsers[role], role)
    if (!newUsers[role] || newUsers[role].length === 0) return;
    setEntitlements(prev => ({
      ...prev,
      [role]: [...prev[role], ...newUsers[role]]
    }));
    setNewUsers(prev => ({
      ...prev,
      [role]: [] // Clear only the users for this specific role
    }));
  };
  // Function to remove selected users
  const handleRemoveUsers = (role) => {
    const roleToUserIds = {};
    Object.keys(selectedUsers).forEach(role => {
        if (selectedUsers[role]?.length > 0) {
            roleToUserIds[role] = selectedUsers[role].map(user => user.userId);
        }
    });

    ResouceEntitlementClient.removeQuizEntitlement(handleEntitlementState.resourceId, selectedUsers[role], role)
        .then(() => {
            setEntitlements(prev => {
                const updatedEntitlements = { ...prev };
                Object.keys(roleToUserIds).forEach(role => {
                    updatedEntitlements[role] = updatedEntitlements[role].filter(
                        user => !roleToUserIds[role].includes(user.userId)
                    );
                });
                return updatedEntitlements;
            });
            setSelectedUsers({});
        })
        .catch(error => {
            console.error('Failed to remove users:', error);
        });
};


  // const handleRemoveUsers = (role) => {
  //   setEntitlements(prev => ({
  //     ...prev,
  //     [role]: prev[role].filter(user => !selectedUsers[role].includes(user))
  //   }));
  //   setSelectedUsers(prev => ({ ...prev, [role]: [] }));  // Clear selection
  // };

  const handleOnClose = () => {
    toggleModal();
  };

  // Function to handle input changes and simulate user search
  const handleUserSearch = async (e, role) => {
    const query = e.target.value;
    setUserSearch(prev => ({...prev, [role]: query}));
    const fetchedUsers = await UserClient.searchUsers(query);
    setMatchingUsers(prev => ({...prev, [role]: fetchedUsers}));
  };

  // Function to select a user from the dropdown
  // const selectUser = (user) => {
  //   if (!newUsers.includes(user)) {
  //     setNewUsers([...newUsers, user]);
  //   }
  //   setUserSearch(''); // Clear the input after selecting a user
  //   setMatchingUsers([]);  // Hide the dropdown
  // };
  const selectUser = (user, role) => {
    setNewUsers(prev => ({
      ...prev,
      [role]: [...(prev[role] || []), user]
    }));
    setUserSearch('');
    setMatchingUsers([]);
  };

  // Function to toggle input visibility for each role
  const toggleShowInput = (role) => {
    setShowInput(prev => ({ ...prev, [role]: !prev[role] }));
  };

  // Function to toggle user selection for removal
  const handleSelectUser = (role, user) => {
    setSelectedUsers(prev => {
      const isSelected = (prev[role] || []).includes(user); // Use fallback
      return {
        ...prev,
        [role]: isSelected
          ? (prev[role] || []).filter(u => u !== user) // Use fallback
          : [...(prev[role] || []), user] // Use fallback
      };
    });
  };
  

  

  return (
    selectedUsers ? (
    <>
      <Modal>
        <ModalHeader title="Manage Role Entitlements" onClose={handleOnClose}/>
        <ModalBody>          
          {devView && (
            <>
              <p>Selected Users</p>
              {JSON.stringify(selectedUsers, null, 2)}
              {/* <p>Entitlements</p>
              {JSON.stringify(entitlements)} */}
              <p>New Users</p>
              {JSON.stringify(newUsers, null, 2)}
              <p>Matching Users</p>
              {matchingUsers ? JSON.stringify(matchingUsers, null, 2) : 'No matching users'}
            </>
          )}    
          {roles.map(role => (
            <div className="role-column" key={role}>
              <div className="role-header">
                <h3>{formatRoleName(role)}</h3>
                <button
                  className="remove-icon"
                  onClick={() => handleRemoveUsers(role)}
                  disabled={!selectedUsers[role]?.length}
                >
                  <AiOutlineDelete />
                </button>
              </div>
              {
                entitlements[role] && entitlements[role]?.length !== 0 && (                  
                  <div className="user-list">
                    {entitlements[role]?.map(userData => (
                      <div key={userData.userId} className="user-item">
                        <input
                          type="checkbox"
                          checked={selectedUsers[role]?.includes(userData)}
                          onChange={() => handleSelectUser(role, userData)}
                        />
                        {userData.username}
                      </div>
                    ))}
                  </div>
                )
              }

              <div className="add-user">
                {!showInput[role] ? (
                  <button onClick={() => toggleShowInput(role)} className="add-user-button">
                    <AiOutlineUserAdd /> Add User
                  </button>
                ) : (
                  <>
                    <div className="user-input">
                    <input
                        key={role}
                        type="text"
                        value={userSearch[role] || ''}
                        onChange={(e) => handleUserSearch(e, role)}
                        placeholder="Type to search..."
                    />
                      <button onClick={() => handleAddUser(role)} className="add-user-confirm">
                        <AiOutlinePlus />
                      </button>

                      {/* Dropdown for matching users */}
                      <p>ROle {role}</p>
                      {matchingUsers[role]?.length > 0 && (
                        <ul className="user-dropdown">
                            {matchingUsers[role].map(user => (
                                <li key={user.userId} onClick={() => selectUser(user, role)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                      )}
                    </div>
                    <div className="selected-users">
    
                    {newUsers[role]?.map(user => (
                      <span key={user.userId} className="selected-user">
                          {user.username}
                      </span>
                  ))}
                  </div>
                </>
                )}
              </div>
            </div>
          ))}
          <button onClick={() => setDevView(!devView)} />
        </ModalBody>
        <ModalFooter>
          <button onClick={handleOnClose}>Close</button>
          {/* TODO: Handle backend request only onSave, the rest should only be only by the UI */}
          {/* <button onClick={() => console.log("Save")}>Save</button> */}
        </ModalFooter>
      </Modal>
    </>
  ) : <h2>loading</h2>
  );
}

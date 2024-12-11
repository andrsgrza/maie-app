import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './Modal';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineUserAdd } from 'react-icons/ai'; // Icons for add and delete
import { ResouceEntitlementClient } from '../../api/resource-entitlement-client';
import './HandleEntitlementModal.css';

export default function HandleEntitlementModal( { toggleModal }) {
  const roles = ['owner','read only', 'read write'];  // Example roles
  const [entitlements, setEntitlements] = useState({
    role1: ['User1', 'User2'],
    role2: ['User3', 'User4'],
    role3: ['User5', 'User6'],
  });

  const [selectedUsers, setSelectedUsers] = useState({
    role1: [],
    role2: [],
    role3: []
  });

  const [userSearch, setUserSearch] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);  // Simulated search result
  const [newUsers, setNewUsers] = useState([]);  // Users selected for addition
  const [showInput, setShowInput] = useState({
    role1: false,
    role2: false,
    role3: false
  });

  useEffect(() => {
    // Simulate fetching roles from the server
    ResouceEntitlementClient.getRoles()
      .then(response => {
        if (response.status === 200) {
          console.log('rikesh: ', response.data)
        }
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  // Mock user data for dropdown (in real app, you'd fetch this from the server)
  const allUsers = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'NewUser1', 'NewUser2'];

  // Function to handle adding users
  const handleAddUser = (role) => {
    if (newUsers.length === 0) return; // No users to add
    setEntitlements(prev => ({
      ...prev,
      [role]: [...prev[role], ...newUsers]
    }));
    setNewUsers([]);  // Clear the input after adding
  };

  // Function to handle input changes and simulate user search
  const handleUserSearch = (e) => {
    const query = e.target.value;
    setUserSearch(query);
    // Simulate user search (in a real app, you'd call an API here)
    setMatchingUsers(allUsers.filter(user => user.toLowerCase().includes(query.toLowerCase())));
  };

  // Function to select a user from the dropdown
  const selectUser = (user) => {
    if (!newUsers.includes(user)) {
      setNewUsers([...newUsers, user]);
    }
    setUserSearch(''); // Clear the input after selecting a user
    setMatchingUsers([]);  // Hide the dropdown
  };

  // Function to toggle input visibility for each role
  const toggleShowInput = (role) => {
    setShowInput(prev => ({ ...prev, [role]: !prev[role] }));
  };

  // Function to toggle user selection for removal
  const handleSelectUser = (role, user) => {
    setSelectedUsers(prev => {
      const isSelected = prev[role].includes(user);
      return {
        ...prev,
        [role]: isSelected ? prev[role].filter(u => u !== user) : [...prev[role], user]
      };
    });
  };

  // Function to remove selected users
  const handleRemoveUsers = (role) => {
    setEntitlements(prev => ({
      ...prev,
      [role]: prev[role].filter(user => !selectedUsers[role].includes(user))
    }));
    setSelectedUsers(prev => ({ ...prev, [role]: [] }));  // Clear selection
  };

  const handleOnClose = () => {
    toggleModal();
  };

  return (
    <Modal>
      <ModalHeader title="Manage Role Entitlements" onClose={handleOnClose}/>
      <ModalBody>
        {roles.map(role => (
          <div className="role-column" key={role}>
            <div className="role-header">
              <h3>{role}</h3>
              <button
                className="remove-icon"
                onClick={() => handleRemoveUsers(role)}
                disabled={selectedUsers[role].length === 0}  // Disable if no users selected
              >
                <AiOutlineDelete />
              </button>
            </div>

            <div className="user-list">
              {entitlements[role]?.map(user => (
                <div key={user} className="user-item">
                  <input
                    type="checkbox"
                    checked={selectedUsers[role]?.includes(user)}
                    onChange={() => handleSelectUser(role, user)}
                  />
                  {user}
                </div>
              ))}
            </div>

            <div className="add-user">
              {!showInput[role] ? (
                <button onClick={() => toggleShowInput(role)} className="add-user-button">
                  <AiOutlineUserAdd /> Add User
                </button>
              ) : (
                <div className="user-input">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={handleUserSearch}
                    placeholder="Type to search..."
                  />
                  <button onClick={() => handleAddUser(role)} className="add-user-confirm">
                    <AiOutlinePlus />
                  </button>

                  {/* Dropdown for matching users */}
                  {matchingUsers.length > 0 && (
                    <ul className="user-dropdown">
                      {matchingUsers.map(user => (
                        <li key={user} onClick={() => selectUser(user)}>
                          {user}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Display selected users */}
                  <div className="selected-users">
                    {newUsers.map(user => (
                      <span key={user} className="selected-user">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <button onClick={handleOnClose}>Close</button>
        <button onClick={() => console.log("Save")}>Save</button>
      </ModalFooter>
    </Modal>
  );
}

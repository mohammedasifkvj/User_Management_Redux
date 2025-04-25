import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  getUser,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  showTaskStart,
  showTaskSuccess,
  showTaskFailure
} from '../redux/admin/adminSlice';

export default function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [showTaskPopup, setshowTaskPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]); // State to store tasks for selected user

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/list');
        dispatch(getUser(response.data)); // Dispatch the action to store users
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  // fetch tasks and show the popup for the selected user
  const showTasks = async (user) => {
    setSelectedUser(user);
    try {
      dispatch(showTaskStart());
      const response = await axios.get(`/api/admin/showTask/${user.id}`);
      setTasks(response.data.tasks);
      dispatch(showTaskSuccess(user.id));
    } catch (error) {
      dispatch(showTaskFailure(error));
      console.log('Error fetching tasks:', error);
      setTasks([]);
    }
    setshowTaskPopup(true);
  };

  // Delete user
  const handleDeleteAccount = async (userId) => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/admin/deleteUser/${userId}`);
      dispatch(deleteUserSuccess(userId));
      setShowDeletePopup(false);
    } catch (error) {
      dispatch(deleteUserFailure(error));
      console.log('Error deleting user:', error);
    }
  };

  // Show delete popup
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  return (
    <div className="flex min-h-screen bg-white justify-center items-top">
      <div className="w-2/3 bg-white shadow-md rounded p-6">
        <Link to="/createUser">
          <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:bg-green-600 disabled:opacity-80">
            Create User
          </button>
        </Link>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="border border-gray-300 px-0 py-0">Sl. Number</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="odd:bg-gray-100 even:bg-white">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                  <Link to={`/editUser/${user.id}`}>
                    <button className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => confirmDelete(user)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <Link to={`/assignTask/${user.id}`}>
                    <button className="bg-emerald-500 text-white py-1 px-2 rounded hover:bg-emerald-600">
                      Assign Task
                    </button>
                  </Link>
                  <button
                    onClick={() => showTasks(user)}
                    className="bg-slate-500 text-white py-1 px-2 rounded hover:bg-slate-600">
                    Show Tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">Delete User</h2>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete user <strong>{selectedUser.name}</strong> ?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAccount(selectedUser.id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Popup */}
      {showTaskPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">
              Assigned Tasks for {selectedUser?.name}
            </h2>

            {tasks && tasks.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li key={task._id} className="p-4 border rounded-lg text-center">
                      <h3 className="text-lg font-semibold">{task.taskName}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      {task.dueTime && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(task.dueTime).toLocaleDateString()}
                        </p>
                      )}
                      {/* Status with color coding */}
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full
                    ${task.status === 'pending' ? 'bg-yellow-500' : ''}
                    ${task.status === 'completed' ? 'bg-green-500' : ''}
                    ${task.status === 'overdue' ? 'bg-red-500' : ''}`}
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No tasks assigned.</p>
            )}

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setshowTaskPopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
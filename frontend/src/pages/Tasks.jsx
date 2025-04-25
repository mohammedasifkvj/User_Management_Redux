import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  updateTaskStart,
  updateTaskSuccess,
  updateTaskFailure,
} from '../redux/user/userSlice.js';

export default function Tasks() {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error } = useSelector((state) => state.user);

  const { currentUser, err } = useSelector((state) => state.user);

        // Fetch tasks
      useEffect(() => {
        const fetchTasks = async () => {
          try {
            const res = await axios.get(`/api/student/getTasks/${currentUser._id}`);
            if (res.data.success === false) {
              return;
            }
            setTasks(res.data.tasks);
          } catch (err) {
            console.error('Error fetching tasks:', err);
          }
        };

        fetchTasks();
      }, []);

  // Status update
      const handleStatusChange = async (taskId) => {
        dispatch(updateTaskStart());
        setLoading(true);
        try {
          const res = await axios.patch(`/api/student/updateTask/${taskId}`, {
            status: 'completed',
          });

          setLoading(false);
          if (res.data.success === false) {
            dispatch(updateTaskFailure(res.data.message));
            return;
          }
          dispatch(updateTaskSuccess(res.data));
          
          // Update the task in local state to reflect the new status
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === taskId ? { ...task, status: 'completed' } : task
            )
          );
        } catch (error) {
          setLoading(false);
          dispatch(updateTaskFailure(error?.response?.data?.message || error.message));
        }
      };

  return (
    <div className='p-3 max-w-3xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Assigned Tasks</h1>
      {error && <p className='text-red-700 text-center my-3'>{error}</p>}
      {tasks.length === 0 ? (
        <p className='text-center'>No tasks assigned.</p>
      ) : (
        <div className='space-y-4'>
          {tasks.map(task => (
            <div key={task._id} className='p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <h2 className='text-xl font-semibold'>{task.taskName}</h2>
                <p>{task.description}</p>
                {task.dueTime && (
                  <p className='text-sm text-gray-500'>Due: {new Date(task.dueTime).toLocaleDateString()}</p>
                )}
                <p className='text-sm text-gray-500'>Status:
                <span
                      className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full
                        ${task.status === 'pending' ? 'bg-yellow-500' : ''}
                        ${task.status === 'completed' ? 'bg-green-500' : ''}
                        ${task.status === 'overdue' ? 'bg-red-500' : ''}`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                </p>
              </div>
              <div>
                {task.status === 'pending' ? (
                  <button
                    onClick={() => handleStatusChange(task._id)}
                    disabled={loading}
                    className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-70'
                  >
                    {loading ? 'Updating...' : 'Mark as Completed'}
                  </button>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
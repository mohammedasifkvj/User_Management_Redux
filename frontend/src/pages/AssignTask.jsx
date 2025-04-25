import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  assignTaskStart,
  assignTaskSuccess,
  assignTaskFailure,
} from '../redux/admin/adminSlice';

export default function AssignTask() {
  const { id } = useParams(); //take id from the URL
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ taskName: '', description: '', dueTime: '' });
  const [errors, setErrors] = useState({ taskName: '', description: '', dueTime: '' });
  const [loadingg, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Updated validate function with dueTime check
  const validate = (name, value) => {
    switch (name) {
      case 'taskName':
        if (value.trim().length < 4) {
          return 'Task name must be at least 4 characters long and cannot be only spaces.';
        }
        return '';
      case 'description':
        if (value.trim().length < 4) {
          return 'Description must be at least 4 characters long and cannot be only spaces.';
        }
        return '';
      case 'dueTime':
        if (value) {
          const selectedDate = new Date(value);
          const now = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(now.getDate() + 1);
          selectedDate.setHours(0, 0, 0, 0);

          if (selectedDate < tomorrow) {
            return 'Due date must be at least tomorrow.';
          }
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    const errorMessage = validate(id, value);
    setErrors({ ...errors, [id]: errorMessage });
  };

  const isFormValid = () => {
    return (
      formData.taskName.trim().length >= 4 &&
      formData.description.trim().length >= 4 &&
      (formData.dueTime === '' || errors.dueTime === '')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      taskName: validate('taskName', formData.taskName),
      description: validate('description', formData.description),
      dueTime: validate('dueTime', formData.dueTime),
    };
    setErrors(newErrors);
    if (newErrors.taskName || newErrors.description || newErrors.dueTime) {
      return;
    }

    try {
      setLoading(true);
      dispatch(assignTaskStart());
      const response = await fetch(`/api/admin/assignTask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success === false) {
        alert(data.message || 'Something went wrong.');
        return;
      }
      
      dispatch(assignTaskSuccess(data));
      navigate('/list');
    } catch (err) {
      dispatch(assignTaskFailure(err.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Assign Task</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Task name'
          autoComplete="off"
          id='taskName'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}
        <textarea
          placeholder='Task description'
          autoComplete="off"
          id='description'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        <label htmlFor="dueTime" className="font-semibold">
          Due Date 
        </label>
        <input
          type="date"
          id="dueTime"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        {errors.dueTime && <p className="text-red-500 text-sm">{errors.dueTime}</p>}
        <button
          disabled={loading || !isFormValid()}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Add Task'}
        </button>
      </form>
      {error && <p className='text-red-700 mt-5'>Error: {error}</p>}
    </div>
  );
}
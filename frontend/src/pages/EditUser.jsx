import { useNavigate,useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/admin/userSlice';

export default function EditUser() {
  const { id } = useParams(); // Extract the user ID from the URL
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const [loadingg,setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch the specific user's data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/getUser/${id}`);
        const userData = await response.json();
        setFormData(userData); // Set the user data in the form
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(updateUserStart());
      const response = await fetch(`/api/admin/editUser/${id}`, {
        method: 'PUT',
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
      
      dispatch(updateUserSuccess(data));
      navigate('/list');
      //alert('User updated successfully!');
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const validate = (name, value) => {
    switch (name) {
      case 'username':
        if (value.trim().length < 4) {
          return 'Username must be at least 4 characters long and cannot be only spaces.';
        }
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address.';
        }
        return '';
      // case 'password':
      //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      //   if (!passwordRegex.test(value)) {
      //     return 'Password must be at least 6 characters long and include both letters and numbers.';
      //   }
      //   return '';
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
    // return (
    //   Object.values(errors).every((err) => err === '') &&
    //   Object.values(formData).every((value) => value.trim() !== '')
    // );
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Edit User</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
        value={formData.username || ''}
          type='text'
          placeholder='Username'
          autoComplete="off"
          id='username'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        <input
        value={formData.email || ''}
          type='email'
          placeholder='Email'
          autoComplete="off"
          id='email'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type='password'
          placeholder='Password'
          autoComplete="off"
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          //disabled={loading || !isFormValid()}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      {error && <p className='text-red-700 mt-5'>Error: {error}</p>}
    </div>
  );
}
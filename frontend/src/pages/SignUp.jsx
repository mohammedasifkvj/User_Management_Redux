import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      case 'password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(value)) {
          return 'Password must be at least 6 characters long and include both letters and numbers.';
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
      Object.values(errors).every((err) => err === '') &&
      Object.values(formData).every((value) => value.trim() !== '')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        alert(data.message || 'Something went wrong.');
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          autoComplete="off"
          id='username'
          value={formData.username}
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        <input
          type='email'
          placeholder='Email'
          autoComplete="off"
          id='email'
          value={formData.email}
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
          value={formData.password}
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          disabled={loading || !isFormValid()}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        {/* <OAuth /> */}
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already Have an Account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
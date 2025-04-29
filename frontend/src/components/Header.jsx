import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'>User Management App</h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='/admin-signIn'>
            { !currentUser ? (
              <li>Admin Login</li>
            ) : (
              <li></li>
            )}
          </Link>
          <Link to='/list'>
            {currentUser && currentUser.isAdmin ? (
              <li>Users List</li>
            ) : (
              <li></li>
            )}
          </Link>
          <Link to='/task'>
            {currentUser && !currentUser.isAdmin ? (
              <li>Tasks</li>
            ) : (
              <li></li>
            )}
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

import AdminSignIn from './pages/AdminSignIn';
import UsersList from './pages/UsersList';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin-signIn' element={<AdminSignIn />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/list' element={<UsersList />} />
          <Route path='/createUser' element={<CreateUser />} />
          <Route path='/editUser/:id' element={<EditUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
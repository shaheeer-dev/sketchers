import { useDispatch } from 'react-redux';
// import { logout } from '@/store/authSlice';
import { AppDispatch } from '@/store';
import ThemeToggler from './Theme/ThemeToggler';

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  return ( 
    <div>
        <h1>Navbar</h1>
        {/* <button onClick={handleLogout}>Logout</button> */}
        <br />
        <span>Toggle Theme</span>
        <ThemeToggler />
    </div>
  );
}

export default Navbar

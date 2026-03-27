import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, register, logout } from '../store/slices/authSlice';
import { LoginDto, RegisterDto } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (credentials: LoginDto) => {
    return dispatch(login(credentials)).unwrap();
  };

  const handleRegister = async (userData: RegisterDto) => {
    return dispatch(register(userData)).unwrap();
  };

  const handleLogout = async () => {
    return dispatch(logout()).unwrap();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

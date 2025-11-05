import API from '../utils/API/API';

const AuthService = {
  login: (email: string, password: string) => API.post('/login', { email, password })
};

export default AuthService;

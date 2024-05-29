import axios from 'axios';

export const refreshToken = async () => {
  try {
    const response = await axios.post('http://localhost:5000/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
      }
    });

    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    return null;
  }
};

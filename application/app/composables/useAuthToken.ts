export const useAuthToken = () => useCookie('auth_token', {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: true,
  sameSite: 'lax',
  path: '/',
})
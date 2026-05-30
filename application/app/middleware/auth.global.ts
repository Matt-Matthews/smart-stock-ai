export default defineNuxtRouteMiddleware((to) => {
//   const { loggedIn } = useUserSession() // or however you track auth
  // const token = useCookie('auth_token') // Example: check for auth token cookie
  // if (to.path === '/' && !token.value) {
  //   return navigateTo('/login')
  // }

  // Redirect logged-in users away from login page
//   if (to.path === '/login' && loggedIn.value) {
//     return navigateTo('/dashboard')
//   }
})
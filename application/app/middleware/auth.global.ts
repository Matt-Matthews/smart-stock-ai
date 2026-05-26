export default defineNuxtRouteMiddleware((to) => {
//   const { loggedIn } = useUserSession() // or however you track auth

  if (to.path === '/') {
    return navigateTo('/login')
  }

  // Redirect logged-in users away from login page
//   if (to.path === '/login' && loggedIn.value) {
//     return navigateTo('/dashboard')
//   }
})
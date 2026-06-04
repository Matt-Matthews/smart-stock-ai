import type { DecodedToken } from "~/types/tokenTypes";


export const useAuthValidator = () => {
    const authToken = useAuthToken()
    const router = useRouter()
    const userStore = useUserStore()

    const decodeJwt = (token: string): DecodedToken => {
        const payload = token.split('.')[1];
        // Base64URL decode: replace URL-safe characters with standard Base64 characters
        const decoded = atob(payload!.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    }

    const isAuthenticated = () => {
        if (!authToken.value) {
            console.log("No token:::")
            router.push('login')
            return;
        }
        const decoded = decodeJwt(authToken.value)


        const isExpired = decoded.exp * 1000 < Date.now();
        const date = new Date(decoded.exp * 1000);
        
        if (isExpired) {
            router.push('login')
            return;
        }

        userStore.setUser(decoded.user)

        router.push('/dashboard')
    }

    const isPrivateAuthenticated = () => {
        if (!authToken.value) {
            router.push('login')
            return;
        }
        const decoded = decodeJwt(authToken.value)


        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            router.push('login')
            return;
        }
    }

    return {
        isAuthenticated,
        isPrivateAuthenticated
    }
}
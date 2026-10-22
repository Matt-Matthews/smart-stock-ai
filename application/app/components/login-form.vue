<template>
  <div class="w-full">
    <NuxtPageCard class="w-full">
      <NuxtAuthForm
        :schema="schema"
        title="Welcome Back"
        description="Access your dashboard to manage your inventory."
        icon="i-lucide-user"
        :fields="fields"
        :loading="isLoading"
        class="text-default"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="flex items-center justify-center gap-1">
            <p class="text-xs">Don't have an account?</p>
            <NuxtLink class="text-xs text-primary" to="/register">
              Request SME Access
            </NuxtLink>
          </div>
        </template>
      </NuxtAuthForm>
    </NuxtPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'


const schema = z.object({
    email: z.email('Please enter a valid email'),
    password: z.string("Please enter a password").min(8, 'Must be at least 8 characters').regex(/[A-Z]/, 'Must contain an uppercase letter').regex(/[a-z]/, 'Must contain a lowercase letter').regex(/[0-9]/, 'Must contain a number').regex(/[@$!%*?&]/, 'Must contain a special character')
})

const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
}, {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox'
}]



type Schema = z.output<typeof schema>

const config = useRuntimeConfig()
const isLoading = ref(false)
const toastMenu = useToast();
const token = useAuthToken()
const userStorage = useUserStore()
const router = useRouter()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    isLoading.value = true
    const baseUrl = config.public.apiBase;
    const {email, password} = payload.data;
    const base64Token = btoa(`${email}:${password}`)

    const { data, error } = await useFetch(`${baseUrl}/auth/login`, {
        method: "POST",
        body: {},
        headers: {
            Authorization: `Basic ${base64Token}`
        }
    });

    if (error.value?.data) {
        toastMenu.add({
            title: 'Error',
            description: error.value?.data?.message,
            color: 'error',
        })
    }else {
        token.value = (data.value as any)?.data?.accessToken
        userStorage.setUser((data.value as any)?.data?.user)
        router.push('/dashboard')
    }
    isLoading.value = false
}
</script>
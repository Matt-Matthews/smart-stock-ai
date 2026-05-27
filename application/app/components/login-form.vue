<template>
    <div class="w-1/2 h-full  flex items-center justify-center text-black">
        <div class="w-2/3 xl:w-1/2">
            <NuxtPageCard class="w-full">
                <NuxtAuthForm :schema="schema" title="Welcome Back" description="Access your dashboard to manage your
                    inventory." icon="i-lucide-user" :fields="fields" @submit="onSubmit" class="text-default">
                    <template #providers>
                        <!-- Intentionally left empty to remove from top -->
                    </template>

                    <template #footer>
                        <!-- Move providers to the bottom -->
                        <div class="flex items-center gap-1 justify-center">
                            <!-- <NuxtSeparator label="or" /> -->
                            <p class="text-xs">Don't have an account?</p> <NuxtLink class="text-xs text-primary" to="/docs/components/link">Request SME Access</NuxtLink>
                        </div>
                    </template>
                </NuxtAuthForm>

            </NuxtPageCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'


const schema = z.object({
    email: z.email('Please enter a valid email'),
    password: z.string("Please enter a password").min(8, 'Must be at least 8 characters').regex(/[A-Z]/, 'Must contain an uppercase letter').regex(/[a-z]/, 'Must contain a lowercase letter').regex(/[0-9]/, 'Must contain a number').regex(/[@$!%*?&]/, 'Must contain a special character')
})

const toast = useToast()

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

const providers = [{
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
        toast.add({ title: 'Google', description: 'Login with Google' })
    }
}, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
        toast.add({ title: 'GitHub', description: 'Login with GitHub' })
    }
}]


type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
    console.log('Submitted', payload)
}
</script>
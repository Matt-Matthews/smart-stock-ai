<template>
    <div class="max-w-3xl flex flex-col gap-6">
        <div><h1 class="font-bold text-4xl">Profile</h1><p class="text-sm">Manage your personal account details.</p></div>
        <NuxtCard variant="soft">
            <form class="grid grid-cols-2 gap-4" @submit.prevent="saveProfile">
                <NuxtFormField label="First Name"><NuxtInput v-model="form.first_name" required class="w-full" /></NuxtFormField>
                <NuxtFormField label="Last Name"><NuxtInput v-model="form.last_name" required class="w-full" /></NuxtFormField>
                <NuxtFormField label="Email" class="col-span-2"><NuxtInput v-model="form.email" type="email" required class="w-full" /></NuxtFormField>
                <NuxtFormField label="New Password" class="col-span-2"><NuxtInput v-model="form.password" type="password" placeholder="Leave blank to keep current password" class="w-full" /></NuxtFormField>
                <div class="col-span-2 flex justify-end"><NuxtButton type="submit" color="primary">Save Changes</NuxtButton></div>
            </form>
        </NuxtCard>
    </div>
</template>

<script setup lang="ts">
import { useProfileRequests } from '~/composables/useProfileRequests'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const config = useRuntimeConfig()
const token = useAuthToken()
const { updateProfile } = useProfileRequests()
const form = reactive({ first_name: user.value.firstName, last_name: user.value.lastName, email: user.value.email, password: '' })
async function saveProfile() {
    if (!user.value.id) return
    const updated = await updateProfile(config.public.apiBase, token.value!, user.value.id, form)
    if (updated) userStore.setUser({ ...user.value, id: updated.id, firstName: updated.first_name, lastName: updated.last_name, email: updated.email })
}
definePageMeta({ layout: 'main' })
</script>
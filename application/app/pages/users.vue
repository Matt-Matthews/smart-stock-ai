<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center justify-between gap-2">
            <div>
                <h1 class="font-bold text-4xl">Users</h1>
                <p class="text-sm">Manage company users, roles, and access.</p>
            </div>
            <NuxtButton class="text-white" @click="userModal = true"><NuxtIcon name="i-lucide-plus" class="text-[20px]" /> Add User</NuxtButton>
        </div>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class="w-full flex items-center gap-4">
                <NuxtIcon name="i-lucide-list-filter" class="text-muted" />
                <NuxtInput v-model="search" placeholder="Search users" class="w-72" />
                <NuxtSelect v-model="selectedRole" placeholder="Select Role" :items="roleOptions" class="w-48" />
                <NuxtButton variant="outline" color="primary" class="ml-auto" @click="clearFilters">Clear Filters</NuxtButton>
            </div>
        </NuxtCard>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <NuxtTable :data="filteredUsers" :columns="columns" ref="table" class="flex-1" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="table?.tableApi?.getFilteredRowModel().rows.length" @update:page="(page) => table?.tableApi?.setPageIndex(page - 1)" />
            </div>
        </NuxtCard>
        <NuxtModal v-model:open="userModal" title="Add User" description="Create a company user and assign a role."
            :ui="{ content: 'overflow-visible', body: 'overflow-visible', footer: 'justify-end' }">
            <template #body>
                <form id="user-form" class="flex flex-col gap-4" @submit.prevent="submitUser">
                    <NuxtFormField label="First Name"><NuxtInput v-model="userForm.firstName" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Last Name"><NuxtInput v-model="userForm.lastName" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Email"><NuxtInput v-model="userForm.email" type="email" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Password"><NuxtInput v-model="userForm.password" type="password" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Role"><NuxtSelect v-model="userForm.roleId" :items="roles" label-key="name" value-key="id" required class="w-full" /></NuxtFormField>
                </form>
            </template>
            <template #footer="{ close }"><NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" /><NuxtButton label="Submit" form="user-form" type="submit" color="neutral" /></template>
        </NuxtModal>
    </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useRoleRequests } from '~/composables/useRoleRequests'
const managedUserStore = useManagedUserStore()
const { users } = storeToRefs(managedUserStore)
const { listUsers, addUser, deleteUser } = useUserRequests()
const { listRoles } = useRoleRequests()
const roleStore = useRoleStore()
const { roles } = storeToRefs(roleStore)
const config = useRuntimeConfig()
const authToken = useAuthToken()
const { user } = storeToRefs(useUserStore())
const search = ref('')
const selectedRole = ref('')
const userModal = ref(false)
const userForm = reactive({ firstName: '', lastName: '', email: '', password: '', roleId: '' })
const table = useTemplateRef<any>('table')
const roleOptions = computed(() => roles.value.map(role => role.name))
const columns: TableColumn<any>[] = [
    { accessorKey: 'id', header: '#', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: ({ row }) => row.original.role?.name || 'Unassigned' },
    { accessorKey: 'enabled', header: 'Status', cell: ({ row }) => row.original.enabled ? 'Enabled' : 'Disabled' },
    { accessorKey: 'created_at', header: 'Created At', cell: ({ row }) => formatDate(row.original.created_at) },
    { id: 'actions', header: '', cell: ({ row }) => h(resolveComponent('NuxtButton'), { icon: 'i-lucide-trash-2', color: 'error', variant: 'ghost', 'aria-label': 'Delete user', onClick: () => deleteManagedUser(row.original.id) }) }
]
const formatDate = (value: string | null) => value ? new Date(value).toLocaleDateString() : 'N/A'
const filteredUsers = computed(() => users.value.filter(item => {
    const textMatch = `${item.first_name} ${item.last_name} ${item.email}`.toLowerCase().includes(search.value.toLowerCase())
    const roleMatch = selectedRole.value ? item.role?.name === selectedRole.value : true
    return textMatch && roleMatch
}))
function clearFilters() { search.value = ''; selectedRole.value = '' }
async function submitUser() {
    const created = await addUser(config.public.apiBase, authToken.value!, { ...userForm, companyId: user.value.company.id })
    if (created?.id) managedUserStore.addUser(created)
    userForm.firstName = ''; userForm.lastName = ''; userForm.email = ''; userForm.password = ''; userForm.roleId = ''; userModal.value = false
}
async function deleteManagedUser(id: string) {
    const deleted = await deleteUser(config.public.apiBase, authToken.value!, id)
    if (deleted?.id) managedUserStore.removeUser(id)
}
if (user.value.company.id && authToken.value) {
    managedUserStore.setUsers(await listUsers(config.public.apiBase, authToken.value, user.value.company.id))
    roleStore.setRoles(await listRoles(config.public.apiBase, authToken.value, user.value.company.id))
}
definePageMeta({ layout: 'main' })
</script>
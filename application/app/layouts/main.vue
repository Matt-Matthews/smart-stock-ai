<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps, BreadcrumbItem, DropdownMenuItem } from '@nuxt/ui'




// Ignore the props for the example
defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const open = ref(false)
const router = useRouter()
const isLoading = ref(false)

const config = useRuntimeConfig()
const userStore = useUserStore()
const authToken = useAuthToken()
const { user } = storeToRefs(userStore)
const { fetchMasterData } = useFetchMasterData()
const { isPrivateAuthenticated } = useAuthValidator()

const companyId = user.value?.company?.id
const toggleIsLoading = (): void => {
    isLoading.value = !isLoading.value
}

isPrivateAuthenticated()

if (user.value && authToken.value) {
    fetchMasterData(config.public.apiBase, authToken.value, companyId, toggleIsLoading);
} else {
    router.push('/login')
}


const items = computed<NavigationMenuItem[]>(
    () => [
        {
            label: 'Dashboard',
            icon: 'i-lucide-layout-dashboard',
            active: router.currentRoute.value.path.toLowerCase().includes('dashboard'),
            to: '/dashboard',
            tooltip: { text: 'Dashboard', side: 'right', },
        },
        {
            label: 'Inventory',
            icon: 'i-lucide-package',
            active: router.currentRoute.value.path.toLowerCase().includes('inventory'),
            to: '/inventory',
            tooltip: { text: 'Inventory', side: 'right' }
        },
        {
            label: 'Products',
            icon: 'i-lucide-shopping-bag',
            active: router.currentRoute.value.path.toLowerCase().includes('products'),
            to: '/products',
            tooltip: { text: 'Products', side: 'right' }
        },
        {
            label: 'Categories',
            icon: 'i-lucide-layers',
            active: router.currentRoute.value.path.toLowerCase().includes('categories'),
            to: '/categories',
            tooltip: { text: 'Categories', side: 'right' }
        },
        {
            label: 'Suppliers',
            icon: 'i-lucide-truck',
            active: router.currentRoute.value.path.toLowerCase().includes('suppliers'),
            to: '/suppliers',
            tooltip: { text: 'Suppliers', side: 'right' }
        },
        {
            label: 'Reports',
            icon: 'i-lucide-bar-chart-3',
            active: router.currentRoute.value.path.toLowerCase().includes('reports'),
            to: '/reports',
            tooltip: { text: 'Reports', side: 'right' }
        },
        {
            label: 'Invoices',
            icon: 'i-lucide-file-text',
            active: router.currentRoute.value.path.toLowerCase().includes('invoices'),
            to: '/invoices',
            tooltip: { text: 'Invoices', side: 'right' }
        },
        {
            label: 'Users',
            icon: 'i-lucide-users',
            active: router.currentRoute.value.path.toLowerCase().includes('users'),
            to: '/users',
            tooltip: { text: 'Users', side: 'right' }
        },
        {
            label: 'Settings',
            icon: 'i-lucide-settings',
            active: router.currentRoute.value.path.toLowerCase().includes('settings'),
            to: '/settings',
            tooltip: { text: 'Settings', side: 'right' }
        }
    ]);

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const pathSegments = router.currentRoute.value.path.split('/').filter(segment => segment !== '');
    const items: BreadcrumbItem[] = [];

    let accumulatedPath = '';
    for (const segment of pathSegments) {
        accumulatedPath += `/${segment}`;
        items.push({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            to: accumulatedPath
        });
    }

    return items;
});


const dropdownItems: DropdownMenuItem[] = [
    {
        label: 'Profile',
        icon: 'i-lucide-user',
        to: '/profile',
    },
    {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        to: '/logout'
    }
]
</script>

<template>
    <LoadingScreen v-show="isLoading" />
    <div v-show="!isLoading" class="flex flex-1" :class="[
        variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
        side === 'right' && 'flex-row-reverse'
    ]">
        <NuxtSidebar v-model:open="open" :variant="'sidebar'" class="relative border-0" :collapsible="'icon'"
            :side="'left'" :ui="{
                container: 'h-full',
            }">
            <template #header>
                <div class="flex gap-3 items-center overflow-x-clip relative">
                    <NuxtImg src="/transparent-logo.png" class="h-9 w-8" alt="A logo" />

                    <span v-if="open" class="font-bold text-nowrap">Smart Stock AI</span>
                </div>
            </template>

            <NuxtButton :icon="open ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'" color="neutral" variant="soft"
                aria-label="Toggle sidebar" class="absolute -right-4 top-3" size="sm" @click="() => { open = !open }" />

            <NuxtNavigationMenu :items="items" orientation="vertical" collapsible
                :ui="{ link: 'p-1.5 py-2 overflow-hidden', list: 'flex flex-col gap-3' }" tooltip />
        </NuxtSidebar>

        <div
            class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default">
            <div class="flex items-center justify-between border-b border-default p-2.5">
                <div class="ml-8">
                    <NuxtBreadcrumb class="capitalize" :items="breadcrumbItems">
                        <template #separator>
                            <span class="mx-2 text-muted">/</span>
                        </template>
                    </NuxtBreadcrumb>
                </div>
                <div class="flex items-center gap-4 pr-4">
                    <NuxtColorModeSwitch />
                    <NuxtChip>
                        <NuxtButton icon="i-lucide-bell" size="md" variant="soft" />
                    </NuxtChip>
                    <NuxtDropdownMenu :items="dropdownItems" :arrow="{}">
                        <NuxtAvatar class="rounded-sm" :alt="`${user.firstName} ${user.lastName}`" loading="lazy" />
                    </NuxtDropdownMenu>
                </div>
            </div>

            <!-- <div class="flex-1 p-4">
                <slot />

            </div> -->
        </div>
    </div>
</template>
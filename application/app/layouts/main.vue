<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

// Ignore the props for the example
defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const open = ref(false)
const router = useRouter()

const items = computed<NavigationMenuItem[]>(
    () => [
        {
            label: 'Dashboard',
            icon: 'i-lucide-layout-dashboard',
            active: router.currentRoute.value.path.toLowerCase().includes('dashboard'),
            to: '/dashboard',
            tooltip: { text: 'Dashboard', side: 'right' }
        },
        {
            label: 'Inventory',
            icon: 'i-lucide-shelving-unit',
            active: router.currentRoute.value.path.toLowerCase().includes('inventory'),
            to: '/inventory',
            tooltip: { text: 'Inventory', side: 'right' }
        },
        {
            label: 'Products',
            icon: 'i-lucide-boxes',
            active: router.currentRoute.value.path.toLowerCase().includes('products'),
            to: '/products',
            tooltip: { text: 'Products', side: 'right' }
        },
        // {
        //     label: 'Transactions',
        //     icon: 'i-lucide-badge-dollar-sign',
        //     active: router.currentRoute.value.path.toLowerCase().includes('transactions')
        // },
        {
            label: 'Invoices',
            icon: 'i-lucide-file-text',
            active: router.currentRoute.value.path.toLowerCase().includes('invoices'),
            to: '/invoices',
            tooltip: { text: 'Invoices', side: 'right' }
        },
        {
            label: 'Settings',
            icon: 'i-lucide-settings',
            active: router.currentRoute.value.path.toLowerCase().includes('settings'),
            to: '/settings',
            tooltip: { text: 'Settings', side: 'right' }
        }
    ]);
</script>

<template>
    <div class="flex flex-1" :class="[
        variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
        side === 'right' && 'flex-row-reverse'
    ]">
        <NuxtSidebar v-model:open="open" :variant="'floating'" :collapsible="'icon'" :side="'left'" :ui="{
            container: 'h-full'
        }">
            <template #header>
                <div class="flex gap-3 items-center overflow-x-clip">
                    <NuxtImg src="/transparent-logo.png" class="h-9 w-8" alt="A logo" />

                    <span v-if="open" class="font-bold text-nowrap">Smart Stock AI</span>
                </div>
            </template>

            <NuxtNavigationMenu :items="items" orientation="vertical" collapsible
                :ui="{ link: 'p-1.5 py-2 overflow-hidden', list: 'flex flex-col gap-3' }" tooltip />
        </NuxtSidebar>

        <div
            class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default">
            <div class="flex items-center justify-between border-b border-default">
                <div class="h-(--ui-header-height) shrink-0 flex items-center px-4" :class="[
                    side === 'right' && 'justify-end'
                ]">
                    <NuxtButton :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'" color="neutral"
                        variant="ghost" aria-label="Toggle sidebar" @click="open = !open" />
                </div>
                <div class="flex items-center gap-10">
                    <NuxtInput icon="i-lucide-search" size="md" variant="outline"
                        placeholder="Search product or SKU..." />
                    <NuxtButton>Upgrade Plan</NuxtButton>
                </div>
                <div class="flex items-center gap-3 pr-4">
                    <NuxtColorModeButton />
                    <NuxtChip>
                        <NuxtButton icon="i-lucide-bell" size="md" variant="soft" />
                    </NuxtChip>
                    <NuxtAvatar class="rounded-sm" alt="Mathews Paku" loading="lazy" />
                </div>
            </div>

            <div class="flex-1 p-4">
                <slot />

            </div>
        </div>
    </div>
</template>
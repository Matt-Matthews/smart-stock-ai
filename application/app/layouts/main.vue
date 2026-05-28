<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

// Ignore the props for the example
defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const open = ref(false)

const items: NavigationMenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        active: true
    },
    {
        label: 'Inventory',
        icon: 'i-lucide-archive',
    },
    {
        label: 'Products',
        icon: 'i-lucide-apple'
    },
    {
        label: 'Transactions',
        icon: 'i-lucide-badge-dollar-sign',
    },
    {
        label: 'Invoices',
        icon: 'i-lucide-file-text'
    },
    {
        label: 'Settings',
        icon: 'i-lucide-settings',
    }
]
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

            <NuxtNavigationMenu :items="items" orientation="vertical" :ui="{ link: 'p-1.5 overflow-hidden' }" />
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
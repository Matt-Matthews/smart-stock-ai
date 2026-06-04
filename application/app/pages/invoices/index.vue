<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center w-full gap-2">
            <div class="w-1/2">
                <h1 class="font-bold text-4xl">Invoice Management</h1>
                <p class="text-sm">Manage and process your documents with AI-powered OCR.</p>
            </div>

            <div class="w-1/2 rounded-sm h-full flex items-center justify-end gap-2">
                <NuxtButton variant="outline">
                    <NuxtIcon name="i-lucide-download" class="text-[20px]" />
                    Export
                </NuxtButton>
            </div>
        </div>
        <NuxtFileUpload color="neutral" highlight label="Scan New Invoice"
            description="Drag and drop your PDF or Image files here. Our OCR engine will automatically extract vendor data, totals, and line items. SVG, PNG, JPG or GIF (max. 2MB)"
            class="w-full min-h-56 mt-6 bg-elevated" :icon="'i-lucide-cloud-upload'" multiple :ui="{
                description: 'w-1/2',
            }" size="xl" />
        <div class="flex w-full items-center gap-3">
            <div class="rounded-sm bg-elevated h-fit p-4 flex flex-col gap-2 shadow-sm dark:shadow-gray-700/30 mt-6 w-1/3">
                <p class="text-sm text-muted">Total Processed</p>
                <div class="flex items-center w-full justify-between">
                    <h2 class="text-2xl font-bold">1,234</h2>
                    <div class="flex items-center justify-center rounded-sm bg-green-500/20 w-8 h-8">
                        <NuxtIcon name="i-lucide-cloud-check" class="text-green-500" />
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <NuxtIcon name="i-lucide-trending-up" class="text-green-500" />
                    <p class="text-sm text-muted">+12% from last month</p>
                </div>
            </div>
        </div>
        <div class="bg-elevated w-full mt-6 rounded-sm p-4 flex items-center gap-4 shadow-sm dark:shadow-gray-700/30">
            <div class="flex items-center gap-2 text-muted text-sm rounded-sm px-3 py-1">
                <NuxtIcon name="i-lucide-list-filter" class="" />
                <p>Filters</p>
            </div>
            <NuxtSelect placeholder="Select Status" :items="items" />
            <NuxtSelect placeholder="Select Document Type" :items="items" />
            <NuxtButton variant="outline" color="primary" class="ml-auto">Apply Filters</NuxtButton>
            <NuxtButton variant="outline" color="primary">Clear Filters</NuxtButton>
        </div>
    </div>
</template>

<script setup lang="ts">

const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
definePageMeta(
    {
        layout: 'main'
    }
)
</script>
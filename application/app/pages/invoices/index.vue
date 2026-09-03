<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center w-full gap-2">
            <div class="w-1/2">
                <h1 class="font-bold text-4xl">Invoice Management</h1>
                <p class="text-sm">Manage and process your documents with AI-powered OCR.</p>
            </div>
        </div>
        <NuxtFileUpload color="neutral" highlight label="Scan New Invoice"
            description="Drag and drop your PDF or Image files here. Our OCR engine will automatically extract vendor data, totals, and line items. SVG, PNG, JPG or GIF (max. 2MB)"
            class="w-full min-h-56 mt-6 bg-elevated" :icon="'i-lucide-cloud-upload'" multiple :ui="{
                description: 'w-1/2',
            }" size="xl" />
      
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
<template>
    <div class="p-4 flex flex-col gap-2 rounded-sm shadow-sm dark:shadow-gray-700/30 bg-elevated w-1/2 h-full">
        <p class="text-sm">{{ title }}</p>
        <h3 class="text-2xl font-bold">{{ value }}</h3>
        <div class="flex items-center gap-3">
            <NuxtIcon v-if="isPositive" name="i-lucide-trending-up" class="text-[20px] text-success" />
            <NuxtIcon v-else name="i-lucide-trending-down" class="text-[20px] text-error" />
            <span :class="isPositive ? 'text-success' : 'text-error'">{{ trend }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    trend: {
        type: String,
        required: false,
    },
    isPositive: {
        type: Boolean,
        default: true
    }
})
</script>
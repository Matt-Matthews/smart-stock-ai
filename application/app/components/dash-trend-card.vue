<template>
    <NuxtCard variant="soft" class="w-1/4 p-2">
        <div class="flex items-center w-full justify-between">
            <p>{{ label }}</p>
            <NuxtIcon :name="icon" class="ml-1 text-muted/10" size="50" />
        </div>
        <h1 class="text-4xl font-bold mb-5 mt-2">
            {{ valueType === 'currency' ? `$${value.toLocaleString()}` : value.toLocaleString() }}
        </h1>
        <div class="flex items-center gap-1">
            <div :class="(`flex items-center gap-1  rounded-md px-2 py-1 w-fit ${trendValue > 0 ? 'text-success bg-green-200 dark:bg-green-950' : trendValue < 0 ? 'text-destructive bg-red-200 dark:bg-red-950/70' : 'text-muted bg-muted'}`)">
                <NuxtIcon v-if="['up', 'down'].includes(trend)" :name="trend === 'up' ? 'i-lucide-trending-up' : trend === 'down' ? 'i-lucide-trending-down' : 'i-lucide-minus'" class="ml-1" size="16" />
                <span v-if="['up', 'down'].includes(trend)" class="text-xs">{{ trendValue > 0 ? `+${trendValue}`: trendValue }}</span>
                <p v-else class="text-muted text-xs">{{ comment }}</p>
            </div>
            <p v-if="['up', 'down'].includes(trend)" class="text-muted text-xs">{{ comment }}</p>
        </div>
    </NuxtCard>
</template>

<script setup lang="ts">
type TrendType = 'up' | 'down' | 'neutral';
defineProps({
    trend: {
        type: String as () => TrendType,
        default: 'neutral'
    },
    value: {
        type: String,
        default: 0
    },
    label: {
        type: String,
        default: ''
    },
    comment: {
        type: String,
        default: ''
    },
    trendValue: {
        type: Number,
        default: 0
    },
    valueType: {
        type: String,
        default: 'currency'
    },
    icon: {
        type: String,
        default: 'i-lucide-circle-dollar-sign'
    }
})
</script>
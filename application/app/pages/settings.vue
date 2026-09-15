<template>
    <div class="max-w-3xl flex flex-col gap-6">
        <div><h1 class="font-bold text-4xl">Settings</h1><p class="text-sm">Configure workspace preferences.</p></div>
        <NuxtCard variant="soft" class="flex flex-col gap-5">
            <NuxtFormField label="Default currency" description="Used when displaying monetary values.">
                <NuxtSelect v-model="settings.currency" :items="['ZAR', 'USD', 'EUR', 'GBP']" class="w-48" />
            </NuxtFormField>
            <NuxtFormField label="Low stock threshold" description="Items at or below this quantity are flagged.">
                <NuxtInput v-model.number="settings.lowStockThreshold" type="number" min="0" class="w-48" />
            </NuxtFormField>
            <NuxtFormField label="Invoice notifications"><NuxtSwitch v-model="settings.invoiceNotifications" /></NuxtFormField>
            <div class="flex justify-end"><NuxtButton color="primary" @click="saveSettings">Save Settings</NuxtButton></div>
        </NuxtCard>
    </div>
</template>

<script setup lang="ts">
const settings = useState('stock-settings', () => ({ currency: 'ZAR', lowStockThreshold: 5, invoiceNotifications: true }))
const toast = useToast()
function saveSettings() { toast.add({ title: 'Success', description: 'Settings saved.', color: 'success' }) }
definePageMeta({ layout: 'main' })
</script>
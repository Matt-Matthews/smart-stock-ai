<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)
const statuses = ref(['In Stock', 'Low Stock', 'Out of Stock', 'Refunded'])
const { items: products } = useItemStore()
const { user } = useUserStore()
const config = useRuntimeConfig()
const authToken = useAuthToken()

const props = defineProps({
    addInventoryItemToTable: {
        type: Function as PropType<(item: any) => void>,
        required: false
    }
})

const emits = defineEmits(["submitted"])

const {addInventoryItem} = useInventoryRequests()

const schema = z.object({
    productId: z.string('Product must me a valid string').min(1, 'Please select product.'),
    // companyId: z.string("Company must be a valid string"),
    quantity: z.number('Quantity must be a number.').positive("Quantity must be a positive number"),
    status: z.string("Status must be a valid string.").min(1, "Please select a status.")
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    productId: '',
    quantity: 0,
    status: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
    const companyId = user.company.id;
    const basePath = config.public.apiBase;

    const res = await addInventoryItem(basePath, authToken.value as string, {...event.data, companyId});
    
    emits('submitted', res)
    open.value = false;
}

</script>

<template>
    <NuxtModal v-model:open="open" title="Add Inventory Item"
        description="Create a new inventory item by entering product details, SKU, pricing, and stock quantity."
        :ui="{ footer: 'justify-end' }">
        <NuxtButton class="text-white">
            <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
            Add Inventory Item
        </NuxtButton>

        <template #body>
            <NuxtForm id="inventory-add-form" :schema="schema" :state="state" class="w-full flex flex-col gap-4"
                @submit="onSubmit">
                <NuxtFormField label="Product" , name="productId">
                    <NuxtSelect label-key="name" value-key="id" class="w-full" placeholder="Select Product" required
                        :items="products" v-model="state.productId" />
                </NuxtFormField>
                <NuxtFormField label="Status" name="status">
                    <NuxtSelect class="w-full" placeholder="Select Status" required :items="statuses"
                        v-model="state.status" />
                </NuxtFormField>
                <NuxtFormField label="Quantity" name="quantity">
                    <NuxtInput placeholder="Enter quantity" type="number" required class="w-full"
                        v-model="state.quantity" />
                </NuxtFormField>

            </NuxtForm>

        </template>

        <template #footer="{ close }">
            <NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <NuxtButton label="Submit" form="inventory-add-form" type="submit" color="neutral" />
        </template>
    </NuxtModal>
</template>
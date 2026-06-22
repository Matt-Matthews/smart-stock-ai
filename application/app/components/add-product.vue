<template>
    <NuxtModal v-model:open="open" title="Add Product" description="Create a new product by entering product details."
        :ui="{ footer: 'justify-end' }">
        <NuxtButton class="text-white">
            <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
            Add Product
        </NuxtButton>
        <template #body>
            <NuxtForm id="inventory-add-form" :schema="schema" :state="state" class="w-full flex flex-col gap-4"
                @submit="onSubmit">
                <NuxtFormField label="Name" name="name">
                    <NuxtInput placeholder="Enter product name" type="text" required class="w-full"
                        v-model="state.name" />
                </NuxtFormField>
                <NuxtFormField label="Description" name="description">
                    <NuxtTextarea placeholder="Enter product description" type="text" required class="w-full"
                        v-model="state.description" />
                </NuxtFormField>
                <NuxtFormField label="Category" , name="categoryId">
                    <NuxtSelect label-key="name" value-key="id" class="w-full" placeholder="Select Product Category"
                        required :items="categories" v-model="state.categoryId" />
                </NuxtFormField>
                <NuxtFormField label="Currency" name="currencyId">
                    <NuxtSelect class="w-full" label-key="code" value-key="id" placeholder="Select Status" required
                        :items="currencies" v-model="state.currencyId" />
                </NuxtFormField>
                <NuxtFormField label="Selling Price" name="sellPrice">
                    <NuxtInput placeholder="Enter a selling price" type="number" required class="w-full"
                        v-model="state.sellPrice" />
                </NuxtFormField>
                <NuxtFormField label="Cost Price" name="costPrice">
                    <NuxtInput placeholder="Enter a cost price" type="number" required class="w-full"
                        v-model="state.costPrice" />
                </NuxtFormField>
                <NuxtFormField label="Barcode" name="barcode">
                    <NuxtInput placeholder="Enter a barcode" type="text" required class="w-full"
                        v-model="state.barcode" />
                </NuxtFormField>
                <NuxtFormField label="SKU" name="sku">
                    <NuxtInput placeholder="Enter product SKU" type="text" required class="w-full"
                        v-model="state.sku" />
                </NuxtFormField>
            </NuxtForm>

        </template>

        <template #footer="{ close }">
            <NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <NuxtButton label="Submit" form="inventory-add-form" type="submit" color="neutral" />
        </template>
    </NuxtModal>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emits = defineEmits(["submitted"])

const { categories } = useCategoryStore()
const { currencies } = useCurrencyStore()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const { addProduct } = useProductRequests()
const { user } = useUserStore()

const schema = z.object({
    name: z.string("Name must be a string"),
    description: z.string("Description must be a string.").optional(),
    categoryId: z.uuid("Category is required"),
    currencyId: z.uuid("Currency is required"),
    costPrice: z.number("Cost price must be a valid number."),
    sellPrice: z.number("Sell price must be a valid number"),
    sku: z.string("SKU must be a string"),
    barcode: z.string("Barcode must be a string")
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    name: '',
    description: '',
    barcode: '',
    categoryId: '',
    costPrice: 0,
    sellPrice: 0,
    currencyId: '',
    sku: ''
})
const open = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log("Adding product::", event.data)
    const companyId = user.company.id;
    const basePath = config.public.apiBase;
    const product = await addProduct(basePath, authToken.value!, { ...event.data, companyId });
    open.value = false;
    emits('submitted', product)
}
</script>
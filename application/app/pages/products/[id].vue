<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <NuxtButton to="/products" variant="ghost" color="neutral" icon="i-lucide-arrow-left">
                Back to products
            </NuxtButton>
            <NuxtButton to="/inventory" variant="outline" color="neutral" icon="i-lucide-warehouse">
                View inventory
            </NuxtButton>
        </div>

        <section class="flex flex-col justify-between gap-6 border-b border-default pb-6 md:flex-row md:items-end">
            <div class="flex items-start gap-4">
                <div class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <NuxtIcon name="i-lucide-package-2" size="32" />
                </div>
                <div>
                    <div class="mb-2 flex flex-wrap items-center gap-2">
                        <NuxtChip v-if="product.category?.name" color="neutral" variant="subtle">{{ product.category.name }}</NuxtChip>
                        <NuxtChip :color="stockColor" variant="subtle">{{ product.inventory?.status || 'Not stocked' }}</NuxtChip>
                    </div>
                    <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ product.name }}</h1>
                    <p class="mt-1 font-mono text-sm text-muted">SKU {{ product.sku || 'Not assigned' }}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <NuxtButton variant="outline" color="neutral" icon="i-lucide-copy" @click="copySku">Copy SKU</NuxtButton>
                <NuxtButton color="primary" icon="i-lucide-pencil" @click="openEdit">Edit product</NuxtButton>
            </div>
        </section>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section class="flex flex-col gap-6">
                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="rounded-xl border border-default bg-elevated p-5">
                        <p class="text-sm text-muted">Selling price</p>
                        <p class="mt-2 text-3xl font-bold text-primary">{{ formatPrice(product.sell_price) }}</p>
                        <p class="mt-1 text-xs text-muted">Per unit in {{ product.currency?.code || 'local currency' }}</p>
                    </div>
                    <div class="rounded-xl border border-default bg-elevated p-5">
                        <p class="text-sm text-muted">Cost price</p>
                        <p class="mt-2 text-3xl font-bold">{{ formatPrice(product.cost_price) }}</p>
                        <p class="mt-1 text-xs text-muted">Margin {{ marginPercent }}%</p>
                    </div>
                </div>

                <section class="rounded-xl border border-default bg-elevated p-6">
                    <div class="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 class="text-lg font-semibold">Product description</h2>
                            <p class="text-sm text-muted">Information shown across your stock workspace.</p>
                        </div>
                        <NuxtIcon name="i-lucide-file-text" class="text-muted" size="22" />
                    </div>
                    <p class="max-w-3xl whitespace-pre-line leading-7 text-muted">{{ product.description || 'No description has been added for this product.' }}</p>
                </section>

                <section class="rounded-xl border border-default bg-elevated p-6">
                    <h2 class="mb-5 text-lg font-semibold">Product information</h2>
                    <dl class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                        <div><dt class="text-xs uppercase tracking-wide text-muted">Category</dt><dd class="mt-1 font-medium">{{ product.category?.name || 'Not assigned' }}</dd></div>
                        <div><dt class="text-xs uppercase tracking-wide text-muted">Currency</dt><dd class="mt-1 font-medium">{{ product.currency?.name || product.currency?.code || 'Not assigned' }}</dd></div>
                        <div><dt class="text-xs uppercase tracking-wide text-muted">Barcode</dt><dd class="mt-1 font-mono text-sm">{{ product.barcode || 'Not assigned' }}</dd></div>
                        <div><dt class="text-xs uppercase tracking-wide text-muted">Product ID</dt><dd class="mt-1 break-all font-mono text-sm">{{ product.id }}</dd></div>
                    </dl>
                </section>
            </section>

            <aside class="flex flex-col gap-6">
                <section class="rounded-xl border border-default bg-elevated p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div><p class="text-sm text-muted">Available stock</p><p class="mt-2 text-4xl font-bold">{{ product.inventory?.quantity ?? 0 }}</p></div>
                        <div class="rounded-lg bg-primary/10 p-3 text-primary"><NuxtIcon name="i-lucide-boxes" size="24" /></div>
                    </div>
                    <div class="mt-6 flex items-center justify-between border-t border-default pt-4 text-sm">
                        <span class="text-muted">Inventory status</span><span class="font-medium">{{ product.inventory?.status || 'Not stocked' }}</span>
                    </div>
                </section>
                <section class="rounded-xl border border-default bg-elevated p-6">
                    <h2 class="mb-5 text-lg font-semibold">Record history</h2>
                    <dl class="space-y-4 text-sm">
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Created</dt><dd>{{ formatDate(product.created_at) }}</dd></div>
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Last updated</dt><dd>{{ formatDate(product.updated_at) }}</dd></div>
                    </dl>
                </section>
            </aside>
        </div>

        <NuxtModal v-model:open="editOpen" title="Edit Product"
            description="Update this product's details." :ui="{ footer: 'justify-end' }">
            <template #body>
                <NuxtForm id="product-edit-form" :schema="schema" :state="state"
                    class="flex w-full flex-col gap-4" @submit="onSubmit">
                    <NuxtFormField label="Name" name="name">
                        <NuxtInput v-model="state.name" placeholder="Enter product name" required class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="Description" name="description">
                        <NuxtTextarea v-model="state.description" placeholder="Enter product description"
                            class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="Category" name="categoryId">
                        <NuxtSelect v-model="state.categoryId" label-key="name" value-key="id"
                            placeholder="Select product category" required :items="categories" class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="Currency" name="currencyId">
                        <NuxtSelect v-model="state.currencyId" label-key="code" value-key="id"
                            placeholder="Select currency" required :items="currencies" class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="Selling Price" name="sellPrice">
                        <NuxtInput v-model="state.sellPrice" type="number" min="0" step="0.01"
                            placeholder="Enter selling price" required class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="Cost Price" name="costPrice">
                        <NuxtInput v-model="state.costPrice" type="number" min="0" step="0.01"
                            placeholder="Enter cost price" required class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="Barcode" name="barcode">
                        <NuxtInput v-model="state.barcode" placeholder="Enter barcode" class="w-full" />
                    </NuxtFormField>
                    <NuxtFormField label="SKU" name="sku">
                        <NuxtInput v-model="state.sku" placeholder="Enter product SKU" class="w-full" />
                    </NuxtFormField>
                </NuxtForm>
            </template>
            <template #footer>
                <NuxtButton label="Cancel" color="neutral" variant="outline" @click="closeEdit" />
                <NuxtButton label="Save changes" form="product-edit-form" type="submit"
                    color="primary" :loading="isSaving" />
            </template>
        </NuxtModal>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { getProduct, updateProduct } = useProductRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const route = useRoute()
const toast = useToast()
const categoryStore = useCategoryStore()
const currencyStore = useCurrencyStore()
const { categories } = storeToRefs(categoryStore)
const { currencies } = storeToRefs(currencyStore)
const product = ref(await getProduct(config.public.apiBase, authToken.value!, route.params.id as string))
const editOpen = ref(false)
const isSaving = ref(false)

const schema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().optional(),
    categoryId: z.uuid('Select a category'),
    currencyId: z.uuid('Select a currency'),
    costPrice: z.number().nonnegative('Cost price must be zero or more'),
    sellPrice: z.number().nonnegative('Selling price must be zero or more'),
    sku: z.string().optional(),
    barcode: z.string().optional()
})

type EditProductForm = z.output<typeof schema>

const state = reactive<Partial<EditProductForm>>({
    name: '',
    description: '',
    categoryId: '',
    currencyId: '',
    costPrice: 0,
    sellPrice: 0,
    sku: '',
    barcode: ''
})

function openEdit() {
    state.name = product.value.name
    state.description = product.value.description || ''
    state.categoryId = product.value.category_id
    state.currencyId = product.value.currency_id
    state.costPrice = product.value.cost_price
    state.sellPrice = product.value.sell_price
    state.sku = product.value.sku || ''
    state.barcode = product.value.barcode || ''
    editOpen.value = true
}

function closeEdit() {
    editOpen.value = false
}

async function onSubmit(event: FormSubmitEvent<EditProductForm>) {
    isSaving.value = true
    try {
        const updated = await updateProduct(
            config.public.apiBase,
            authToken.value!,
            product.value.id,
            {
                name: event.data.name,
                description: event.data.description,
                category_id: event.data.categoryId,
                currency_id: event.data.currencyId,
                cost_price: event.data.costPrice,
                sell_price: event.data.sellPrice,
                sku: event.data.sku?.trim() || null,
                barcode: event.data.barcode?.trim() || null
            }
        )
        const category = categories.value.find(item => item.id === event.data.categoryId)
        const currency = currencies.value.find(item => item.id === event.data.currencyId)
        product.value = {
            ...product.value,
            ...updated,
            category: category || product.value.category,
            currency: currency || product.value.currency
        }
        editOpen.value = false
    } finally {
        isSaving.value = false
    }
}

const stockColor = computed(() => {
    if (product.value.inventory?.status === 'In Stock') return 'success' as const
    if (product.value.inventory?.status === 'Low Stock') return 'warning' as const
    if (product.value.inventory?.status === 'Out of Stock') return 'error' as const
    return 'neutral' as const
})
const marginPercent = computed(() => {
    if (!product.value.cost_price || !product.value.sell_price) return '0.0'
    return (((product.value.sell_price - product.value.cost_price) / product.value.sell_price) * 100).toFixed(1)
})
const formatPrice = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: product.value.currency?.code || 'ZAR' }).format(value || 0)
const formatDate = (value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    const numericValue = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : NaN
    const date = Number.isFinite(numericValue) ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue) : new Date(value)
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toDateString()
}
async function copySku() {
    if (!product.value.sku) return
    await navigator.clipboard.writeText(product.value.sku)
    toast.add({ title: 'SKU copied', description: 'The product SKU is on your clipboard.', color: 'success' })
}

definePageMeta({ layout: 'main' })
</script>

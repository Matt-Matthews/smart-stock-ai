<template>
    <div class="p-4">
        <div class="w-full flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">{{ product.name }}</h1>
                <p class="text-sm">{{ product.sku }}</p>
            </div>

            <div class="w-fit flex items-center gap-4 text-white">
                <NuxtButton color="primary" class="text-white" leading-icon="i-lucide-pen">Edit Product</NuxtButton>
                <NuxtButton color="error" class="text-white" leading-icon="i-lucide-trash-2">Delete</NuxtButton>
            </div>

        </div>
        <div class="w-full flex items-start justify-between mt-4 gap-4">
            <NuxtCard class="w-1/2 flex items-center">
                <div>
                    Nuxt
                </div>
            </NuxtCard>
            <NuxtCard class="w-1/2">
                <template #header>
                    <Placeholder class="h-8" />
                </template>

                <Placeholder class="h-32" />

                <template #footer>
                    <Placeholder class="h-8" />                                                                                                        
                </template>
            </NuxtCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { getProduct } = useProductRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const router = useRouter()

const productId = router.currentRoute.value.params.id

const product = await getProduct(config.public.apiBase, authToken.value!, productId as string)
console.log("Product:::", product)
definePageMeta(
    {
        layout: 'main'
    }
)
</script>
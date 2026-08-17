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
        <div class="w-full flex flex-col items-start justify-between mt-4 gap-4">
            <NuxtCard class="w-full flex items-center">
                <div class="flex flex-col md:flex-row gap-6 w-full">
                    <div
                        class="w-full md:w-3/4 aspect-square bg-surface-container-low rounded-lg overflow-hidden relative group">
                        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            data-alt="A premium 1-liter carton of oat milk set against a minimalist, bright studio background. The lighting is crisp and modern, highlighting the clean typography and professional packaging design of the carton. The color palette is composed of pristine whites and neutral grays, emphasizing a high-end corporate food product aesthetic. The mood is fresh, healthy, and sophisticated."
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2id8wI1Y6ire0rAKC3QwQUspf2OSEr2H3__ZjQLsgPH3yY-CZpwXYuwxArsUcaaCneBvKLr8Quvn1NXFBpjEHyvqxlwfYbPxuyevNut3msYj496su-ljaCy_GJOrkhbfg0vmOd5Wwe12xcm1eJ5RbKzOlV1YLUp1OfIm8JcTUe7qGKr0-s-ivTOe1K91LOxn4w_OUU6kIxgyTkzD7gaIobTSIufmXJKQxbE6KJl9DmlBvbeX4PWP4xMzrOPOlPVgJTrf8Eq2lE-c" />
                        <div class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
                            <NuxtIcon name="i-lucide-zoom-in" class="text-[20px] text-black" />
                        </div>
                    </div>
                    <div class="flex md:flex-col gap-3 w-full md:w-1/4">
                        <div
                            class="flex-1 aspect-square rounded-lg border-2 border-secondary overflow-hidden cursor-pointer">
                            <img class="w-full h-full object-cover"
                                data-alt="Close up product photography of premium oat milk packaging. Minimalist layout."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLX1lzI_Tlscjm5DfTUUB1wv5bfSpfP4R4_encQ2UbTzZmhvQIgGNohDgZiTvevnleCvhP3CDOfEA_o0UIJ6TqMKSmZrkhOelNBu3sSHMjwXVDxom9S5tdWNHQ3-aR3e6RiDxctw9mvdlVBnbb9xdXtDtSKvrgYxCKr4cnibEgt7PdNkmazQTA4kOH-ES6w9taetxff-Wk9oVdOgGPD5l-SOEnYjR-HR1gnwHlXcHswxXIPmQYPNixnTgIPnIqNV2q_PXxafhkNso" />
                        </div>
                        <div
                            class="flex-1 aspect-square rounded-lg border border-outline-variant overflow-hidden cursor-pointer hover:border-secondary transition-all">
                            <img class="w-full h-full object-cover"
                                data-alt="A lifestyle shot of oat milk being poured into a glass of iced coffee in a bright, modern kitchen."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp6XDuVpC71ERlqevZGMHWNoiP88ywJROFnVaaf1aRT9gOzaG9mpwdZYvlBZc-BAoTft3pfQOVEax4e5u6Wpw-bce2FvciN1h5SlH8y0J6jdvqEbpNA8HQorguOxTx2RmDw2d0CDrDlvyP7mrTYiLe8fDvXVIPRDJ-3gGIkFWZIYbldKzbUXwcyKdGf3JudDv9yY2IFNGy18At6qrkqe2aAST57Uv32AtdJqGPtWtVUXDBkM51IpCueL55Cz5h4pdkgFPBQqBWz2Q" />
                        </div>
                        <div
                            class="flex-1 aspect-square rounded-lg border border-outline-variant overflow-hidden cursor-pointer hover:border-secondary transition-all">
                            <img class="w-full h-full object-cover"
                                data-alt="Detailed view of the nutrition label and ingredients list on an oat milk carton. High-density information design."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgyO_0f8IeOfz3asLFho20UAhH5tB6-Me80hkZGYcu6iS4zvzqGAXgeeoO7VioIifK7Avky0wapFp7MgAYDZ71Bf66m_01jRaTWoFUs7oHI_PyOmvtw8bFD5r1ZtS-VXe05_k63CQ_YXXVRh9X_cVMxSIXLc2TTq1so1xWZFOBhAgeLQeSgHWAi6Jw0WtyRmlHKbHSnM4E7eMXb42YBTtgtlav89d25jZ_fLodD-keNlsZ_KsuoXZfgUa_6nAGNgVsOfn04AazWoA" />
                        </div>
                    </div>
                </div>
            </NuxtCard>
            <NuxtCard class="w-full">
                <section
                    class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0px_1px_3px_rgba(15,23,42,0.08)] space-y-6">
                    <div class="grid grid-cols-12 gap-gutter">
                        <div class="col-span-12 lg:col-span-8 space-y-6">
                            <div>
                                <h2
                                    class="font-headline-md text-headline-md text-primary border-b border-outline-variant/30 pb-3 mb-4">
                                    Detailed Description</h2>
                                <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                                    {{ product.description }}
                                </p>
                            </div>
                            <!-- <div class="space-y-4">
                                <h3
                                    class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                                    Ingredients
                                </h3>
                                <p class="font-body-lg text-body-lg text-on-surface-variant italic">Water, Gluten-free
                                    Oats (10%),
                                    Rapeseed Oil, Calcium Carbonate, Sea Salt, Riboflavin, Vitamin D2, Vitamin B12.</p>
                            </div> -->
                        </div>
                        <div
                            class="col-span-12 lg:col-span-4 bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
                            <h3
                                class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-6">
                                Specifications</h3>
                            <ul class="space-y-4">
                                <li class="flex justify-between items-center border-b border-outline-variant/10 pb-3">
                                    <span class="text-on-surface-variant font-body-md">Category</span><span
                                        class="font-data-mono text-primary font-bold">{{ product?.category?.name
                                        }}</span>
                                </li>
                                <li class="flex justify-between items-center border-b border-outline-variant/10 pb-3">
                                    <span class="text-on-surface-variant font-body-md">Currency</span><span
                                        class="font-data-mono text-primary font-bold">{{ product?.currency?.code
                                        }}</span>
                                </li>
                                <li class="flex justify-between items-center border-b border-outline-variant/10 pb-3">
                                    <span class="text-on-surface-variant font-body-md">Selling Price</span><span
                                        class="font-data-mono text-primary font-bold">{{
                                            formatAmount(product?.sell_price) }}</span>
                                </li>
                                <li class="flex justify-between items-center border-b border-outline-variant/10 pb-3">
                                    <span class="text-on-surface-variant font-body-md">Cost Price</span><span
                                        class="font-data-mono text-primary font-bold">{{
                                        formatAmount(product?.cost_price) }}</span>
                                </li>
                                <li class="flex justify-between items-center"><span
                                        class="text-on-surface-variant font-body-md">Barcode</span><span
                                        class="font-data-mono text-primary font-bold">{{ product?.barcode }}</span></li>
                            </ul>
                        </div>
                    </div>
                </section>
            </NuxtCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { getProduct } = useProductRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const router = useRouter()
const { formatAmount } = useFormat()

const productId = router.currentRoute.value.params.id

const product = await getProduct(config.public.apiBase, authToken.value!, productId as string)

definePageMeta(
    {
        layout: 'main'
    }
)
</script>
<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center w-full gap-2">
            <div class="w-1/3">
                <h1 class="font-bold text-4xl">Categories</h1>
                <p class="text-sm">Manage your product categories and their details.</p>
            </div>
        </div>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class=" p-0">
                <NuxtTable :data="categories" :columns="columns" class="flex-1" ref="table" />
                <div class="flex justify-end border-t border-default pt-4 px-4">
                    <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                        :total="table?.tableApi?.getFilteredRowModel().rows.length"
                        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
                </div>
            </div>
        </NuxtCard>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class="w-full flex justify-end items-center">
                <AddCategory @submitted="onSubmitted" />
            </div>
        </NuxtCard>
    </div>
</template>

<script setup lang="ts">
const { categories, addCategory } = useCategoryStore()
const { columns } = useCategoryColumns(
    resolveComponent('NuxtButton'),
    resolveComponent('NuxtDropdownMenu')
)
const table = useTemplateRef('table')

const onSubmitted = (value: any) => {
    console.log('Category added successfully:', value.data.createCategory)
    addCategory(value.data.createCategory)
}


definePageMeta(
    {
        layout: 'main'
    }
)
</script>
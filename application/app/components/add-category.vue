<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)
const { user } = useUserStore()
const config = useRuntimeConfig()
const authToken = useAuthToken()

const emits = defineEmits(["submitted"])

const {addCategory} = useCategoryRequests()

const schema = z.object({
    name: z.string('Category name must be a valid string').min(2, 'Category name must be at least 2 characters long').max(100, 'Category name must be less than 100 characters long'),
    description: z.string('Description must be a valid string').min(5, 'Description must be at least 5 characters long').max(500, 'Description must be less than 500 characters long')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    name: '',
    description: '',
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  
    const companyId = user.company.id;
    
    const basePath = config.public.apiBase;

    const res = await addCategory(basePath, authToken.value as string, {...event.data, companyId});
    
    emits('submitted', res)
    open.value = false;
}

</script>

<template>
    <NuxtModal v-model:open="open" title="Add Category"
        description="Create a new category by entering its details."
        :ui="{ footer: 'justify-end' }">
        <NuxtButton class="text-white">
            <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
            Add Category
        </NuxtButton>

        <template #body>
            <NuxtForm id="category-add-form" :schema="schema" :state="state" class="w-full flex flex-col gap-4"
                @submit="onSubmit">
                <NuxtFormField label="Category Name" name="name">
                    <NuxtInput placeholder="Enter category name" required class="w-full" v-model="state.name" />
                </NuxtFormField>
                <NuxtFormField label="Description" name="description">
                    <NuxtTextarea placeholder="Enter description" required class="w-full" v-model="state.description" />
                </NuxtFormField>

            </NuxtForm>

        </template>

        <template #footer="{ close }">
            <NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <NuxtButton label="Submit" form="category-add-form" type="submit" color="neutral" />
        </template>
    </NuxtModal>
</template>
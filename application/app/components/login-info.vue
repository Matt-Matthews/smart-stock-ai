<template>
    <div class="w-1/2 h-full relative flex items-center justify-center">
        <div class="absolute inset-0 z-0">
            <img class="w-full h-full object-cover dark:opacity-40 opacity-95 mix-blend-overlay"
                data-alt="A sprawling modern warehouse at dusk, featuring automated robotic platforms moving between high-density shelving. The scene is bathed in a professional cool-blue and Action Indigo lighting scheme, with sharp highlights on metallic surfaces. Cinematic lighting creates long shadows across the polished concrete floor, emphasizing a high-tech, organized logistics environment. The atmosphere is quiet, efficient, and technologically advanced, mirroring a premium enterprise software aesthetic."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMGPGy5j3XGwyHhdsPEbgHfoMGtM20MEu9H_iDbRHmZFlwVzOUVMN0wcIOThWIFX-ZJIcyvWK1GFHyXSBMyEOwFIPLIJ7N9OMK7W03FoM_6zu3ZOWVQoZXpWBzbv1wvgbTvc6E7N8ZzuJWJBkzGIKNrcCM_rTvCDCPhHvfkRMIzSbEjUHq2Gtpl_ksduy-KExhKjkfgRHpcS3Rr8G-YWMz9-LzB93RqfLdbkZlPaqvpduRcpDtbt9LDpNPlq79DSq0i_AQ0IreqLs" />
        </div>

        <div class="relative z-10 max-w-xl ">
            <div class="flex items-center gap-3 mb-stack-md">
                <NuxtIcon name="i-lucide-archive-restore" class="text-[40px]" />
                <h1 class="text-xl text-white font-bold">SmartStock AI</h1>
            </div>
            <p class="mb-7 mt-2 text-sm text-white">
                Experience the future of SME logistics. Our AI-driven inventory engine transforms chaotic
                data into actionable intelligence, ensuring your supply chain never misses a beat.
            </p>

            <div class="grid grid-cols-2 gap-3">
                <div class="glass-effect p-3 rounded-xl">
                    <NuxtIcon name="i-lucide-brain-circuit" class="text-white  mb-2" />
                    <h3 class="mb-1 font-semibold text-white">Predictive</h3>
                    <p class="text-sm text-white">Anticipate demand with 99%
                        accuracy.</p>
                </div>
                <div class="glass-effect p-3 rounded-xl">
                    <NuxtIcon name="i-lucide-warehouse" class="text-white mb-2" />
                    <h3 class="mb-1 font-semibold text-white">Scalable</h3>
                    <p class="font-label-md text-label-md text-white text-sm">Manage infinite SKU counts with
                        ease.</p>
                </div>
            </div>
        </div>
        <!-- Atmospheric Floating Element -->
        <div
            class="absolute bottom-10 right-10 glass-effect px-3 py-2 rounded-full flex items-center gap-3 animate-bounce shadow-2xl">
            <NuxtIcon name="i-lucide-badge-check" class=" text-tertiary-fixed-dim bg-green-500" />
            <span class="font-label-md text-label-md text-white text-sm">Enterprise Tier Security</span>
        </div>
    </div>
</template>
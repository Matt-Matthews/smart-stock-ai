<template>
  <main
    class="flex min-h-screen w-full items-center justify-center bg-neutral-50 px-4 py-10 dark:bg-neutral-950"
  >
    <div class="w-full max-w-md">
      <div class="mb-7 flex items-center justify-center gap-3">
        <NuxtImg
          src="/transparent-logo.png"
          class="h-10 w-10"
          alt="SmartStock AI logo"
        />
        <span class="text-xl font-bold text-highlighted">SmartStock AI</span>
      </div>
      <LoginForm />
    </div>
  </main>
</template>
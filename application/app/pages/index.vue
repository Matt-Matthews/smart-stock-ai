<template>
  <LoadingScreen />
</template>

<script setup>

const { isAuthenticated } = useAuthValidator()

isAuthenticated()

</script>

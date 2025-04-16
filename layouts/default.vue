<template>
    <LayoutHeader />
        <slot />
    <LayoutFooter />
    <Notifications />
</template>

<script setup>
import Notifications from '~/components/ui/Notifications.vue';
</script>
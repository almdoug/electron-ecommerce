<template>
  <div class="fixed top-4 right-4 z-50 w-80 space-y-2">
    <TransitionGroup name="notification">
      <div v-for="notification in notifications" :key="notification.id"
        class="flex items-center justify-between p-4 rounded-lg shadow-md"
        :class="getNotificationClass(notification.type)">
        <div class="flex items-center">
          <div class="mr-3">
            <icon :name="getNotificationIcon(notification.type)" />
          </div>
          <span>{{ notification.message }}</span>
        </div>
        <button @click="remove(notification.id)" class="ml-2 text-gray-500 hover:text-gray-700">
          <icon name="ph:x" size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification, type NotificationType } from '~/composables/useNotification';

const { notifications, remove } = useNotification();

const getNotificationClass = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'ph:check-circle';
    case 'error':
      return 'ph:x-circle';
    case 'warning':
      return 'ph:warning';
    case 'info':
    default:
      return 'ph:info';
  }
};
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
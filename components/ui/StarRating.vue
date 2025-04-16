<template>
  <div class="flex" :class="className">
    <template v-for="i in maxRating" :key="i">
      <icon :name="i <= rating ? 'ph:star-fill' : 'ph:star'" :size="size"
        :class="i <= rating ? fillColorClass : emptyColorClass" />
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  rating: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0
  },
  maxRating: {
    type: Number,
    default: 5
  },
  size: {
    type: [Number, String],
    default: 'md'
  },
  fillColorClass: {
    type: String,
    default: 'text-primary'
  },
  emptyColorClass: {
    type: String,
    default: 'text-zinc-300'
  },
  className: {
    type: String,
    default: ''
  }
});
</script>
<template>
  <div class="form-group" :class="{ 'has-danger': error }">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      :value="value"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      class="form-control"
      :class="{ 'is-invalid': error }"
    />
    <div class="invalid-feedback" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: string;
  label?: string;
  value: unknown;
  id: string;
}>();

const emit = defineEmits<{
  (e: "update:value", value: unknown);
}>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

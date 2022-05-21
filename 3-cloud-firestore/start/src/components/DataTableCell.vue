<script setup>
import { defineProps } from 'vue';
const { isNumeric, value } = defineProps(['isNumeric', 'value']);
const cssClass = isNumeric ? 'numeric' : '';
</script>

<template>
  <td :key="value" :class="cssClass">
    {{value}}
  </td>
</template>

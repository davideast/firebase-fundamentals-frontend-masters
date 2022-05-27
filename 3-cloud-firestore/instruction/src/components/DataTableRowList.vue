<script setup>
import DataTableRow from './DataTableRow.vue';
const { values, numericColumns } = defineProps(['values', 'numericColumns']);
</script>

<template>
  <DataTableRow
    v-for="(value, index) in values"
    :key="index"
    :value="value"
    :numericColumns="numericColumns"
  />
</template>

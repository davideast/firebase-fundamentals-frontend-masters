<script setup>
import DataTableCell from './DataTableCell.vue';
const { value, numericColumns } = defineProps(['value', 'numericColumns'])
const keys = Object.keys(value);
</script>

<template>
  <tr>
    <DataTableCell 
      v-for="(key, index) in keys"
      :key="index" 
      :value="value[key]" 
      :isNumeric="numericColumns[key]" />
  </tr>
</template>
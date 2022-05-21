<script setup>
import DataTableHead from './DataTableHead.vue';
import DataTableRowList from './DataTableRowList.vue';

const { headings, values } = defineProps(['headings', 'values']);
let headingValues = [];
let numericColumns = [];
for (let heading of headings) {
  headingValues = [...headingValues, heading.value];
  const isNumeric = heading.type === "numeric";
  numericColumns[heading.value] = isNumeric;
}
</script>

<template>
  <table class='datatable'>
    <DataTableHead :headingValues="headingValues" />
    <tbody>
      <DataTableRowList :values="values" :numericColumns="numericColumns" />
    </tbody>
  </table>
</template>

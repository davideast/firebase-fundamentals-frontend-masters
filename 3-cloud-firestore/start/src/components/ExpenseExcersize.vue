
<script setup>
import DataTable from "./DataTable.vue";

const { results, number, subtitle } = defineProps(['results', 'number', 'subtitle']);
const headings = [
  { value: "UID" },
  { value: "cost", type: "numeric" },
  { value: "category" },
  { value: "fromCache" },
  { value: "date", type: "numeric" },
];
</script>

<template>
  <section class="table-section">
    <div class="headline">
      <h2>Exercise {{ number }}</h2>
      <div>{{ subtitle }}</div>
    </div>

    <DataTable :headings="headings" :values="results" />
  </section>
</template>

<style>
</style>

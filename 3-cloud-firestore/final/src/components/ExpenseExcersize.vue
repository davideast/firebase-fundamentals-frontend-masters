
<script setup>
import DataTable from "./DataTable.vue";

let { results, number, subtitle, headings } = defineProps(['results', 'number', 'subtitle', 'headings']);
const headingValues = headings == null ? [
  { value: "UID" },
  { value: "cost", type: "numeric" },
  { value: "category" },
  { value: "fromCache" },
  { value: "date", type: "numeric" }
]: headings;
</script>

<template>
  <section class="table-section">
    <div class="headline">
      <h2>Exercise {{ number }}</h2>
      <div>{{ subtitle }}</div>
    </div>

    <DataTable :headings="headingValues" :values="results" />
  </section>
</template>

<style>
</style>


<script setup>
import DataTable from "./DataTable.vue";

const { results, number, subtitle } = defineProps(['results', 'number', 'subtitle']);
const headings = [
  { value: "uid" },
  { value: "fist" },
  { value: "last" },
  { value: "highscore", type: "numeric" },
  { value: "city" },
  { value: "fromCache" },
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

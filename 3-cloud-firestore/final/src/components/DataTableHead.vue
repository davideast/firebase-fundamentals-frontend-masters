<script setup>
const { headingValues } = defineProps(['headingValues']);
</script>

<template>
  <thead>
    <tr>
      <th v-for="(heading, index) in headingValues" :key="index">{{ heading }}</th>
    </tr>
  </thead>
</template>

<style>
th {
  text-align: left;
}
</style>
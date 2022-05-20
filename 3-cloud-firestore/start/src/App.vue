<script setup>
import DataTable from './components/DataTable.vue'
const headings = [{ value: 'name' }, { value: 'Other' }];
const values = [{ name: 'David East', other: 'value shown' }];
</script>

<template>
  <DataTable
    :headings="headings"
    :values="values" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

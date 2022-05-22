<script setup>
import { Suspense } from 'vue';
</script>

<template>
  <Suspense>
    <router-view></router-view>
  </Suspense>
</template>

<style>
#app, html, body, main { height: 100%; }

.headline {
  display: grid;
  gap: 12px;
  margin-block-end: 32px;
}

.headline h2 + div {
  font-size: 1.35rem;
}

main {
  max-width: 1440px;
  margin: 0 auto;
  padding-inline: 16px;
  display: grid;
  grid-template-columns: 1fr;
  margin-block-start: 120px;
  gap: 24px;
}

.table-section, .code-section {
  width: 100%;
}

.table-section table {
  width: 100%;
  border-spacing: 0;
}

.table-section th {
  text-transform: capitalize;
}

.table-section td, .table-section th {
  padding-inline: var(--size-2);
}

.numeric {
  font-family: var(--font-mono);
}

.table-section tbody td {
  padding-block: var(--size-2);
  vertical-align: middle;
}
.table-section tbody tr:nth-child(even) {
  background-color: var(--theme-row);
}

.code-box {
  background: hsl(0, 0%, 7%);
  border-radius: 8px;
  height: 400px;
  position: sticky;
  top: 16px;
  width: 100%;
  font-family: var(--font-mono);
  padding: var(--size-4);
}

@media (prefers-color-scheme: light) {
  :root {
    --theme-row: var(--gray-3);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --theme-row: var(--gray-8);
  }
}
</style>

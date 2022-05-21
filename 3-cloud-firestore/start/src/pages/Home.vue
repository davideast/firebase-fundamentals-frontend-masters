
<template>
  <main>
    <section>
      <h2>Exercises</h2>
      <ol>
        <li>
          <router-link to="/reading-101">Reading Data 101</router-link>
        </li>
        <li>
          <router-link to="/querying-101">Querying Data 101</router-link>
        </li>
        <li>
          <router-link to="/querying-201">Querying Data 201</router-link>
        </li>
        <li>
          <router-link to="/querying-301">Querying Data 301</router-link>
        </li>
        <li>
          <router-link to="/querying-401">Querying Data 401</router-link>
        </li>
      </ol>
    </section>
  </main>

</template>

<style scoped>
  section {
    width: 960px;
    margin: 0 auto;
  }
  section ol {
    padding-inline-start: var(--size-4);
    line-height: 2;
  }
  section ol li a {
    font-size: var(--size-4);
  }
</style>
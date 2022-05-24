
<template>
  <main>
    <section>
      <h2>Exercises</h2>
      <ol>
        <li>
          <router-link to="/1/creating-realtime-streams">Creating realtime streams</router-link>
        </li>
        <li>
          <router-link to="/2/fundamental-querying">Fundamental querying</router-link>
        </li>
        <li>
          <router-link to="/3/querying-arrays">Querying arrays</router-link>
        </li>
        <li>
          <router-link to="/4/ranges-cursoring">Ranges and cursoring</router-link>
        </li>
        <li>
          <router-link to="/5/joins-denormalization">Denormalization</router-link>
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
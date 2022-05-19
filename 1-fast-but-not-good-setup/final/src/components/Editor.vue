<script setup>
import { onMounted, reactive } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useRoute } from 'vue-router'
import { config } from '../config';

import { debounce, snarkdownEnhanced as snarkdown } from '../util';

const app = initializeApp(config.firebase);
const route = useRoute();
const db = getFirestore(app);
const markdownCol = collection(db, 'markdowns');
const state = reactive({ });
const singleDoc = doc(markdownCol, route.params.id);

onMounted(() => {
  onSnapshot(singleDoc, snapshot => {
    const data = snapshot.data() || {};
    state.converted = data.converted;
    state.markdown = data.markdown;
  });
})

function convert(event) {
  const markdown = event.target.value;
  const converted = snarkdown(markdown);
  setDoc(singleDoc, { converted, markdown }, { merge: true });
}

const waitConvert = debounce(convert, 150)

</script>

<template>
  <h3>Editor</h3>
  <router-link to="/dashboard">&lt; Dashboard</router-link>
  <div id="editor">
    <textarea @keyup="waitConvert" v-model="state.markdown"></textarea>
    <div class="output" v-html="state.converted"></div>
  </div>
</template>

<style>
#editor {
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
  margin-block-start: 8px;
  height: 100vh;
}
#editor h1,
#editor h2,
#editor h3,
#editor h4,
#editor h5 {
  margin-block-end: 8px;
}
#editor .output p {
  line-height: 1.5;
  margin-block-end: 12px;
}
</style>
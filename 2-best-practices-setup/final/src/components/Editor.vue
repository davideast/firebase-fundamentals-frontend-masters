<script setup>
import { onMounted, reactive } from 'vue';
import { getFirebase } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useRoute } from 'vue-router'
import { debounce, snarkdownEnhanced as snarkdown } from '../util';

const { firestore } = getFirebase();
const route = useRoute();
const markdownCol = collection(firestore, 'markdowns');
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

#editor .output h1 + p,
#editor .output h2 + p,
#editor .output h3 + p,
#editor .output h4 + p,
#editor .output h5 + p {
  margin-block-end: 32px;
}
#editor .output blockquote {
  margin-block: 32px;
}
#editor .output p {
  line-height: 1.5;
  margin-block-end: 12px;
}
</style>
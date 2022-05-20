import type { CollectionReference, WriteBatch } from 'firebase-admin/firestore';

export type BatchConfig<T = unknown> = {
  colRef: CollectionReference;
  arrayData: T[];
  indexKey?: string;
  count?: number;
  currentBatchIndex?: number;
  batches?: WriteBatch[];
}

export function batchUp<T>(config: BatchConfig): WriteBatch[] {
  config = { count: 0, currentBatchIndex: 0, batches: [], ...config, }
  let { indexKey, colRef, arrayData, count, currentBatchIndex, batches } = config;
  const BATCH_SIZE = 500;
  const BATCH_LIMIT = (BATCH_SIZE * currentBatchIndex) + BATCH_SIZE;
  while(count < BATCH_LIMIT && count <= arrayData.length - 1) {
    const record = arrayData[count];
    const indexKeyValue: string = indexKey != null ? record[indexKey] : colRef.doc().id;
    if(batches[currentBatchIndex] == null) {
      batches[currentBatchIndex] = colRef.firestore.batch() as any;
      batches[1]
    }
    const docRef = colRef.doc(indexKeyValue) as any;
    batches[currentBatchIndex].set(docRef, record);
    count = count + 1;
    currentBatchIndex = Math.floor(count / BATCH_SIZE);
  }
  if(arrayData.length > count) {
    return batchUp({ indexKey, colRef, arrayData: arrayData, count, currentBatchIndex, batches });
  }
  return batches;
}

export function commitBatches(batches: WriteBatch[]) {
  return Promise.all(batches.map(b => b.commit()));
}

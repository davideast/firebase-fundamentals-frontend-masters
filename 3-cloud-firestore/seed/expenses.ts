import { expensesCol, usersCol } from './admin';
import { batchUp, commitBatches } from './batch';
import { CreatedExpense } from './types';
import { convertMockarooData, getRandomInt } from './util';
const expensesMockData = require('./data/expenses.json');
const categoriesData: string[] = require('./data/categories.json');

function convertMockExpenseData(users: Partial<{ uid: string }[]>) {
  return convertMockarooData<CreatedExpense>(expensesMockData, expense => {
    if(expense.date != null) {
      expense.date = new Date(expense.date);
    }
    expense.uid = users[getRandomInt(0, users.length - 1)].uid;
    const categoryOne = expense.category as any;
    const categoryTwo = categoriesData[getRandomInt(0, categoriesData.length - 1)];
    let categories = categoryOne === categoryTwo ? [categoryOne] : [categoryOne, categoryTwo];
    expense.categories = categories;
    return expense;
  });
}

export async function seedExpensesInlineUid(users: Partial<{ uid: string }[]>, limit = 5000) {
  const expenses = convertMockExpenseData(users).slice(0, limit);
  const batches = batchUp({
    arrayData: expenses,
    colRef: expensesCol,
  });
  await commitBatches(batches);
  return expenses;
}

export async function seedExpensesReference(users: Partial<{ uid: string }[]>, limit = 5000) {
  const expenses = convertMockExpenseData(users).slice(0, limit)
    .map(ex => ({ ...ex, user: usersCol.doc(ex.uid) }));
  const batches = batchUp({
    arrayData: expenses,
    colRef: expensesCol,
  });
  await commitBatches(batches);
  return expenses;
}

export async function seedExpensesDernormalized(users: Partial<{ uid: string, first: string; last: string; }[]>, limit = 2500) {
  const expenses = convertMockExpenseData(users).slice(0, limit)
    .map(ex => {
      const user = users.find(u => u.uid === ex.uid);
      const userRef = usersCol.doc(ex.uid);
      return { ...ex, user, userRef };
    });
  const batches = batchUp({
    arrayData: expenses,
    colRef: expensesCol,
  });
  await commitBatches(batches);
  return expenses;
}



export async function seedExpensesByMonth(users: Partial<{ uid: string }[]>, limit = 5000) {
  const expenses = convertMockExpenseData(users).slice(0, limit);
  const promises = expenses.map(expense => {
    const year = expense.date.getFullYear();
    const month = expense.date.getMonth();
    return usersCol.doc(expense.uid).collection(`${year}-${month}`).add(expense);
  });
  return Promise.all(promises);
}

export async function seedExpensesUnderUid(users: Partial<{ uid: string }[]>, limit = 5000) {
  const expenses = convertMockExpenseData(users).slice(0, limit);
  const promises = expenses.map(expense => {
    return usersCol.doc(expense.uid).collection(`expenses`).add(expense);
  });
  return Promise.all(promises);
}

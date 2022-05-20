export type MockUser = {
  first: string;
  last: string;
  email: string;
  birthday: string | Date;
}

export interface CreatedUser extends MockUser {
  uid: string;
}

export type MockExpense = {
  category: string;
  cost: number;
  date: string | Date;
}

export interface CreatedExpense extends MockExpense {
  uid: string;
  date: Date;
  categories: string[];
}

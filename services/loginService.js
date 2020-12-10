import { executeQuery } from "../database/database.js";

const selectUserByEmail = async (email) => {
  return await executeQuery("SELECT * FROM users WHERE email = $1", email);
};
const selectAccounts = async (user_id) => {
  const res = await executeQuery(
    "SELECT * FROM accounts WHERE user_id = $1",
    user_id
  );

  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }

  return [];
};
const selectAccountById = async ({ id }) => {
  const res = await executeQuery("SELECT * FROM accounts WHERE id = $1", id);

  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }

  return [];
};
const insertUser = async ({ email, hash }) => {
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2);",
    email,
    hash
  );
};
const insertAccount = async ({ name, user_id }) => {
  await executeQuery(
    "INSERT INTO accounts (name, user_id) VALUES ($1, $2);",
    name,
    user_id
  );
};
const updateAccountDeposit = async ({ balance, id }) => {
  await executeQuery(
    "UPDATE accounts SET balance = $1 WHERE id = $2;",
    balance,
    id
  );
};

export {
  selectUserByEmail,
  insertUser,
  selectAccounts,
  insertAccount,
  updateAccountDeposit,
  selectAccountById,
};

- [x] GET /auth/register shows a registration form.

- [x] POST /auth/register registers the user.

- [x] GET /auth/login shows a login form.

- [x] POST /auth/login authenticates the user using a session.

- [x] GET /accounts shows a list of the accounts and their balances for the current user, and a form for creating a new account (EJS code for listing accounts and a form provided in the assignment template). Only accounts that belong to the current user are shown.

- [x] POST /accounts with the name for the account to be created in the request body creates a new account for the user. Returns status code 200.

- [x] POST /accounts/:id/deposit deposits the amount of money sent in the request body to the balance of the account identified by :id. The account identified by :id must be owned by the currently authenticated user. Returns status code 200 if ok, 401 if the account does not belong to the user.

- [x] POST /accounts/:id/withdraw withdraws the amount of money sent in the request body from the balance of the account identified by :id. The account identified by :id must be owned by the currently authenticated user. Returns status code 200 if ok, 401 if the account does not belong to the user or the user tries to withdraw more money than the account holds.
# deno-demo-bank

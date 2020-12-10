import { numeral } from "../../deps.js";
import * as loginService from "../../services/loginService.js";

const postAccount = async ({ request, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const name = params.get("name");
  const user = await session.get("user");

  await loginService.insertAccount({ name, user_id: user.id });

  response.status = 200;
};
const postAccountDeposit = async ({ params, request, response, session }) => {
  const body = request.body();
  const payload = await body.value;

  const user = (await session.get("user")) || {};
  const accountId = params.id;
  const account =
    (await loginService.selectAccountById({ id: accountId })) || {};

  if (account && account.user_id === user.id) {
    const balance = Number.parseFloat(
      numeral(account.balance).add(payload.get("amount")).format("0.00")
    );
    await loginService.updateAccountDeposit({ balance, id: accountId });
    response.status = 200;
  } else {
    response.status = 401;
  }
};
const postAccountWithdraw = async ({ params, request, response, session }) => {
  const body = request.body();
  const payload = await body.value;

  const user = (await session.get("user")) || {};
  const accountId = params.id;
  const account =
    (await loginService.selectAccountById({ id: accountId })) || {};

  const balance = Number.parseFloat(
    numeral(account.balance).subtract(payload.get("amount")).format("0.00")
  );
  if (account && account.user_id === user.id && balance > 0) {
    await loginService.updateAccountDeposit({ balance, id: accountId });
    response.status = 200;
  } else {
    response.status = 401;
  }
};
const postAccountTransfer = async ({ params, request, response, session }) => {
  const body = request.body();
  const payload = await body.value;
  const amount = payload.get("amount");
  if (!amount || amount < 0) {
    response.status = 401;
    return;
  }
  const user = (await session.get("user")) || {};
  if (!user) {
    response.status = 401;
    return;
  }
  let fromAccount = {
    id: params.fromId,
  };
  let toAccount = {
    id: params.toId,
  };
  fromAccount =
    (await loginService.selectAccountById({ id: fromAccount.id })) || {};
  if (!fromAccount || fromAccount.user_id !== user.id) {
    response.status = 401;
    return;
  }
  toAccount =
    (await loginService.selectAccountById({ id: toAccount.id })) || {};
  if (!toAccount) {
    response.status = 401;
    return;
  }
  fromAccount.balance = Number.parseFloat(
    numeral(fromAccount.balance).subtract(amount).format("0.00")
  );
  if (fromAccount.balance < 0) {
    response.status = 401;
    return;
  }
  toAccount.balance = Number.parseFloat(
    numeral(toAccount.balance).add(amount).format("0.00")
  );
  await loginService.updateAccountDeposit({
    balance: fromAccount.balance,
    id: fromAccount.id,
  });
  await loginService.updateAccountDeposit({
    balance: toAccount.balance,
    id: toAccount.id,
  });

  response.status = 200;
};

export {
  postAccount,
  postAccountDeposit,
  postAccountWithdraw,
  postAccountTransfer,
};

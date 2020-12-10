import { Router } from "../deps.js ";
import * as loginController from "./controllers/loginController.js";
import * as loginApi from "./apis/loginApi.js";

const router = new Router();

router.get("/auth/register", loginController.showRegistrationForm);
router.post("/auth/register", loginController.postRegistrationForm);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.postLoginForm);
router.get("/accounts", loginController.showAccounts);
router.post("/accounts", loginApi.postAccount);
router.post("/accounts/:id/deposit", loginApi.postAccountDeposit);
router.post("/accounts/:id/withdraw", loginApi.postAccountWithdraw);
router.post("/accounts/transfer/:fromId/:toId", loginApi.postAccountTransfer);

export { router };

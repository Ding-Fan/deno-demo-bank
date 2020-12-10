import * as loginService from "../../services/loginService.js";
import { bcrypt } from "../../deps.js";

const showRegistrationForm = ({ render }) => {
  render("register.ejs");
};

const showAccounts = async ({ render, session, response }) => {
  const user = await session.get("user");
  if (user) {
    const accounts = await loginService.selectAccounts(user.id);

    render("accounts.ejs", { accounts });
  } else {
    response.status = 401;
  }
};

const postRegistrationForm = async ({ request, response }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");
  const verification = params.get("verification");

  if (password !== verification) {
    response.body = "The entered passwords did not match";
    return;
  }

  const existingUsers = await loginService.selectUserByEmail(email);
  if (existingUsers.rowCount > 0) {
    response.body = "The email is already reserved.";
    return;
  }

  const hash = await bcrypt.hash(password);
  await loginService.insertUser({ email, hash });
  response.body = "Registration successful!";
};

const postLoginForm = async ({ request, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  // check if the email exists in the database
  const res = await loginService.selectUserByEmail(email);
  if (res.rowCount === 0) {
    response.status = 401;
    return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    response.status = 401;
    return;
  }

  await session.set("authenticated", true);
  await session.set("user", {
    id: userObj.id,
    email: userObj.email,
  });
  response.body = "Authentication successful!";
};

const showLoginForm = ({ render }) => {
  render("login.ejs");
};

export {
  showLoginForm,
  postLoginForm,
  postRegistrationForm,
  showRegistrationForm,
  showAccounts,
};

export async function checkLogin() {
  console.log("checking login");
  let result;
  await fetch("http://localhost:8080/loginState", {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.isLoggedIn);
      result = data.isLoggedIn;
    });
  return result;
}

export async function login(username, password) {
  console.log("logging in");
  let result;
  fetch("http://localhost:8080/login", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data;
    });
  return result;
}

export async function logout() {
  console.log("logging out");
  const response = await fetch("http://localhost:8080/logout", {
    mode: "cors",
    method: "POST",
    credentials: "include",
  });
  console.log(response.ok);
}

export async function signup(username, password) {
  console.log("signing up");
  fetch("http://localhost:8080/signup", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

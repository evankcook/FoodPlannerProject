import classes from "./LoginSignup.module.css";
import { checkLogin, login, signup } from "../Utils.js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function LoginSignup() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkLogin().then((result) => {
      setIsLoggedIn(result);
    });
  }, []);

  // For Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // For Sign Up
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function submitLogin(e) {
    e.preventDefault();
    try {
      console.log(username + password);
      await login(username, password);
      setIsLoading(true);
      setTimeout(() => window.location.reload(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  }

  async function submitSignUp(e) {
    e.preventDefault();
    try {
      console.log(newUsername + newPassword);
      await signup(newUsername, newPassword);
      setIsLoading(true);
      setTimeout(() => window.location.reload(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className={classes.container}>
      {isLoggedIn ? (
        <Navigate to="/dashboard" />
      ) : isLoading ? (
        <div className={classes.loading}>
          <h2>Loading...</h2>
        </div>
      ) : (
        <div className={classes.tabs}>
          <Tabs>
            <TabList className={classes.header}>
              <Tab className={classes.headerItems}>Login</Tab>
              <Tab className={classes.headerItems}>Sign Up</Tab>
            </TabList>
            <TabPanel>
              <Card className={classes.card}>
                <div className={classes.form}>
                  <form onSubmit={submitLogin}>
                    <div>
                      <h2>Login Here:</h2>
                      <label>
                        <h3>Username</h3>
                        <input
                          type="text"
                          placeholder="e.g. chef_sparkles_23"
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                        />
                      </label>
                      <label>
                        <h3>Password</h3>
                        <input
                          type="text"
                          placeholder="e.g. uniquepassword12345"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </label>
                    </div>
                    <div className={classes.searchButton}>
                      <Button type="submit">Login</Button>
                    </div>
                  </form>
                </div>
              </Card>
            </TabPanel>
            <TabPanel>
              <Card className={classes.card}>
                <div className={classes.form}>
                  <form onSubmit={submitSignUp}>
                    <div>
                      <h2>Sign Up Here:</h2>
                      <label>
                        <h3>New Username</h3>
                        <input
                          type="text"
                          placeholder="e.g. chef_sparkles_23"
                          onChange={(e) => setNewUsername(e.target.value)}
                          value={newUsername}
                        />
                      </label>
                      <label>
                        <h3>New Password</h3>
                        <input
                          type="text"
                          placeholder="e.g. uniquepassword12345"
                          onChange={(e) => setNewPassword(e.target.value)}
                          value={newPassword}
                        />
                      </label>
                    </div>
                    <div className={classes.searchButton}>
                      <Button type="submit">Sign Up</Button>
                    </div>
                  </form>
                </div>
              </Card>
            </TabPanel>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default LoginSignup;

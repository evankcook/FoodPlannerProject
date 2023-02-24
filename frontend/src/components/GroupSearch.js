import classes from "./GroupSearch.module.css";
import { useState, useEffect } from "react";
import { getUserDetails } from "../utils/UserAuthUtils";
import Button from "./ui/Button";
import Card from "./ui/Card";
import {
  getGroupIdByGroupName,
  getRandomRecipe,
  getRecipesByGroupAndRecipeTitle,
  getRecipesByGroupId,
  getRecipesByRecipeTitle,
  getUsernameById,
} from "../utils/RouteUtils";

function GroupSearch(props) {
  const [groupName, setGroupName] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  async function submitGroupQuery(e) {
    e.preventDefault();
    const recipes = [];
    if (groupName && !recipeName) {
      const groupId = await getGroupIdByGroupName(userId, groupName);
      getRecipesByGroupId(userId, groupId).then((res) => {
        recipes.push(...res);
        props.onReceiveGroups(recipes);
      });
    }

    if (!groupName && recipeName) {
      getRecipesByRecipeTitle(userId, recipeName).then((res) => {
        recipes.push(res);
        props.onReceiveGroups(recipes);
      });
    }

    if (groupName && recipeName) {
      const groupId = await getGroupIdByGroupName(userId, groupName);
      getRecipesByGroupAndRecipeTitle(userId, groupId, recipeName).then(
        (res) => {
          recipes.push(res);
          props.onReceiveGroups(recipes);
        }
      );
    }

    if (!groupName && !recipeName) {
      alert("Must fill in at least one input");
    }
  }

  async function handleRandom() {
    const recipes = [];
    getRandomRecipe(userId).then((res) => {
      recipes.push(res);
      props.onReceiveGroups(recipes);
    });
  }

  useEffect(() => {
    getUserDetails().then((result) => {
      if (result.isLoggedIn === true) {
        console.log("Setting userID");
        setUserId(result.userId);
      }
    });
  }, []);

  useEffect(() => {
    getUsernameById(userId).then((result) => {
      setUsername(result);
    });
  }, [userId]);

  return (
    <Card className={classes.card}>
      <div className={classes.form}>
        <form onSubmit={submitGroupQuery}>
          <div>
            <label>
              <h2>
                Group Search for {username !== undefined ? username : "..."}
              </h2>
              <input
                type="text"
                placeholder="My Favorite Italian Dishes... (optional)"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
            </label>
          </div>
          <div className={classes.specs}>
            <div>
              <label>
                <h3>Recipe Name</h3>
                <input
                  type="text"
                  placeholder="e.g. Pasta Margherita (optional)"
                  onChange={(e) => setRecipeName(e.target.value)}
                  value={recipeName}
                />
              </label>
            </div>
            <div className={classes.searchButton}>
              <Button type="submit">Search!</Button>
              <Button onClick={handleRandom}>Surprise Me!</Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default GroupSearch;

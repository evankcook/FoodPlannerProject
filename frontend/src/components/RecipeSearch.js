import classes from "./RecipeSearch.module.css";
import Card from "./ui/Card";
import { useState } from "react";
import Button from "./ui/Button";
import { handleRecipeQuery } from "../utils/API";
import { useEffect } from "react";
import { getUserDetails } from "../utils/UserAuthUtils";
import { getUsernameById } from "../utils/RouteUtils";

function RecipeSearch(props) {
  const [query, setQuery] = useState("");
  const [includeIngredients, setIncludeIngredients] = useState("");
  const [excludeIngredients, setExcludeIngredients] = useState("");
  const [maxTime, setMaxTime] = useState("");

  async function submitRecipeQuery(e) {
    e.preventDefault();
    const results = await handleRecipeQuery(
      query,
      includeIngredients,
      excludeIngredients,
      maxTime
    );
    props.onReceiveRecipe(results);
  }

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState();

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
        <form onSubmit={submitRecipeQuery}>
          <div>
            <label>
              <h2>
                Recipe Search for {username !== undefined ? username : "..."}
              </h2>
              <input
                type="text"
                placeholder="pasta..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </label>
          </div>
          <div className={classes.specs}>
            <div>
              <label>
                <h3>Include Ingredients:</h3>
                <input
                  type="text"
                  placeholder="tomato, cheese, ..."
                  onChange={(e) => setIncludeIngredients(e.target.value)}
                  value={includeIngredients}
                />
              </label>
            </div>
            <div>
              <label>
                <h3>Exclude Ingredients:</h3>
                <input
                  type="text"
                  placeholder="eggs, peanuts, ..."
                  onChange={(e) => setExcludeIngredients(e.target.value)}
                  value={excludeIngredients}
                />
              </label>
            </div>
            <div>
              <label>
                <h3>Max Time:</h3>
                <input
                  type="number"
                  placeholder="20"
                  onChange={(e) => setMaxTime(e.target.value)}
                  value={maxTime}
                />
              </label>
            </div>
            <div className={classes.searchButton}>
              <Button type="submit">Search!</Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default RecipeSearch;

import classes from "./RecipeSearch.module.css";
import Card from "./ui/Card";
import { useState } from "react";

function RecipeSearch(props) {
  const [includeIngredients, setIncludeIngredients] = useState("");
  const [excludeIngredients, setExcludeIngredients] = useState("");
  const [maxTime, setMaxTime] = useState("");

  const handleSubmit = () => {
    const info = {
      includeIngredients: includeIngredients,
      excludeIngredients: excludeIngredients,
      maxTime: maxTime,
    };
    props.onSearchInfo(info);
  };

  return (
    <Card className={classes.card}>
      <form onSubmit={handleSubmit}>
        <label>Include Ingredients</label>
        <input
          type="text"
          placeholder="tomato, cheese, ..."
          onChange={(e) => setIncludeIngredients(e.target.value)}
          value={includeIngredients}
        />
        <label>Exclude Ingredients</label>
        <input
          type="text"
          placeholder="eggs, peanuts, ..."
          onChange={(e) => setExcludeIngredients(e.target.value)}
          value={excludeIngredients}
        />
        <label>Max Time</label>
        <input
          type="number"
          placeholder="20"
          onChange={(e) => setMaxTime(e.target.value)}
          value={maxTime}
        />
      </form>
    </Card>
  );
}

export default RecipeSearch;

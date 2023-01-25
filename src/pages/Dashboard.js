import RecipeSearch from "../components/RecipeSearch";
import classes from "./Dashboard.module.css";
import { useState } from "react";
import RecipeInfo from "../components/RecipeInfo";
import RecipeFullInfo from "../components/RecipeFullInfo";
import { handleInformationQuery } from "../utils/API";

function Dashboard() {
  const [recipePreviewInfo, setRecipePreviewInfo] = useState();
  const [isFullInfo, setIsFullInfo] = useState(false);
  const [fullInfo, setFullInfo] = useState();

  async function handleRecipeClick(id) {
    setIsFullInfo(true);
    console.log("about to call query");
    const results = await handleInformationQuery(id);
    console.log("finish query");
    setFullInfo(results);
  }

  function handleExit() {
    setIsFullInfo(false);
  }

  return (
    <div className={classes.search}>
      <RecipeSearch
        onReceiveRecipe={(results) => setRecipePreviewInfo(results)}
      />
      {!isFullInfo && recipePreviewInfo && (
        <div className={classes.searchResults}>
          {recipePreviewInfo.map((recipe) => {
            return (
              <RecipeInfo
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                onRecipeClick={handleRecipeClick}
              ></RecipeInfo>
            );
          })}
        </div>
      )}
      {isFullInfo && fullInfo && (
        <div className={classes.searchResults}>
          <RecipeFullInfo
            onExit={handleExit}
            image={fullInfo.image}
            title={fullInfo.title}
            servings={fullInfo.servings}
            readyInMinutes={fullInfo.readyInMinutes}
            sourceName={fullInfo.sourceName}
            sourceUrl={fullInfo.sourceUrl}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;

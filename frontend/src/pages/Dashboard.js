import RecipeSearch from "../components/RecipeSearch";
import classes from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import RecipeInfo from "../components/RecipeInfo";
import RecipeFullInfo from "../components/RecipeFullInfo";
import { handleInformationQuery } from "../utils/API";
import { createRecipe, getAllGroups } from "../utils/RouteUtils";
import { getUserDetails } from "../utils/UserAuthUtils";

function Dashboard() {
  const [recipePreviewInfo, setRecipePreviewInfo] = useState();
  const [isFullInfo, setIsFullInfo] = useState(false);
  const [fullInfo, setFullInfo] = useState();

  async function handleRecipeClick(id) {
    setIsFullInfo(true);
    console.log("about to call query");
    const results = await handleInformationQuery(id);
    console.log("finish query");
    results.id = id;
    setFullInfo(results);
    await createRecipe(results.id, results.title, results.image)
      .then((res) => console.log(res))
      .catch((err) => alert(err));
  }

  function handleExit() {
    setIsFullInfo(false);
  }

  const [userId, setUserId] = useState();
  const [groups, setGroups] = useState();

  useEffect(() => {
    getUserDetails().then((result) => {
      console.log("RESULT:");
      console.log(result);
      setUserId(result.userId);
    });
  }, []);

  useEffect(() => {
    getAllGroups(userId).then((result) => {
      if (result) {
        console.log(result[0].group_name);
        const groupsArr = [];
        result.forEach((item) => groupsArr.push(item.group_name));
        console.log(groupsArr);
        setGroups(groupsArr);
      }
    });
  }, [userId]);

  return (
    <div className={classes.search}>
      <div>
        <div className={classes.groupNames}>
          <p>{groups && groups.join(", ")}</p>
        </div>
        <RecipeSearch
          onReceiveRecipe={(results) => setRecipePreviewInfo(results)}
        />
      </div>
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
            isDashBoard={true}
            id={fullInfo.id}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import classes from "./Groups.module.css";
import GroupSearch from "../components/GroupSearch";
import { getAllGroups } from "../utils/RouteUtils";
import { useEffect, useState } from "react";
import { getUserDetails } from "../utils/UserAuthUtils";
import { handleInformationQuery } from "../utils/API";
import RecipeInfo from "../components/RecipeInfo";
import RecipeFullInfo from "../components/RecipeFullInfo";

function Groups() {
  const [recipePreviewInfo, setRecipePreviewInfo] = useState();
  const [isFullInfo, setIsFullInfo] = useState(false);
  const [fullInfo, setFullInfo] = useState();

  const [userId, setUserId] = useState();
  const [groups, setGroups] = useState();

  async function handleRecipeClick(id) {
    setIsFullInfo(true);
    console.log("about to call query");
    const results = await handleInformationQuery(id);
    console.log("finish query");
    results.id = id;
    setFullInfo(results);
  }

  function handleExit() {
    setIsFullInfo(false);
  }

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
    <div className={classes.container}>
      <div className={classes.groupNames}>
        <p>{groups && groups.join(", ")}</p>
      </div>
      <div className={classes.searchContainer}>
        <GroupSearch
          onReceiveGroups={(results) => {
            setRecipePreviewInfo(results);
          }}
        />
        {!isFullInfo && recipePreviewInfo && (
          <div className={classes.searchResults}>
            {recipePreviewInfo.map((recipe) => {
              return (
                <RecipeInfo
                  key={recipe.recipe_id}
                  id={recipe.recipe_id}
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
              isDashBoard={false}
              id={fullInfo.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Groups;

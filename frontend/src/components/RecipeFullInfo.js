import classes from "./RecipeFullInfo.module.css";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useEffect, useState } from "react";
import {
  addRecipeToGroup,
  createGroup,
  getGroupIdByGroupName,
} from "../utils/RouteUtils";
import { getUserDetails } from "../utils/UserAuthUtils";

function RecipeFullInfo(props) {
  const [groupName, setGroupName] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    getUserDetails().then((result) => {
      console.log("RESULT:");
      console.log(result);
      setUserId(result.userId);
    });
  }, []);

  async function submitAddToGroup(e) {
    e.preventDefault();
    console.log("START SUBMIT");
    // Add group name if it doesn't already exist
    const groupIdLocal = await getGroupIdByGroupName(userId, groupName)
      .then((res) => {
        console.log("GROUP EXISTS");
        console.log(res);
        return res;
      })
      .catch(async (err) => {
        return await createGroup(groupName, userId).then((res) => {
          console.log("CREATE NEW GROUP");
          console.log(res.groupId);
          return res.groupId;
        });
      });
    // add recipe to group
    const response = await addRecipeToGroup(props.id, groupIdLocal, userId);
    console.log(response);
    setGroupName("");
    alert("Added to group!");
  }

  return (
    <Card
      className={
        props.isDashBoard ? classes.fullInfo : classes.fullInfoGroupBoard
      }
    >
      <h2>{props.title}</h2>
      <div className={classes.infoBody}>
        <img src={props.image} alt={props.title} />
        <div>
          <div>
            <h3>Servings:</h3>
            <p>{props.servings}</p>
          </div>
          <div>
            <h3>Time:</h3>
            <p>{props.readyInMinutes}</p>
          </div>
          <div>
            <h3>A Recipe of:</h3>
            <p>{props.sourceName}</p>
          </div>
        </div>
      </div>
      <div className={classes.buttons}>
        <Button onClick={props.onExit}>Back</Button>
        <a href={props.sourceUrl} target="_blank" rel="noopener noreferrer">
          Go to Recipe
        </a>
      </div>
      {props.isDashBoard && (
        <div className={classes.form}>
          <form onSubmit={submitAddToGroup}>
            <div className={classes.specs}>
              <div>
                <label>
                  <h3>Group Name</h3>
                  <input
                    type="text"
                    placeholder="Choose existing or add new one"
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                  />
                </label>
              </div>
              <div className={classes.searchButton}>
                <Button type="submit">Add!</Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

export default RecipeFullInfo;

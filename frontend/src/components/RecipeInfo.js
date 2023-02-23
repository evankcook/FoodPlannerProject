import classes from "./RecipeInfo.module.css";

function RecipeInfo(props) {
  return (
    <div
      className={classes.infoCard}
      onClick={() => props.onRecipeClick(props.id)}
    >
      <img src={props.image} alt={props.title} />
      <div>
        <p>{props.title}</p>
      </div>
    </div>
  );
}

export default RecipeInfo;

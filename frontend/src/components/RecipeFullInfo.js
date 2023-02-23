import classes from "./RecipeFullInfo.module.css";
import Card from "./ui/Card";
import Button from "./ui/Button";

function RecipeFullInfo(props) {
  return (
    <Card className={classes.fullInfo}>
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
    </Card>
  );
}

export default RecipeFullInfo;

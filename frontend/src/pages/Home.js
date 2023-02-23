import classes from "./Home.module.css";
import { TypeAnimation } from "react-type-animation";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const recipeSequence = [
    "pasta",
    2000,
    "salad",
    2000,
    "steak dinner",
    2000,
    "bread",
    2000,
    "cake",
    2000,
  ];
  return (
    <div className={classes.container}>
      <div className={classes.textbox}>
        <h2>Find your next favorite</h2>
        <br />
        <TypeAnimation
          sequence={recipeSequence}
          wrapper="h2"
          className={classes.typing}
          repeat={Infinity}
        />
        <h2>recipe.</h2>
        <h3>Who knew it could be so easy?</h3>
        <Button onClick={() => navigate("/dashboard")}>
          Start your search!
        </Button>
      </div>
      <div className={classes.photo}>
        <img src="images/salmon.svg" alt="salmon dish" />
      </div>
    </div>
  );
}

export default Home;

import RecipeSearch from "../components/RecipeSearch";
import classes from "./Dashboard.module.css";

function Dashboard() {
  const handleSearchInfo = (info) => {};

  const key = process.env.REACT_APP_API_KEY;
  console.log(key);

  const getMeal = () => {
    fetch(
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
        key +
        "&query=pasta&maxFat=25&number=2"
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <RecipeSearch onSearchInfo={handleSearchInfo} />
      </div>
    </div>
  );
}

export default Dashboard;

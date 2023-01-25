import RecipeSearch from "../components/RecipeSearch";
import Button from "../components/ui/Button";
import classes from "./Dashboard.module.css";

function Dashboard() {
  const handleSearchInfo = (info) => {};

  return (
    <div className={classes.search}>
      <RecipeSearch onSearchInfo={handleSearchInfo} />
      <RecipeSearch onSearchInfo={handleSearchInfo} />
    </div>
  );
}

export default Dashboard;

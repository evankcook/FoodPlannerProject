import RecipeSearch from "../components/RecipeSearch";
import classes from "./Dashboard.module.css";

function Dashboard() {
  const handleSearchInfo = (info) => {};

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <RecipeSearch onSearchInfo={handleSearchInfo} />
      </div>
    </div>
  );
}

export default Dashboard;

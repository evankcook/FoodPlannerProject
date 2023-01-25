export async function handleRecipeQuery(
  query,
  includeIngredients,
  excludeIngredients,
  maxTime
) {
  console.log("Fetching...");
  const url =
    "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
    process.env.REACT_APP_API_KEY +
    `&query=${query}${
      includeIngredients ? "&includeIngredients=" + includeIngredients : ""
    }${excludeIngredients ? "&excludeIngredients=" + excludeIngredients : ""}${
      maxTime > 0 ? "&maxTime=" + maxTime : ""
    }&number=6`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const { results } = data;
  console.log(results);
  return results;
}

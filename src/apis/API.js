export async function handleRecipeQuery(
  query,
  includeIngredients,
  excludeIngredients,
  maxTime
) {
  console.log("Fetching...");
  try {
    const response = await fetch(
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
        process.env.REACT_APP_API_KEY +
        `&query=${query}${
          includeIngredients.length > 0
            ? "&includeIngredients=" + includeIngredients
            : ""
        }${
          excludeIngredients.length > 0
            ? "&excludeIngredients=" + excludeIngredients
            : ""
        }${maxTime > 0 ? "&maxTime=" + maxTime : ""}&number=3`
    ).then((response) => response.json());
  } catch (err) {}
}

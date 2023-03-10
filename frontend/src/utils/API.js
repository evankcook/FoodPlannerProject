export async function handleRecipeQuery(
  query,
  includeIngredients,
  excludeIngredients,
  maxTime
) {
  console.log("Fetching recipe query...");
  const url =
    "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
    "9c5d68566c9d4014a84292ab910039ba" +
    `&query=${query}${
      includeIngredients ? "&includeIngredients=" + includeIngredients : ""
    }${excludeIngredients ? "&excludeIngredients=" + excludeIngredients : ""}${
      maxTime > 0 ? "&maxTime=" + maxTime : ""
    }&number=6`;

  const data = await fetch(url)
    .then((response) => response.json())
    .catch((err) => alert(err));
  const { results } = data;
  console.log("Results of recipe query");
  console.log(results);
  return results;
}

export async function handleInformationQuery(id) {
  console.log("Fetching information query...");
  const url =
    "https://api.spoonacular.com/recipes/" +
    id +
    "/information?apiKey=" +
    "9c5d68566c9d4014a84292ab910039ba" +
    "&includeNutrition=false";

  const data = await fetch(url)
    .then((response) => response.json())
    .catch((err) => alert(err));
  console.log("Results of Information query");
  console.log(data);
  return data;
}

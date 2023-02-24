// Post Routes

export async function createGroup(groupName, userId) {
  console.log("creating new group");
  const response = await fetch("http://localhost:8080/user/group", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      groupName: groupName,
      userId: userId,
    }),
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function createRecipe(recipeId, title, image) {
  console.log("creating new recipe");
  const response = await fetch("http://localhost:8080/recipe", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipeId: recipeId,
      title: title,
      image: image,
    }),
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function addRecipeToGroup(recipeId, groupId, userId) {
  console.log(
    "creating new recipe group with " + recipeId + " and groupID " + groupId
  );
  const response = await fetch("http://localhost:8080/recipeGroup", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipeId: recipeId,
      groupId: groupId,
      userId: userId,
    }),
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

// GET Routes

export async function getUsernameById(userId) {
  console.log("getting username...");
  let result;
  await fetch(`http://localhost:8080/user/${userId}`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data.username;
    });
  return result;
}

export async function getRecipesByGroupId(userId, groupId) {
  console.log("getting recipes by group id...");
  let result;
  await fetch(`http://localhost:8080/users/${userId}/groups/${groupId}`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data;
    });
  return result;
}

export async function getRecipesByGroupAndRecipeTitle(
  userId,
  groupId,
  recipeTitle
) {
  console.log("getting recipes by group id and title...");
  let result;
  await fetch(
    `http://localhost:8080/users/${userId}/groups/${groupId}/recipe/${recipeTitle}`,
    {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data;
    });
  return result;
}

export async function getRecipesByRecipeTitle(userId, recipeTitle) {
  console.log("getting recipes by recipe title...");
  let result;
  await fetch(`http://localhost:8080/users/${userId}/recipe/${recipeTitle}`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data;
    });
  return result;
}

export async function getRandomRecipe(userId) {
  console.log("getting random recipe...");
  let result;
  await fetch(`http://localhost:8080/users/${userId}/randomRecipe`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data;
    });
  return result;
}

export async function getGroupIdByGroupName(userId, groupName) {
  console.log("getting groupID by group name...");
  const response = await fetch(
    `http://localhost:8080/users/${userId}/group/${groupName}`,
    {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );
  const data = await response.json();
  const result = data.group_id;
  return result;
}

export async function getAllGroups(userId) {
  console.log("getting all groups...");
  let result;
  await fetch(`http://localhost:8080/users/${userId}/groups`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      result = data;
    });
  return result;
}

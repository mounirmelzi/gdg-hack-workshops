const data = {
  posts: [],
  users: [],
  comments: [],
};

async function fetchData() {
  try {
    const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/posts"),
      fetch("https://jsonplaceholder.typicode.com/users"),
      fetch("https://jsonplaceholder.typicode.com/comments"),
    ]);

    const [posts, users, comments] = await Promise.all([
      postsResponse.json(),
      usersResponse.json(),
      commentsResponse.json(),
    ]);

    data.posts = posts;
    data.users = users;
    data.comments = comments;

    renderData();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderData() {
  console.log({ data });
}

document.addEventListener("DOMContentLoaded", fetchData);

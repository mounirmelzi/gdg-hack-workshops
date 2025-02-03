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

    document.querySelector(".loader").remove();
    renderPosts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderPosts() {
  const feed = document.getElementById("feed");

  data.posts.forEach((post) => {
    const user = data.users.find((user) => user.id === post.userId);
    const postComments = data.comments.filter(
      (comment) => comment.postId === post.id
    );

    const postElement = createPostElement(post, user, postComments);
    feed.appendChild(postElement);
  });

  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const button = event.currentTarget;
      button.classList.toggle("liked");

      if (button.classList.contains("liked")) {
        button.innerHTML = "❤️ Like";
        button.style.color = "#1877f2";
      } else {
        button.innerHTML = "🤍 Like";
        button.style.color = "#65676b";
      }
    });
  });

  document.querySelectorAll(".comment-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const postCard = button.closest(".post-card");
      const commentSection = postCard.querySelector(".comments");

      commentSection.classList.toggle("show");

      button.style.color = commentSection.classList.contains("show")
        ? "#1877f2"
        : "#65676b";
    });
  });

  document.querySelectorAll(".comment-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const postCard = form.closest(".post-card");
      const input = form.querySelector(".comment-input");
      const comment = input.value.trim();

      if (comment) {
        fetch("https://jsonplaceholder.typicode.com/comments", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            body: comment,
            postId: postCard.dataset.postId,
            name: "name",
            email: "user@gmail.com",
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            const commentsSection = postCard.querySelector(".comments");

            const newCommentDiv = document.createElement("div");
            newCommentDiv.className = "comment";

            const commentHeader = document.createElement("div");
            commentHeader.className = "comment-header";

            const commentAvatar = document.createElement("div");
            commentAvatar.className = "user-avatar";

            const commentUserName = document.createElement("p");
            commentUserName.className = "user-name";
            commentUserName.textContent = json.email;

            commentHeader.append(commentAvatar, commentUserName);

            const commentBody = document.createElement("p");
            commentBody.className = "comment-body";
            commentBody.textContent = json.body;

            newCommentDiv.append(commentHeader, commentBody);

            const commentForm = postCard.querySelector(".comment-form");
            commentsSection.insertBefore(newCommentDiv, commentForm);

            input.value = "";
          });
      }
    });
  });
}

function createPostElement(post, user, comments) {
  // create main post card section
  const postCard = document.createElement("section");
  postCard.className = "post-card";
  postCard.dataset.postId = post.id;

  // create user info section
  const userInfo = document.createElement("div");
  userInfo.className = "user-info";

  const userAvatar = document.createElement("div");
  userAvatar.className = "user-avatar";

  const userDetails = document.createElement("div");
  userDetails.className = "user-details";

  const userName = document.createElement("p");
  userName.className = "user-name";
  userName.textContent = user.name;

  const userHandle = document.createElement("p");
  userHandle.className = "user-handle";
  userHandle.textContent = `@${user.username}`;

  userDetails.append(userName, userHandle);
  userInfo.append(userAvatar, userDetails);

  // create post title
  const postTitle = document.createElement("p");
  postTitle.className = "post-title";
  postTitle.textContent = post.title;

  // create post body
  const postBody = document.createElement("p");
  postBody.className = "post-body";
  postBody.textContent = post.body;

  // create post actions
  const postActions = document.createElement("div");
  postActions.className = "post-actions";

  const likeButton = document.createElement("div");
  likeButton.className = "action-button like-button";
  likeButton.textContent = "🤍 Like";

  const commentButton = document.createElement("div");
  commentButton.className = "action-button comment-button";
  commentButton.textContent = "💬 Comment";

  const shareButton = document.createElement("div");
  shareButton.className = "action-button";
  shareButton.textContent = "↗️ Share";

  postActions.append(likeButton, commentButton, shareButton);

  // create comments section
  const commentsSection = document.createElement("div");
  commentsSection.className = "comments";

  comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";

    const commentHeader = document.createElement("div");
    commentHeader.className = "comment-header";

    const commentAvatar = document.createElement("div");
    commentAvatar.className = "user-avatar";

    const commentUserName = document.createElement("p");
    commentUserName.className = "user-name";
    commentUserName.textContent = comment.email;

    commentHeader.append(commentAvatar, commentUserName);

    const commentBody = document.createElement("p");
    commentBody.className = "comment-body";
    commentBody.textContent = comment.body;

    commentDiv.append(commentHeader, commentBody);
    commentsSection.appendChild(commentDiv);
  });

  const commentForm = document.createElement("form");
  commentForm.className = "comment-form";

  const newCommentAvatar = document.createElement("div");
  newCommentAvatar.className = "user-avatar";

  const newCommentInput = document.createElement("input");
  newCommentInput.className = "comment-input";
  newCommentInput.type = "text";
  newCommentInput.placeholder = "Write a comment...";

  commentForm.append(newCommentAvatar, newCommentInput);
  commentsSection.appendChild(commentForm);

  // append all elements to post card
  postCard.append(userInfo, postTitle, postBody, postActions, commentsSection);
  return postCard;
}

document.addEventListener("DOMContentLoaded", fetchData);

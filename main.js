import { postApi } from "./api/postApi.mjs";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

let selectID = null;

// su dung axios thu vien cua JS
async function getPostList() {
  try {
    const res = await postApi.getAll({ _page: 1, _limit: 6 });
    //
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

// su dung fetch API mac dinh cua JS
// async function getPostList() {
//   try {

//     const response = await fetch(apiUrl);
//     const data = response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }

function renderItems(data) {
  const blogTemplate = document.querySelector("#blogTemplate");
  const blogList = document.querySelector("#blogList");
  for (let i = 0; i < data.length; i++) {
    const cloneBlogTemplate = blogTemplate.cloneNode(true).content;

    const blogCard = cloneBlogTemplate.querySelector(".blog-card");
    const blogCardImg = cloneBlogTemplate.querySelector(".blog-card--img");
    const blogCardTitle = cloneBlogTemplate.querySelector(".blog-card--title");
    const blogCardDesc = cloneBlogTemplate.querySelector(".blog-card--desc");
    const blogCardDate = cloneBlogTemplate.querySelector(".blog-card--date");
    const blogCardAuthor =
      cloneBlogTemplate.querySelector(".blog-card--author");
    const date = new Date(data[i].createdAt);

    const btnEditPost = cloneBlogTemplate.querySelector(".btn-edit");
    if (btnEditPost) {
      btnEditPost.addEventListener("click", (event) => {
        event.preventDefault();
        selectID = data[i].id;
        handleTogglePopup(data[i].id);
        setFormValue(data[i]);
      });
    }

    const btnDeletePost = cloneBlogTemplate.querySelector(".btn-delete");
    if (btnDeletePost) {
      btnDeletePost.addEventListener("click", (event) => {
        event.preventDefault();
        selectID = data[i].id;
        handleDeletePost(data[i].id);
      });
    }

    blogCard.href = "/detail?id=" + data[i].id;
    blogCardImg.src = data[i].imageUrl;
    blogCardImg.alt = data[i].title;
    blogCardTitle.textContent = data[i].title;
    blogCardDesc.textContent = data[i].description;
    blogCardDate.textContent =
      date.getHours() +
      ":" +
      date.getMinutes() +
      " " +
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear();
    blogCardAuthor.textContent = data[i].author;

    blogList.appendChild(cloneBlogTemplate);
  }
}

function setFormValue(post) {
  const title = document.querySelector("#title");
  if (title) {
    title.value = post.title;
  }

  const author = document.querySelector("#author");
  if (author) {
    author.value = post.author;
  }

  const desc = document.querySelector("#desc");
  if (desc) {
    desc.value = post.description;
  }

  const imagePost = document.querySelector("#imagePost");
  if (imagePost) {
    imagePost.src = post.imageUrl;
  }
}

async function handleDeletePost(id) {
  try {
    await postApi.delete(id);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

function handleTogglePopup(id) {
  const popup = document.querySelector("#popup");
  const titlePopup = popup.querySelector(".popup-title");
  titlePopup.textContent = id ? "Edit post" : "Add post"; // Toan tu 3 ngoi = if (id) -> (dung -> ham) : (sai -> ham)

  if (popup) {
    popup.classList.toggle("is-active");
    const btnClosePopup = popup.querySelector(".btn-close");
    if (btnClosePopup) {
      btnClosePopup.addEventListener("click", () => {
        popup.classList.remove("is-active");
      });
    }
  }
}
function handleAddCBtnClick() {
  handleTogglePopup();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const desc = document.querySelector("#desc").value;
  const imagePost = document.querySelector("#imagePost").src;
  const formValue = {
    title: title,
    author: author,
    description: desc,
    imageUrl: imagePost,
  };    

  if (selectID) {
    handleEditPost({
      id: selectID,
      ...formValue
    });
    
  }else{
    handleCreatePost(formValue);
  }

  const blogForm = document.querySelector("#blogForm");
  if (blogForm) {
    blogForm.reset();
  }
  handleTogglePopup()
  
}

async function handleCreatePost(data) {
  try {
    await postApi.create(data);

  
    showNotification("Tao thanh cong", "SUCCESS");
  } catch (error) {
    showNotification("Tao that bai", "ERROR");
  }
}

function showNotification(message, status) {
  const color = { SUCCESS: "green", ERROR: "red" };
  Toastify({
    text: message,

    duration: 3000,
    style: {
      background: color[status] || "black",
    },
  }).showToast();
}

async function handleEditPost(newPost) {
  try {
    await postApi.update(newPost.id, newPost);
    showNotification("Cap nhat thanh cong", "SUCCESS");
    window.location.reload();
  } catch (error) {
    showNotification("Cap nhat that bai", "ERROR");
  }
}

(async () => {
  const { data } = await getPostList();
  renderItems(data);

  const btnAddPost = document.querySelector("#btnAddPost");
  if (btnAddPost) {
    btnAddPost.addEventListener("click", handleAddCBtnClick);
  }
  
  const blogForm = document.querySelector("#blogForm");
  if (blogForm) {
    blogForm.addEventListener("submit", handleFormSubmit);
  }
})();

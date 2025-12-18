/* =========================
   GLOBAL DATA
========================= */
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editIndex = -1;
let pastedImage = "";

/* =========================
   ELEMENTS
========================= */
const form = document.getElementById("recipeForm");
const list = document.getElementById("recipeList");
const pasteBox = document.getElementById("pasteBox");

/* =========================
   TOGGLE FORM
========================= */
function toggleForm(){
  if(form.style.display === "block"){
    form.style.opacity = "0";
    setTimeout(()=>form.style.display="none",300);
  }else{
    form.style.display = "block";
    setTimeout(()=>form.style.opacity="1",50);
  }
}

/* =========================
   IMAGE PASTE
========================= */
pasteBox.addEventListener("paste", e=>{
  const items = e.clipboardData.items;
  for(let i=0;i<items.length;i++){
    if(items[i].type.includes("image")){
      const file = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = ()=>{
        pastedImage = reader.result;
        pasteBox.innerHTML = "Image pasted ✅";
      };
      reader.readAsDataURL(file);
    }
  }
});

/* =========================
   SAVE RECIPE (FIXED)
========================= */
function saveRecipe(){
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = true;   // 🔒 double click block

  const title = titleInput().value.trim();
  if(title === ""){
    alert("Recipe name required");
    saveBtn.disabled = false;
    return;
  }

  const imageUrl = imageUrlInput().value.trim();

  const recipe = {
    title,
    ingredients: ingredientsInput().value,
    steps: stepsInput().value,
    image: pastedImage || imageUrl || ""
  };

  if(editIndex === -1){
    recipes.push(recipe);
  }else{
    recipes[editIndex] = recipe;
    editIndex = -1;
  }

  localStorage.setItem("recipes", JSON.stringify(recipes));
  resetForm();
  showRecipes();

  saveBtn.disabled = false; // 🔓 enable again
}

/* =========================
   SHOW RECIPES
========================= */
function showRecipes(){
  list.innerHTML = "";   // ⭐ MOST IMPORTANT LINE

  recipes.forEach((r,i)=>{
    list.innerHTML += `
      <div class="recipe-card">
        <h2>${r.title}</h2>
        ${r.image ? `<img src="${r.image}">` : ""}
        <p><b>Ingredients:</b><br>${r.ingredients}</p>
        <p><b>Steps:</b><br>${r.steps}</p>
        <div class="actions">
          <button onclick="editRecipe(${i})">Edit</button>
          <button onclick="deleteRecipe(${i})">Delete</button>
        </div>
      </div>
    `;
  });
}

/* =========================
   DELETE
========================= */
function deleteRecipe(i){
  const card = document.querySelectorAll(".recipe-card")[i];
  card.classList.add("shake");

  setTimeout(()=>{
    recipes.splice(i,1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    showRecipes();
  },300);
}

/* =========================
   EDIT
========================= */
function editRecipe(i){
  const r = recipes[i];
  titleInput().value = r.title;
  ingredientsInput().value = r.ingredients;
  stepsInput().value = r.steps;
  imageUrlInput().value = "";
  pastedImage = r.image;
  editIndex = i;
  toggleForm();
}

/* =========================
   SEARCH
========================= */
function searchRecipe(){
  const val = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll(".recipe-card").forEach(card=>{
    card.style.display =
      card.innerText.toLowerCase().includes(val) ? "block" : "none";
  });
}

/* =========================
   RESET
========================= */
function resetForm(){
  form.reset();
  pastedImage = "";
  pasteBox.innerHTML = "Paste Image Here (Ctrl + V)";
  toggleForm();
}

/* =========================
   SHORTCUTS
========================= */
const titleInput = () => document.getElementById("title");
const ingredientsInput = () => document.getElementById("ingredients");
const stepsInput = () => document.getElementById("steps");
const imageUrlInput = () => document.getElementById("imageUrl");

/* =========================
   INITIAL LOAD
========================= */
showRecipes();

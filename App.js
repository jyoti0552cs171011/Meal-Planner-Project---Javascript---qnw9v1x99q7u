let meals = [];
let recipes = [];
// Function to fetch data from the API
async function fetchMealData() {
    const apiURL = "https://content.newtonschool.co/v1/pr/64995a40e889f331d43f70ae/categories";

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log(data)
        meals = data;
        // return data;
    } catch (error) {
        console.error("Error fetching meal data:", error);
        return null;
    }
}
fetchMealData();

async function fetchMealRecipe() {
    const apiURL = "https://content.newtonschool.co/v1/pr/64996337e889f331d43f70ba/recipes";

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        const data = await response.json();
        recipes = data;
    } catch (error) {
        console.error("Error fetching meal data:", error);
        return null;
    }
}
fetchMealRecipe();

function calculateCalories () {
    const form = document.getElementById("meal-form");
    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");
    const ageInput = document.getElementById("age");
    const genderSelect = document.getElementById("gender");
    const activitySelect = document.getElementById("activity");
  
    function handleSubmit (event){
        event.preventDefault();
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value;
        const activityLevel = activitySelect.value;

        let bmr;
        if (gender === "male") {
            bmr = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
        } else if (gender === "female") {
            bmr = 655.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age);
        }

        let dailyCalories;
        if (activityLevel === "light") {
            dailyCalories = bmr * 1.375;
        } else if (activityLevel === "moderate") {
            dailyCalories = bmr * 1.55;
        } else if (activityLevel === "active") {
            dailyCalories = bmr * 1.725;
        }
        const mealPlan = filterMealsByCalories(dailyCalories.toFixed(2));
        recipe = mealPlan;
        renderMealPlan(mealPlan)
        window.scrollBy(0, 330);
    };
    form.addEventListener('submit', handleSubmit);

}
calculateCalories();

// Function to filter meals by calorie categories
function filterMealsByCalories(calorie) {
    return meals.find((meal) => {
        return calorie >= meal.min && calorie <= meal.max;
    });
}
  
  // Function to render the meal plan
function renderMealPlan(mealPlan) {
    const mealPlanSection = document.getElementById("meal-plan");
    const {breakfast,lunch, dinner} = mealPlan;
    mealPlanSection.innerHTML = "";
    mealPlanSection.innerHTML = `<div class="meal-card">
        <h3>Breakfast</h3>
        <div class="meal-item">
          <img src="${breakfast.image}" alt="Meal Image">
          <h4>${breakfast.title}</h4>
          <p>Ready in ${breakfast.readyInMinutes} minutes</p>
          <button class="get-recipe-btn" data-meal-id="${breakfast.id}">Get Recipe</button>
        </div>
        </div>
        <div class="meal-card">
        <h3>Lunch</h3>
        <div class="meal-item">
          <img src="${lunch.image}" alt="Meal Image">
          <h4>${lunch.title}</h4>
          <p>Ready in ${lunch.readyInMinutes} minutes</p>
          <button class="get-recipe-btn" data-meal-id="${lunch.id}">Get Recipe</button>
        </div>
        </div>
        <div class="meal-card">
        <h3>Dinner</h3>
        <div class="meal-item">
          <img src="${dinner.image}" alt="Meal Image">
          <h4>${dinner.title}</h4>
          <p>Ready in ${dinner.readyInMinutes} minutes</p>
          <button class="get-recipe-btn" data-meal-id="${dinner.id}">Get Recipe</button>
        </div>
        </div>`
        renderRecipe();
}
  
function renderRecipe () {
    function displayRecipe (recipeData) {
        function formatList(text) {
            let step = 1;
            return text.split(',').map((stepText) => `${step++}:  ${stepText}`).join('.<br>');
        }
        function formatSteps(text) {
            let step = 1;
            return text.split('. ').map((stepText) => `Step ${step++}: ${stepText}`).join('.<br>');
        }
          
          const recipeSection = document.getElementById('recipe-section');
          recipeSection.style.padding = "10px"
          recipeSection.innerHTML = `
            <h2>${recipeData.title}</h2>
            <img src="${recipeData.image}" alt="${recipeData.title}" width="200">
            <p>Ready in ${recipeData.readyInMinutes} minutes</p>
            <p>Servings: ${recipeData.servings}</p>
            <div class="recipe-tab">
                <div id="ingredients" class="tab-content">
                    <h3>INGREDIENTS</h3>
                    <p>${formatList(recipeData.ingredients)}</p>
                </div>
                <div id="steps" class "tab-content">
                    <h3>STEPS</h3>
                    <p>${formatSteps(recipeData.steps)}</p>
                </div>
            </div>
          `;
    }
    const recipeBtn = document.querySelectorAll('.get-recipe-btn');
    recipeBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const attributeValue = e.target.getAttribute('data-meal-id');
            if (attributeValue) {
                const generatedRecipe = recipes.filter(item => item.id == attributeValue);
                displayRecipe(generatedRecipe[0]);
            }
            window.scrollBy(0, 500);
        });
    });
}
renderRecipe();

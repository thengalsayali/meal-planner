document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const diet = params.get("diet");
    const calories = params.get("calories");
    const protein = params.get("protein");
    const fat = params.get("fat");
    const carbs = params.get("carbs");

    const mealPlanDiv = document.getElementById("mealPlan");
    mealPlanDiv.innerHTML = "<p>Loading...</p>"; // Show loading state

    try {
        // Use the provided Edamam application ID, key, and user ID
        const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${diet}&app_id=09a7b713&app_key=0d95207cc1f53064317c67f5dc1a6e6a&calories=${calories}`, {
            headers: {
                'Edamam-Account-User': 'sayali03'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch meal plan: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();

        if (!data.hits) {
            mealPlanDiv.innerHTML = "No meals found for this category.";
            return;
        }

        let mealHTML = `<h2>Day 1</h2><h3>Recommended Meals</h3>`;
        
        const mealTypes = ["Breakfast", "Lunch", "Snacks", "Dinner"];
        mealTypes.forEach((mealType, index) => {
            const meal = data.hits[index].recipe;
            mealHTML += `
                <div class='meal'>
                    <h3>${mealType}: ${meal.label}</h3>
                    <img src="${meal.image}" width="100" />
                    <p><strong>Calories:</strong> ${meal.calories.toFixed(2)}</p>
                    <p><strong>Protein:</strong> ${meal.totalNutrients.PROCNT.quantity.toFixed(2)}g</p>
                    <p><strong>Fat:</strong> ${meal.totalNutrients.FAT.quantity.toFixed(2)}g</p>
                    <p><strong>Carbs:</strong> ${meal.totalNutrients.CHOCDF.quantity.toFixed(2)}g</p>
                    <a href="${meal.url}" target="_blank">View Recipe</a>
                </div>`;
        });

        mealPlanDiv.innerHTML = mealHTML;
    } catch (error) {
        mealPlanDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
        console.error(error);
    }
});

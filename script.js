document.getElementById("generateButton").addEventListener("click", generateMealPlan);

async function generateMealPlan() {
    const diet = document.getElementById("diet").value;
    const calories = document.getElementById("calories").value;
    const protein = document.getElementById("protein").value;
    const fat = document.getElementById("fat").value;
    const carbs = document.getElementById("carbs").value;

    if (!calories || !protein || !fat || !carbs) {
        document.getElementById("mealPlan").innerHTML = "Please fill in all fields.";
        return;
    }

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
            document.getElementById("mealPlan").innerHTML = "No meals found for this category.";
            return;
        }

        let mealHTML = `<h2>Day 1</h2><h3>Recommended Meals</h3>`;
        
        data.hits.forEach(hit => {
            const meal = hit.recipe;
            mealHTML += `
                <div class='meal'>
                    <h3>${meal.label}</h3>
                    <img src="${meal.image}" width="100" />
                    <p><strong>Calories:</strong> ${meal.calories.toFixed(2)}</p>
                    <p><strong>Protein:</strong> ${meal.totalNutrients.PROCNT.quantity.toFixed(2)}g</p>
                    <p><strong>Fat:</strong> ${meal.totalNutrients.FAT.quantity.toFixed(2)}g</p>
                    <p><strong>Carbs:</strong> ${meal.totalNutrients.CHOCDF.quantity.toFixed(2)}g</p>
                    <a href="${meal.url}" target="_blank">View Recipe</a>
                </div>`;
        });

        document.getElementById("mealPlan").innerHTML = mealHTML;
    } catch (error) {
        document.getElementById("mealPlan").innerHTML = `Error fetching meal plan: ${error.message}`;
        console.error(error);
    }
}

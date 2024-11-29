class MealPlanner {
    constructor() {
        this.includedIngredients = [];
        this.excludedIngredients = [];
        this.initEventListeners();
    }

    initEventListeners() {
        const form = document.getElementById('mealPlannerForm');
        const includeIngredientInput = document.getElementById('includeIngredients');
        const excludeIngredientInput = document.getElementById('excludeIngredients');
        const includedContainer = document.getElementById('includedIngredients');
        const excludedContainer = document.getElementById('excludedIngredients');

        this.setupIngredientManagement(
            includeIngredientInput, 
            includedContainer, 
            this.includedIngredients
        );

        this.setupIngredientManagement(
            excludeIngredientInput, 
            excludedContainer, 
            this.excludedIngredients
        );

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateMealPlan();
        });
    }

    setupIngredientManagement(input, container, ingredientList) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const ingredient = input.value.trim();
                if (ingredient && !ingredientList.includes(ingredient)) {
                    ingredientList.push(ingredient);
                    this.renderIngredientTags(container, ingredientList);
                    input.value = '';
                }
            }
        });

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-ingredient')) {
                const ingredientToRemove = e.target.parentElement.dataset.ingredient;
                const index = ingredientList.indexOf(ingredientToRemove);
                if (index > -1) {
                    ingredientList.splice(index, 1);
                    this.renderIngredientTags(container, ingredientList);
                }
            }
        });
    }

    renderIngredientTags(container, ingredientList) {
        container.innerHTML = ingredientList.map(ingredient => `
            <div class="ingredient-tag" data-ingredient="${ingredient}">
                ${ingredient}
                <button class="remove-ingredient">✕</button>
            </div>
        `).join('');
    }

    async generateMealPlan() {
        const userName = document.getElementById('userName').value;
        const dietPreferences = Array.from(
            document.getElementById('dietPreferences').selectedOptions
        ).map(option => option.value);
        const caloricGoal = document.getElementById('caloricGoal').value || 2000;
        const mealsPerDay = document.getElementById('mealsPerDay').value;

        try {
            // Mock data for demonstration
            const weeklyMealPlan = this.generateMockMealPlan({
                userName,
                dietPreferences,
                caloricGoal,
                includedIngredients: this.includedIngredients,
                excludedIngredients: this.excludedIngredients,
                mealsPerDay
            });

            this.displayMealPlan(weeklyMealPlan);
            this.displayNutritionalBreakdown(weeklyMealPlan);
            this.generateShoppingList(weeklyMealPlan);
        } catch (error) {
            console.error('Meal plan generation failed:', error);
            this.displayError(error);
        }
    }

    generateMockMealPlan(preferences) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

        return {
            days: days.map(day => ({
                day: day,
                meals: mealTypes.map(type => ({
                    type: type,
                    name: this.generateMockRecipeName(preferences.dietPreferences),
                    calories: Math.floor(preferences.caloricGoal / 3),
                    protein: 20,
                    carbs: 30,
                    fat: 15
                }))
            }))
        };
    }

    generateMockRecipeName(dietPreferences) {
        const prefixMap = {
            vegan: ['Vegan', 'Plant-Based'],
            keto: ['Keto-Friendly', 'Low-Carb'],
            'low-carb': ['Light', 'Lean'],
            'high-protein': ['Protein-Packed', 'Muscle-Building']
        };

        const ingredients = [
            'Chicken', 'Salmon', 'Tofu', 'Quinoa', 
            'Salad', 'Bowl', 'Wrap', 'Stir-Fry'
        ];

        const prefix = dietPreferences.length > 0 
            ? prefixMap[dietPreferences[0]][0] || '' 
            : '';

        const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];

        return `${prefix} ${ingredient} Delight`;
    }

    displayMealPlan(mealPlan) {
        const container = document.getElementById('weeklyMealPlan');
        container.innerHTML = mealPlan.days.map(day => `
            <div class="meal-day">
                <h3>${day.day}</h3>
                ${day.meals.map(meal => `
                    <div class="recipe-card">
                        <h4>${meal.type}: ${meal.name}</h4>
                        <p>Calories: ${meal.calories}</p>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    displayNutritionalBreakdown(mealPlan) {
        // Placeholder for nutritional breakdown
        console.log('Nutritional Breakdown:', mealPlan);
    }

    generateShoppingList(mealPlan) {
        // Placeholder for shopping list generation
        console.log('Shopping List:', mealPlan);
    }

    displayError(error) {
        const container = document.getElementById('weeklyMealPlan');
        container.innerHTML = `
            <div class="error-message">
                <h3>Meal Plan Generation Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Get the dietary preferences dropdown element
const dietPreferencesDropdown = document.getElementById('dietPreferences');

// Add event listener to close the dropdown after selection
dietPreferencesDropdown.addEventListener('change', () => {
    dietPreferencesDropdown.blur();
});

document.addEventListener('DOMContentLoaded', () => {
    new MealPlanner();
});
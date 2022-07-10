let searchBarRef
let favoritesRef
let recipesRef
let toastRef
let instructionsRef
let ingredientsRef
let measurementsRef

const favoriteMeals = []
const INGREDIENT_ROUTE = "https://www.themealdb.com/api/json/v1/1/filter.php?i="
const LOOKUP_ROUTE = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="

window.onload = async () =>{
    searchBarRef = document.getElementById('filter')
    favoritesRef = document.getElementById('favorites')
    recipesRef = document.getElementById('recipes')
    toastRef = document.getElementById('toast')
    instructionsRef = document.getElementById('instructions')
    ingredientsRef = document.getElementById('ingredients')
    measurementsRef = document.getElementById('measurements')

    checkForFavorites()
}

const checkForFavorites = () =>{
    const favoritesJSON = localStorage.getItem('favorites')
    if(!favoritesJSON){
        return
    }
    for(const meal of JSON.parse(favoritesJSON)){
        addToFavorites([meal.meal])
    }
    favoritesRef.classList.remove('hidden')
}

const search = () =>{
    removeMealsFromDOM()
    const searchValue = searchBarRef.value
    fetch(INGREDIENT_ROUTE + searchValue).then((res) =>
			res.json().then((data) => {
				if(!data.meals){
                    alert('Not found!')
                    return
                }
				addMealsToDom(data.meals);
			})
		);
}

const removeToastInfoFromDOM = () =>{
    for(const li of document.querySelectorAll('li')){
        li.remove()
    }   
}

const onRecipeClick = (e)=>{
    removeToastInfoFromDOM()
    const mealId = (e.explicitOriginalTarget.parentNode.id)
    fetch(LOOKUP_ROUTE + mealId).then((res) =>
			res.json().then((data) => showRecipe(data.meals))
		);
}

const showRecipe = (meals) =>{
    const [meal] = meals
    instructionsRef.innerText = meal.strInstructions
    for(let i = 0; i < 20; i++){
        if(!i || meal['strIngredient'+i] == ''){
            continue
        }
        const ingredientRef = document.createElement('li')
        ingredientRef.innerHTML = meal['strIngredient'+i]
        ingredientsRef.append(ingredientRef)
        
        const measurementRef = document.createElement('li')
        measurementRef.innerHTML = meal['strMeasure'+i]
        measurementsRef.append(measurementRef)
    }
    toastRef.classList.remove('hidden')
} 

const hideToast = () =>{
    toastRef.classList.add('hidden')
}

const entered = (e) =>{
    console.log(e.explicitOriginalTarget.parentNode.id)
}

const addMealsToDom = (meals)=>{
    for(const meal of meals){
        const recipeRef = document.createElement('div')
        recipeRef.classList.add('recipe')
        recipeRef.setAttribute('id',meal.idMeal)
        
        const recipeImageRef = document.createElement('img')
        recipeImageRef.classList.add('recipe-image')
        recipeImageRef.setAttribute('src', meal.strMealThumb)
        recipeImageRef.addEventListener('click',onRecipeClick)
        recipeRef.append(recipeImageRef)
        
        const recipeFooterRef = document.createElement('div')
        recipeFooterRef.classList.add('recipe-footer')
        const nameRef = document.createElement('span')
        nameRef.innerHTML = meal.strMeal
        recipeFooterRef.append(nameRef)
        const heartRef = document.createElement('img')
        heartRef.setAttribute('src', 'heart.png')
        heartRef.classList.add('cora')
        heartRef.addEventListener('click',onHeartClick)
        recipeFooterRef.append(heartRef)
        recipeRef.append(recipeFooterRef)

        recipesRef.append(recipeRef)
    }
    recipesRef.classList.remove('hidden')
}

const onHeartClick = (e) =>{
    favoritesRef.classList.remove('hidden')
    const mealId = (e.explicitOriginalTarget.parentElement.parentNode.id)
    const found = favoriteMeals.find(el=> el.id === mealId) 
    if(found){
        return
    }
    fetch(LOOKUP_ROUTE + mealId).then((res) =>
    res.json().then((data) => addToFavorites(data.meals))
    );
}

const addToFavorites = (meals) =>{
    const [meal] = meals
    favoriteMeals.push({
        id: meal.idMeal,
        meal: meal
    })
    localStorage.setItem('favorites', JSON.stringify(favoriteMeals))

    const storyRef = document.createElement('div')
    storyRef.classList.add('story')
    storyRef.setAttribute('id',meal.idMeal)
    
    const recipeImageRef = document.createElement('img')
    recipeImageRef.setAttribute('src', meal.strMealThumb)
    recipeImageRef.classList.add('circular-image')
    storyRef.append(recipeImageRef)
    
    recipeImageRef.addEventListener('click',findInFavorites)
    const nameRef = document.createElement('span')
    nameRef.innerHTML = meal.strMeal
    storyRef.append(nameRef)
    
    document.getElementById('choose').append(storyRef)
}

const findInFavorites = (e) =>{
    removeToastInfoFromDOM()
    const mealId = e.explicitOriginalTarget.parentNode.id
    const meal = favoriteMeals.find(el=> el.id === mealId) 
    showRecipe([meal.meal])
}

const removeMealsFromDOM = () =>{
    for(const meal of document.querySelectorAll('.recipe')){
        meal.remove()
    }
}
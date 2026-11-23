
       $(document).ready(function() {

    // RESOURCE PAGE BUTTON
    $("#resource-page").click(function() {
        window.location.href = "https://basicneeds.ucsc.edu/";
    });


    // FOOD PAGE BUTTON
    $("#to-food-page").click(function() {
        $("#main-page").hide();
        $("#drinks-page").hide();
        $("#food-page").show();
    });


    // DRINKS PAGE BUTTON
    $("#to-drinks-page").click(function() {
        $("#main-page").hide();
        $("#food-page").hide();
        $("#drinks-page").show();
    });


    // BACK TO MAIN BUTTON
    $(".back-btn").click(function() {
        $("#food-page").hide();
        $("#drinks-page").hide();
        $("#main-page").show();
    });


    // FOOD RECIPES
    const foods = {
        bagel: {
            
            ingredients: ["Cream Cheese", "Butter", "Bagel"]
        },
        sandwich: {
           
            ingredients: ["Bread", "Cheese", "Lettuce", "Tomato"]
        },
        cookie: {
            
            ingredients: ["Flour", "Sugar", "Chocolate Chips"]
        },
        brownie: {
            
            ingredients: ["Flour", "Sugar", "Chocolate"]
        },
      
        
    };


    // DRINK RECIPES
    const drinks = {
        coffee: {
          
            ingredients: ["Coffee", "Water"]
        },
        latte: {
            
            ingredients: ["Espresso", "Milk"]
        },
        tea: {
          
            ingredients: ["Tea", "Water"]
        },
        lemonade: {
           
            ingredients: ["Lemon", "Water", "Sugar"]
        }
    };


    // ALL AVAILABLE INGREDIENTS
    const foodIngredients = [
        "Cream Cheese", "Butter", "Jam",
        "Peanut Butter", "Nutella", "Bread",
        "Cheese", "Lettuce", "Tomato",
        "Flour", "Sugar", "Chocolate Chips",
         "Bagel", "chocolate"
    ];

    const drinkIngredients = [
        "Coffee", "Water", "Espresso",
        "Milk", "Tea", "Lemon",
        "Sugar", "Ice", "Honey"
    ];


    // CURRENT RECIPE AND INGREDIENTS
    let currentFood = "";
    let currentDrink = "";
    let addedFood = [];
    let addedDrink = [];


    // DISPLAY INGREDIENT BUTTONS
    function showIngredients(type) {

        let ingredients;
        let container;

        if (type === "food") {
            ingredients = foodIngredients;
            container = $("#food-ingredients");
        } else {
            ingredients = drinkIngredients;
            container = $("#drink-ingredients");
        }

        container.empty();

        ingredients.forEach(function(ingredient) {

            let button = $("<button>")
                .addClass("ingredient")
                .text(ingredient)
                .attr("draggable", true)
                .attr("data-ingredient", ingredient);

            container.append(button);

        });
    }


    // CHOOSE FOOD
    $(".food-choice").click(function() {

        currentFood = $(this).data("food");
        addedFood = [];

        $("#food-options").hide();
        $("#food-workspace").show();

        $("#selected-food").text(
            "Make a " + currentFood + "!"
        );

        showIngredients("food");
        updateTray("food");

    });


    // CHOOSE DRINK
    $(".drink-choice").click(function() {

        currentDrink = $(this).data("drink");
        addedDrink = [];

        $("#drink-options").hide();
        $("#drink-workspace").show();

        $("#selected-drink").text(
            "Make a " + currentDrink + "!"
        );

        showIngredients("drink");
        updateTray("drink");

    });


    // ADD INGREDIENT
    function addIngredient(type, ingredient) {

        if (type === "food") {
            if (!currentFood) return;
            addedFood.push(ingredient);
        } else {
            if (!currentDrink) return;
            addedDrink.push(ingredient);
        }

        updateTray(type);

    }


    // CLICK INGREDIENT TO ADD IT
    $(document).on("click", ".ingredient", function() {

        let ingredient = $(this).data("ingredient");

        let type = $(this).closest("#food-workspace").length
            ? "food"
            : "drink";

        addIngredient(type, ingredient);

    });


    // START DRAGGING INGREDIENT
    $(document).on("dragstart", ".ingredient", function(event) {

        let ingredient = $(this).data("ingredient");

        event.originalEvent.dataTransfer.setData(
            "text/plain",
            ingredient
        );

    });


    // ALLOW INGREDIENTS TO DROP ON TRAY
    $("#food-tray, #drink-tray").on("dragover", function(event) {

        event.preventDefault();

        $(this).addClass("drag-over");

    });


    // REMOVE DRAG HIGHLIGHT
    $("#food-tray, #drink-tray").on("dragleave", function() {

        $(this).removeClass("drag-over");

    });


    // DROP INGREDIENT INTO TRAY
    $("#food-tray, #drink-tray").on("drop", function(event) {

        event.preventDefault();

        $(this).removeClass("drag-over");

        let ingredient = event.originalEvent.dataTransfer.getData(
            "text/plain"
        );

        let type = this.id === "food-tray"
            ? "food"
            : "drink";

        if (ingredient) {
            addIngredient(type, ingredient);
        }

    });


    // UPDATE FOOD OR DRINK TRAY
    function updateTray(type) {

        let items;
        let display;
        let addedContainer;

        if (type === "food") {

            items = addedFood;

            display = foods[currentFood].emoji;

            addedContainer = $("#food-added-ingredients");

            $("#food-display").text(display);

            $("#food-feedback").text("");

        } else {

            items = addedDrink;

            display = drinks[currentDrink].emoji;

            addedContainer = $("#drink-added-ingredients");

            $("#drink-display").text(display);

            $("#drink-feedback").text("");

        }

        addedContainer.empty();

        items.forEach(function(ingredient, index) {

            let item = $("<span>")
                .addClass("added-item")
                .text(ingredient + " ");

            let removeButton = $("<button>")
                .addClass("remove-ingredient")
                .text("×")
                .attr("type", "button");

            removeButton.click(function() {

                items.splice(index, 1);

                updateTray(type);

            });

            item.append(removeButton);
            addedContainer.append(item);

        });

    }


    // CHECK IF RECIPE IS CORRECT
    function checkRecipe(type) {

        let recipe;
        let selected;
        let feedback;

        if (type === "food") {

            if (!currentFood) return;

            recipe = foods[currentFood].ingredients;
            selected = addedFood;
            feedback = $("#food-feedback");

        } else {

            if (!currentDrink) return;

            recipe = drinks[currentDrink].ingredients;
            selected = addedDrink;
            feedback = $("#drink-feedback");

        }

        // Compare ingredients regardless of order
        let correct = recipe.length === selected.length &&
            [...recipe].sort().join(",") ===
            [...selected].sort().join(",");

        if (correct) {

            feedback
                .text("Correct! You made the recipe! 🎉")
                .removeClass("error")
                .addClass("success");

        } else {

            feedback
                .text("Incorrect recipe! Try again!")
                .removeClass("success")
                .addClass("error");

        }

    }


    // CHECK FOOD
    $("#check-food").click(function() {
        checkRecipe("food");
    });


    // CHECK DRINK
    $("#check-drink").click(function() {
        checkRecipe("drink");
    });


    // RESET FOOD
    $("#reset-food").click(function() {

        addedFood = [];

        if (currentFood) {
            updateTray("food");
        }

    });


    // RESET DRINK
    $("#reset-drink").click(function() {

        addedDrink = [];

        if (currentDrink) {
            updateTray("drink");
        }

    });


    // CHOOSE ANOTHER FOOD
    $("#back-to-food").click(function() {

        $("#food-workspace").hide();
        $("#food-options").show();

        currentFood = "";
        addedFood = [];

    });


    // CHOOSE ANOTHER DRINK
    $("#back-to-drinks").click(function() {

        $("#drink-workspace").hide();
        $("#drink-options").show();

        currentDrink = "";
        addedDrink = [];

    });

});
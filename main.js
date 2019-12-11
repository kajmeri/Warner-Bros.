var baseURL = 'https://www.thecocktaildb.com/api/json/v2/'
var apiKey = '9973533'
var url = baseURL + apiKey + '/'

var queryUrl = ''
var data
var randomNumber
var whiskeyData

window.onload = function () {
    //default to old-fashioned when page is loaded
    this.getDrinkByID(11001)
}

function getRandomNumber(length) {
    //generate number to randomly show a specific drink
    if (length) {
        randomNumber = this.Math.floor((Math.random() * length))
    } else {
        randomNumber = 1
    }
}

function generateRandomDrink(type) {
    if (!type) {
        queryUrl = url + 'random.php'
        runQuery()
    } else {
        switch (type) {
            case 'Whiskey':
                let number = this.Math.floor((Math.random() * 2))
                if (number == 1) {
                    getRandomDrinkOfType('bourbon')
                } else {
                    getRandomDrinkOfType('scotch')
                }
                break
            case 'Gin':
                getRandomDrinkOfType(type)
                break
            case 'Vodka':
                getRandomDrinkOfType(type)
                break
            case 'Rum':
                getRandomDrinkOfType(type)
                break
            case 'Tequila':
                getRandomDrinkOfType(type)
                break
            case 'Non_Alcoholic':
                getRandomDrinkOfType(type)
                break
        }
    }
}

function search() {
    var parameter = document.getElementById("dropdown").value
    var value = document.getElementById("value").value
    document.getElementById("drinksList").innerHTML = ''

    if (parameter == 'drinkName') {
        queryUrl = url + 'search.php?s=' + value
    } else {
        queryUrl = url + 'filter.php?i=' + value
    }

    fetch(queryUrl)
        .then((response) => response.json())
        .then(json => {
            json = JSON.stringify(json)
            data = JSON.parse(json)

            if (data.drinks == 'None Found' || data.drinks == undefined || !data.drinks) {
                var node = document.createElement("li")
                var textnode = document.createTextNode("No results found.")
                node.appendChild(textnode)
                document.getElementById("drinksList").appendChild(node)
            } else {
                for (var i = 0; i < data.drinks.length; i++) {
                    var nodeList = document.createElement("li")
                    var node = document.createElement("button")
                    nodeList.appendChild(node)
                    var textnode = document.createTextNode(data.drinks[i].strDrink)
                    node.setAttribute("id", "resultsButtons")
                    node.setAttribute("value", data.drinks[i].idDrink)
                    node.setAttribute("onclick", "getDrinkByID(value)")
                    node.appendChild(textnode)
                    document.getElementById("drinksList").appendChild(node)
                }
            }

        }).catch(function (err) {
            console.log(err)
        })
}

function getRandomDrinkOfType(type) {
    if (type == 'Non_Alcoholic') {
        queryUrl = url + 'filter.php?a=' + type
    } else {
        queryUrl = url + 'filter.php?i=' + type
    }

    fetch(queryUrl)
        .then((response) => response.json())
        .then(json => {
            json = JSON.stringify(json)
            data = JSON.parse(json)
            getRandomNumber(data.drinks.length)
            getDrinkByID(data.drinks[randomNumber].idDrink)
        }).catch(function (err) {
            console.log(err)
        })
}

function getDrinkByID(id) {
    queryUrl = url + 'lookup.php?i=' + id
    runQuery()
}

function runQuery() {
    reset()

    //api call to the cocktails database
    fetch(queryUrl)
        .then((response) => response.json())
        .then(json => {
            json = JSON.stringify(json)
            data = JSON.parse(json)
            data = data.drinks[0]
            updateUI()
        }).catch(function (err) {
            console.log(err)
        })
}

function reset() {
    //reset ingredients list
    document.getElementById("ingredients").innerHTML = ''
    document.getElementById("instructions").innerHTML = ''
}

function updateUI() {
    //view drink information
    document.getElementById('image').src = data.strDrinkThumb
    document.getElementById('drinkName').innerHTML = data.strDrink
    document.getElementById('instructions').innerHTML = data.strInstructions

    //get ingredients and measurements
    var ingredients = []
    var measurements = []

    for (var i = 1; i < 15; i++) {
        var ingredientKey = "strIngredient" + i
        var measurementKey = "strMeasure" + i
        for (let key in data) {
            if ((key === ingredientKey) && data[key]) {
                ingredients.push(data[key])
            } else if ((key === measurementKey) && data[key]) {
                measurements.push(data[key])
            }
        }
    }

    //add list element for each ingredient and measurement
    for (var i = 0; i < ingredients.length; i++) {
        var node = document.createElement("li")
        var textnode = document.createTextNode((measurements[i] || '') + ' ' + ingredients[i])
        node.appendChild(textnode);
        document.getElementById("ingredients").appendChild(node);
    }
}
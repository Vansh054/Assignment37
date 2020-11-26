var dog, dog2;
var database;
var addFood,addFoods;
var feed, feedDog;
var feedTime,lastFed;
var foodStock, foodObj;
var readState;
var bedroomImage,gardenImage,washroomImage;
var gameState;

function preload()
{
  dog1 = loadImage("dogimg.png")
  dog2 = loadImage("dogimg1.png")
  bedroomImage = loadImage("BedRoom.png")
  gardenImage = loadImage("Garden.png")
  washroomImage = loadImage("WashRoom.png")
}

function setup() {
  createCanvas(400, 500);
  database = firebase.database();
  dog = createSprite(200,400)
  dog.addImage(dog1)
  dog.scale = 0.15

  foodObj = new Food();

  addFood = createButton("Add Food")
  addFood.position(275,50)
  addFood.mousePressed(addFoods)

  feed = createButton("Feed the dog")
  feed.position(175,50)
  feed.mousePressed(feedDog)
  

}

function draw() {  
  background(46,139,87)
  drawSprites();
  foodObj.getFoodStock();
  foodObj.foodS = foodStock;
  foodObj.display();

  var feedTime = database.ref('feedTime')
    feedTime.on("value",function(data){
        lastFed = data.val();
    })

  var readState = database.ref('gameState')
    readState.on("value",function(data){
        gameState = data.val();
    })

  
  fill("white")
  textSize(13)
  if (lastFed > 12)
  {
    text("Last Feed : " + lastFed % 12 + " PM",50,65)
  }
  else if (lastFed == 0)
  {
    text("Last Feed : 12 PM",50,65)
  } else {
    text("Last Feed : "+ lastFed + " AM",50,65)
  }

  currentTime = hour();
  if (currentTime==(lastFed+1)){
    updateState("PLAYING")
    foodObj.garden();
    
  } else if (currentTime==(lastFed+2)){
    updateState("SLEEPING")
    foodObj.bedroom();
  } else if (currentTime > (lastFed+2) && currentTime <= (lastFed+4)){
    updateState("BATHING")
    foodObj.washroom();
  } else {
    updateState("HUNGRY")
    foodObj.display();
  }
  console.log(gameState)

  if (gameState !="HUNGRY"){
    feed.hide();
    addFood.hide(); 
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(dog1);
  }
  
}

function addFoods(){
  foodStock++;
  
  database.ref('/').update({
    'food':foodStock
  })

}
 
function feedDog(){
    dog.addImage(dog2)

    if (foodStock != 0)
    {
    foodStock--;
    }

    database.ref('/').update({
      'food':foodStock,
      'feedTime':hour()
    })
  
}

function updateState(state){
  database.ref('/').update({
    'gameState':state
  })
}

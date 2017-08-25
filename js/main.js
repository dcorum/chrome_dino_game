console.log("we're good");
 //make Golbal variables
var score=0;
var highScore=localStorage.getItem("highScore");
var hasRan=false;
var $cacti=$('<div>');
var rand;
var timeout;
//Assign variables to the dino
var $dino = $('#dino');

//put in the high score
$('.highScore').val(highScore);

//function to get distance between cactus and dino
function getDistance(x1, y1, x2, y2){
  let xDistance = x2-x1+0.01;
  let yDistance = y1-y2;
  return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
}

//function to get random number between 1 and 3
function random(level){
  if(level===1){
    return (Math.random()*2)+1;
  }
  if(level===2){
    return (Math.random()*1.5)+1;
  }
  if(level===3){
    return (Math.random()*1)+0.1;
  }
  else{
    return;
  }
}
//function to hide instructions
function hidePopup(){
  $(".popup").css("display","none");
  $("main").css("opacity","1");
}

//listener for the spacebar down, makes dino jump and starts the game
$('body').on('keypress',function(e){

  $('#dino').css("animation","none");

      if (e.keyCode === 32) {
         console.log("hit");
         $('#dino').css("animation","jump .6s");

         //this only runs once per gaame, contains all functionality
         if(hasRan===false){

           //disable the instructions button to prevent accidental clicking
           $('.instructButton').prop('disabled',true);

           //make sure instructions are hidden
           hidePopup();


         //Set DINO TO RUN
           setInterval(function(){
             $dino.removeClass("rightFoot");
             $dino.addClass("leftFoot");
             setTimeout(function(){
               $dino.removeClass("leftFoot");
               $dino.addClass("rightFoot");
             }, 200);
           }, 400);
           $('img').hide();

           $dino.css("display","flex");


           //START THE cacti and remove old cacti
           (function loop() {
               timeout = setTimeout(function() {
                 //do stuff
                 var obsticles = ["multi","cacti","bird"]

                 if(score/10<10.3){
                   rand = random(1);
                   $cacti = $('<div class="canvas ' +  obsticles[Math.floor(Math.random()*obsticles.length)] + ' cactis"></div>');
                 }

                 else if(score/10>10.3&&score/10<20){
                   rand = random(2);
                   $cacti = $('<div class="canvas ' +  obsticles[Math.floor(Math.random()*obsticles.length)] + ' cacti-faster"></div>');
                 }

                 else{
                   rand = random(3);
                   $cacti = $('<div class="canvas ' +  obsticles[Math.floor(Math.random()*obsticles.length)] + ' cacti-faster-faster"></div>');
                 }

                 $cacti.appendTo($('section'));
                 $cacti.css("display","flex");
                       console.log(rand);
                       loop();
               }, rand*1000);

           }());

           //interval that runs ever tenth of a second, to check for collision
           var timer = setInterval(function(){
             //get the distance between each obsticle and the dino
             var distance1 = getDistance($dino.position().left, $dino.position().top, $cacti.position().left, $cacti.position().top);
             var distance2 = getDistance($dino.position().left, $dino.position().top, $cacti.prev().position().left, $cacti.prev().position().top);
             var distance3 = getDistance($dino.position().left, $dino.position().top, $cacti.prev().prev().position().left, $cacti.prev().prev().position().top);
             var distance4 = getDistance($dino.position().left, $dino.position().top, $cacti.prev().prev().prev().position().left, $cacti.prev().prev().position().top);

           //records the current score in real time
             score++;
             $('.score').val(score/10);

             //Baseline distance to evaluate collision using the distance variables
               if(distance1<70||distance2<70||distance3<70||distance4<70){
                 console.log("COLLISION");
                 $('.multi').css("animation","none");
                 $('.cacti').css("animation","none");
                 $('.bird').css("animation","none");
                 clearInterval(timer);

                 //Save HighScore and refresh page
                 if(score/10>highScore){
                   highScore = score/10;
                   $('.highScore').val(highScore);
                   localStorage.setItem('highScore', highScore);

                   $(".winner").text("You beat the high score! Your score is " + score/10 +"! Click Here to restart!");
                   $('main').css("opacity",".3");
                   $(".winner").css("display","flex");
                   clearInterval(timer);
                   clearTimeout(timeout);
                   $dino.css("display","none");
                   $('img').show();
                   $("body").on('click',function(){
                     location.reload();
                   });

                 }
                 else{
                   $(".loser").text("You lost! Your score is " + score/10 +"! Click Here to restart!");
                   $('main').css("opacity",".3");
                   $(".loser").css("display","flex");
                   clearInterval(timer);
                   clearTimeout(timeout);
                   $dino.css("display","none");
                   $('img').show();
                   $("body").on('click',function(){
                     location.reload();
                   });
                 }
               }
           }, 100);

           hasRan=true;
         }

       }
});

//listener for spacebar up, brings dino down
$('body').on('keyup',function(e){
  if (e.keyCode === 32) {
    console.log("up");
    $('#dino').css("animation","none");
  }
});

//A couple handlers to show and hide the instructions
$('.instructButton').on('click',function(){
  $('main').css("opacity",".3");
  $(".instructions").css("display","flex");
});

$('.instructions').on('click',function(){
  hidePopup();
});

/*
Creative Programming II

Randiel Zoquier

idea 1

sliding vertical slices that shift with mouse position and color changes
(perhaps other motion elements)
*/

//pallette
//green = "#73C7A8" = (115, 199, 168)
// pink = "#EE4196" = (238, 65, 150)
// yellow = "#FFCD23" = (255, 205, 35)
// lightBlue = "#5CB4E5" = (92, 180, 229)
// darkBlue = "#131A3F" = (19, 26, 63)
// orange = (255, 199, 69)

var columns;
var sliceNumber = 16;
var Futura;
var slidingWeight;
var sliceSelected;
var wavArray;

function preload(){
  Futura = loadFont("assets/Futura.ttf");
  soundFormats('mp3');
  sample = loadSound("assets/sample2.mp3");
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  var top = createGraphics(width, height);
  top.textFont(Futura);
  top.textSize(width * 0.3);
  top.textAlign(CENTER, CENTER);
  top.noStroke();
  top.fill("#EE4196");
  top.text("Ableton", width / 2, height /2);

  var clear = createGraphics(width, height);
  clear.textFont(Futura);
  clear.textSize(width * 0.3);
  clear.textAlign(CENTER, CENTER);
  clear.noStroke();
  clear.fill(238, 65, 150, 175);
  clear.text("Ableton", width / 2, height /2);

  columns = [];
  for(var i = 0; i < top.width; i+= width / sliceNumber){

    let column = new Slice(i, width / sliceNumber, top, clear);
    columns.push(column);
  }

  slidingWeight = [];

  for(var s = 0; s < sliceNumber; s++){
    slidingWeight.push(random(0.1, 0.9));
  }

  wavArray = sample.getPeaks(width);

}


function draw() {
  background("#131A3F");

  rectMode(CORNER);
  randomSeed(0);
  //intro section
  if(millis() < 2  * 1000){

    for(var rects = 0; rects < sliceNumber; rects++){
      noStroke();

      if(rects % 2 == 0){
        var offset1 = map2(millis(), 0, 2 * 1000, height / 2 - random(0, height/ 2), height, SINUSOIDAL, OUT);
        fill("#FFCD23");
        rect(rects * width / sliceNumber, 0, width / sliceNumber , offset1);
        columns[rects].display(height -offset1);
      }else{
        var offset2 = map2(millis(), 0, 2 * 1000, height / 2 + random(0, height/ 2), 0, SINUSOIDAL, OUT);
        fill("#FFCD23");
        rect(rects * width / sliceNumber, offset2, width / sliceNumber, height);
        columns[rects].display(offset2);
      }

      //text
    }
  }else{
    //interactive parts
      var sliding = 0;


    //create the sliding offset
    if(millis() > 5 * 1000) {
      sliding = map2(millis(), 5 * 1000,10 * 1000, 0, height * 0.022, SINUSOIDAL, BOTH);
    }else{
      sliding = 0;
    }



    rectMode(CORNER);
    //slices
    for(var rects = 0; rects < sliceNumber; rects ++){

      noStroke();
      if(mouseX >= rects * (width/ sliceNumber) && mouseX <= (rects+ 1) *(width/ sliceNumber)){

        sliceSelected = rects;

        if(rects % 2 == 0){
          var budge = map2(mouseY, height *0.9, height *0.1, height * 0.15, height * 0.0001, SINUSOIDAL, OUT);

          if(sample.isPlaying()){
            fill(255);
          }else{
            fill(115, 199, 168);
          }


          rect(rects * width / sliceNumber, budge *2, width / sliceNumber , height);

          //waveform
            for(var w = rects * (width/ sliceNumber); w < (rects+ 1) *(width/ sliceNumber); w++){
                rectMode(CENTER);
                fill(19, 26, 63, 150);
                rect(w, height/2, 1, wavArray[int(w)] * height * 2.5);
            }
            columns[rects].display2(budge);

        }else{
          var budge = map2(mouseY, height *0.1, height *0.9, height * 0.15, height * 0.0001, SINUSOIDAL, OUT);

          if(sample.isPlaying()){
            fill(255);
          }else{
            fill(92, 180, 229);
          }

          rect(rects * width / sliceNumber, -budge * 2, width / sliceNumber , height);


          //waveform
            for(var w = rects * (width/ sliceNumber); w < (rects+ 1) *(width/ sliceNumber); w++){
                rectMode(CENTER);
                fill(19, 26, 63, 150);
                rect(w, height/2, 1, wavArray[int(w)] * height * 2.5);
            }
          columns[rects].display2(-budge);
        }
      }else{
        fill("#FFCD23");
        rectMode(CORNER);
        if(rects % 2 == 0){
          rect(rects * width / sliceNumber, 0 + (sliding * slidingWeight[rects]), width / sliceNumber , height);
          columns[rects].display(0 + (sliding * slidingWeight[rects]));
        }else{
          rect(rects * width / sliceNumber, 0 - (sliding * slidingWeight[rects]), width / sliceNumber , height);
          columns[rects].display(0 - (sliding * slidingWeight[rects]));
        }

      }

    }
  }


}

function windowResized(){
  setup();
}

function mouseClicked(){

  var audioStart = (sample.duration() / 16) * sliceSelected;
  sample.play(0, 1, 0.8, audioStart, (sample.duration() / 16));
  print(sliceSelected * (width/ sliceNumber));
}


class Slice{
  constructor(x, w, screen1, screen2){
    this.x = x;

    //create an image slice
    this.img = createImage(int(w), height);
    this.img.copy(screen1, x, 0, w, height, 0,0, w, height);

    this.img2 = createImage(int(w), height);
    this.img2.copy(screen2, x, 0, w, height, 0,0, w, height);
  }

  display(y){
    push();
      rectMode(CORNER);
      translate(this.x, y);
      image(this.img, 0, 0);
    pop();
  }

  display2(y){
    push();
      // rectMode(CENTER);
      translate(this.x, y);
      image(this.img2, 0, 0);
    pop();
  }
}

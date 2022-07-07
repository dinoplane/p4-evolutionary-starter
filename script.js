/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */
function prandomHash(i, min, max){
  randomSeed(i*200);
  if (max == undefined){
    max = min;
    min = 0;
  }
    
  return random(1) * (max - min) + min;
}

function randomHash(i, min, max){
  return prandomHash(prandomHash(i, max+min), min, max);
}


function p4_inspirations() {
  return [
          {name:"apple" , assetUrl: "./assets/apple.jpg"},
          {name: "cherry", assetUrl: "./assets/cherry.jpg"},
          {name: "strawberry", assetUrl: "./assets/strawberry.jpg"},
          {name:"apple_color" , assetUrl: "./assets/apple_color.jpg"},
          {name: "cherry_color", assetUrl: "./assets/cherry_color.jpg"},
          {name: "strawberry_color", assetUrl: "./assets/strawberry_color.jpg"}

        ];
}

function p4_initialize(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  if (inspiration.name.indexOf("apple") != -1){
    return {type: "apple", r_range:{max: 100, min: 20}, opa_range:{min: 128, max: 255}, intervals: 5, 
            sample_x: [0, 1], sample_y:[0, 1], c_rangemin_c: 0, max_c: 10};    
  }

  if (inspiration.name.indexOf("cherry") != -1){
    return {type: "cherry", r_range:{max: 100, min: 20}, opa_range:{min: 128, max: 255}, intervals: 3, 
            sample_x: [0, 1], sample_y:[0, 1], c_rangemin_c: 0, max_c: 10};    
  }

  if (inspiration.name.indexOf("strawberry") != -1){
    return {type: "strawberry", r_range:{max: 100, min: 5}, opa_range:{min: 128, max: 255}, intervals: 4, 
            sample_x: [0, 1], sample_y:[0, 1], c_rangemin_c: 1, max_c: 10};    
  }
}

function p4_render(design, inspiration) {
  push();
  background(255);
  noStroke();
  
  scale(0.25);
  let iw = inspiration.image.width / design.intervals;
  let ih = inspiration.image.height / design.intervals;
  let [x, y] = [0,0];
  
  for (let i = 0; i < design.intervals; i++){
    //console.log(x);
    y = 0;
    for (let j = 0; j < design.intervals; j++){
      let k = floor(random(design.min_c, design.max_c+1));
      for (let n = 0; n < k; n++){
        let sx = random(x + design.sample_x[0] * iw, x + design.sample_x[1] * iw);
        let sy = random(y + design.sample_y[0] * ih, y + design.sample_x[1] * ih);
        
        let px_color = inspiration.image.get(sx, sy);
        //console.log(px_color)
        px_color[3] = random(design.min_opa, design.max_opa);
        fill(px_color);
        circle(random(x, x + iw), random(y, y + ih), random(design.min_r, design.max_r));
      }
      y += ih;
    }
    x += iw;
  }
  pop();
  //console.log(x, y)
}

// Yanked from Adam Smith's slides...
function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}


const MAX_R = {apple: 200, cherry: 100, strawberry: 50};
const MIN_R = {apple: 20, cherry: 10, strawberry: 5};

const MAX_C = {apple: 15, cherry: 5, strawberry: 10};
const MIN_C = {apple: 0, cherry: 1, strawberry: 1};

const INIT_INTERVALS = 8;



function p4_mutate(design, inspiration, rate) {
  //console.log(design.min_r, MIN_R[design.type], design.max_r, rate)
  design.min_r = mut(design.min_r, MIN_R[design.type], design.max_r, rate);
  design.max_r = mut(design.max_r, design.min_r, MAX_R[design.type], rate);
  
  design.min_opa = mut(design.min_opa, 0, design.max_opa, rate);
  design.max_opa = mut(design.max_opa, design.min_r, 255, rate);

  design.intervals =  floor(mut(design.intervals, 2, 20, rate));
  design.sample_x[0] = mut(design.sample_x[0], 0, design.sample_x[1], rate);
  design.sample_x[1] = mut(design.sample_x[1], design.sample_x[0], 1, rate);
  design.sample_x[0] = mut(design.sample_y[0], 0, design.sample_y[1], rate);
  design.sample_x[1] = mut(design.sample_y[1], design.sample_y[0], 1, rate);
  
  design.min_c = mut(design.min_c, MIN_C[design.type], design.max_c, rate);
  design.max_c = mut(design.max_c, design.min_c, MAX_C[design.type], rate);

}

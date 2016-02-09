
var particleSystem = [];
var attractors = [];

function setup() {
    
    var canvas = createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(30);
    
    colorMode(HSB, 360, 100, 100, 100);
    
    var at = new Attractor(createVector(width/2, height/2), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/2, height/1.01), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/2, height/90), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/4, height/90), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/4, height/1.01), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/4, height/2), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.25, height/2), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.25, height/1.01), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.25, height/90), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.1, height/2), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.1, height/1.01), 5, true);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.1, height/90), 5, true);
    attractors.push(at);
    
    
    var at = new Attractor(createVector(width/1.1, height/4), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/4, height/4), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.25, height/4), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/2, height/4), 5, false);
    attractors.push(at);
    
    
    var at = new Attractor(createVector(width/2, height/1.33), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.25, height/1.33), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/1.1, height/1.33), 5, false);
    attractors.push(at);
    
    var at = new Attractor(createVector(width/4, height/1.33), 5, false);
    attractors.push(at);
}

function draw(){
    
    background(250,100,20,10);
    
    blendMode(SCREEN);
    
    //background(0);
    
    for(var i = particleSystem.length-1; i>=0; i--){         
        var p = particleSystem[i];
                                                     
        if(p.areYouDeadYet()){
            particleSystem.splice(i, 1);
        }else{
            p.update();
            p.draw();
        }

    }
    
    if(mouseIsPressed){
        createMightyParticles();
    }
    
    attractors.forEach(function(at){
        at.update();
        at.draw();
        
    });
}


function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    
}

var Particle = function(pos, vel, hue){
    
    var pos = pos.copy();
    var vel = vel.copy();
    var acc = createVector(0, .25)
    var psize = random(3, 10);
    var initialLifeSpan = random(500, 500)
    this.lifeSpan = initialLifeSpan;
    this.hue = random(hue-15, hue+15);
    
    
    this.update = function(){
        
        this.lifeSpan--; //this.lifespan = this.lifespan - 1;
        

        
        attractors.forEach(function(A){
            var att = p5.Vector.sub(A.getPos(), pos); 
            var distanceSq = att.magSq();
            if(distanceSq >1){
                att.div(distanceSq*psize);
                att.mult(20*A.getStrength());
                if(A.areYouARepeller()){
                    att.mult(-1);
                }
                acc.add(att);
            }
        });
        
        vel.add(acc);
        vel.limit(5);
        pos.add(vel);
        acc.mult(0);
    }
    
    this.getPos = function(){
        return pos.copy();
    }    
    
    this.draw = function(){
        
        var transparency = map(this.lifeSpan, 0, initialLifeSpan, 0, 100);
        //stroke(this.hue, 100, 100, transparency);
        //line(pos.x, pos.y, pos.x-4*vel.x, pos.y-4*vel.y);
        noStroke();
        fill(this.hue, 40, 100, transparency);
        ellipse(pos.x, 
                pos.y,                                           
                psize, 
                psize);
    }
   
    this.areYouDeadYet = function(){
        return this.lifeSpan <= 0;
    }
    
    this.getSize = function(){
        return psize;
    }
}

function createMightyParticles(initialPos){
    
    var hue = random(210,250);
    
    for(var i=0; i<random(50, 100); i++){
        var pos;
        if (!initialPos){
            pos = createVector(mouseX, mouseY);
        }else{
            pos = initialPos.copy();
        }
        
        var vel = createVector(0, 1);
        vel.rotate(random(0, TWO_PI));
        //vel.mult(random(1, 2));

        var newBorn = new Particle(pos, vel, hue);
        particleSystem.push(newBorn); 
    }
}

function mouseClicked(){
    createMightyParticles();   
}

var Attractor = function(pos,s, brepeller){
    var pos = pos.copy();
    var strength = s;
    var repeller = brepeller;
    var initialX = pos.x;
    this.draw = function(){
        noStroke();
        fill(100, 100, 0, 0);
        ellipse(pos.x, pos.y, strength, strength);
    }
    
    this.update = function(){
        pos.x = initialX + map(noise(initialX+frameCount/25), 0, 1, -600, 600);
    }
    
    this.getStrength = function(){
        return strength;
    }
    this.getPos = function(){
        return pos.copy();
    }
    this.areYouARepeller = function(){
        return repeller;
    }
}


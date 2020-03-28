var rewardMultiplier = 20;

class Rocket
{
	constructor(dna) 
	{
		// Physics of rocket at current instance
		this.pos = createVector(startX, startY, startZ);
		this.vel = createVector();
		this.acc = createVector();

		// Checkes rocket has reached target
		this.completed = false;
		// Checks if rocket had crashed
		this.crashed = false;

		this.finishTime = 0;
	  
	    // Gives a rocket dna
		  if (dna)
		  {
			this.dna = dna;
		  }
		  else 
		  {
			this.dna = new DNA();
		  }
	  
	  this.fitness = 0;
	  this.distance = 0;
	}
	
	
  // Object can recieve force and add to acceleration
  applyForce(force) 
  {
    this.acc.add(force);
  }
  
  // Calulates fitness of rocket
  calcFitness(targetsManager)
  {
    // Takes distance to target
    this.distance = targetsManager.meanAvgDis(this.pos.x, this.pos.y, this.pos.z);

    // Maps range of fitness
    this.fitness = map(this.distance, 0, width, width, 0);
	
    // If rocket gets to target increase fitness of rocket
    if (this.completed) {
      this.fitness *= rewardMultiplier;
    }
    // If rocket does not get to target decrease fitness
    else if (this.crashed) {
      this.fitness /= rewardMultiplier;
    }
	this.fitness += (this.finishTime / rewardMultiplier);
  }
  
  // Updates state of rocket
  update(frameNubmer, frameRate, obsticleManager, targetsManager) 
  {
	  for(var step = 0; step < frameRate; step++)
	  {
		// Checks distance from rocket to target
		// If distance less than 10 pixels, then it has reached target
		if (!this.completed && targetsManager.hit(this)) {
		  this.completed = true;
		  this.finishTime = frameNubmer;
		  this.pos = targetsManager.copyBest(this.pos);
		  howManyWon++;
		}
		
		// Rocket hit the barrier
		if (!this.crashed && obsticleManager.hit(this)) {
		  this.crashed = true;
		  howManyCrashed++;
		  this.finishTime = frameNubmer;
		}
		
		// Rocket has hit left or right of window or Rocket has hit top or bottom of window
		else if (!this.crashed && (this.pos.x > width || this.pos.x < 0 ||
									this.pos.y > height || this.pos.y < 0 ||
									this.pos.z > zIndex || this.pos.z < 0)) {
		  this.crashed = true;
		  howManyCrashed++;
		  this.finishTime = frameNubmer;
		}
		
		//applies the random vectors defined in dna to consecutive frames of rocket
		this.applyForce(this.dna.genes[count]);
		// if rocket has not got to goal and not crashed then update physics engine
		if (!this.completed && !this.crashed) {
		  this.vel.add(this.acc);
		  this.pos.add(this.vel);
		  this.acc.mult(0);
		  this.vel.limit(4);
		}
	  }
  }
  
  // displays rocket to window
  show(targetsManager) 
  {
    //color customization of rockets
    noStroke();
	if(this.crashed)
	{
		fill(color(0, 0 ,255, 80));
	}
	else if(this.completed)
	{
		fill(color(200, 200, 200, 80));
	}
	else{
		var d = targetsManager.meanDis(this, startX, startY, startZ);
		fill(color(255*(d), 255*(1 - d) ,0, 90));
		
	}
    // push and pop allow's rotating and translation not to affect other objects
	push();
    //translate to the postion of rocket
    translate(this.pos.x, this.pos.y, this.pos.z);
    //rotatates to the angle the rocket is pointing
    rotateX(this.vel.x);
	rotateY(this.vel.y);
	rotateZ(this.vel.z);
	// print rocket 
    cone(5, 25);
    pop();
  }
}
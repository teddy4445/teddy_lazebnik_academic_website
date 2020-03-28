var ERROR_FACTOR = 1.5;

class Target
{
	constructor(x,y,z,w,h,d,shape)
	{
		// members // 
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.h = h;
		this.d = d;
		this.r = (this.w + this.h + this.d)/3;
		this.shape = shape;
	}
	
	// print the object to the screen
	show() 
	{
		fill(color(200,200,0,10));
		stroke(color(200,200,0,10));
		push();
		translate(this.x, this.y, this.z);
		if(this.shape == "box")
		{
			box(this.w, this.h, this.d);
		}
		else // if(this.shape == "sphere")
		{
			sphere(this.r, 10, 10);
		}
		pop();
	}
	
	// check if the rocket hit our target
	hit(rocket) 
	{
		// select target shape
		if(this.shape == "box")
		{
			// the place where this target is 
			if(rocket.pos.x > this.x && rocket.pos.x < this.x + this.w 
			&& rocket.pos.y > this.y && rocket.pos.y < this.y + this.h
			&& rocket.pos.z > this.z && rocket.pos.z < this.z + this.d)
			{
				return true;
			}
		}
		else // if(this.shape == "sphere")
		{
			// the place where this target is 
			if(dist(rocket.pos.x , rocket.pos.y, rocket.pos.z, this.x, this.y, this.z) <= ERROR_FACTOR * this.r)
			{
				return true;
			}
		}
		return false;
	}
}
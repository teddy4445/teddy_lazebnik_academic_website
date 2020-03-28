class Block
{		
	// Constructor function
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
	
	// displays block to window
	show(isWall) 
	{ 
		stroke(255);
		if(isWall)
		{
			fill(color(255,255,255,2));
			strokeWeight(1);
		}
		else{
			fill(color(255,255,255,75));
			strokeWeight(3);
		}
		push();
		translate(this.x, this.y, this.z);
		if(this.shape == "box")
		{
			box(this.w, this.h, this.d);
		}
		else // if(this.shape == "sphere")
		{
			sphere(this.r);
		}
		pop();
	}
	// check if rocket hit block
	hit(rocket) 
	{
		if(this.shape == "box")
		{
			if(rocket.pos.x > this.x - (this.w / 2) && rocket.pos.x < this.x + (this.w / 2)
			&& rocket.pos.y > this.y - (this.h / 2) && rocket.pos.y < this.y + (this.h / 2)
			&& rocket.pos.z > this.z - (this.d / 2) && rocket.pos.z < this.z + (this.d / 2))
			{
				return true;
			}
		}
		else // if(this.shape == "sphere")
		{
			if(dist(rocket.pos.x , rocket.pos.y, rocket.pos.z, this.x, this.y, this.z) <= this.r)
			{
				return true;
			}
		}
		return false;
	}
}
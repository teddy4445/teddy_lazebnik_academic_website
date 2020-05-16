// Dwitter Shim by Frank Force 2020
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

function u(t) { // dwitter code goes here

// https://www.dwitter.net/d/18610 - Blood Cavern
for(k=i=960;--i;x.fill(x.arc(k+i+S(m=i+t*k/4)*(r=(S(t+m/k)*.5+1.4)*1e5/i),540+C(m)*r,s=4e4/i,0,7,(m=i-t*k|0)%59||x.arc(k+i+S(m=m**5)*r/3,540+C(m)*r/2,s=r/9,0,7))))x.beginPath(x.fillStyle=R(i/4))

}

let time = 0;
let frame = 0;
let FPS = 120;
let x = c.getContext('2d');
let S = Math.sin;
let C = Math.cos;
let T = Math.tan;
let R = (r,g,b,a=1) => `rgba(${r|0},${g|0},${b|0},${a})`;

let loop = (frameTime) =>
{
  requestAnimationFrame(loop);
  
  // update time
  time = frame++/FPS;
  u(time);
  
  {
    // fill window
    const aspect = c.width/c.height;
    if (aspect > innerWidth/innerHeight)
    {
      c.style.height = '100%';
      c.style.width = '';
    }
    else
    {
      c.style.width = '100%';
      c.style.height = '';
    }
  }
}

loop();
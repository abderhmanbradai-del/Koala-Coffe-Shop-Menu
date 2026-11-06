var IM=[];
for(var n=1;n<=14;n++)IM.push("images/page-"+(n<10?"0":"")+n+".jpg");
var NAMES=["Couverture","Bienvenue","Brunche","Pizza","Burger & Tacos","Baguette & Kumpir","Plats","Desserts","Crêpes","Boissons fraîches","Mojito & Jus","Boissons chaudes","Boissons","Contact"];
var $=function(s){return document.querySelector(s)},cur=0,N=IM.length,book=$("#book"),pgs=[];
IM.forEach(function(src,i){
  var d=document.createElement("div");d.className="pg";d.style.zIndex=N-i;
  var im=new Image();im.src=src;im.alt=NAMES[i];im.draggable=false;d.appendChild(im);
  d.onclick=function(){zoom()};book.appendChild(d);pgs.push(d);
  var c=document.createElement("button");c.className="ch";c.textContent=NAMES[i];c.onclick=function(){go(i)};$("#chips").appendChild(c);
  var o=document.createElement("i");o.onclick=function(){go(i)};$("#dots").appendChild(o);
});
function go(n){
  n=Math.max(0,Math.min(N-1,n));if(n===cur&&pgs[n].classList.contains("cur"))return;
  var s=$("#sh");s.classList.remove("go");void s.offsetWidth;s.classList.add("go");
  cur=n;
  pgs.forEach(function(p,i){p.classList.toggle("fl",i<n);p.classList.toggle("cur",i===n)});
  document.querySelectorAll(".ch").forEach(function(c,i){c.classList.toggle("on",i===n);if(i===n)c.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})});
  document.querySelectorAll("#dots i").forEach(function(c,i){c.classList.toggle("on",i===n)});
  $("#prog").style.width=((n+1)/N*100)+"%";$("#pv").disabled=n===0;$("#nx").disabled=n===N-1;
  $("#zm img").src=IM[n];
}
$("#pv").onclick=function(){go(cur-1)};$("#nx").onclick=function(){go(cur+1)};
addEventListener("keydown",function(e){if(e.key=="ArrowRight")go(cur+1);if(e.key=="ArrowLeft")go(cur-1);if(e.key=="Escape")$("#zm").classList.remove("on","z")});
/* swipe */
var sx=null,sy=0;
book.addEventListener("touchstart",function(e){sx=e.touches.length==1?e.touches[0].clientX:null;sy=e.touches[0].clientY},{passive:true});
book.addEventListener("touchend",function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){go(cur+(dx<0?1:-1));book.dataset.sw=1;setTimeout(function(){delete book.dataset.sw},350)}sx=null});
/* zoom */
function zoom(){if(book.dataset.sw)return;var z=$("#zm");z.querySelector("img").src=IM[cur];z.classList.remove("z");z.classList.add("on")}
$("#zb").onclick=zoom;
$("#zx").onclick=function(e){e.stopPropagation();$("#zm").classList.remove("on","z")};
$("#zm").onclick=function(e){var z=this,im=z.querySelector("img");
  if(z.classList.contains("z")){z.classList.remove("z");return}
  if(e.target===im){var r=im.getBoundingClientRect(),fx=(e.clientX-r.left)/r.width,fy=(e.clientY-r.top)/r.height;z.classList.add("z");z.scrollLeft=fx*im.offsetWidth-innerWidth/2;z.scrollTop=fy*im.offsetHeight-innerHeight/2}else z.classList.remove("on")};
/* leaves */
for(var i=0,LN=innerWidth<600?5:9;i<LN;i++){var l=document.createElement("span");l.className="lf";l.textContent=i%2?"🍃":"🌿";l.style.left=(i*(100/LN)+Math.random()*6)+"%";l.style.animationDuration=(14+Math.random()*10)+"s";l.style.animationDelay=(-Math.random()*20)+"s";l.style.fontSize=(18+Math.random()*18)+"px";document.body.appendChild(l)}
/* theme + splash */
$("#th").onclick=function(){var r=document.documentElement,d=r.dataset.theme?r.dataset.theme=="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=d?"light":"dark"};
var iv=$("#iv");
function closeSplash(){$("#splash").classList.add("out");try{iv.pause()}catch(e){}}
$("#skip").onclick=closeSplash;$("#go").onclick=closeSplash;
$("#snd").onclick=function(){iv.muted=!iv.muted;this.textContent=iv.muted?"🔇":"🔊";if(iv.paused)iv.play()};
try{var pr=iv.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}
var shown=false;function showGo(){if(!shown){shown=true;$("#go").classList.add("show")}}
iv.addEventListener("timeupdate",function(){if(iv.duration&&iv.currentTime>=iv.duration-.35)showGo()});
iv.addEventListener("ended",showGo);setTimeout(showGo,9500);
/* taille du livre : s'adapte à l'écran */
function fit(){var s=$("#stage"),c=getComputedStyle(s),w=s.clientWidth-parseFloat(c.paddingLeft)-parseFloat(c.paddingRight),h=s.clientHeight-parseFloat(c.paddingTop)-parseFloat(c.paddingBottom),r=595.5/842.25,bw=Math.max(80,Math.min(w,h*r));book.style.width=bw+"px";book.style.height=(bw/r)+"px"}
addEventListener("resize",fit);addEventListener("orientationchange",function(){setTimeout(fit,250)});
if(window.ResizeObserver)new ResizeObserver(fit).observe($("#stage"));
fit();go(0);

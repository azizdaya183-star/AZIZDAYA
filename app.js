(function(){
var d=document,r=d.documentElement;
var t=d.getElementById('theme'),m=d.getElementById('menu'),n=d.getElementById('nav');
function icon(){if(t)t.textContent=r.getAttribute('data-theme')==='dark'?'☀':'☾';}
icon();
if(t)t.addEventListener('click',function(){var v=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',v);try{localStorage.setItem('theme',v)}catch(e){}icon();});
if(m)m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o);});
})();

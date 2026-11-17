/* Quiz d'article : lit les questions dans <script type="application/json" class="quiz-data"> */
(function(){
var d=document;
function el(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
function init(box){
  var data;
  try{data=JSON.parse(box.querySelector('script.quiz-data').textContent);}catch(e){return;}
  var qs=data.questions||[],i=0,score=0,L='ABCD';
  var head=el('div','quiz-head'),h=el('h2',null,data.title||'Testez vos connaissances'),cnt=el('span','quiz-count');
  head.appendChild(h);head.appendChild(cnt);
  var bar=el('div','quiz-bar'),fill=el('i');bar.appendChild(fill);
  var body=el('div');body.setAttribute('aria-live','polite');
  box.textContent='';box.appendChild(head);box.appendChild(bar);box.appendChild(body);

  function show(){
    var q=qs[i],answered=false;
    body.textContent='';
    cnt.textContent='Question '+(i+1)+' / '+qs.length;
    fill.style.width=(i/qs.length*100)+'%';
    body.appendChild(el('p','quiz-q',q.q));
    var ul=el('ul','quiz-opts'),btns=[];
    q.options.forEach(function(o,k){
      var li=el('li'),b=el('button','quiz-opt');b.type='button';
      b.appendChild(el('b',null,L[k]));b.appendChild(el('span',null,o));
      b.addEventListener('click',function(){
        if(answered)return;answered=true;
        var ok=k===q.answer;if(ok)score++;
        btns.forEach(function(x,j){x.disabled=true;
          if(j===q.answer)x.classList.add('good');
          else if(j===k)x.classList.add('bad');
          else x.classList.add('dim');});
        var fb=el('div','quiz-fb');
        fb.appendChild(el('strong',null,ok?'Bonne réponse !':'Pas tout à fait.'));
        fb.appendChild(d.createTextNode(q.explain||''));
        body.appendChild(fb);
        var n=el('button','btn sm quiz-next',i<qs.length-1?'Question suivante →':'Voir mon résultat');
        n.type='button';n.addEventListener('click',function(){i++;i<qs.length?show():end();});
        body.appendChild(n);n.focus();
      });
      li.appendChild(b);ul.appendChild(li);btns.push(b);
    });
    body.appendChild(ul);
  }
  function end(){
    fill.style.width='100%';cnt.textContent='Terminé';
    body.textContent='';
    var r=el('div','quiz-res');
    r.appendChild(el('div','quiz-score',score+' / '+qs.length));
    var m=score===qs.length?'Parfait ! Vous maîtrisez le sujet.':score>=Math.ceil(qs.length*0.6)?'Bien joué, vous avez retenu l’essentiel.':'Relisez l’article, puis retentez votre chance.';
    r.appendChild(el('p',null,m));
    var b=el('button','btn sm','Recommencer');b.type='button';
    b.addEventListener('click',function(){i=0;score=0;show();});
    r.appendChild(b);body.appendChild(r);
  }
  show();
}
d.querySelectorAll('.quiz').forEach(init);
})();

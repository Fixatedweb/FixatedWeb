(function(){
var $=function(i){return document.getElementById(i)},D=window.FIXATED_DATA,IMG=window.FIXATED_IMAGES,app=$('app'),SK=D.skus,FM=D.fams,ST=D.settings;
var cart={},last=null,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,F={cat:'all',q:'',sort:'def',st:false},pq=1;
try{cart=JSON.parse(localStorage.getItem('fxb')||'{}')}catch(e){}
function sku(i){return SK.filter(function(s){return s.id===i})[0]}
function fam(i){return FM.filter(function(f){return f.id===i})[0]}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function R(n){return 'R'+n}
function sav(){try{localStorage.setItem('fxb',JSON.stringify(cart))}catch(e){}}
function ids(){return Object.keys(cart).filter(function(k){return sku(k)&&cart[k]>0})}
function cnt(){return ids().reduce(function(n,k){return n+cart[k]},0)}
function tot(){return ids().reduce(function(n,k){return n+cart[k]*sku(k).price},0)}
function vis(){return SK.filter(function(s){return !s.hide})}
function pic(s){return IMG[s.id]?'<img src="'+IMG[s.id]+'" alt="'+esc(s.name+' '+s.mg)+'">':'<div class="np"><span>'+esc(fam(s.fam).brand)+'</span><b>'+esc(s.name)+'</b><small>Photo coming soon</small></div>'}
function wa(n){return '0'+n.slice(2,4)+' '+n.slice(4,7)+' '+n.slice(7)}
function card(s){return '<article class="cd rv"><a class="im" href="#/product/'+s.id+'" aria-label="'+esc(s.name+' '+s.mg)+'">'+(s.stock?'':'<span class="bdg">Sold out</span>')+pic(s)+'</a><div class="ci"><div><h3>'+esc(s.name)+'</h3><span class="mg">'+esc(s.mg)+'</span></div><span class="pr">'+R(s.price)+'</span></div><button class="qa" data-a="'+s.id+'"'+(s.stock?'':' disabled')+'>'+(s.stock?'Add to bag':'Sold out')+'</button></article>'}

/* bag + menu */
function bagUI(){
  var a=ids();$('bc').textContent=cnt();
  $('bl').innerHTML=a.length?a.map(function(k,i){var s=sku(k);return '<div class="bi" style="animation-delay:'+(i*60)+'ms"><div class="t">'+pic(s)+'</div><div><b>'+esc(s.name)+'</b><small>'+esc(s.mg)+' · '+R(s.price)+'</small><div class="q2"><button data-m="'+k+'" aria-label="Remove one">−</button><span>'+cart[k]+'</span><button data-p="'+k+'" aria-label="Add one">+</button></div></div><b>'+R(s.price*cart[k])+'</b></div>'}).join(''):'<p class="em">Your bag is empty.</p>';
  $('bf').innerHTML=a.length?'<div class="tt"><span>Total</span><span>'+R(tot())+'</span></div><a class="bt d" href="#/cart" data-x="bag">Go to checkout</a>':'<a class="bt d" href="#/collection" data-x="bag">Browse the collection</a>';
}
function openX(id){$(id).classList.add('open');$(id).setAttribute('aria-hidden','false');if(id==='bag')$('sc').classList.add('open');document.body.classList.add('lock');var b=$(id).querySelector('button');if(b)b.focus()}
function closeX(){['bag','menu','sc'].forEach(function(i){$(i).classList.remove('open');if(i!=='sc')$(i).setAttribute('aria-hidden','true')});document.body.classList.remove('lock')}
function add(id,n){cart[id]=Math.min(50,(cart[id]||0)+(n||1));sav();bagUI();var c=$('bc');c.classList.remove('b');void c.offsetWidth;c.classList.add('b');openX('bag')}
function chg(k,d,rm){cart[k]=(cart[k]||0)+d;if(cart[k]<=0||rm)delete cart[k];sav();bagUI();if(/^#\/cart/.test(location.hash))render()}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-a],[data-m],[data-p],[data-x]');if(!t)return;
  if(t.dataset.a)add(t.dataset.a);else if(t.dataset.m)chg(t.dataset.m,-1);else if(t.dataset.p)chg(t.dataset.p,1);else if(t.dataset.x){closeX()}
});
$('bagb').onclick=function(){openX('bag')};$('mb').onclick=function(){openX('menu')};
document.querySelectorAll('#menu a').forEach(function(a){a.addEventListener('click',closeX)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeX()});
window.addEventListener('scroll',function(){$('hd').classList.toggle('sc',window.scrollY>40)},{passive:true});

/* pages */
function home(){
  var f=['s50b','c100'].map(sku),pick=['g200','c200','s50b','s30a'].map(sku).filter(function(s){return s&&!s.hide});
  app.innerHTML='<section class="hero"><div class="w hg"><div><h1 aria-label="Fixated Cannabis"><span class="ln" style="--d:0"><i>Fixated</i></span><span class="ln" style="--d:1"><i>Cannabis</i></span></h1><p class="hs">Free your mind. High-quality edibles at an affordable price, delivered nationwide.</p><div class="cta"><a class="bt" href="#/collection">Shop the collection</a><a class="ul" href="#/story">Our story</a></div></div>'+
  '</div></section>'+
  '<section class="sp"><div class="w"><div class="rv" style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:40px"><h2 class="big">The collection</h2><a class="ul" href="#/collection">View all</a></div><div class="pg">'+pick.map(card).join('')+'</div></div></section>'+
  '<section class="sp dk"><div class="w sx c2"><h2 class="big rv" style="color:var(--cr)">Honestly labelled. Fairly priced. Made for adults.</h2><div class="rv"><p class="lede" style="margin-top:0">Fixated is a cannabis edibles brand based in '+esc(ST.place)+'. We show you the strength of every pack, the size of every serving and what is printed on the label, so you always know what you are choosing.</p><p style="margin-top:26px"><a class="bt" href="#/story">Read our story</a></p></div></div></section>'+
  '<section class="sp"><div class="w"><h2 class="big rv" style="margin-bottom:46px">Behind the brand</h2><div class="sx c3"><div class="pn rv"><h3>On the label</h3><p>Milligrams per pack and per serving, pack size and the free-from claims printed on each pack.</p></div><div class="pn rv"><h3>In the range</h3><p>Gummies, choc-chip cookies and cannabis craft soda, in strengths from 10 mg a serving.</p></div><div class="pn rv"><h3>At your door</h3><p>National delivery, arranged personally with you over WhatsApp.</p></div></div><p class="rv" style="margin-top:34px"><a class="ul" href="#/craft">See the full breakdown</a></p></div></section>'+
  '<section class="sp dk"><div class="w"><div class="rv" style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:30px"><h2 class="big" style="color:var(--cr)">The journal</h2><a class="ul" href="#/journal">All articles</a></div><div class="jc">'+JA.map(function(a){return '<a class="rv" href="#/journal/'+a.s+'"><h3>'+a.t+'</h3><p>'+a.d+'</p></a>'}).join('')+'</div></div></section>';
}
function collection(){
  var C=[['all','All'],['gummies','Gummies'],['baked','Baked edibles'],['drinks','Drinkables']];
  app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">The Collection</h1><p class="lede">Gummies, baked edibles and drinkables. Every strength is shown in full on each product page.</p><div class="fb"><div class="pills" role="group" aria-label="Category">'+C.map(function(c){return '<button class="pl" data-c="'+c[0]+'" aria-pressed="'+(F.cat===c[0])+'">'+c[1]+'</button>'}).join('')+'</div><div class="ft"><input id="fq" type="search" placeholder="Search the collection" aria-label="Search" value="'+esc(F.q)+'"><select id="fs" aria-label="Sort"><option value="def">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="mg">Strength: low to high</option></select><label class="ck"><input id="fk" type="checkbox"'+(F.st?' checked':'')+'>In stock only</label></div></div><p class="cn" id="cc" role="status"></p><div class="pg" id="pg"></div></div></section>';
  $('fs').value=F.sort;$('fq').oninput=function(){F.q=this.value;draw()};$('fs').onchange=function(){F.sort=this.value;draw()};$('fk').onchange=function(){F.st=this.checked;draw()};
  app.querySelectorAll('.pl').forEach(function(b){b.onclick=function(){F.cat=b.dataset.c;app.querySelectorAll('.pl').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.c===F.cat)});draw()}});draw();
  function draw(){var t=F.q.trim().toLowerCase(),l=vis().filter(function(s){return(F.cat==='all'||s.cat===F.cat)&&(!F.st||s.stock)&&(!t||(s.name+' '+s.mg+' '+s.tags.join(' ')).toLowerCase().indexOf(t)>-1)}),n=function(s){return parseInt(s.mg,10)};
    if(F.sort==='lo')l.sort(function(a,b){return a.price-b.price});if(F.sort==='hi')l.sort(function(a,b){return b.price-a.price});if(F.sort==='mg')l.sort(function(a,b){return n(a)-n(b)});
    $('cc').textContent=l.length+(l.length===1?' product':' products');$('pg').innerHTML=l.length?l.map(card).join(''):'<p class="em">Nothing matches your search.</p>';$('pg').querySelectorAll('.rv').forEach(function(e){e.classList.add('in')})}
}
function product(id){
  var s=sku(id);if(!s||s.hide)return nf();var f=fam(s.fam),sib=SK.filter(function(x){return x.fam===s.fam&&!x.hide});pq=1;
  app.innerHTML='<div class="w pp"><nav class="bc" aria-label="Breadcrumb"><a href="#/collection">Collection</a> / '+esc(s.name)+'</nav><div class="pd"><div><div class="gm" id="gm">'+pic(s)+'</div>'+(sib.length>1?'<div class="gt">'+sib.map(function(x){return '<button onclick="location.hash=\'#/product/'+x.id+'\'" aria-label="'+esc(x.lab)+'" aria-current="'+(x.id===id)+'">'+(IMG[x.id]?'<img src="'+IMG[x.id]+'" alt="">':esc(x.lab))+'</button>'}).join('')+'</div>':'')+'</div>'+
  '<div class="pi"><h1>'+esc(s.name)+'</h1><p class="by">'+esc(f.brand)+' · '+esc(s.mg)+'</p><div class="pr">'+R(s.price)+'</div>'+
  (sib.length>1?'<div class="vr" role="group" aria-label="Options">'+sib.map(function(x){return '<a href="#/product/'+x.id+'" aria-current="'+(x.id===id)+'">'+esc(x.lab)+'</a>'}).join('')+'</div>':'')+
  '<ul class="tg">'+s.tags.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul>'+
  '<div class="buy"><div class="qt"><button id="qm" aria-label="Fewer">−</button><span id="qn">1</span><button id="qp" aria-label="More">+</button></div><button class="bt d" id="qa"'+(s.stock?'':' disabled')+'>'+(s.stock?'Add to bag':'Sold out')+'</button></div>'+
  '<details open><summary>About</summary><div>'+esc(f.desc)+' '+esc(s.per)+'.</div></details>'+
  '<details><summary>Cannabinoid content</summary><div>'+esc(s.can)+', as printed on the pack. '+esc(s.per)+'. We have not published laboratory results on this site, so we make no claim beyond what the pack states.</div></details>'+
  '<details><summary>Ingredients and allergens</summary><div>'+(f.ing?esc(f.ing)+' ':'')+'The full ingredient list and allergen information are printed on the pack. We have not published a verified list here. If you have an allergy, message us on WhatsApp before you order.</div></details>'+
  '<details><summary>Delivery</summary><div>'+esc(ST.delivery)+'</div></details></div></div></div>';
  var g=$('gm'),im=g.querySelector('img');if(im)g.onclick=function(e){var r=g.getBoundingClientRect();im.style.setProperty('--ox',((e.clientX-r.left)/r.width*100)+'%');im.style.setProperty('--oy',((e.clientY-r.top)/r.height*100)+'%');g.classList.toggle('z')};
  $('qm').onclick=function(){pq=Math.max(1,pq-1);$('qn').textContent=pq};$('qp').onclick=function(){pq=Math.min(20,pq+1);$('qn').textContent=pq};$('qa').onclick=function(){add(id,pq)};
}
var JA=[
{s:'start-low-go-slow',t:'Start low, go slow',d:'How edibles work, and why patience matters.',b:['Edibles are digested, so they take longer to work than inhaled cannabis and the effects last longer. Many people feel nothing for an hour or more.','That gap is where mistakes happen: someone feels nothing, takes more, and then feels both portions together. Wait at least two hours before even thinking about a second serving.','Begin with the smallest serving on the pack. Do not drive or operate machinery. If you are pregnant, breastfeeding, taking medication or living with a health condition, speak to a doctor before using cannabis products.']},
{s:'reading-an-edible-label',t:'Reading an edible label',d:'Per pack, per serving, per can: what the numbers mean.',b:['The big number on a pack is usually the total for the whole pack. The number that matters for you is the amount in one serving.','Take a 200 mg pack with ten servings: each serving is 20 mg. A 100 mg pack with ten servings gives 10 mg each. Our cans are different, since each can is a single serving of 30 mg or 50 mg.','Check the pack size and number of servings before you buy, and cut or portion carefully. If a label is unclear, ask the seller before you eat anything.']},
{s:'storing-edibles-responsibly',t:'Storing edibles responsibly',d:'Edibles look like sweets. Treat them accordingly.',b:['Cannabis edibles can look just like ordinary gummies, cookies and soft drinks, which makes safe storage essential.','Keep them in their original, sealed packaging, out of sight and out of reach of children and pets, and away from regular snacks. Tell the people you live with what they are.','Never leave a can or pouch where someone could mistake it for something else, and never share an edible without saying what it is.']}];
function story(){app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">Our story</h1></div></section><section class="sp" style="padding-top:30px"><div class="w sx c2"><h2 class="big rv">Free your mind, with your eyes open.</h2><div class="rv art"><p>Fixated is a cannabis edibles brand based in '+esc(ST.place)+'. We started from a simple belief: edibles should be easy to understand, fairly priced and sold to adults who know what they are choosing.</p><p>That is why every product here shows its strength per pack and per serving, and why we only repeat what is printed on the pack. No invented lab results, no health claims, no pressure.</p><p>We deliver nationwide and arrange every order personally, so there is a real person to talk to before and after you buy.</p><p><a class="bt d" href="#/collection">Explore the collection</a></p></div></div></section>'}
function craft(){var rows=vis().map(function(s){return '<tr><td><a href="#/product/'+s.id+'">'+esc(s.name)+'</a></td><td>'+esc(s.mg)+'</td><td>'+esc(s.per)+'</td></tr>'}).join('');
  app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">Behind the brand</h1><p class="lede">What we show, what we do not claim, and what is in the range.</p></div></section><section class="sp" style="padding-top:30px"><div class="w"><div class="sx c3"><div class="pn rv"><h3>What we show</h3><p>Strength per pack and per serving, pack size, and the free-from claims printed on each pack.</p></div><div class="pn rv"><h3>What we do not claim</h3><p>We do not invent laboratory results, certifications or medical benefits. If it is not on the pack, it is not on this site.</p></div><div class="pn rv"><h3>How we sell</h3><p>Adults only, to club members, with delivery arranged personally over WhatsApp.</p></div></div><div class="aw rv"><table class="tbl"><thead><tr><th>Product</th><th>Strength</th><th>Serving</th></tr></thead><tbody>'+rows+'</tbody></table></div></div></section>'}
function journal(slug){
  if(slug){var a=JA.filter(function(x){return x.s===slug})[0];if(!a)return nf();app.innerHTML='<div class="w pp"><nav class="bc"><a href="#/journal">Journal</a> / '+a.t+'</nav><article class="art"><h1>'+a.t+'</h1>'+a.b.map(function(p){return '<p>'+p+'</p>'}).join('')+'<p><a class="ul" href="#/journal">Back to the journal</a></p></article></div>';return}
  app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">The Journal</h1><p class="lede">Product knowledge and responsible use.</p><div class="jc" style="margin-top:40px">'+JA.map(function(a){return '<a class="rv" href="#/journal/'+a.s+'"><h3>'+a.t+'</h3><p>'+a.d+'</p></a>'}).join('')+'</div></div></section>'}
function faq(){var Q=[['Who can buy?','Adults only. Products are not for sale to anyone under 18 and are available to club members only.'],['How do I order?','Add products to your bag, check out, and your order opens in WhatsApp ready to send. We confirm stock and delivery there and arrange payment with you directly.'],['Do you deliver?',ST.delivery],['How strong is each product?','Every product page shows the strength per pack and per serving, exactly as printed on the pack.'],['How long do edibles take to work?','Longer than most people expect, often an hour or more. Wait at least two hours before taking more. Read “Start low, go slow” in the journal.'],['Is it legal?','Cannabis laws in South Africa are still developing. We do not claim that our products are licensed or approved by any regulator. You are responsible for knowing and following the law that applies to you.'],['What about allergies?','Allergen information is printed on the pack. If you have an allergy, message us before you order.'],['Something is wrong with my order.',ST.returns]];
  app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">FAQ</h1></div></section><section class="sp" style="padding-top:30px"><div class="w" style="max-width:820px">'+Q.map(function(q){return '<details class="rv"><summary>'+esc(q[0])+'</summary><div>'+esc(q[1])+'</div></details>'}).join('')+'</div></section>'}
function contact(){app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">Contact</h1></div></section><section class="sp" style="padding-top:30px"><div class="w sx c2"><div><p class="big" style="margin-bottom:24px">Message us on WhatsApp.</p><p><a class="ul" href="https://wa.me/'+ST.wa1+'" target="_blank" rel="noopener">'+wa(ST.wa1)+'</a><br><a class="ul" href="https://wa.me/'+ST.wa2+'" target="_blank" rel="noopener">'+wa(ST.wa2)+'</a></p><p style="color:var(--mut)">Based in '+esc(ST.place)+'. National delivery available.</p></div><form class="fm" id="cf"><label>Your name<input name="n" autocomplete="name"></label><label>Message<textarea name="m" rows="5"></textarea></label><button class="bt d" type="submit">Send on WhatsApp</button></form></div></section>';
  $('cf').onsubmit=function(e){e.preventDefault();var f=e.target;window.open('https://wa.me/'+ST.wa1+'?text='+encodeURIComponent('Hi Fixated, this is '+(f.n.value.trim()||'a customer')+'.\n'+f.m.value.trim()),'_blank','noopener')}}
var LG={privacy:['Privacy policy',['This website has no customer accounts and no tracking or analytics. Your bag is saved only in your own browser.','When you place an order, your name, phone number and delivery address are put into a WhatsApp message that you send to us. That message is handled through WhatsApp and is used only to confirm and deliver your order.','Your date of birth is checked in your browser and is never stored or sent anywhere. Message us on WhatsApp if you would like your order details removed.']],terms:['Terms and conditions',['Our products are for adults aged 18 and older and are available to club members only. By ordering you confirm that you meet these requirements.','Orders are confirmed with you on WhatsApp, where stock, delivery cost and payment are agreed. Prices and availability can change.','Use products responsibly, never drive or operate machinery after using them, and keep them away from children and pets. Nothing on this site is medical advice.']],delivery:['Delivery and returns',[ST.delivery,ST.returns]],responsible:['Responsible use',['Start low and go slow. Edibles can take an hour or more to take effect, so wait at least two hours before taking more.','Do not drive or operate machinery. Keep products locked away from children and pets. Not for anyone under 18.','If you are pregnant, breastfeeding, taking medication or have a health condition, speak to a doctor first.']],regulatory:['Regulatory information',['Cannabis laws in South Africa are still developing. We do not claim that our products are licensed, certified or approved by any regulator, and selling a product does not mean it is legally approved.','You are responsible for knowing and following the law that applies to you. Products are available to adult club members only.',ST.licence?'Licensing information: '+ST.licence:'No licence or certification details have been published on this site.']]};
function legal(k){var l=LG[k];if(!l)return nf();app.innerHTML='<div class="w pp"><article class="art"><h1>'+l[0]+'</h1>'+l[1].map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</article></div>'}
function nf(){app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">Not found</h1><p class="lede"><a class="ul" href="#/collection">Back to the collection</a></p></div></section>'}
function cartPage(){var a=ids();
  if(!a.length){app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">Checkout</h1><p class="em">Your bag is empty.</p><a class="bt d" href="#/collection">Browse the collection</a></div></section>';return}
  app.innerHTML='<section class="ph"><div class="w"><h1 class="xl">Checkout</h1><div class="co" style="margin-top:40px"><div>'+a.map(function(k){var s=sku(k);return '<div class="bi" style="grid-template-columns:72px 1fr auto"><div class="t">'+pic(s)+'</div><div><b>'+esc(s.name)+'</b><small>'+esc(s.mg)+' · '+R(s.price)+' each</small><div class="q2"><button data-m="'+k+'" aria-label="Remove one">−</button><span>'+cart[k]+'</span><button data-p="'+k+'" aria-label="Add one">+</button></div></div><b>'+R(s.price*cart[k])+'</b></div>'}).join('')+'<div class="tt" style="margin-top:16px"><span>Total</span><span>'+R(tot())+'</span></div><p style="color:var(--mut)">'+esc(ST.delivery)+'</p></div>'+
  '<form class="fm" id="f" novalidate><label>Name<input name="n" autocomplete="name"></label><label>Phone number<input name="t" type="tel" autocomplete="tel"></label><label>Delivery address<textarea name="a" rows="3" autocomplete="street-address"></textarea></label><label>Notes (optional)<input name="o"></label><label class="chk"><input type="checkbox" name="age"><span>I am 18 or older and a club member.</span></label><p class="er" id="er" role="alert"></p><button class="bt d" type="submit">Send order on WhatsApp</button><p style="color:var(--mut);margin:0;font-size:.95rem">Your order opens in WhatsApp. We confirm stock, delivery and payment with you there.</p></form></div></div></section>';
  $('f').onsubmit=function(e){e.preventDefault();var f=e.target,v=function(n){return f.elements[n].value.trim()};
    if(!v('n')||!v('t')||!v('a')){$('er').textContent='Please fill in your name, phone number and delivery address.';return}
    if(!f.elements.age.checked){$('er').textContent='Please confirm you are 18 or older.';return}
    var ref='FX-'+Date.now().toString(36).toUpperCase().slice(-5),lines=a.map(function(k){var s=sku(k);return cart[k]+' x '+s.name+' '+s.mg+' ('+R(s.price*cart[k])+')'}),
    m='New order '+ref+'\n\n'+lines.join('\n')+'\n\nTotal: '+R(tot())+'\nName: '+v('n')+'\nPhone: '+v('t')+'\nDelivery address: '+v('a')+(v('o')?'\nNotes: '+v('o'):'')+'\n18+ and club member confirmed';
    last={ref:ref,lines:lines,total:tot(),url:'https://wa.me/'+ST.wa1+'?text='+encodeURIComponent(m)};window.open(last.url,'_blank','noopener');
    cart={};sav();bagUI();location.hash='#/confirmed'}}
function confirmed(){if(!last){location.hash='#/collection';return}
  app.innerHTML='<section class="ph"><div class="w" style="max-width:760px"><h1 class="xl">Order '+esc(last.ref)+'</h1><p class="lede">Your order is ready. Send the message in WhatsApp to complete it. If WhatsApp did not open, <a class="ul" href="'+last.url+'" target="_blank" rel="noopener">tap here</a>.</p><div style="margin:34px 0;border-top:1px solid var(--ln)">'+last.lines.map(function(l){return '<p style="margin:0;padding:12px 0;border-bottom:1px solid var(--ln)">'+esc(l)+'</p>'}).join('')+'<div class="tt" style="margin-top:14px"><span>Total</span><span>'+R(last.total)+'</span></div></div><a class="bt d" href="#/collection">Continue shopping</a></div></section>'}
async function admin(){
  app.innerHTML='<div class="ad w"><h1>Owner panel</h1><p>Checking access…</p></div>';var own=false;
  try{var u=await claude.use('user');own=u?(await u.canEdit()):false}catch(e){}
  if(!own){app.innerHTML='<div class="ad w"><h1>Owner panel</h1><p>This area is for the store owner. Open the page from your claude.ai account to manage products.</p><a class="bt d" href="#/">Back to the store</a></div>';return}
  app.innerHTML='<div class="ad w"><h1>Owner panel</h1><p style="color:var(--mut)">Update prices, stock and details. Saving publishes the change for every visitor.</p><div class="aw"><table class="at"><thead><tr><th>Product</th><th>Price (R)</th><th>In stock</th><th>Show</th></tr></thead><tbody>'+SK.map(function(s){return '<tr data-id="'+s.id+'"><td>'+esc(s.name)+' <small>'+esc(s.mg)+'</small></td><td><input type="number" min="0" value="'+s.price+'" aria-label="Price for '+esc(s.name)+'"></td><td><input type="checkbox" class="st"'+(s.stock?' checked':'')+' aria-label="In stock"></td><td><input type="checkbox" class="sh"'+(s.hide?'':' checked')+' aria-label="Show"></td></tr>'}).join('')+'</tbody></table></div>'+
  '<form class="fm" id="af" style="margin-top:28px">'+FM.map(function(f){return '<label>Ingredients: '+esc(f.brand)+' '+f.id+'<textarea name="ing_'+f.id+'" rows="2" placeholder="Paste the verified ingredient list from the pack">'+esc(f.ing)+'</textarea></label>'}).join('')+
  '<label>Banner message<input name="note" value="'+esc(ST.note)+'"></label><label>Delivery note<textarea name="delivery" rows="2">'+esc(ST.delivery)+'</textarea></label><label>Returns note<textarea name="returns" rows="2">'+esc(ST.returns)+'</textarea></label><label>Licence or regulatory details (leave empty if none)<textarea name="licence" rows="2">'+esc(ST.licence)+'</textarea></label><label>WhatsApp number for orders (with country code, no +)<input name="wa1" value="'+esc(ST.wa1)+'"></label><label>Second number<input name="wa2" value="'+esc(ST.wa2)+'"></label><div><button class="bt d" type="submit" id="sv">Save and publish</button> <span id="ms" role="status"></span></div></form></div>';
  $('af').onsubmit=async function(e){e.preventDefault();var f=e.target,b=$('sv'),ms=$('ms');
    app.querySelectorAll('tr[data-id]').forEach(function(tr){var s=sku(tr.dataset.id);s.price=Math.max(0,parseInt(tr.querySelector('input[type=number]').value,10)||0);s.stock=tr.querySelector('.st').checked;s.hide=!tr.querySelector('.sh').checked});
    FM.forEach(function(x){x.ing=f.elements['ing_'+x.id].value.trim()});ST.note=f.note.value.trim();ST.delivery=f.delivery.value.trim();ST.returns=f.returns.value.trim();ST.licence=f.licence.value.trim();ST.wa1=f.wa1.value.replace(/\D/g,'');ST.wa2=f.wa2.value.replace(/\D/g,'');
    b.disabled=true;ms.textContent='Publishing…';
    try{var a=await claude.use('artifact');if(!a)throw new Error('na');var c=document.documentElement.cloneNode(true);
      c.className='';c.querySelector('body').className='';c.querySelector('#app').innerHTML='';c.querySelector('#bl').innerHTML='';c.querySelector('#bf').innerHTML='';c.querySelector('#bc').textContent='0';c.querySelector('#bc').className='';c.querySelector('#fl').textContent='';
      c.querySelector('#ld').className='ld';c.querySelector('#gate').setAttribute('hidden','');c.querySelector('#bag').className='bag';c.querySelector('#menu').className='menu';c.querySelector('#sc').className='sc';c.querySelector('#hd').className='';
      c.querySelector('#data').textContent=JSON.stringify(D).replace(/</g,'\\u003c');
      await a.publish('<!DOCTYPE html>\n'+c.outerHTML);ms.textContent='Saved.';ms.className='ok'}
    catch(x){b.disabled=false;ms.className='er';ms.textContent=(x&&x.code==='conflict')?'Someone else published first. Reload and try again.':'Could not publish. Make sure you are signed in as the owner.'}}
}

/* router */
var io=window.IntersectionObserver&&!reduce?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1}):null;
if(io)document.documentElement.classList.add('io');
function render(){
  closeX();var p=(location.hash||'#/').replace(/^#\/?/,'').split('/'),r=p[0]||'home';
  ({home:home,collection:collection,product:function(){product(p[1])},story:story,craft:craft,journal:function(){journal(p[1])},faq:faq,contact:contact,cart:cartPage,confirmed:confirmed,legal:function(){legal(p[1])},admin:admin}[r]||nf)();
  $('hd').classList.toggle('lt',r!=='home');
  document.querySelectorAll('.dn a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#/'+r)});
  $('fl').textContent=ST.licence?'Licensing information: '+ST.licence:'';
  window.scrollTo(0,0);
  if(io)app.querySelectorAll('.rv').forEach(function(e){if(!e.classList.contains('in'))io.observe(e)});
}
function route(){if(document.startViewTransition&&!reduce)document.startViewTransition(render);else render()}
window.addEventListener('hashchange',route);
bagUI();render();
setTimeout(function(){$('ld').classList.add('gone')},reduce?0:1300);

/* age gate */
var g=$('gate'),ok=false;try{ok=sessionStorage.getItem('fx18')==='1'}catch(e){}
if(!ok){g.removeAttribute('hidden');document.body.classList.add('lock')}
(function(){var F=[$('dd'),$('mm'),$('yy')],mx=[2,2,4],big=[3,1];
  F.forEach(function(el,i){
    el.addEventListener('input',function(){
      var v=el.value.replace(/\D/g,'').slice(0,mx[i]);
      if(i<2&&v.length===1&&+v>big[i])v='0'+v;
      el.value=v;
      if(v.length===mx[i]){if(i<2)F[i+1].focus();else $('ag').querySelector('button').focus()}
    });
    el.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!el.value&&i>0){F[i-1].focus()}});
    el.addEventListener('focus',function(){el.select()});
  });
  var gt=$('gate');if(!gt.hidden)setTimeout(function(){F[0].focus()},1500)})();
$('ag').onsubmit=function(e){e.preventDefault();var d=+$('dd').value,m=+$('mm').value,y=+$('yy').value,t=new Date(),dt=new Date(y,m-1,d);
  if(!d||!m||y<1900||dt.getMonth()!==m-1||dt.getDate()!==d||dt>t){$('ae').textContent='Please enter a valid date of birth.';return}
  var a=t.getFullYear()-y;if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<d))a--;
  if(a<18){$('ae').textContent='You must be 18 or older to enter.';return}
  g.setAttribute('hidden','');document.body.classList.remove('lock');try{sessionStorage.setItem('fx18','1')}catch(x){}};
})();

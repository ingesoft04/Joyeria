import {Hand3D} from './hand-3d.js?v=2';

const form=document.querySelector('#customizerForm');
const preview=document.querySelector('#braceletPreview');
const canvas=document.querySelector('#braceletCanvas');
const ctx=canvas.getContext('2d');
const hand3d=new Hand3D(document.querySelector('#handStage'));
let rotation=-.25,dragging=false,lastX=0,lastY=0;

const sizeOptions={
  Manilla:['14 cm','15 cm','16 cm','17 cm','18 cm','19 cm','20 cm'],
  Anillo:['Talla 4','Talla 5','Talla 6','Talla 7','Talla 8','Talla 9','Talla 10','Talla 11']
};
function colorMix(hex,amount){
  const value=parseInt(hex.slice(1),16);
  const channel=shift=>Math.max(0,Math.min(255,((value>>shift)&255)+amount));
  return `rgb(${channel(16)},${channel(8)},${channel(0)})`;
}
function resizeCanvas(){
  const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);draw();
}
function bead(x,y,r,diamond){
  ctx.save();ctx.translate(x,y);ctx.beginPath();
  if(diamond){for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2,rad=i%2?r*.72:r;ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad)}ctx.closePath()}
  else ctx.arc(0,0,r,0,Math.PI*2);
  const shine=ctx.createRadialGradient(-r*.35,-r*.45,1,0,0,r);
  shine.addColorStop(0,'#fff8c7');shine.addColorStop(.22,'#f2cf70');shine.addColorStop(.58,'#c78b27');shine.addColorStop(1,'#6f3d08');
  ctx.fillStyle=shine;ctx.shadowColor='#5f390855';ctx.shadowBlur=7;ctx.shadowOffsetY=4;ctx.fill();ctx.strokeStyle='#ffdc82';ctx.lineWidth=1;ctx.stroke();ctx.restore();
}
function drawCharm(x,y,symbol,small=false){
  if(!symbol)return;const radius=small?10:20;ctx.save();ctx.translate(x,y);ctx.shadowColor='#3a210866';ctx.shadowBlur=8;ctx.shadowOffsetY=4;
  ctx.fillStyle='#d8a13d';ctx.strokeStyle='#fff0a4';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#34200d';ctx.font=`${small?13:25}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(symbol,0,1);ctx.restore();
}
function threadEllipse(cx,cy,rx,ry,color,width,dash=[],offset=0){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.lineDashOffset=offset;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function draw(){
  if(!canvas.width)return;
  const width=canvas.clientWidth,height=canvas.clientHeight,item=form.elements.namedItem('item').value,isRing=item==='Anillo',view=form.elements.namedItem('view').value,onHand=view!=='Producto';
  let cx=width/2,cy=height/2-4,rx=Math.min(width*(isRing?.24:.35),isRing?112:175),ry=Math.min(height*(isRing?.29:.24),isRing?94:82);
  if(onHand&&isRing){cx=width*.435;cy=height*.405;rx=Math.max(10,width*.027);ry=Math.max(5,height*.017)}
  if(onHand&&!isRing){cx=width*.49;cy=height*.51;rx=Math.max(18,width*.043);ry=Math.max(43,height*.19)}
  const look=form.querySelector('[name=beads]:checked').dataset.look,weave=form.querySelector('[name=weave]:checked').dataset.weave,thread=form.querySelector('[name=thread]:checked').dataset.color,symbol=form.querySelector('[name=charm]:checked').dataset.symbol;
  preview.classList.toggle('on-hand',onHand);preview.classList.toggle('male',view==='Hombre');preview.style.backgroundImage='';
  ctx.clearRect(0,0,width,height);
  if(onHand){
    hand3d.setJewelry({item,thread,look,weave,symbol,gender:view});
    preview.setAttribute('aria-label',`Modelo 3D de mano de ${view.toLowerCase()} con ${item.toLowerCase()}, ${form.elements.weave.value.toLowerCase()}, color ${form.elements.thread.value.toLowerCase()} y dije ${form.elements.charm.value.toLowerCase()}`);
    return;
  }
  if(!onHand){const shadow=ctx.createRadialGradient(cx,cy+ry+38,5,cx,cy+ry+38,rx*.82);shadow.addColorStop(0,'#5d421b35');shadow.addColorStop(1,'#5d421b00');ctx.fillStyle=shadow;ctx.beginPath();ctx.ellipse(cx,cy+ry+38,rx*.82,18,0,0,Math.PI*2);ctx.fill()}
  const baseWidth=onHand?(isRing?5:7):(weave==='double'?15:11);
  threadEllipse(cx,cy,rx,ry,colorMix(thread,-22),baseWidth);
  if(weave==='double'){threadEllipse(cx,cy-(onHand?2:5),rx-1,ry-2,colorMix(thread,38),onHand?2:4);threadEllipse(cx,cy+(onHand?2:5),rx-1,ry-2,colorMix(thread,-42),onHand?2:4)}
  else if(weave==='braided'){threadEllipse(cx,cy-1,rx,ry,colorMix(thread,42),onHand?3:6,[onHand?4:10,onHand?3:7],rotation*24);threadEllipse(cx,cy+1,rx,ry,colorMix(thread,-38),onHand?2:4,[onHand?4:10,onHand?3:7],rotation*24+9)}
  else if(weave==='spiral')threadEllipse(cx,cy,rx,ry,colorMix(thread,48),onHand?3:6,[onHand?2:4,onHand?3:6],rotation*30);
  else threadEllipse(cx,cy-(onHand?1:2),rx,ry,colorMix(thread,32),onHand?2.5:5);
  const count=onHand?(isRing?8:12):(isRing?12:18),points=[];
  for(let i=0;i<count;i++){const angle=i/count*Math.PI*2+rotation,z=Math.sin(angle),scale=.72+(z+1)*.18,base=onHand?(isRing?4.5:7):(isRing?10:12);points.push({x:cx+Math.cos(angle)*rx,y:cy+Math.sin(angle)*ry,r:base*scale,z,i})}
  points.sort((a,b)=>a.z-b.z).forEach(p=>bead(p.x,p.y,p.r,look==='diamond'||look==='mixed'&&p.i%2===1));
  const bottom=points.reduce((best,p)=>p.y>best.y?p:best,points[0]);
  if(symbol){const small=onHand;ctx.strokeStyle='#9a651b';ctx.lineWidth=small?1.5:3;ctx.beginPath();ctx.moveTo(bottom.x,bottom.y+(small?4:8));ctx.lineTo(bottom.x,bottom.y+(small?12:24));ctx.stroke();drawCharm(bottom.x,bottom.y+(small?19:(isRing?40:47)),symbol,small)}
  preview.setAttribute('aria-label',`Referencia en ${view.toLowerCase()}: ${item.toLowerCase()} con ${form.elements.beads.value.toLowerCase()}, ${form.elements.weave.value.toLowerCase()}, tejido ${form.elements.thread.value.toLowerCase()} y dije ${form.elements.charm.value.toLowerCase()}`);
}
function updateSizeOptions(){
  const item=form.elements.namedItem('item').value,select=form.elements.namedItem('size');if(select.dataset.item===item)return;
  select.dataset.item=item;select.innerHTML='<option value="">Selecciona…</option>'+sizeOptions[item].map(v=>`<option>${v}</option>`).join('')+'<option value="Por confirmar">No sé la medida todavía</option>';
  document.querySelector('#sizeLabel').textContent=item==='Anillo'?'Talla del anillo':'Medida de muñeca';
}
function updatePreview(){updateSizeOptions();draw()}
preview.addEventListener('pointerdown',event=>{dragging=true;lastX=event.clientX;lastY=event.clientY;preview.setPointerCapture(event.pointerId);preview.classList.add('dragging')});
preview.addEventListener('pointermove',event=>{if(!dragging)return;const dx=event.clientX-lastX,dy=event.clientY-lastY;if(form.elements.namedItem('view').value==='Producto'){rotation+=dx*.018;draw()}else hand3d.rotate(dx,dy);lastX=event.clientX;lastY=event.clientY});
preview.addEventListener('pointerup',()=>{dragging=false;preview.classList.remove('dragging')});
preview.addEventListener('pointercancel',()=>{dragging=false;preview.classList.remove('dragging')});
form.addEventListener('change',updatePreview);
form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.elements.size.value){form.querySelector('.custom-status').textContent='Selecciona una medida o indica que aún no la sabes.';return}
  const data=new FormData(form),text=`Hola, quiero cotizar un diseño tejido personalizado.\n\n• Producto: ${data.get('item')}\n• Tipo de tejido: ${data.get('weave')}\n• Balines: ${data.get('beads')}\n• Color del tejido: ${data.get('thread')}\n• Dije: ${data.get('charm')}\n• Medida o talla: ${data.get('size')}\n• Vista usada: ${data.get('view')}\n• Detalle adicional: ${data.get('notes')||'Ninguno'}\n\nEntiendo que la simulación es aproximada y que disponibilidad y precio serán confirmados por BEZALEEL.`;
  location.href=`https://wa.me/573175697698?text=${encodeURIComponent(text)}`;
});
new ResizeObserver(resizeCanvas).observe(canvas);updateSizeOptions();resizeCanvas();

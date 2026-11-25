/* Original faceted characters, architecture and merchandise for the Barcelona district. */
const DistrictArt=(()=>{
 const T=THREE, mats=new Map(), geo={box:new T.BoxGeometry(1,1,1),ball:new T.SphereGeometry(.5,10,7),rock:new T.IcosahedronGeometry(.58,0),round:new T.CylinderGeometry(.5,.5,1,12),taper:new T.CylinderGeometry(.38,.5,1,10),cone:new T.ConeGeometry(.5,1,10),ring:new T.TorusGeometry(.38,.105,6,14)};
 const paint=['#ed6558','#428d99','#e7ab43','#9667bc','#517ec1','#6d9e70'], trim=['#21566b','#9a4057','#286c64','#5c487c','#ac6242','#355888'];
 function material(c){if(!mats.has(c))mats.set(c,new T.MeshStandardMaterial({color:c,roughness:.76,flatShading:true}));return mats.get(c)}
 function group(p,x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);p?.add(g);return g}
 function shape(p,k,c,x,y,z,w,h,d,rx=0,ry=0,rz=0){const o=new T.Mesh(geo[k],material(c));o.scale.set(w,h,d);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);p.add(o);return o}
 const B=(p,c,x,y,z,w,h,d,...r)=>shape(p,'box',c,x,y,z,w,h,d,...r);
 const E=(p,c,x,y,z,w,h,d,...r)=>shape(p,'ball',c,x,y,z,w,h,d,...r);
 function cast(p,id){const g=group(p),body=group(g,0,20),arms=[],legs=[];const skin=['#bd794e','#d2a079','#784830','#9c644c','#e5b083'][id%5],coat=['#ed9638','#337c82','#604a9c','#d46865','#5781ad'][id%5],hair=['#423038','#a6a9a6','#362b39','#4d3029','#774731'][id%5];
 shape(body,'taper',coat,0,8,0,14,15,8);B(body,'#27384e',0,.5,0,10,4,7);B(body,'#e5b265',1,1,4,3,2,1);
 E(body,skin,0,19,0,11,13,10);B(body,skin,0,18,4.9,2.3,2.4,2);E(body,hair,0,23,-.8,12,6,11);
 for(const s of [-1,1]){E(body,skin,s*5,19,0,2.6,3.4,2.2);B(body,'#342d36',s*2.4,20,4.5,1.4,1,.7);B(body,hair,s*2.4,21.5,4.3,2.7,.65,.9,0,0,-s*.1)}
 if(id===0){for(let k=0;k<7;k++)shape(body,'rock',hair,Math.cos(k*.91)*4.5,23+Math.sin(k)*1.3,Math.sin(k*.91)*4,5.8,5.3,5);B(body,'#39465b',0,8,4.4,1.7,17,1,0,0,-.55);B(body,'#ab5637',4,2,4.1,5,5,3)}
 if(id===1){E(body,'#90908d',0,15.9,3.4,8.5,3.6,4);B(body,'#944a4a',0,4,4.3,9,13,1.2);B(body,'#d89769',0,5,5,6,3,1)}
 if(id===2){for(const s of [-1,1])shape(body,'ring','#232a41',s*2.7,19.7,4.7,5,4.8,2);E(body,hair,0,25,-2.9,7,7,7);B(body,'#52cebe',0,13,3,9,3,3)}
 for(const s of [-1,1]){const arm=group(body,s*7.1,12,0);arms.push(arm);arm.rotation.z=s*.13;E(arm,coat,0,-3,0,5.5,8,6);E(arm,skin,0,-9,.3,4,7,4);E(arm,skin,0,-13,.5,4.3,4,4);
 const leg=group(g,s*3.2,19,0);legs.push(leg);shape(leg,'taper','#374361',0,-4.5,0,5.8,9,6);const knee=group(leg,0,-9,0);leg.userData.knee=knee;B(knee,'#344056',0,-3.8,0,4.7,8,4.6);E(knee,id===0?'#f6e4c1':'#513d46',0,-7.9,1.2,5.9,4.3,9)}
 return {g,pose(x,z,angle,phase,moving){g.position.set(x,0,z);g.rotation.y=angle;const f=moving?Math.sin(phase):0;body.position.y=20+Math.abs(f)*.9;body.rotation.z=f*.035;arms.forEach((a,i)=>a.rotation.x=(i?1:-1)*f*.62);legs.forEach((l,i)=>{const n=(i?-1:1)*f;l.rotation.x=n*.62;l.userData.knee.rotation.x=Math.max(0,-n)*.52})}}}
 function merch(k,c='#ca7053'){const g=group(),cream='#ffe3a9',dark='#323c53',gold='#dfab50';let b=(...a)=>B(g,...a),e=(...a)=>E(g,...a),q=(...a)=>shape(g,...a);
 if(['tarta','pastel','pan','jabón','esponja'].includes(k)){q('round',cream,0,.15,0,.95,.3,.76);q('round',k==='pan'?gold:c,0,.38,0,.85,.19,.69);for(let i=-1;i<2;i++)e('#c84550',i*.23,.53,0,.18,.19,.18)}
 else if(['vela','perfume','jarrón','lámpara','cafetera','taza','plato','maceta'].includes(k)){q('round',gold,0,.07,0,.64,.14,.64);q('taper',c,0,.37,0,.67,.53,.63);if(k==='vela')q('cone','#ffbd48',0,.77,0,.16,.29,.16);else if(k==='lámpara')q('cone',cream,0,.83,0,.96,.6,.96);else q('round',cream,0,.68,0,.37,.12,.37)}
 else if(['bolso','regalo','maleta','estuche','mochila','cesta'].includes(k)){b(c,0,.32,0,.87,.6,.42);q('ring',gold,0,.62,0,.54,.56,.38);b(gold,0,.38,.23,.14,.14,.05)}
 else if(['camiseta','vestido','abrigo','sombrero'].includes(k)){q('taper',c,0,.52,0,.7,.82,.38);for(const s of [-1,1])b(c,s*.34,.8,0,.29,.38,.36,0,0,s*.56);b(cream,0,.87,.14,.18,.11,.12);if(k==='vestido')q('cone',c,0,.25,0,.98,.6,.62)}
 else if(['zapato','bota','zapatilla'].includes(k)){e(cream,0,.1,0,1,.18,.47);e(c,0,.26,0,.99,.39,.46);b(c,.23,.44,0,.41,.31,.41);for(let i=0;i<3;i++)b(cream,i*.09,.46,.04,.036,.03,.3)}
 else if(['libro','cuaderno','mapa','partitura','puzle','dados'].includes(k)){b(c,0,.45,0,.68,.86,.19);b(cream,0,.45,.11,.52,.68,.03);b(c,0,.56,.14,.43,.25,.02);b(gold,0,.3,.14,.34,.03,.02)}
 else if(['rosa','ramo','flor','hojas','lápiz','pluma'].includes(k)){b('#42856b',0,.41,0,.05,.82,.05);e('#5c9c69',.12,.38,0,.31,.12,.11,0,0,.5);for(let j=0;j<5;j++)q('rock',c,Math.cos(j*1.26)*.13,.8+Math.sin(j*1.26)*.12,0,.28,.26,.24)}
 else if(['gafas','auriculares','vinilo','anillo','collar','reloj','balón','ovillo','medalla'].includes(k)){if(['balón','ovillo'].includes(k)){q('rock',cream,0,.4,0,.83,.83,.83);q('rock',dark,.12,.48,.32,.36,.28,.13)}else if(k==='gafas'){for(let s of [-1,1])q('ring',dark,s*.21,.35,0,.52,.4,.25);b(gold,0,.37,0,.16,.06,.08)}else{q('ring',dark,0,.5,0,.88,.88,.35);e(c,0,.5,.02,.36,.36,.14)}}
 else if(k==='silla'){b(c,0,.42,0,.76,.12,.67);b(c,0,.76,-.24,.76,.68,.15);for(let x of [-.29,.29])for(let z of [-.24,.24])b(dark,x,.2,z,.08,.4,.08)}
 else if(['móvil','altavoz','cámara'].includes(k)){b(dark,0,.42,0,.71,.78,.32);b(c,0,.42,.17,.6,.62,.04);q('ring',dark,0,.45,.2,.42,.42,.28)}
 else {q('rock',c,0,.46,0,.71,.74,.51);b(gold,0,.1,0,.78,.13,.55)}
 return g}
 return {T,paint,trim,group,shape,B,E,cast,merch,geo,material}
})();

/**
 * backgrounds.js
 * Virtual background drawers — called per-frame by camera.js
 */

const Backgrounds = (() => {
  let current = 'none';

  const drawers = {

    aincrad(ctx, w, h, t) {
      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0,'#050118'); grad.addColorStop(0.5,'#150838'); grad.addColorStop(1,'#080d22');
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
      // stars
      for(let i=0;i<100;i++){
        const sx=(i*137)%w, sy=(i*97)%(h*0.7);
        ctx.globalAlpha=0.3+0.7*Math.abs(Math.sin(t*0.02+i));
        ctx.fillStyle='#fff'; ctx.fillRect(sx,sy,i%5===0?2:1,i%5===0?2:1);
      }
      ctx.globalAlpha=1;
      // floating islands
      [{x:.15,y:.62,w:.18},{x:.38,y:.52,w:.26},{x:.68,y:.67,w:.2}].forEach((p,i)=>{
        const dy=Math.sin(t*.015+i)*10;
        const px=p.x*w,py=p.y*h+dy,pw=p.w*w;
        // island body
        ctx.fillStyle='#2d1060'; ctx.fillRect(px,py,pw,16);
        ctx.fillStyle='#1a0840'; ctx.fillRect(px+4,py+16,pw-8,20);
        // glow
        const g=ctx.createLinearGradient(0,py+16,0,py+50);
        g.addColorStop(0,'rgba(140,80,255,0.5)'); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.fillRect(px,py+16,pw,34);
      });
      // castle
      ctx.fillStyle='rgba(15,5,50,0.85)';
      const cx=w*.5,cy=h*.4;
      ctx.beginPath();
      ctx.moveTo(cx-70,cy+70);ctx.lineTo(cx-70,cy+10);ctx.lineTo(cx-50,cy-10);
      ctx.lineTo(cx-38,cy+10);ctx.lineTo(cx-18,cy-30);ctx.lineTo(cx,cy-55);
      ctx.lineTo(cx+18,cy-30);ctx.lineTo(cx+38,cy+10);ctx.lineTo(cx+50,cy-10);
      ctx.lineTo(cx+70,cy+10);ctx.lineTo(cx+70,cy+70);ctx.closePath();ctx.fill();
      // castle glow
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,100);
      cg.addColorStop(0,'rgba(100,60,200,0.15)');cg.addColorStop(1,'transparent');
      ctx.fillStyle=cg;ctx.fillRect(0,0,w,h);
    },

    arcade(ctx,w,h,t){
      ctx.fillStyle='#06000e';ctx.fillRect(0,0,w,h);
      // ceiling lights
      ['#ff00cc','#00ffcc','#ffcc00','#0088ff','#ff4400'].forEach((c,i)=>{
        const lx=(i/4)*w;
        const lg=ctx.createRadialGradient(lx,0,0,lx,0,130);
        lg.addColorStop(0,c+'99');lg.addColorStop(1,'transparent');
        ctx.fillStyle=lg;ctx.fillRect(0,0,w,h);
      });
      // floor grid
      const hor=h*.55;
      ctx.strokeStyle='rgba(0,255,200,0.5)';ctx.lineWidth=1;
      for(let i=0;i<=12;i++){const x=(i/12)*w;ctx.beginPath();ctx.moveTo(w/2,hor);ctx.lineTo(x,h);ctx.stroke();}
      for(let j=1;j<=8;j++){
        const p=j/8,y=hor+(h-hor)*(p*p);
        ctx.beginPath();ctx.moveTo(w/2-(w/2)*p,y);ctx.lineTo(w/2+(w/2)*p,y);ctx.stroke();
      }
      // cabinet silhouettes
      [-0.3,0,0.3].forEach((pos,i)=>{
        const cx=w/2+pos*w,ch=h*.42,cw=55;
        const colors=['rgba(255,0,200,0.5)','rgba(0,255,200,0.5)','rgba(255,200,0,0.5)'];
        ctx.fillStyle=colors[i];ctx.fillRect(cx-cw/2,h-ch,cw,ch);
        ctx.strokeStyle=colors[i].replace('.5','.9');ctx.lineWidth=1.5;
        ctx.strokeRect(cx-cw/2,h-ch,cw,ch);
      });
      // scanlines
      for(let y=0;y<h;y+=4){ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(0,y,w,2);}
    },

    space(ctx,w,h,t){
      ctx.fillStyle='#000008';ctx.fillRect(0,0,w,h);
      // nebulas
      [{x:.2,y:.3,r:200,c:'rgba(100,0,200,0.14)'},{x:.75,y:.6,r:220,c:'rgba(0,80,200,0.1)'},{x:.5,y:.1,r:160,c:'rgba(200,0,100,0.09)'}]
        .forEach(n=>{const g=ctx.createRadialGradient(n.x*w,n.y*h,0,n.x*w,n.y*h,n.r);g.addColorStop(0,n.c);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);});
      // stars
      for(let i=0;i<140;i++){
        const tw=.4+.6*Math.abs(Math.sin(t*.03+i*.7));
        ctx.globalAlpha=tw*(i%5===0?1:.5);
        ctx.fillStyle=i%7===0?'#aaddff':'#fff';
        ctx.fillRect((i*173)%w,(i*113)%h,i%10===0?2.5:1,i%10===0?2.5:1);
      }
      ctx.globalAlpha=1;
      // planet
      const pg=ctx.createRadialGradient(w*.8,h*.22,0,w*.8,h*.22,65);
      pg.addColorStop(0,'#5577ff');pg.addColorStop(.6,'#2233aa');pg.addColorStop(1,'#001133');
      ctx.fillStyle=pg;ctx.beginPath();ctx.arc(w*.8,h*.22,65,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(120,160,255,0.45)';ctx.lineWidth=8;
      ctx.beginPath();ctx.ellipse(w*.8,h*.22,100,18,-0.3,0,Math.PI*2);ctx.stroke();
    },

    forest(ctx,w,h,t){
      const sg=ctx.createLinearGradient(0,0,0,h);
      sg.addColorStop(0,'#061404');sg.addColorStop(.5,'#122808');sg.addColorStop(1,'#081204');
      ctx.fillStyle=sg;ctx.fillRect(0,0,w,h);
      // moon
      const mg=ctx.createRadialGradient(w*.12,h*.1,0,w*.12,h*.1,38);
      mg.addColorStop(0,'rgba(220,255,180,.9)');mg.addColorStop(.5,'rgba(180,255,120,.5)');mg.addColorStop(1,'transparent');
      ctx.fillStyle=mg;ctx.beginPath();ctx.arc(w*.12,h*.1,28,0,Math.PI*2);ctx.fill();
      // fireflies
      for(let i=0;i<25;i++){
        const fx=((i*137+t*(i%2?.3:-.2))%w+w)%w;
        const fy=h*.25+((i*97+t*.1)%(h*.55));
        ctx.globalAlpha=.3+.7*Math.abs(Math.sin(t*.05+i*1.3));
        ctx.fillStyle='#aaff44';ctx.shadowColor='#aaff44';ctx.shadowBlur=10;
        ctx.beginPath();ctx.arc(fx,fy,2,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      // trees
      [.04,.14,.24,.54,.64,.74,.84,.94].forEach((xp,i)=>{
        const tx=xp*w,th=70+(i%3)*45,sw=Math.sin(t*.02+i)*3;
        ctx.fillStyle='#140800';ctx.fillRect(tx-5,h-th,10,th);
        ctx.fillStyle=i%2?'#0a3006':'#124008';
        ctx.beginPath();ctx.moveTo(tx+sw,h-th-35);ctx.lineTo(tx-28,h-th+18);ctx.lineTo(tx+28,h-th+18);ctx.closePath();ctx.fill();
        ctx.beginPath();ctx.moveTo(tx+sw,h-th-60);ctx.lineTo(tx-18,h-th-14);ctx.lineTo(tx+18,h-th-14);ctx.closePath();ctx.fill();
      });
      // ground fog
      const fg=ctx.createLinearGradient(0,h-50,0,h);
      fg.addColorStop(0,'transparent');fg.addColorStop(1,'rgba(80,180,60,.12)');
      ctx.fillStyle=fg;ctx.fillRect(0,h-50,w,50);
    },

    city(ctx,w,h,t){
      const sg=ctx.createLinearGradient(0,0,0,h);
      sg.addColorStop(0,'#040010');sg.addColorStop(.6,'#0e0022');sg.addColorStop(1,'#180030');
      ctx.fillStyle=sg;ctx.fillRect(0,0,w,h);
      // horizon glow
      const hg=ctx.createRadialGradient(w/2,h*.65,0,w/2,h*.65,w*.6);
      hg.addColorStop(0,'rgba(255,0,180,.14)');hg.addColorStop(.5,'rgba(0,100,255,.08)');hg.addColorStop(1,'transparent');
      ctx.fillStyle=hg;ctx.fillRect(0,0,w,h);
      // buildings
      for(let i=0;i<14;i++){
        const bx=(i/13)*w-8,bw=38+(i*37%52),bh=70+(i*67%190);
        const colors=['rgba(255,0,150,.7)','rgba(0,150,255,.7)','rgba(100,0,200,.6)'];
        ctx.fillStyle='rgba(4,0,12,.95)';ctx.fillRect(bx,h-bh,bw,bh);
        ctx.strokeStyle=colors[i%3];ctx.lineWidth=1;ctx.strokeRect(bx,h-bh,bw,bh);
        // windows
        for(let wy=h-bh+8;wy<h-10;wy+=13)
          for(let wx=bx+5;wx<bx+bw-5;wx+=9)
            if((i*wy*wx)%7>2){ctx.fillStyle=Math.random()>.6?'#ffcc00aa':colors[i%3].replace('.7','.9');ctx.fillRect(wx,wy,4,6);}
      }
      // rain
      ctx.strokeStyle='rgba(100,180,255,.2)';ctx.lineWidth=1;
      for(let i=0;i<70;i++){
        const rx=((i*173+t*3)%w),ry=((i*97+t*5)%h);
        ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-1,ry+12);ctx.stroke();
      }
    },

    sunset(ctx,w,h,t){
      const sg=ctx.createLinearGradient(0,0,0,h*.6);
      sg.addColorStop(0,'#080018');sg.addColorStop(.4,'#2a0050');sg.addColorStop(.7,'#bb0044');sg.addColorStop(1,'#ff5500');
      ctx.fillStyle=sg;ctx.fillRect(0,0,w,h*.6);
      // sun
      const sun=ctx.createRadialGradient(w/2,h*.48,0,w/2,h*.48,68);
      sun.addColorStop(0,'#fff');sun.addColorStop(.3,'#ffee00');sun.addColorStop(.7,'#ff6600');sun.addColorStop(1,'transparent');
      ctx.fillStyle=sun;ctx.fillRect(0,0,w,h);
      // sun stripes
      ctx.fillStyle='#080018';
      for(let i=0;i<8;i++)ctx.fillRect(w/2-68,h*.4+i*9+i*i*.4,136,4+i*.4);
      // ground
      ctx.fillStyle='#080018';ctx.fillRect(0,h*.6,w,h*.4);
      // grid
      const hor=h*.6;
      ctx.strokeStyle='rgba(255,0,180,.6)';ctx.lineWidth=1;
      for(let i=0;i<=10;i++){ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(w/2,hor);ctx.lineTo((i/10)*w,h);ctx.stroke();}
      for(let j=1;j<=6;j++){
        const p=j/6,y=hor+(h-hor)*(p*p);
        ctx.globalAlpha=.3+p*.5;ctx.beginPath();
        ctx.moveTo(w/2-(w/2)*p,y);ctx.lineTo(w/2+(w/2)*p,y);ctx.stroke();
      }
      ctx.globalAlpha=1;
      // stars
      for(let i=0;i<50;i++){
        ctx.globalAlpha=.3+.7*Math.abs(Math.sin(t*.04+i));
        ctx.fillStyle='#fff';ctx.fillRect((i*173)%w,(i*97)%(h*.38),1.5,1.5);
      }
      ctx.globalAlpha=1;
    },

    matrix(ctx,w,h,t){
      ctx.fillStyle='rgba(0,4,0,.88)';ctx.fillRect(0,0,w,h);
      ctx.font='14px monospace';
      const cols=Math.floor(w/14);
      for(let c=0;c<cols;c++){
        const speed=.5+(c*37%10)*.15,offset=(c*97)%h;
        const y=((t*speed+offset)%(h+200))-100;
        for(let r=0;r<22;r++){
          ctx.globalAlpha=(22-r)/22*.75;
          const ch2=0x30A0+((c*13+r+Math.floor(t*.1))%96);
          ctx.fillStyle=r===0?'#ccffcc':'#00cc44';
          ctx.fillText(String.fromCharCode(ch2),c*14,y-r*14);
        }
      }
      ctx.globalAlpha=1;
    },

    dungeon(ctx,w,h,t){
      ctx.fillStyle='#0a0806';ctx.fillRect(0,0,w,h);
      // stone walls
      for(let row=0;row<Math.ceil(h/28);row++)
        for(let col=0;col<Math.ceil(w/58)+1;col++){
          const off=row%2?29:0,sx=col*58-off,sy=row*28;
          const sh=18+(row*7+col*13)%14;
          ctx.fillStyle=`rgb(${sh},${sh-2},${sh-3})`;ctx.fillRect(sx+1,sy+1,56,26);
          ctx.strokeStyle='#040302';ctx.lineWidth=1;ctx.strokeRect(sx,sy,58,28);
        }
      // torches
      [.12,.88].forEach((xp,i)=>{
        const tx=xp*w,ty=h*.33,fl=Math.sin(t*.15+i)*.3+.7;
        const fg=ctx.createRadialGradient(tx,ty,0,tx,ty,65*fl);
        fg.addColorStop(0,`rgba(255,200,50,${.65*fl})`);fg.addColorStop(.4,`rgba(255,100,0,${.3*fl})`);fg.addColorStop(1,'transparent');
        ctx.fillStyle=fg;ctx.fillRect(0,0,w,h);
        ctx.fillStyle='#2a1608';ctx.fillRect(tx-3,ty,6,18);
        ctx.fillStyle=`rgba(255,${140+Math.sin(t*.2)*50|0},0,.9)`;
        ctx.beginPath();ctx.moveTo(tx,ty-18*fl);ctx.lineTo(tx-7,ty);ctx.lineTo(tx+7,ty);ctx.closePath();ctx.fill();
      });
      // ground shadow
      const gg=ctx.createLinearGradient(0,h*.78,0,h);
      gg.addColorStop(0,'transparent');gg.addColorStop(1,'rgba(0,0,0,.75)');
      ctx.fillStyle=gg;ctx.fillRect(0,h*.78,w,h*.22);
    },
  };

  function drawFrame(ctx, w, h, t) {
    if (current !== 'none' && drawers[current]) {
      drawers[current](ctx, w, h, t);
    }
  }

  function setBackground(name) { current = name; }
  function getCurrent() { return current; }

  return { drawFrame, setBackground, getCurrent };
})();

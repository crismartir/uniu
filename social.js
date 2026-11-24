(()=>{
  const token=localStorage.getItem('unio-token');
  if(!token)return;
  const main=document.querySelector('main')||document.querySelector('.main');
  if(!main||document.querySelector('#unio-friendships'))return;
  const client=window.UNIOSocial;
  const h={Authorization:'Bearer '+token,'Content-Type':'application/json'};
  const box=document.createElement('section');
  box.id='unio-friendships';
  box.style.cssText='margin:0 0 18px;padding:18px;border:1px solid #ded6cf;border-radius:18px;background:#fff';
  box.innerHTML='<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#873c56;font-weight:800">Conexões</div><h2 style="margin:6px 0">Amizades com reciprocidade</h2><p style="color:#4b5750;margin:0 0 10px">O messenger só é liberado depois que o pedido é aceito.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="friend-target" type="number" min="1" placeholder="ID do usuário" style="width:150px;padding:9px;border:1px solid #ded6cf;border-radius:9px"><button id="friend-send" type="button" style="padding:9px 12px;border:0;border-radius:999px;background:#873c56;color:#fff;font-weight:700">Enviar pedido</button><button id="friend-refresh" type="button" style="padding:9px 12px;border:1px solid #ded6cf;border-radius:999px;background:#fff;font-weight:700">Atualizar</button></div><div id="friend-list" aria-live="polite" style="margin-top:12px"></div>';
  main.prepend(box);
  const list=box.querySelector('#friend-list');
  const current=()=>Number(JSON.parse(localStorage.getItem('unio-user')||'{}').id);
  const load=async()=>{
    const d=client?await client.friendships():await fetch('/api/friendships',{headers:h}).then(r=>r.json());
    const rows=d.friendships||[];
    list.innerHTML=rows.length?rows.map(x=>{
      const incoming=x.addresseeId!==current();
      const actions=x.status==='PENDING'&&incoming?`<button data-action="ACCEPTED" data-id="${x.id}">Aceitar</button><button data-action="DECLINED" data-id="${x.id}">Recusar</button>`:`<span>${incoming?'recebido':'enviado'}</span>`;
      const name=x.peer?.name||`Pessoa ${incoming?x.requesterId:x.addresseeId}`;
      return `<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;padding:8px 0;border-top:1px solid #ded6cf"><span>${name} · ${x.status}</span><span style="display:flex;gap:5px">${actions}</span></div>`;
    }).join(''):'<p style="color:#4b5750">Nenhum pedido ainda.</p>';
    list.querySelectorAll('button[data-action]').forEach(b=>b.onclick=async()=>{if(client)await client.patch('/api/friendships/'+b.dataset.id,{status:b.dataset.action});else await fetch('/api/friendships/'+b.dataset.id,{method:'PATCH',headers:h,body:JSON.stringify({status:b.dataset.action})});load()});
  };
  box.querySelector('#friend-send').onclick=async()=>{const target=Number(box.querySelector('#friend-target').value);if(!target)return;try{if(client)await client.post('/api/friendships',{targetUserId:target});else{const r=await fetch('/api/friendships',{method:'POST',headers:h,body:JSON.stringify({targetUserId:target})});if(!r.ok){const d=await r.json();throw new Error(d.error)}}box.querySelector('#friend-target').value='';load()}catch(error){alert(error.message||'Não foi possível enviar o pedido.')}};
  box.querySelector('#friend-refresh').onclick=load;
  load();
})();

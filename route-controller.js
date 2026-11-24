(()=>{
  const route=()=>location.hash||'#descobrir';
  const hide=(selector,yes)=>{document.querySelectorAll(selector).forEach(x=>x.style.display=yes?'none':'');};
  const apply=()=>{
    const r=route();
    hide('#profiles',r!=='#descobrir');
    hide('#unio-feed-interactions',r!=='#feed');
    hide('#unio-friendships',r!=='#feed');
    hide('#unio-messenger',r!=='#conversas');
    hide('#unio-intelligence',r!=='#descobrir');
    hide('#lumi-entry',r!=='#descobrir');
    document.querySelectorAll('#post-form,#feed-list').forEach(node=>{const original=node.closest('section');if(original)original.style.display='none';});
    const heading=document.querySelector('.headline h1');
    const eyebrow=document.querySelector('.headline .eyebrow');
    if(heading&&eyebrow){
      const copy={
        '#descobrir':['Pessoas com interesses próximos','Área privada · descobrir'],
        '#feed':['Um espaço para compartilhar com intenção','Área privada · feed'],
        '#conversas':['Conversas com reciprocidade','Área privada · mensagens'],
        '#experiencias':['Escolha como quer viver o unio','Área privada · experiências'],
        '#perfil':['Seu perfil, no seu ritmo','Área privada · perfil']
      }[r]||['Pessoas com interesses próximos','Área privada · descobrir'];
      heading.textContent=copy[0];eyebrow.textContent=copy[1];
    }
    let panel=document.querySelector('#experience-panel');
    if(r==='#experiencias'){
      if(!panel){panel=document.createElement('section');panel.id='experience-panel';panel.className='card';panel.style.cssText='padding:24px;background:linear-gradient(135deg,#fffaf0,#f7f1e8);border:1px solid #d4b27a88';panel.innerHTML='<img src="unio-lumi.png" alt="Lumi, guia das conexões" style="width:92px;float:right;filter:drop-shadow(0 0 18px #d4b27a)"><div class="eyebrow">Lumi · experiências</div><h2>Mais clareza, ou mais encanto?</h2><p style="color:var(--muted)">A experiência clássica mantém o foco na descoberta. A experiência mágica acrescenta estados emocionais, comunidades guiadas e celebrações sutis — sempre com controle e respeito ao seu ritmo.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a href="magic.html" style="padding:10px 14px;border-radius:999px;background:var(--forest);color:#fff;text-decoration:none;font-weight:800">Ativar experiência mágica</a><a href="#descobrir" style="padding:10px 14px;border-radius:999px;border:1px solid var(--border);color:var(--ink);text-decoration:none;font-weight:800">Continuar clássica</a></div>';document.querySelector('main')?.append(panel)}
    }else if(panel)panel.remove();
  };
  apply();
  addEventListener('hashchange',apply);
  // Os módulos legados são criados de forma assíncrona no app.html. Uma
  // segunda aplicação atrasada é suficiente; observer contínuo gerava custo
  // desnecessário e podia provocar instabilidade em sessões longas.
  setTimeout(apply,500);
})();

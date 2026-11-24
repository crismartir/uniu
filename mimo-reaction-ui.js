(()=>{
const sprite='/mimo-reactions.png';
const icon=(size=26,gray=true,asset=null)=>{const position=asset?.sprite||'100% 0%';return '<span data-mimo-icon aria-hidden="true" style="display:block;width:'+size+'px;height:'+size+'px;background-image:url('+sprite+');background-size:500% 200%;background-position:'+position+';background-repeat:no-repeat;'+(gray?'filter:grayscale(1);opacity:.78;':'')+'"></span>'};
const enhance=()=>document.querySelectorAll('[data-reaction-menu]').forEach(trigger=>{
  const firstWire=trigger.dataset.mimoUi!=='1';trigger.dataset.mimoUi='1';
  trigger.style.minWidth='44px';trigger.style.justifyContent='center';trigger.style.padding='6px 9px';
  const selected=trigger.querySelector('[data-selected]');
  if(selected){const raw=selected.textContent.trim(),chosen=selected.dataset.mimoCode||((raw&&raw!=='Reagir'&&raw!=='true')?{sprite:'100% 0%',displayName:raw}:null);if(!selected.querySelector('[data-mimo-icon]'))selected.innerHTML=chosen?icon(34,false,chosen):icon(30,true);selected.setAttribute('aria-label',chosen?'Reação selecionada: '+chosen.displayName:'Escolher uma reação do Mimo')}
  const menu=trigger.parentElement?.querySelector('[data-reaction-box]');if(!menu)return;
  menu.style.maxWidth='min(560px,calc(100vw - 24px))';menu.style.overflowX='auto';menu.style.flexWrap='nowrap';menu.style.scrollbarWidth='thin';menu.style.top='calc(100% + 8px)';menu.style.bottom='auto';menu.style.left='0';
  const close=()=>{menu.hidden=true;menu.style.display='none';trigger.setAttribute('aria-expanded','false')};
  const open=()=>{menu.hidden=false;menu.style.display='flex';trigger.setAttribute('aria-expanded','true')};
  if(firstWire){close();menu.querySelectorAll('[data-reaction]').forEach(option=>{option.style.flex='0 0 auto';option.style.minWidth='62px';option.style.padding='5px 4px';option.addEventListener('click',close)});trigger.onmouseenter=null;trigger.onmouseleave=null;trigger.onclick=e=>{e.preventDefault();e.stopPropagation();menu.hidden?open():close()}}
});
enhance();new MutationObserver(enhance).observe(document.body,{subtree:true,childList:true});
document.addEventListener('click',e=>{if(e.target.closest('[data-reaction]'))setTimeout(enhance,0);else if(!e.target.closest('[data-reaction-menu]'))document.querySelectorAll('[data-reaction-box]').forEach(menu=>{menu.hidden=true;menu.style.display='none'})},true);
})();

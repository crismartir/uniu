(()=>{
  const sprite="/mimo-reactions.png";
  const icon=(size=26,gray=true)=>`<span aria-hidden="true" style="display:block;width:${size}px;height:${size}px;background-image:url('${sprite}');background-size:500% 200%;background-position:100% 100%;background-repeat:no-repeat;${gray?'filter:grayscale(1);opacity:.78;':''}"></span>`;
  const enhance=()=>document.querySelectorAll('[data-reaction-menu]').forEach(trigger=>{
    if(trigger.dataset.mimoUi==='1')return;
    trigger.dataset.mimoUi='1';
    trigger.style.minWidth='44px';
    trigger.style.justifyContent='center';
    trigger.style.padding='6px 9px';
    const selected=trigger.querySelector('[data-selected]');
    if(selected){selected.innerHTML=icon();selected.setAttribute('aria-label','Escolher uma reação do Mimo');}
    const menu=trigger.parentElement?.querySelector('[data-reaction-box]');
    if(menu){menu.style.maxWidth='min(520px,calc(100vw - 24px))';menu.style.overflowX='auto';menu.style.flexWrap='nowrap';menu.style.scrollbarWidth='thin';menu.querySelectorAll('[data-reaction]').forEach(option=>{option.style.flex='0 0 auto';option.style.minWidth='54px';});}
  });
  enhance();
  new MutationObserver(enhance).observe(document.body,{subtree:true,childList:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-reaction]'))setTimeout(enhance,0);},true);
})();

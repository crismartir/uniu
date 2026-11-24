(()=>{
  const apply=()=>document.querySelectorAll('#social-posts article img').forEach(image=>{
    image.style.width='100%';
    image.style.maxHeight='320px';
    image.style.objectFit='cover';
    image.style.objectPosition='center';
    image.style.display='block';
    image.style.borderRadius='14px';
    image.style.margin='10px 0';
  });
  apply();
  new MutationObserver(apply).observe(document.body,{subtree:true,childList:true});
})();

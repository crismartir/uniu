/* UNIU social client boundary.
 * Inspired by the Bluesky separation between views, server state and API code.
 * The backend remains the single source of truth; this module only normalizes
 * authenticated requests so future React/TanStack Query migration has one seam.
 */
(()=>{
  const token=()=>localStorage.getItem('unio-token')||'';
  const request=async(url,options={})=>{
    const headers=Object.assign({'Content-Type':'application/json'},options.headers||{});
    if(token())headers.Authorization='Bearer '+token();
    const response=await fetch(url,{...options,headers});
    let data=null;
    try{data=await response.json()}catch{}
    if(!response.ok){const error=new Error(data?.error||`request_failed_${response.status}`);error.status=response.status;error.data=data;throw error}
    return data;
  };
  window.UNIOSocial={
    token,
    request,
    get:(url)=>request(url),
    post:(url,body)=>request(url,{method:'POST',body:JSON.stringify(body||{})}),
    patch:(url,body)=>request(url,{method:'PATCH',body:JSON.stringify(body||{})}),
    put:(url,body)=>request(url,{method:'PUT',body:JSON.stringify(body||{})}),
    feed:(query='')=>request('/api/feed'+query),
    communities:()=>request('/api/communities'),
    reactions:()=>request('/api/reactions/catalog'),
    friendships:()=>request('/api/friendships'),
    conversations:()=>request('/api/conversations')
  };
})();

(function(){
"use strict";
var share=document.getElementById("site-share"),install=document.getElementById("site-install");
if(!share&&!install)return;
var home=new URL("./",document.baseURI).href,site="ثانوية حليمي محمد الصغير – سيدي داود",promptEvent=null,dialog=null;
var canonical=document.querySelector('link[rel="canonical"]');
var shareUrl=canonical?canonical.href:location.href.split("#")[0];
function metaValue(name){var el=document.querySelector('meta[property="'+name+'"],meta[name="'+name+'"]');return el?el.content:""}
var shareTitle=metaValue("og:title")||document.title;
var shareDesc=metaValue("og:description")||metaValue("description")||"بوابة الثانوية الإلكترونية";
function makeSocialLinks(){
 var group=document.createElement("div");group.className="share-social-grid";group.id="share-social-grid";
 var entries=[
 ["واتساب","https://api.whatsapp.com/send?text="+encodeURIComponent(shareTitle+"\n"+shareDesc+"\n"+shareUrl)],
 ["فيسبوك","https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(shareUrl)],
 ["تيليغرام","https://t.me/share/url?url="+encodeURIComponent(shareUrl)+"&text="+encodeURIComponent(shareTitle+" — "+shareDesc)],
 ["X","https://twitter.com/intent/tweet?url="+encodeURIComponent(shareUrl)+"&text="+encodeURIComponent(shareTitle)],
 ["لينكدإن","https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(shareUrl)]
 ];
 entries.forEach(function(entry){var link=document.createElement("a");link.className="share-social-link";link.href=entry[1];link.textContent=entry[0];link.target="_blank";link.rel="noopener noreferrer";group.append(link)});
 return group;
}
function makeSharePreview(){
 var preview=document.createElement("div");preview.className="share-preview";preview.id="share-preview";
 var icon=document.createElement("img");icon.src=new URL("assets/icons/school-emblem-512.png",home).href;icon.alt="شعار الثانوية";icon.width=64;icon.height=64;
 var box=document.createElement("div");var name=document.createElement("strong");name.textContent=shareTitle;
 var desc=document.createElement("p");desc.textContent=shareDesc;box.append(name,desc);preview.append(icon,box);return preview;
}
function modal(title,message,link){
 if(!dialog){
  dialog=document.createElement("dialog");dialog.className="site-dialog";dialog.setAttribute("aria-labelledby","site-dialog-title");
  var h=document.createElement("div");h.className="site-dialog-head";
  var t=document.createElement("h2");t.id="site-dialog-title";
  var c=document.createElement("button");c.type="button";c.className="site-dialog-close";c.setAttribute("aria-label","إغلاق");c.textContent="×";
  c.onclick=function(){dialog.close()};h.append(t,c);
  var p=document.createElement("p");p.id="site-dialog-message";
  var u=document.createElement("input");u.type="text";u.id="site-dialog-link";u.className="site-dialog-link";u.readOnly=true;u.dir="ltr";
  var b=document.createElement("button");b.type="button";b.className="site-dialog-copy";b.textContent="نسخ الرابط";
  var status=document.createElement("p");status.className="site-dialog-status";status.setAttribute("role","status");
  b.onclick=async function(){
   var ok=false;try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(shareUrl);ok=true}}catch(e){}
   if(!ok){try{u.focus();u.select();ok=document.execCommand("copy")}catch(e){}}
   status.textContent=ok?"تم نسخ الرابط.":"حدّد الرابط وانسخه يدويًا.";if(!ok){u.focus();u.select()}
  };
  dialog.append(h,p,makeSharePreview(),makeSocialLinks(),u,b,status);document.body.append(dialog);
  dialog.addEventListener("click",function(e){if(e.target===dialog)dialog.close()});
 }
 dialog.querySelector("#site-dialog-title").textContent=title;
 dialog.querySelector("#site-dialog-message").textContent=message;
 dialog.querySelector("#site-dialog-link").value=shareUrl;
 dialog.querySelector("#share-preview").hidden=!link;
 dialog.querySelector("#share-social-grid").hidden=!link;
 dialog.querySelector("#site-dialog-link").hidden=!link;
 dialog.querySelector(".site-dialog-copy").hidden=!link;
 dialog.querySelector(".site-dialog-status").textContent="";
 if(!dialog.open)dialog.showModal();
}
function isInstalled(){return window.matchMedia&&matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}
function refresh(){if(!install)return;var yes=isInstalled();install.setAttribute("aria-label",yes?"الموقع مثبت":"تثبيت الموقع");install.title=yes?"الموقع مثبت":"تثبيت الموقع";if(yes)install.setAttribute("aria-disabled","true");else install.removeAttribute("aria-disabled");var label=document.getElementById("install-label");if(label)label.textContent=yes?"مثبت":"تثبيت التطبيق"}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();promptEvent=e});
window.addEventListener("appinstalled",function(){promptEvent=null;refresh()});
if(window.matchMedia){var media=matchMedia("(display-mode: standalone)");if(media.addEventListener)media.addEventListener("change",refresh)}
if(share)share.addEventListener("click",async function(){
 if(navigator.share)try{await navigator.share({title:shareTitle,text:shareDesc,url:shareUrl});return}catch(e){if(e.name==="AbortError")return}
 modal("مشاركة الصفحة","شارك الصفحة مباشرة على منصة التواصل المناسبة، أو انسخ رابطها.",true);
});
if(install)install.addEventListener("click",async function(){
 if(isInstalled()){modal("التطبيق مثبت","يمكنك فتح الموقع من الشاشة الرئيسية أو قائمة التطبيقات.",false);return}
 if(promptEvent){var p=promptEvent;promptEvent=null;try{await p.prompt();await p.userChoice;refresh();return}catch(e){}}
 var ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;
 if(ios)modal("تثبيت الموقع على iPhone أو iPad","افتح الموقع في Safari، واضغط مشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية».",false);
 else modal("تثبيت الموقع","من قائمة المتصفح (⋮) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» إن توفر الخيار. تختلف إمكانية التثبيت باختلاف المتصفح.",false);
});
refresh();
if("serviceWorker" in navigator&&isSecureContext)window.addEventListener("load",function(){navigator.serviceWorker.register(new URL("sw.js",home).href,{scope:home}).catch(function(e){console.warn("PWA registration:",e)})});
})();

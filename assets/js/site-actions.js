(function(){
"use strict";
var share=document.getElementById("site-share"),install=document.getElementById("site-install");
if(!share&&!install)return;
var home=new URL("./",document.baseURI).href,site="ثانوية حسين محمد الصغير – سيدي داود",promptEvent=null,dialog=null;
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
   var ok=false;try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(home);ok=true}}catch(e){}
   if(!ok){try{u.focus();u.select();ok=document.execCommand("copy")}catch(e){}}
   status.textContent=ok?"تم نسخ الرابط.":"حدّد الرابط وانسخه يدويًا.";if(!ok){u.focus();u.select()}
  };
  dialog.append(h,p,u,b,status);document.body.append(dialog);
  dialog.addEventListener("click",function(e){if(e.target===dialog)dialog.close()});
 }
 dialog.querySelector("#site-dialog-title").textContent=title;
 dialog.querySelector("#site-dialog-message").textContent=message;
 dialog.querySelector("#site-dialog-link").value=home;
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
 if(navigator.share)try{await navigator.share({title:site,text:"شارك موقع ثانوية حسين محمد الصغير – سيدي داود.",url:home});return}catch(e){if(e.name==="AbortError")return}
 modal("مشاركة موقع الثانوية","انسخ رابط الموقع وشاركه في التطبيق الذي تختاره.",true);
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

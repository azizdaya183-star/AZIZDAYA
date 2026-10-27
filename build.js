/* Génère une page web par article : articles/<slug>.html
   Usage : node build.js   (à lancer dans le dossier qui contient index.html) */
const fs = require("fs");
const src = fs.readFileSync("index.html", "utf8");
const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const code = src.slice(src.indexOf("const LIEN_WEELIFY"), src.indexOf("const PAGES"));
const { ARTICLES, CATS, AD_AFTER, AD } = new Function(code + ";return {ARTICLES,CATS,AD_AFTER,AD};")();

const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const fmt = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const enc = encodeURIComponent;

function withAd(html) {
  const blocks = html.match(/<(p|h2)[ >][\s\S]*?<\/\1>/g) || [html];
  let n = 0;
  return blocks.map((b, i) => {
    n += b.replace(/<[^>]+>/g, "").length;
    if (n >= AD_AFTER && i < blocks.length - 1 && !withAd.done) { withAd.done = true; return b + AD; }
    return b;
  }).join("\n");
}

fs.mkdirSync("articles", { recursive: true });
for (const a of ARTICLES) {
  withAd.done = false;
  const on = a.cat;
  const nav = `<a href="/#/">Accueil</a>` + CATS.concat("Divers").map(c => `<a href="/#/categorie/${enc(c)}" class="${c === on ? "on" : ""}">${c}</a>`).join("");
  const label = a.sub ? a.cat + " / " + a.sub : a.cat;
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(a.titre)} | AZIZ DAYA</title>
<meta name="description" content="${esc(a.resume)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.titre)}">
<meta property="og:description" content="${esc(a.resume)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Source+Serif+4:wght@400;600&display=swap">
<style>${css}</style>
</head>
<body>
<header><div class="wrap"><div class="top"><div class="brand"><a class="logo" href="/#/">AZIZ DAYA<i></i></a><a class="badge" href="/#/page/contact">Ouvert aux collaborations</a></div><button id="theme" type="button" aria-label="Changer de thème">Mode sombre</button></div><nav>${nav}</nav></div></header>
<main class="wrap"><article><a class="back" href="/#/">← Retour</a><div class="cat">${label}</div><h1>${a.titre}</h1><time>${fmt(a.date)}</time><div class="thumb"><span>${a.sub || a.cat}</span><img src="/images/${a.slug}.jpg" alt="${esc(a.titre)}" onerror="this.remove()"></div><div class="prose">${withAd(a.contenu)}</div></article></main>
<footer><div class="wrap"><span>© <span id="yr"></span> AZIZ DAYA. Tous droits réservés.</span><span><a href="/#/page/a-propos">À propos</a> &nbsp; <a href="/#/page/contact">Contact</a> &nbsp; <a href="/#/page/confidentialite">Confidentialité</a></span></div></footer>
<script>
const btn=document.getElementById("theme");
function applyTheme(t){document.documentElement.setAttribute("data-theme",t);btn.textContent=t==="dark"?"Mode clair":"Mode sombre";}
let theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
try{theme=localStorage.getItem("theme")||theme;}catch(e){}
applyTheme(theme);
btn.onclick=()=>{theme=theme==="dark"?"light":"dark";applyTheme(theme);try{localStorage.setItem("theme",theme);}catch(e){}};
document.getElementById("yr").textContent=new Date().getFullYear();
</script>
</body>
</html>`;
  fs.writeFileSync(`articles/${a.slug}.html`, html);
}
console.log(ARTICLES.length + " pages générées dans articles/");

export const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

export function layout(title, content, demo) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} · Good Chapter</title><style>
  :root{color-scheme:light;--paper:#F8EBDA;--card:#F8EBDA;--ink:#651C1A;--wine:#651C1A;--muted:#651C1A;--line:#ad7770;--cobalt:#284CD6;--clay:#C2402F;--serif:Georgia,serif;--sans:Georgia,serif;background:var(--paper);color:var(--ink);font-family:var(--sans)}
  *{box-sizing:border-box}body{margin:0}header{border-bottom:1px solid var(--line)}header div,main,footer{max-width:900px;margin:auto;padding-inline:clamp(20px,5vw,52px)}
  header div{display:flex;justify-content:space-between;align-items:center;gap:1rem;min-height:100px}
  .wordmark{font-family:var(--serif);font-size:clamp(1.45rem,4vw,2.1rem);font-weight:bold;letter-spacing:-.075em;color:var(--ink);text-decoration:none}
  .wordmark img{display:block;width:clamp(125px,24vw,180px);height:auto}.header-home{font-size:.8rem;text-decoration:none;color:var(--muted)}
  main{padding-top:clamp(30px,6vw,72px);padding-bottom:64px;min-height:65vh}footer{padding-block:22px;border-top:1px solid var(--line)}
  h1,h2,legend{font-family:var(--serif);font-weight:normal}h1{font-size:clamp(2.6rem,7vw,5.5rem);line-height:.94;letter-spacing:-.064em;margin:0 0 20px;overflow-wrap:anywhere}
  h2{font-size:clamp(1.45rem,3.5vw,2.1rem);line-height:1.06;letter-spacing:-.03em;margin:0 0 10px}
  p{line-height:1.6;margin:0 0 16px}p:last-child{margin-bottom:0}small{color:var(--muted)}a{color:var(--wine)}summary{cursor:pointer}details{margin:20px 0}
  .eyebrow{font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--wine);margin-bottom:15px}
  .chapter-hero{display:grid;grid-template-columns:minmax(0,1fr);align-items:center;gap:clamp(14px,5vw,44px);padding:clamp(22px,5vw,48px);border:1px solid var(--line);border-radius:6px;background:var(--card);margin-bottom:26px;border-top:6px solid var(--cobalt)}
  .chapter-hero h1{margin-bottom:12px}.chapter-hero p:last-child{color:var(--muted);max-width:53ch}
  .panel,.message{border:1px solid var(--line);border-radius:6px;background:var(--card);padding:clamp(18px,4vw,30px)}
  .message{white-space:pre-wrap;font-family:var(--serif);font-size:clamp(1.1rem,2.4vw,1.45rem);margin-bottom:18px;overflow-wrap:anywhere}
  label,input,textarea,button,.button,summary{font:inherit}label{display:block;margin:15px 0 7px;font-size:.9rem;font-weight:650}
  input[type=checkbox]{width:1.15em;height:1.15em;vertical-align:middle;accent-color:var(--wine);margin:0 7px 0 0}
  input:not([type=checkbox]),textarea{width:100%;display:block;border:1px solid #a88481;background:var(--card);color:inherit;padding:12px;border-radius:4px}
  textarea{min-height:100px;resize:vertical}fieldset{border:1px solid var(--line);border-radius:5px;padding:12px 16px 16px;margin:22px 0;min-width:0}legend{font-size:1.3rem;padding:0 7px}
  .button,button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin:10px 8px 0 0;padding:10px 16px;background:var(--cobalt);color:var(--paper);border:1px solid var(--cobalt);border-radius:4px;text-decoration:none;cursor:pointer;font-size:.87rem;font-weight:650}
  .quiet{background:transparent;color:var(--cobalt)}.button:hover,button:hover{box-shadow:inset 0 0 0 1px currentColor}
  :focus-visible{outline:2px solid #924332;outline-offset:4px}
  .gift-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,225px),1fr));gap:12px;margin-top:24px}
  .gift{padding:18px;border:1px solid var(--line);border-radius:5px;background:var(--card);margin-block:12px}.gift-grid .gift{margin:0;display:flex;flex-direction:column;align-items:flex-start}.gift-grid .gift form{margin-top:auto}
  .gift h2{font-size:1.5rem;margin-bottom:8px}.gift p{margin-bottom:4px;color:var(--muted)}.muted{color:var(--muted);font-size:.9rem}
  @media(max-width:380px){.chapter-hero{gap:10px}.chapter-hero h1{font-size:2.45rem}}
  </style><header><div><a class="wordmark" href="/" aria-label="Good Chapter, Co. home"><img src="/brand-logo.png" width="600" height="264" alt=""></a><a class="header-home" href="/">Home</a></div></header><main>${content}</main>
  <footer><small>${demo ? 'Demo mode · Sample gifts and simulated checkout' : 'Good Chapter, Co.'}</small></footer></html>`;
}

export function chapterHero(label, title, description) {
  return `<section class="chapter-hero"><div>
    ${label ? `<p class="eyebrow">${esc(label)}</p>` : ''}<h1>${esc(title)}</h1><p>${esc(description)}</p>
  </div></section>`;
}

export function field(label, name, value = '', options = '') {
  return `<label for="${name}">${esc(label)}</label><input id="${name}" name="${name}" value="${esc(value)}" ${options}>`;
}

export function area(label, name, value = '', options = '') {
  return `<label for="${name}">${esc(label)}</label><textarea id="${name}" name="${name}" ${options}>${esc(value)}</textarea>`;
}

export function checks(items, name, value, checked = false) {
  return items.map(item => `<label><input type="checkbox" name="${name}" value="${esc(item[value])}" ${checked ? 'checked' : ''}> ${esc(item.title ?? item.name)}${item.price ? ' · ' + esc(item.price) : ''}</label>`).join('');
}

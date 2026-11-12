export const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

export function layout(title, content, demo) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} · Good Chapter</title><style>
  :root{color-scheme:light;font-family:Georgia,serif;background:#f8f1e5;color:#421c27}
  *{box-sizing:border-box}body{margin:0}header{border-bottom:1px solid #d9c5b6}header div,main,footer{max-width:750px;margin:auto;padding:24px}
  header a{font-size:1.45rem;font-weight:bold;color:inherit;text-decoration:none}main{padding-top:52px;padding-bottom:64px}footer{border-top:1px solid #d9c5b6}
  h1{font-weight:normal;font-size:clamp(2.65rem,8vw,4.7rem);line-height:.97;letter-spacing:-.05em;margin:0 0 24px}
  h2{font-size:1.55rem;font-weight:normal;margin-bottom:10px}p{line-height:1.55} .message{white-space:pre-wrap}
  label,input,textarea,button,small,.button,summary{font:inherit}label{display:block;margin:17px 0 8px}
  input:not([type=checkbox]),textarea{width:100%;display:block;border:1px solid #a88481;background:#fffaf2;color:inherit;padding:12px;border-radius:4px}
  textarea{min-height:88px;resize:vertical}fieldset{border:1px solid #d9c5b6;padding:10px 16px 16px;margin:22px 0}
  .button,button{display:inline-block;margin-top:13px;padding:11px 17px;background:#671f39;color:white;border:1px solid #671f39;border-radius:4px;text-decoration:none;cursor:pointer}
  .quiet{background:transparent;color:#671f39}.gift{padding:16px 0;border-top:1px solid #d9c5b6}.gift h2{margin:0}
  small{color:#674952}a{color:#671f39}summary{cursor:pointer}details{margin:20px 0}
  </style><header><div><a href="/">Good Chapter</a></div></header><main>${content}</main>
  <footer><small>${demo ? 'Demo mode · Sample gifts and simulated checkout' : 'Good Chapter'}</small></footer></html>`;
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

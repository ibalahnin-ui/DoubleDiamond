/* Джеки — PP AI Assistant Microservice */
/* Auto-injects CSS + creates floating widget */
(function(){
'use strict';

/* ---- Inject CSS ---- */
if(!document.getElementById('ai-assistant-css')){
  var css=document.createElement('style');
  css.id='ai-assistant-css';
  css.textContent=`
*{margin:0;padding:0;box-sizing:border-box}
body{background:transparent;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}

#ai-root{position:fixed;bottom:0;right:0;z-index:99999;pointer-events:none}
#ai-root *{pointer-events:auto}

.ai-bubble{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;
  background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 4px 24px rgba(99,102,241,.5),0 0 40px rgba(99,102,241,.2);
  transition:all .3s cubic-bezier(.4,0,.2,1);font-size:24px;z-index:99999}
.ai-bubble:hover{transform:scale(1.08)}
.ai-bubble.open{background:linear-gradient(135deg,#4f46e5,#6366f1);box-shadow:0 4px 16px rgba(99,102,241,.3)}
.ai-bubble:not(.open){animation:aiBubblePulse 2s ease-in-out infinite}

.ai-panel{position:fixed;bottom:90px;right:24px;width:440px;max-height:75vh;display:flex;flex-direction:column;
  background:linear-gradient(180deg,#0f0f23 0%,#1a1a2e 100%);border-radius:16px;
  box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 40px rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.2);
  overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);z-index:99998}
.ai-panel.closed{transform:translateY(20px) scale(.95);opacity:0;pointer-events:none}
.ai-panel.open{transform:translateY(0) scale(1);opacity:1}

.ai-header{padding:14px 16px;background:linear-gradient(90deg,rgba(99,102,241,.15),rgba(139,92,246,.1));
  border-bottom:1px solid rgba(99,102,241,.2);display:flex;align-items:center;gap:10px}
.ai-avatar{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
  display:flex;align-items:center;justify-content:center;font-size:16px}
.ai-title{font-size:13px;font-weight:700;color:#e0e0ff}
.ai-subtitle{font-size:10px;color:#6366f1}
.ai-hdr-btn{cursor:pointer;font-size:14px;opacity:.6;padding:4px;transition:opacity .2s}
.ai-hdr-btn:hover{opacity:1}

.ai-messages{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;
  min-height:200px;max-height:55vh}
.ai-msg{display:flex}
.ai-msg.user{justify-content:flex-end}
.ai-msg.assistant{justify-content:flex-start}
.ai-msg-bubble{max-width:88%;padding:10px 14px;font-size:12px;line-height:1.6;word-break:break-word}
.ai-msg.user .ai-msg-bubble{border-radius:14px 14px 4px 14px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff}
.ai-msg.assistant .ai-msg-bubble{border-radius:14px 14px 14px 4px;background:rgba(255,255,255,.06);color:#c8c8e0;border:1px solid rgba(255,255,255,.08)}

.ai-input-bar{padding:10px 14px;border-top:1px solid rgba(99,102,241,.15);background:rgba(0,0,0,.2);display:flex;gap:8px}
.ai-input{flex:1;padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(99,102,241,.2);
  border-radius:12px;color:#e0e0ff;font-size:12px;outline:none}
.ai-input:focus{border-color:rgba(99,102,241,.5)}
.ai-send{padding:10px 16px;border:none;border-radius:12px;color:#fff;cursor:pointer;font-size:14px;transition:all .2s}
.ai-send.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);opacity:1}
.ai-send.inactive{background:rgba(99,102,241,.2);opacity:.5;cursor:default}

.ai-suggestions{padding:6px 14px 10px;display:flex;flex-wrap:wrap;gap:5px}
.ai-sug{padding:3px 10px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);
  border-radius:20px;font-size:10px;color:#a5b4fc;cursor:pointer;transition:background .2s}
.ai-sug:hover{background:rgba(99,102,241,.25)}

.ai-settings{position:fixed;bottom:24px;right:24px;width:380px;background:linear-gradient(135deg,#1a1a2e,#16213e);
  border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid rgba(99,102,241,.3);
  padding:24px;color:#e0e0ff;z-index:99999}
.ai-settings label{font-size:11px;color:#8888cc;display:block;margin-bottom:4px}
.ai-settings input{width:100%;padding:8px 12px;background:rgba(255,255,255,.08);
  border:1px solid rgba(99,102,241,.3);border-radius:8px;color:#e0e0ff;font-size:12px;box-sizing:border-box}
.ai-settings button{width:100%;padding:8px;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);
  border-radius:8px;color:#a5b4fc;cursor:pointer;font-size:12px;font-weight:600;margin-top:12px}

.ai-kb-ref{margin-top:6px;padding:4px 8px;background:rgba(99,102,241,.1);border-radius:6px;
  border-left:2px solid #6366f1;font-size:11px}

.ai-loading{display:flex;gap:4px;align-items:center;padding:10px 14px;border-radius:14px 14px 14px 4px;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}
.ai-loading span.label{font-size:11px;color:#6366f1;margin-right:6px}
.ai-dot{width:6px;height:6px;border-radius:50%;background:#6366f1;animation:aiDot 1.4s ease-in-out infinite}
.ai-dot:nth-child(3){animation-delay:.2s}
.ai-dot:nth-child(4){animation-delay:.4s}

@keyframes aiBubblePulse{0%,100%{box-shadow:0 4px 24px rgba(99,102,241,.5),0 0 40px rgba(99,102,241,.2)}50%{box-shadow:0 4px 32px rgba(99,102,241,.7),0 0 60px rgba(99,102,241,.35)}}
@keyframes aiDot{0%,80%,100%{transform:scale(0);opacity:.5}40%{transform:scale(1);opacity:1}}
`;
  document.head.appendChild(css);
}

/* ---- Ensure root element ---- */
if(!document.getElementById('ai-root')){
  var d=document.createElement('div');
  d.id='ai-root';
  document.body.appendChild(d);
}

const LS_DATA_KEY='pp_portfolio_data_v2';
const LS_API_KEY='pp_ai_api_key';
const LS_PROXY_KEY='pp_ai_proxy_url';

let state={
  open:false,
  showSettings:false,
  loading:false,
  messages:[{role:'assistant',content:'Гав! 🐾 Я Джеки — ваш помощник Paper Planes.\nМогу ответить на вопросы по методологии, проектам и базе знаний.\n\nПримеры:\n• «Как проводить BPM-1 опросы?»\n• «Что такое репрезентативность выборки?»\n• «Какие операции в BPM-1?»\n• «Как выбрать метод сбора анкет?»'}],
  input:''
};

function getApiKey(){return localStorage.getItem(LS_API_KEY)||'';}
function setApiKey(v){localStorage.setItem(LS_API_KEY,v);}
function getProxy(){return localStorage.getItem(LS_PROXY_KEY)||'';}
function setProxy(v){localStorage.setItem(LS_PROXY_KEY,v);}

function getPortfolioData(){
  try{const raw=localStorage.getItem(LS_DATA_KEY);return raw?JSON.parse(raw):{};}
  catch(e){return {};}
}

/* ---- RAG: search KB articles ---- */
function searchKB(query){
  const data=getPortfolioData();
  const items=data.knowledgeItems||[];
  if(!items.length)return{hits:[],context:''};
  const q=query.toLowerCase();
  const words=q.split(/[\s,;.!?]+/).filter(w=>w.length>2);
  if(!words.length)return{hits:[],context:''};

  const bpmMatch=q.match(/бпм[\s-]?(\d+)|bpm[\s-]?(\d+)/i);
  const bpmNum=bpmMatch?(bpmMatch[1]||bpmMatch[2]):null;

  const scored=items.map(item=>{
    const title=(item.title||'').toLowerCase();
    const content=(item.content||item.full_text||'').toLowerCase();
    const desc=(item.description||'').toLowerCase();
    const tags=(item.tags||[]).map(t=>t.toLowerCase());
    const code=(item.project_code||'').toLowerCase();
    let score=0;
    if(bpmNum&&(code.includes(bpmNum)||title.includes('bpm-'+bpmNum)||title.includes('бпм-'+bpmNum)||title.includes('бпм '+bpmNum)))score+=80;
    if(title.includes(q))score+=60;
    words.forEach(w=>{
      if(title.includes(w))score+=20;
      if(code.includes(w))score+=15;
      if(tags.some(t=>t.includes(w)))score+=12;
      if(desc.includes(w))score+=5;
      if(content.includes(w))score+=2;
    });
    return{item,score};
  }).filter(s=>s.score>0).sort((a,b)=>b.score-a.score).slice(0,3);

  if(!scored.length)return{hits:[],context:''};
  const hits=scored.map(s=>s.item);

  let ctx='\n\nРЕЛЕВАНТНЫЕ МАТЕРИАЛЫ ИЗ БАЗЫ ЗНАНИЙ:\n';
  hits.forEach((item,i)=>{
    const content=item.content||item.full_text||item.description||'';
    const lines=content.split('\n').filter(l=>l.trim());
    const relevantLines=[];
    lines.forEach((line,li)=>{
      const ll=line.toLowerCase();
      let lineScore=0;
      words.forEach(w=>{if(ll.includes(w))lineScore++;});
      if(lineScore>0)relevantLines.push({line,score:lineScore,idx:li});
    });
    relevantLines.sort((a,b)=>b.score-a.score);
    let excerpt='';
    if(relevantLines.length>0){
      excerpt=relevantLines.slice(0,10).sort((a,b)=>a.idx-b.idx).map(r=>r.line).join('\n');
    }else{
      excerpt=lines.slice(0,10).join('\n');
    }
    if(excerpt.length>2000)excerpt=excerpt.substring(0,2000)+'...';
    ctx+='\n--- '+(i+1)+'. '+item.title+(item.project_code?' ['+item.project_code+']':'')+ ' ---\n'+excerpt+'\n';
  });
  return{hits,context:ctx};
}

/* ---- Build context from portfolio data ---- */
function getPortfolioContext(){
  const d=getPortfolioData();
  const projects=(d.projects||[]).filter(p=>p.status==='ACTIVE');
  const persons=(d.persons||[]).filter(p=>!p.fire_date);
  const clients=d.clients||[];
  let ctx='Активных проектов: '+projects.length+', сотрудников: '+persons.length+', клиентов: '+clients.length+'\n';
  ctx+='Проекты: '+projects.slice(0,15).map(p=>p.code+' ('+p.work_group+')').join(', ');
  return ctx;
}

const SYSTEM_PROMPT=`Ты — Джеки, AI-помощник системы управления портфелем проектов Paper Planes (Double Diamond). Ты дружелюбный и энергичный, как корги. Иногда можешь вставить «🐾» в ответ.

КЛЮЧЕВОЕ ПРАВИЛО: Когда пользователь спрашивает о методологии, процессах или инструкциях — ТЫ ОБЯЗАН ссылаться на конкретные материалы из базы знаний, которые приведены в контексте. Формат ссылки: «📖 Подробнее: [Название материала] — открой в приложении: Знания → Материалы».

МЕТОДОЛОГИЯ:
- Double Diamond: Explore (BPM: добыча данных) → Define (BPA: сборка) → Develop (BPI: внедрение) → Deliver (BPO: организация)
- BPM = Business Process Mining: BPM-1 опросы, BPM-2 оргинтервью, BPM-3 интервью клиентов, BPM-4 анализ конкурентов, BPM-5 тайный покупатель, BPM-6 desk research, BPM-7 фокус-группы, BPM-8 анализ БП, BPM-9 анализ базы, BPM-10 анализ производства, BPM-11 ЦМД
- Каждый BPM содержит операции OPM (напр. OPM-1.02 дизайн анкеты, OPM-1.03 метод сбора, OPM-1.04 программирование, OPM-1.05 пилотаж)
- SI (Slide Intent) — упаковка результатов в презентации
- BPP — административные процессы

БАЗА ЗНАНИЙ:
Если в контексте есть раздел "РЕЛЕВАНТНЫЕ МАТЕРИАЛЫ" — ИСПОЛЬЗУЙ их для ответа. Цитируй ключевые фрагменты. Всегда указывай источник: 📖 Знания → Материалы → [название статьи].

ФИНАНСЫ:
- P&L: выручка (ACCRUED+PAID) → нетто → − накладные → валовая → − C1-C4 → грязная → − C5 → чистая
- Грейды: C1 (джун) → C5 (партнёр)

Отвечай на русском, структурированно, со ссылками на базу знаний.`;

/* ---- API call ---- */
async function sendToAPI(userText){
  const apiKey=getApiKey();
  if(!apiKey){state.showSettings=true;render();return;}

  state.messages.push({role:'user',content:userText});
  state.input='';
  state.loading=true;
  render();

  try{
    const rag=searchKB(userText);
    const portfolioCtx=getPortfolioContext();
    const contextStr=portfolioCtx+(rag.context||'');
    const contextMsg={role:'user',content:'[Контекст:\n'+contextStr+']'};
    const apiMsgs=[contextMsg,...state.messages.slice(-20).map(m=>({role:m.role,content:m.content}))];

    const endpoint=getProxy()||'https://api.anthropic.com/v1/messages';
    const headers={'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'};
    if(!getProxy())headers['anthropic-dangerous-direct-browser-access']='true';

    const resp=await fetch(endpoint,{
      method:'POST',headers,
      body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:2048,system:SYSTEM_PROMPT,messages:apiMsgs})
    });
    if(!resp.ok){const t=await resp.text();throw new Error('API '+resp.status+': '+t.slice(0,200));}
    const data=await resp.json();
    let text=data.content?.[0]?.text||'(пустой ответ)';

    if(rag.hits.length>0){
      text+='\n\n📚 **Источники из базы знаний:**\n'+rag.hits.map(h=>'• '+h.title+(h.project_code?' ['+h.project_code+']':'')+' — *Знания → Материалы*').join('\n');
    }
    state.messages.push({role:'assistant',content:text});
  }catch(err){
    state.messages.push({role:'assistant',content:'⚠️ Ошибка: '+err.message+'\n\nПроверьте API ключ в настройках (⚙️).'});
  }finally{
    state.loading=false;
    render();
    setTimeout(()=>{const el=document.querySelector('.ai-messages');if(el)el.scrollTop=el.scrollHeight;},50);
  }
}

/* ---- Render markdown-like formatting ---- */
function renderMd(text){
  return text.split('\n').map(line=>{
    /* bold line */
    if(line.startsWith('**')&&line.endsWith('**'))return '<div style="font-weight:700;margin-top:6px">'+line.slice(2,-2)+'</div>';
    /* inline formatting */
    let h=line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em style="color:#a5b4fc">$1</em>');
    /* bullets */
    if(line.startsWith('• ')||line.startsWith('- '))return '<div style="padding-left:12px;margin-top:2px">• '+h.slice(2)+'</div>';
    if(line.match(/^\d+\.\s/))return '<div style="padding-left:12px;margin-top:2px">'+h+'</div>';
    /* KB refs */
    if(line.startsWith('📚')||line.startsWith('📖'))return '<div class="ai-kb-ref">'+h+'</div>';
    /* empty */
    if(!line.trim())return '<div style="height:6px"></div>';
    return '<div style="margin-top:2px">'+h+'</div>';
  }).join('');
}

/* ---- UI Render ---- */
function render(){
  const root=document.getElementById('ai-root');
  if(!root)return;

  if(state.showSettings){
    root.innerHTML=`
      <div class="ai-settings">
        <div style="font-size:16px;font-weight:700;margin-bottom:16px">⚙️ Настройка AI-ассистента</div>
        <div style="margin-bottom:12px">
          <label>API Key (Anthropic)</label>
          <input type="password" id="ai-key-input" value="${escHtml(getApiKey())}" placeholder="sk-ant-..."/>
        </div>
        <div style="margin-bottom:4px">
          <label>Proxy URL (опционально, для обхода CORS)</label>
          <input id="ai-proxy-input" value="${escHtml(getProxy())}" placeholder="https://your-proxy.workers.dev/v1/messages"/>
          <div style="font-size:9px;color:#6666aa;margin-top:4px">Без прокси — прямой вызов Anthropic API</div>
        </div>
        <button id="ai-settings-done">Готово</button>
      </div>`;
    document.getElementById('ai-settings-done').onclick=()=>{
      setApiKey(document.getElementById('ai-key-input').value);
      setProxy(document.getElementById('ai-proxy-input').value);
      state.showSettings=false;render();
    };
    return;
  }

  let msgsHtml=state.messages.map(m=>{
    const cls=m.role==='user'?'user':'assistant';
    const content=m.role==='assistant'?renderMd(m.content):escHtml(m.content);
    return '<div class="ai-msg '+cls+'"><div class="ai-msg-bubble">'+content+'</div></div>';
  }).join('');

  if(state.loading){
    msgsHtml+='<div class="ai-msg assistant"><div class="ai-loading"><span class="label">Ищу в базе знаний...</span><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></div></div>';
  }

  const suggestions=state.messages.length<=1&&!state.loading?
    ['Как проводить BPM-1?','Что такое репрезентативность?','Какие операции в BPM-1?','Как делать пилотаж анкеты?','Расскажи про CJM-опросы'].map(q=>
      '<span class="ai-sug" data-sug="'+escHtml(q)+'">'+escHtml(q)+'</span>'
    ).join(''):'';

  const hasKey=!!getApiKey();
  const hasInput=state.input.trim().length>0;

  root.innerHTML=`
    <div class="ai-panel ${state.open?'open':'closed'}">
      <div class="ai-header">
        <div class="ai-avatar">🐕</div>
        <div><div class="ai-title">Джеки</div><div class="ai-subtitle">Claude Haiku · База знаний PP</div></div>
        <div style="margin-left:auto;display:flex;gap:6px">
          <span class="ai-hdr-btn" id="ai-btn-settings" title="Настройки">⚙️</span>
          <span class="ai-hdr-btn" id="ai-btn-clear" title="Очистить">🗑️</span>
          <span class="ai-hdr-btn" id="ai-btn-close" style="font-size:16px">✕</span>
        </div>
      </div>
      <div class="ai-messages">${msgsHtml}</div>
      ${suggestions?'<div class="ai-suggestions">'+suggestions+'</div>':''}
      <div class="ai-input-bar">
        <input class="ai-input" id="ai-text-input" value="${escHtml(state.input)}" placeholder="${hasKey?'Спросите о методологии, BPM, проектах...':'Укажите API ключ в ⚙️'}" ${state.loading?'disabled':''}/>
        <button class="ai-send ${hasInput&&!state.loading?'active':'inactive'}" id="ai-btn-send" ${state.loading||!hasInput?'disabled':''}>→</button>
      </div>
    </div>
    <div class="ai-bubble ${state.open?'open':''}" id="ai-btn-toggle">
      <span style="transition:transform .3s;transform:rotate(${state.open?'90':'0'}deg)">${state.open?'✕':'🐕'}</span>
    </div>`;

  /* Event listeners */
  document.getElementById('ai-btn-toggle').onclick=()=>{state.open=!state.open;render();};
  document.getElementById('ai-btn-close').onclick=()=>{state.open=false;render();};
  document.getElementById('ai-btn-settings').onclick=()=>{state.showSettings=true;render();};
  document.getElementById('ai-btn-clear').onclick=()=>{state.messages=[{role:'assistant',content:'Чат очищен. Чем помочь?'}];render();};

  const inp=document.getElementById('ai-text-input');
  inp.oninput=()=>{state.input=inp.value;
    const btn=document.getElementById('ai-btn-send');
    if(btn){btn.className='ai-send '+(inp.value.trim()?'active':'inactive');btn.disabled=!inp.value.trim();}
  };
  inp.onkeydown=(e)=>{if(e.key==='Enter'&&!e.shiftKey&&state.input.trim()){e.preventDefault();sendToAPI(state.input.trim());}};
  document.getElementById('ai-btn-send').onclick=()=>{if(state.input.trim())sendToAPI(state.input.trim());};

  document.querySelectorAll('.ai-sug').forEach(el=>{
    el.onclick=()=>{state.input=el.dataset.sug;render();};
  });

  /* Scroll to bottom */
  const msgDiv=document.querySelector('.ai-messages');
  if(msgDiv)msgDiv.scrollTop=msgDiv.scrollHeight;
  if(state.open&&!state.loading)inp.focus();
}

function escHtml(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ---- Init ---- */
render();
console.log('[PP AI Assistant] Microservice loaded. KB items:',((getPortfolioData().knowledgeItems)||[]).length);

/* Expose for external control */
window.__ppAiAssistant={
  open:()=>{state.open=true;render();},
  close:()=>{state.open=false;render();},
  ask:(q)=>{state.open=true;state.input=q;render();sendToAPI(q);},
  toggle:()=>{state.open=!state.open;render();}
};
})();

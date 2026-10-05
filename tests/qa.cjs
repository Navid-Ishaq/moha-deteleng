const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const KEY='moha-learning-v1';
async function go(page,hash){await page.evaluate(h=>location.hash=h,hash);await page.waitForTimeout(35);}
async function state(page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);}
async function answer(page,q,selector,correct=true){const f=page.locator(selector);
 if(q.type==='match'){for(let i=0;i<q.rows.length;i++)await f.locator('select').nth(i).selectOption(String(correct?q.answer[i]:(q.answer[i]+1)%q.options.length));}
 else if(q.type==='order'){
  const order=correct?q.options.map((_,i)=>i):q.options.map((_,i)=>i).reverse();
  for(let target=0;target<order.length;target++){let guard=0;while(true){const ids=await f.locator('[data-item]').evaluateAll(els=>els.map(e=>Number(e.dataset.item)));const at=ids.indexOf(order[target]);if(at===target)break;await f.locator(`[data-item="${order[target]}"] [data-move="-1"]`).click();if(++guard>20)throw Error('Ordering stuck');}}
 }
 else if(q.type==='text')await f.locator('input').fill(correct?q.answer[0]:'incorrect');
 else await f.locator(`input[value="${correct?q.answer:(q.answer+1)%q.options.length}"]`).check();
}
async function reset(page){await go(page,'inici');await page.locator('#reset').click();await page.locator('#confirm-reset').click();}
exports.responsive=async(page,out)=>{
 const failures=[],errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const lessons=await page.evaluate(()=>LESSONS.map(l=>l.id));
 const routes=['inici','bloc/1','bloc/2','bloc/3','bloc/4',...lessons.map(l=>'llico/'+l),...Array.from({length:10},(_,i)=>'anti/'+i),'repas','repas/1','repas/2','repas/3','repas/4','errors','examen'];
 for(const width of [320,375,390,430,768,1280,1440]){await page.setViewportSize({width,height:900});for(const route of routes){await go(page,route);const dim=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('main h1').length}));if(dim.scroll>width+1||dim.h1!==1)failures.push({width,route,...dim});}if(width===390||width===1440){await go(page,'inici');await page.screenshot({path:path.join(out,`home-${width}.png`),fullPage:true});await go(page,'llico/3.2');await page.screenshot({path:path.join(out,`lesson-${width}.png`),fullPage:true});}}
 assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);
 await page.setViewportSize({width:390,height:844});await go(page,'inici');await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.locator('#navigation a[href="#bloc/3"]').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.activity').count(),0);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1280,height:900});await go(page,'inici');await page.keyboard.press('Tab');const focus=await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle}));assert.notEqual(focus.outline,'none');
 return {routes:routes.length,widths:7,overflowFailures:failures,consoleErrors:errors,menu:'passed',keyboardFocus:focus};
};
exports.learning=async(page)=>{
 await reset(page);await go(page,'llico/1.1');await page.locator('#complete-lesson').click();assert.match(await page.locator('#complete-feedback').innerText(),/falta/);
 const q=await page.evaluate(()=>QUIZZES.find(q=>q.id==='licencia'));for(let i=0;i<2;i++){await answer(page,q,'[data-quiz="licencia"]',false);await page.locator('[data-quiz="licencia"] button[type=submit]').click();assert.match(await page.locator('[data-quiz="licencia"] .feedback').innerText(),/Encara no/);}await answer(page,q,'[data-quiz="licencia"]');await page.locator('[data-quiz="licencia"] button[type=submit]').click();assert.match(await page.locator('[data-quiz="licencia"] .feedback').innerText(),/Molt bé/);await page.locator('#complete-lesson').click();assert.equal((await state(page)).completed.length,1);await page.reload();assert.equal((await state(page)).completed.length,1);
 await go(page,'errors');await answer(page,q,'[data-quiz="licencia"]');await page.locator('[data-quiz="licencia"] button[type=submit]').click();await page.locator('#error-round').click();assert.equal(await page.locator('[data-quiz]').count(),0);
 await go(page,'llico/3.2');const smtp=await page.evaluate(()=>QUIZZES.find(q=>q.id==='smtp'));for(let i=0;i<3;i++){await answer(page,smtp,'[data-quiz="smtp"]',false);await page.locator('[data-quiz="smtp"] button[type=submit]').click();}assert.match(await page.locator('[data-quiz="smtp"] .feedback').innerText(),/La resposta és/);await page.getByText('Torna a practicar aquest concepte',{exact:true}).click();await answer(page,smtp,'[data-quiz="smtp"]');await page.locator('[data-quiz="smtp"] button[type=submit]').click();
 await reset(page);return {hintRetryReveal:'passed',completionGate:'passed',persistence:'passed',errorMastery:'passed'};
};
exports.lessons=async(page,from,to)=>{
 const lessons=await page.evaluate(()=>LESSONS);let count=0;for(const l of lessons.slice(from,to)){await go(page,'llico/'+l.id);const questions=await page.evaluate(id=>QUIZZES.filter(q=>q.lesson===id),l.id);for(const q of questions){await answer(page,q,`[data-quiz="${q.id}"]`);await page.locator(`[data-quiz="${q.id}"] button[type=submit]`).click();assert.match(await page.locator(`[data-quiz="${q.id}"] .feedback`).innerText(),/Molt bé/);count++;}await page.locator('#complete-lesson').click();}
 const s=await state(page);assert.equal(s.completed.length,to);if(to===34){await go(page,'inici');assert.match(await page.locator('main').innerText(),/Has completat MP0233/);assert.equal(await page.locator('[role=progressbar]').first().getAttribute('aria-valuenow'),'100');assert.equal(await page.locator('.badge').count(),4);}
 return {lessonsTested:to-from,completed:s.completed.length,activities:count};
};
exports.labs=async(page)=>{
 await go(page,'llico/1.5');await page.locator('[name=cc-NC]').check();assert.match(await page.locator('#cc-preview').innerText(),/BY-NC/);await page.locator('[name=cc-SA]').check();await page.locator('[name=cc-ND]').check();assert.equal(await page.locator('[name=cc-SA]').isChecked(),false);
 await go(page,'llico/2.9');for(let i=0;i<4;i++)await page.locator(`#ticket-lab input[value="${i}"]`).check();await page.locator('#ticket-lab button').click();assert.match(await page.locator('#ticket-feedback').innerText(),/Molt bé/);await page.locator('#ticket-lab input[value="4"]').check();await page.locator('#ticket-lab button').click();assert.match(await page.locator('#ticket-feedback').innerText(),/Gairebé/);
 await go(page,'llico/3.1');await page.locator('#composer select').selectOption('CC');await page.locator('#composer button').click();assert.match(await page.locator('#composer-feedback').innerText(),/Pista/);await page.locator('#composer select').selectOption('CCO');await page.locator('#composer button').click();assert.match(await page.locator('#composer-feedback').innerText(),/Molt bé/);
 await go(page,'llico/3.4');for(const [term,n] of [['has:attachment',2],['from:professor',1],['to:classe',3],['subject:apunts',1],['after:2026-10-01',2],['before:2026-10-01',1],['has:attachment after:2026-10-01',1]]){await page.locator('#inbox-lab input').fill(term);await page.locator('#inbox-lab button').click();assert.equal(await page.locator('.mail-row').count(),n,term);}await page.locator('#inbox-lab input').fill('bad:value');await page.locator('#inbox-lab button').click();assert.match(await page.locator('#inbox-results').innerText(),/Revisa/);
 await go(page,'llico/4.3');const f=page.locator('#calendar-lab');await f.locator('[name=title]').fill('Classe MP0233');await f.locator('[name=date]').fill('2026-10-12');await f.locator('[name=time]').fill('09:00');await f.locator('[name=reminder]').selectOption('10');await f.locator('[name=recurrence]').selectOption('Cada setmana');await f.locator('[name=place]').fill('Aula 12');await f.locator('[name=guests]').fill('classe@exemple.test');await f.locator('[name=description]').fill('Pràctica de Calendar');await f.locator('button').click();assert.match(await page.locator('#calendar-feedback').innerText(),/Molt bé/);assert.match(await page.locator('#calendar-preview').innerText(),/2026-10-12/);
 await go(page,'repas');const first=await page.locator('[data-quiz]').first().getAttribute('data-quiz');await page.locator('#new-review').click();assert.notEqual(await page.locator('[data-quiz]').first().getAttribute('data-quiz'),first);
 for(let i=0;i<10;i++){await go(page,'anti/'+i);assert.equal(await page.locator('.anti-list a[aria-current=page]').count(),1);assert.equal(await page.locator('[data-quiz]').count(),1);}
 return {creativeCommons:'passed',incidentTicket:'passed',emailComposer:'passed',gmailOperators:7,calendar:'passed',variedReview:'passed',antiErrors:10};
};
exports.exams=async(page,wrongCount)=>{
 async function attempt(wrongCount){await go(page,'examen');if(await page.locator('#retake').count())await page.locator('#retake').click();await page.locator('#start-exam').click();await page.locator('#submit-exam').click();assert.match(await page.locator('#submit-status').innerText(),/Falten/);for(let i=0;i<20;i++){const prompt=await page.locator('#exam-form h2').innerText(),q=await page.evaluate(p=>QUIZZES.find(q=>q.prompt===p),prompt);assert.equal(await page.locator('#exam-form .feedback').innerText(),'');await answer(page,q,'#exam-form',i>=wrongCount);await page.locator('#exam-next').click();}await page.locator('#submit-exam').click();assert.equal(await page.locator('.score').innerText(),`${20-wrongCount}/20`);assert.equal(await page.locator('.exam-review details').count(),wrongCount);return (await state(page)).exams.at(-1);}
 if(wrongCount!==undefined)return await attempt(wrongCount);
 const perfect=await attempt(0);assert.equal(perfect.score,20);const mixed=await attempt(5);assert.equal(mixed.score,15);await go(page,'errors');assert.equal(await page.locator('[data-quiz]').count(),5);await reset(page);assert.equal((await state(page)).exams.length,0);assert.equal((await state(page)).completed.length,0);
 return {perfectScore:20,mixedScore:15,errorReview:5,submissionGate:'passed',answersHidden:'passed',reset:'passed'};
};

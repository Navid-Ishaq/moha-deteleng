/* Run: node tests/run.cjs. Requires Playwright and an installed Edge browser. */
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
let playwright;
try{playwright=require('playwright');}catch{playwright=require('C:/Users/mnvid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const qa=require('./qa.cjs');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.MOHA_BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage();
 const out=process.env.MOHA_QA_OUTPUT||path.join(__dirname,'results');fs.mkdirSync(out,{recursive:true});
 try{
  await page.goto(pathToFileURL(path.join(__dirname,'../index.html')).href);
  const report={};report.responsive=await qa.responsive(page,out);console.log('Responsive checks passed');
  report.learning=await qa.learning(page);report.lessons=[];
  for(const [from,to] of [[0,9],[9,20],[20,27],[27,34]]){report.lessons.push(await qa.lessons(page,from,to));console.log(`${to}/34 lessons passed`);}
  report.labs=await qa.labs(page);report.exams=await qa.exams(page);
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('All checks passed. Results: '+out);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

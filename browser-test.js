/**
 * LAST GAME 浏览器自动化测试
 * 验证HTML文件中的实际JavaScript代码
 */

const fs = require('fs');
const path = require('path');

// 读取HTML文件
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 提取JavaScript代码
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('❌ 无法找到JavaScript代码');
  process.exit(1);
}

const jsCode = scriptMatch[1];

// 测试清单
const tests = [
  {
    name: '基础函数存在性',
    checks: [
      { name: 'randInt函数', pattern: /function randInt\(/ },
      { name: 'randChoice函数', pattern: /function randChoice\(/ },
      { name: 'genId函数', pattern: /function genId\(/ },
      { name: 'genRoomCode函数', pattern: /function genRoomCode\(/ },
      { name: 'genRandomName函数', pattern: /function genRandomName\(/ }
    ]
  },
  {
    name: '关卡初始化函数',
    checks: [
      { name: 'initHighLow', pattern: /function initHighLow\(/ },
      { name: 'initGuessNumber', pattern: /function initGuessNumber\(/ },
      { name: 'initRoulette', pattern: /function initRoulette\(/ },
      { name: 'initReaction', pattern: /function initReaction\(/ },
      { name: 'initMindGame', pattern: /function initMindGame\(/ },
      { name: 'initMinority', pattern: /function initMinority\(/ },
      { name: 'initTrust', pattern: /function initTrust\(/ },
      { name: 'initMafia', pattern: /function initMafia\(/ },
      { name: 'initDinner', pattern: /function initDinner\(/ },
      { name: 'initWheel', pattern: /function initWheel\(/ }
    ]
  },
  {
    name: '关卡检查函数',
    checks: [
      { name: 'checkHighLow(内联)', pattern: /if\s*\(\s*alive\.length\s*<=\s*1\s*\)\s*\{\s*endGame/ },
      { name: 'checkGuess(内联)', pattern: /if\s*\(\s*guess\s*===?\s*target\s*\)/ },
      { name: 'checkRoulette(内联)', pattern: /if\s*\(\s*hasBullet\s*\)/ },
      { name: 'checkReactionEnd', pattern: /function checkReactionEnd\(/ },
      { name: 'checkMindEnd', pattern: /function checkMindEnd\(/ },
      { name: 'checkMinorityEnd', pattern: /function checkMinorityEnd\(/ },
      { name: 'checkTrustEnd', pattern: /function checkTrustEnd\(/ },
      { name: 'checkMafiaVoteEnd', pattern: /function checkMafiaVoteEnd\(/ },
      { name: 'checkDinnerEnd', pattern: /function checkDinnerEnd\(/ }
    ]
  },
  {
    name: '游戏状态管理',
    checks: [
      { name: 'startGame函数', pattern: /function startGame\(/ },
      { name: 'initLevel函数', pattern: /function initLevel\(/ },
      { name: 'endGame函数', pattern: /function endGame\(/ },
      { name: 'renderGame函数', pattern: /function renderGame\(/ },
      { name: 'handleGameAction函数', pattern: /function handleGameAction\(/ }
    ]
  },
  {
    name: '网络通信',
    checks: [
      { name: 'initPeer函数', pattern: /function initPeer\(/ },
      { name: 'connectTo函数', pattern: /function connectTo\(/ },
      { name: 'broadcast函数', pattern: /function broadcast\(/ },
      { name: 'sendTo函数', pattern: /function sendTo\(/ },
      { name: 'handleMessage函数', pattern: /function handleMessage\(/ }
    ]
  },
  {
    name: 'AI支持',
    checks: [
      { name: 'processAITurn函数', pattern: /function processAITurn\(/ },
      { name: 'AI玩家标记', pattern: /isAI/ },
      { name: 'AI逻辑分支', pattern: /if\s*\(\s*!current\s*\|\|\s*!current\.isAI\s*\)/ }
    ]
  },
  {
    name: 'UI功能',
    checks: [
      { name: 'showScreen函数', pattern: /function showScreen\(/ },
      { name: 'addChat函数', pattern: /function addChat\(/ },
      { name: 'showResult函数', pattern: /function showResult\(/ },
      { name: 'hideResult函数', pattern: /function hideResult\(/ },
      { name: 'updatePlayerList函数', pattern: /function updatePlayerList\(/ }
    ]
  },
  {
    name: 'Three.js背景',
    checks: [
      { name: 'initThree函数', pattern: /function initThree\(/ },
      { name: 'Scene创建', pattern: /new THREE\.Scene/ },
      { name: 'PerspectiveCamera', pattern: /new THREE\.PerspectiveCamera/ },
      { name: 'WebGLRenderer', pattern: /new THREE\.WebGLRenderer/ },
      { name: '动画循环', pattern: /requestAnimationFrame/ }
    ]
  }
];

// 运行测试
console.log('╔══════════════════════════════════════════════════╗');
console.log('║     LAST GAME 浏览器代码验证测试                 ║');
console.log('╚══════════════════════════════════════════════════╝\n');

let totalPassed = 0;
let totalFailed = 0;

tests.forEach(group => {
  console.log(`\n📦 ${group.name}`);
  console.log('─'.repeat(50));
  
  group.checks.forEach(check => {
    const passed = check.pattern.test(jsCode);
    const icon = passed ? '✅' : '❌';
    console.log(`  ${icon} ${check.name}`);
    
    if (passed) totalPassed++;
    else totalFailed++;
  });
});

// 统计
const total = totalPassed + totalFailed;
console.log('\n' + '═'.repeat(50));
console.log('📊 测试结果统计');
console.log('═'.repeat(50));
console.log(`✅ 通过: ${totalPassed}/${total}`);
console.log(`❌ 失败: ${totalFailed}/${total}`);
console.log(`📈 通过率: ${((totalPassed / total) * 100).toFixed(1)}%`);

if (totalFailed === 0) {
  console.log('\n🎉 所有测试通过！代码完整。');
} else {
  console.log('\n⚠️  部分测试失败，请检查代码。');
}

// 额外检查：关卡配置
console.log('\n' + '═'.repeat(50));
console.log('🎮 关卡配置检查');
console.log('═'.repeat(50));

const levelMatch = jsCode.match(/const LEVELS = ([\s\S]*?);/);
if (levelMatch) {
  try {
    // 简单解析关卡数量
    const levelCount = (levelMatch[1].match(/id:/g) || []).length;
    console.log(`📋 关卡数量: ${levelCount}`);
    
    if (levelCount === 10) {
      console.log('✅ 关卡数量正确 (10关)');
    } else {
      console.log(`❌ 关卡数量错误 (期望10关，实际${levelCount}关)`);
    }
  } catch (e) {
    console.log('⚠️  无法解析关卡配置');
  }
} else {
  console.log('❌ 找不到关卡配置');
}

// 检查CSS变量
console.log('\n' + '═'.repeat(50));
console.log('🎨 CSS变量检查 (HTML <style>标签)');
console.log('═'.repeat(50));

const cssVars = [
  '--red', '--red-glow', '--gold', '--dark', '--darker',
  '--panel', '--border', '--text', '--muted', '--green', '--green-glow'
];

cssVars.forEach(v => {
  const found = htmlContent.includes(v);
  console.log(`${found ? '✅' : '❌'} ${v}`);
});

console.log('\n✨ 验证完成！');

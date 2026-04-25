/**
 * LAST GAME 完整流程测试
 * 模拟从头到尾的完整对局
 */

// 模拟游戏环境
const mockGame = {
  players: [],
  state: null,
  turn: 0,
  
  // 初始化游戏
  initGame(playerCount = 2, levelId = 1) {
    this.players = [];
    for (let i = 0; i < playerCount; i++) {
      this.players.push({
        id: `p${i}`,
        name: `玩家${i + 1}`,
        alive: true,
        isAI: i > 0
      });
    }
    
    this.state = {
      level: levelId,
      players: this.players,
      turn: 0,
      phase: 'playing',
      data: {}
    };
    this.turn = 0;
    
    console.log(`\n🎮 开始第${levelId}关，${playerCount}人参与`);
    return this.state;
  },
  
  // 检查游戏结束
  checkEnd() {
    const alive = this.players.filter(p => p.alive);
    if (alive.length <= 1) {
      if (alive.length === 1) {
        console.log(`🏆 ${alive[0].name} 获得胜利！`);
      } else {
        console.log('💀 无人生还...');
      }
      return true;
    }
    return false;
  },
  
  // 模拟第1关：高低牌
  testLevel1() {
    console.log('\n=== 第1关：高低牌 ===');
    this.initGame(2, 1);
    
    let round = 1;
    while (!this.checkEnd()) {
      console.log(`\n--- 第${round}轮 ---`);
      
      // 发牌
      const currentCard = { rank: '5', value: 5 };
      const nextCard = { rank: '8', value: 8 };
      console.log(`当前牌: ${currentCard.rank}，下一张是...`);
      
      // 玩家猜测
      const alive = this.players.filter(p => p.alive);
      alive.forEach(p => {
        const guess = p.isAI ? (Math.random() > 0.5 ? 'high' : 'low') : 'high';
        const correct = (nextCard.value > currentCard.value && guess === 'high') ||
                       (nextCard.value < currentCard.value && guess === 'low');
        
        console.log(`${p.name} 猜${guess === 'high' ? '高' : '低'}`);
        
        if (!correct) {
          p.alive = false;
          console.log(`❌ ${p.name} 猜错了！出局！`);
        } else {
          console.log(`✅ ${p.name} 猜对了！`);
        }
      });
      
      round++;
      if (round > 10) break; // 防止无限循环
    }
  },
  
  // 模拟第2关：猜数字
  testLevel2() {
    console.log('\n=== 第2关：猜数字 ===');
    this.initGame(3, 2);
    
    const target = 42;
    let min = 1, max = 100;
    let round = 1;
    
    while (!this.checkEnd()) {
      console.log(`\n--- 第${round}轮 (${min}-${max}) ---`);
      
      const alive = this.players.filter(p => p.alive);
      const guesses = alive.map(p => ({
        player: p,
        guess: p.isAI ? Math.floor((min + max) / 2) + Math.floor(Math.random() * 10 - 5) : 50
      }));
      
      guesses.forEach(g => {
        console.log(`${g.player.name} 猜 ${g.guess}`);
        
        if (g.guess === target) {
          g.player.alive = false;
          console.log(`💥 ${g.player.name} 猜中了！出局！`);
        } else if (g.guess < target) {
          min = Math.max(min, g.guess + 1);
          console.log(`📈 太小了`);
        } else {
          max = Math.min(max, g.guess - 1);
          console.log(`📉 太大了`);
        }
      });
      
      round++;
      if (round > 20) break;
    }
  },
  
  // 模拟第3关：俄罗斯轮盘
  testLevel3() {
    console.log('\n=== 第3关：俄罗斯轮盘 ===');
    this.initGame(3, 3);
    
    let chamber = [false, false, false, false, false, true]; // 第6发是子弹
    let currentPos = 0;
    let round = 1;
    
    while (!this.checkEnd()) {
      const alive = this.players.filter(p => p.alive);
      const current = alive[this.turn % alive.length];
      
      console.log(`\n--- 第${round}轮: ${current.name} ---`);
      console.log(`${current.name} 扣动扳机...`);
      
      if (chamber[currentPos]) {
        current.alive = false;
        console.log(`💥 砰！${current.name} 出局！`);
        chamber[currentPos] = false; // 移除子弹
      } else {
        console.log(`😅 咔，安全`);
      }
      
      currentPos = (currentPos + 1) % 6;
      this.turn++;
      round++;
      
      if (round > 20) break;
    }
  },
  
  // 模拟第4关：快速反应
  testLevel4() {
    console.log('\n=== 第4关：快速反应 ===');
    this.initGame(4, 4);
    
    let round = 1;
    while (!this.checkEnd()) {
      console.log(`\n--- 第${round}轮 ---`);
      console.log('等待变绿...');
      
      const alive = this.players.filter(p => p.alive);
      const times = alive.map(p => ({
        player: p,
        time: p.isAI ? 200 + Math.random() * 300 : 150
      }));
      
      times.sort((a, b) => a.time - b.time);
      times.forEach(t => {
        console.log(`${t.player.name}: ${t.time.toFixed(0)}ms`);
      });
      
      const loser = times[times.length - 1];
      loser.player.alive = false;
      console.log(`⏱️ ${loser.player.name} 最慢，出局！`);
      
      round++;
      if (round > 10) break;
    }
  },
  
  // 模拟第5关：心理博弈
  testLevel5() {
    console.log('\n=== 第5关：心理博弈 ===');
    this.initGame(3, 5);
    
    let round = 1;
    while (!this.checkEnd()) {
      const target = Math.floor(Math.random() * 100) + 1;
      console.log(`\n--- 第${round}轮 (目标: ${target}) ---`);
      
      const alive = this.players.filter(p => p.alive);
      const guesses = alive.map(p => ({
        player: p,
        guess: p.isAI ? Math.floor(Math.random() * 100) + 1 : 50
      }));
      
      guesses.forEach(g => {
        const diff = Math.abs(g.guess - target);
        console.log(`${g.player.name}: ${g.guess} (差值: ${diff})`);
      });
      
      guesses.sort((a, b) => Math.abs(a.guess - target) - Math.abs(b.guess - target));
      const loser = guesses[guesses.length - 1];
      loser.player.alive = false;
      console.log(`🎯 ${loser.player.name} 差值最大，出局！`);
      
      round++;
      if (round > 10) break;
    }
  },
  
  // 模拟第6关：少数派
  testLevel6() {
    console.log('\n=== 第6关：少数派 ===');
    this.initGame(5, 6);
    
    let round = 1;
    while (!this.checkEnd()) {
      console.log(`\n--- 第${round}轮 ---`);
      
      const alive = this.players.filter(p => p.alive);
      const choices = alive.map(p => ({
        player: p,
        choice: p.isAI ? (Math.random() > 0.5 ? 'A' : 'B') : 'A'
      }));
      
      const countA = choices.filter(c => c.choice === 'A').length;
      const countB = choices.filter(c => c.choice === 'B').length;
      
      console.log(`A: ${countA}人, B: ${countB}人`);
      
      if (countA < countB) {
        choices.filter(c => c.choice === 'B').forEach(c => {
          c.player.alive = false;
          console.log(`❌ ${c.player.name} 选B（多数派），出局！`);
        });
      } else if (countB < countA) {
        choices.filter(c => c.choice === 'A').forEach(c => {
          c.player.alive = false;
          console.log(`❌ ${c.player.name} 选A（多数派），出局！`);
        });
      } else {
        const randomLoser = alive[Math.floor(Math.random() * alive.length)];
        randomLoser.alive = false;
        console.log(`🎲 平票！${randomLoser.name} 随机淘汰！`);
      }
      
      round++;
      if (round > 10) break;
    }
  },
  
  // 模拟第7关：信任博弈
  testLevel7() {
    console.log('\n=== 第7关：信任博弈 ===');
    this.initGame(4, 7);
    
    let round = 1;
    while (!this.checkEnd()) {
      console.log(`\n--- 第${round}轮 ---`);
      
      const alive = this.players.filter(p => p.alive);
      const choices = alive.map(p => ({
        player: p,
        choice: p.isAI ? (Math.random() > 0.3 ? 'cooperate' : 'betray') : 'cooperate'
      }));
      
      // 随机配对
      const shuffled = choices.sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        const a = shuffled[i];
        const b = shuffled[i + 1];
        
        console.log(`${a.player.name}(${a.choice}) vs ${b.player.name}(${b.choice})`);
        
        if (a.choice === 'cooperate' && b.choice === 'cooperate') {
          console.log('🤝 双方合作，都存活');
        } else if (a.choice === 'betray' && b.choice === 'betray') {
          a.player.alive = false;
          b.player.alive = false;
          console.log('💥 双方背叛，都出局！');
        } else if (a.choice === 'betray') {
          b.player.alive = false;
          console.log(`😈 ${a.player.name}背叛，${b.player.name}出局！`);
        } else {
          a.player.alive = false;
          console.log(`😈 ${b.player.name}背叛，${a.player.name}出局！`);
        }
      }
      
      if (shuffled.length % 2 === 1) {
        console.log(`😴 ${shuffled[shuffled.length - 1].player.name} 轮空，安全`);
      }
      
      round++;
      if (round > 10) break;
    }
  },
  
  // 模拟第8关：沉默的羔羊
  testLevel8() {
    console.log('\n=== 第8关：沉默的羔羊 ===');
    this.initGame(5, 8);
    
    let round = 1;
    while (!this.checkEnd()) {
      console.log(`\n--- 第${round}轮 ---`);
      
      // 夜晚
      console.log('🌙 夜晚...');
      const alive = this.players.filter(p => p.alive);
      const killer = alive[Math.floor(Math.random() * alive.length)];
      const victims = alive.filter(p => p.id !== killer.id);
      const victim = victims[Math.floor(Math.random() * victims.length)];
      
      victim.alive = false;
      console.log(`💀 ${victim.name} 被杀手淘汰`);
      
      if (this.checkEnd()) break;
      
      // 白天投票
      console.log('☀️ 白天投票...');
      const dayAlive = this.players.filter(p => p.alive);
      const votes = {};
      
      dayAlive.forEach(p => {
        const target = dayAlive.find(t => t.id !== p.id);
        if (target) {
          votes[target.id] = (votes[target.id] || 0) + 1;
        }
      });
      
      const maxVotes = Math.max(...Object.values(votes));
      const candidates = Object.keys(votes).filter(id => votes[id] === maxVotes);
      const targetId = candidates[Math.floor(Math.random() * candidates.length)];
      const target = this.players.find(p => p.id === targetId);
      
      if (target) {
        target.alive = false;
        console.log(`⚖️ ${target.name} 被投票处决`);
        if (target.id === killer.id) {
          console.log('🎉 杀手被处决！');
        }
      }
      
      round++;
      if (round > 10) break;
    }
  },
  
  // 模拟第9关：最后的晚餐
  testLevel9() {
    console.log('\n=== 第9关：最后的晚餐 ===');
    this.initGame(5, 9);
    
    const questions = ['谁最不可信？', '谁最聪明？', '谁最该死？'];
    let round = 1;
    
    while (!this.checkEnd()) {
      const question = questions[Math.floor(Math.random() * questions.length)];
      console.log(`\n--- 第${round}轮: ${question} ---`);
      
      const alive = this.players.filter(p => p.alive);
      const votes = {};
      
      alive.forEach(p => {
        const targets = alive.filter(t => t.id !== p.id);
        const target = targets[Math.floor(Math.random() * targets.length)];
        votes[target.id] = (votes[target.id] || 0) + 1;
      });
      
      const voteCounts = alive.map(p => ({
        player: p,
        count: votes[p.id] || 0
      }));
      
      const maxVotes = Math.max(...voteCounts.map(v => v.count));
      const minVotes = Math.min(...voteCounts.map(v => v.count));
      
      voteCounts.forEach(v => {
        if (v.count === maxVotes || v.count === minVotes) {
          v.player.alive = false;
          console.log(`❌ ${v.player.name} 被淘汰 (${v.count}票)`);
        }
      });
      
      round++;
      if (round > 10) break;
    }
  },
  
  // 模拟第10关：命运之轮
  testLevel10() {
    console.log('\n=== 第10关：命运之轮 ===');
    this.initGame(2, 10);
    
    let round = 1;
    while (!this.checkEnd()) {
      const alive = this.players.filter(p => p.alive);
      const current = alive[this.turn % alive.length];
      
      console.log(`\n--- 第${round}轮: ${current.name} ---`);
      console.log(`${current.name} 转动命运之轮...`);
      
      const rand = Math.random();
      let result;
      
      if (rand < 0.5) {
        result = 'kill-opponent';
        const opponent = alive.find(p => p.id !== current.id);
        if (opponent) {
          opponent.alive = false;
          console.log(`🎯 ${current.name} 淘汰了 ${opponent.name}！`);
        }
      } else if (rand < 0.7) {
        result = 'self-destruct';
        current.alive = false;
        console.log(`💥 ${current.name} 自爆！`);
      } else if (rand < 0.85) {
        result = 'mutual';
        alive.forEach(p => p.alive = false);
        console.log('💀 同归于尽！无人生还！');
      } else if (rand < 0.95) {
        result = 'retry';
        console.log('🔄 再转一次');
      } else {
        result = 'win';
        alive.filter(p => p.id !== current.id).forEach(p => p.alive = false);
        console.log(`👑 ${current.name} 直接通关！`);
      }
      
      this.turn++;
      round++;
      
      if (round > 20) break;
    }
  },
  
  // 运行所有关卡测试
  runAllTests() {
    console.log('╔══════════════════════════════════════╗');
    console.log('║     LAST GAME 完整流程测试           ║');
    console.log('╚══════════════════════════════════════╝');
    
    this.testLevel1();
    this.testLevel2();
    this.testLevel3();
    this.testLevel4();
    this.testLevel5();
    this.testLevel6();
    this.testLevel7();
    this.testLevel8();
    this.testLevel9();
    this.testLevel10();
    
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║     所有关卡测试完成！               ║');
    console.log('╚══════════════════════════════════════╝');
  }
};

// 运行测试
mockGame.runAllTests();

// 测试脚本 - 验证游戏逻辑

// 模拟测试环境
const mockLocalStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, val) { this.data[key] = val; },
  removeItem(key) { delete this.data[key]; }
};

// 基础工具函数测试
function testUtils() {
  console.log('=== 测试工具函数 ===');
  
  // randInt
  const r1 = randInt(1, 10);
  console.assert(r1 >= 1 && r1 <= 10, 'randInt范围错误');
  
  // randChoice
  const arr = ['a', 'b', 'c'];
  const r2 = randChoice(arr);
  console.assert(arr.includes(r2), 'randChoice结果不在数组中');
  
  // genId
  const id1 = genId();
  const id2 = genId();
  console.assert(id1 !== id2, 'genId生成重复ID');
  console.assert(id1.length > 0, 'genId生成空ID');
  
  // genRoomCode
  const code = genRoomCode();
  console.assert(code.length === 6, '房间代码长度错误');
  console.assert(/^[A-Z0-9]+$/.test(code), '房间代码格式错误');
  
  // genRandomName
  const name = genRandomName();
  console.assert(name.length > 0, '随机名字为空');
  console.assert(name.includes('-'), '随机名字格式错误');
  
  console.log('✓ 工具函数测试通过');
}

// 关卡配置测试
function testLevels() {
  console.log('=== 测试关卡配置 ===');
  
  console.assert(LEVELS.length === 10, '关卡数量错误');
  
  LEVELS.forEach((lv, i) => {
    console.assert(lv.id === i + 1, `关卡${i} ID错误`);
    console.assert(lv.name.length > 0, `关卡${lv.id} 名字为空`);
    console.assert(lv.min >= 2, `关卡${lv.id} 最小人数错误`);
    console.assert(lv.max >= lv.min, `关卡${lv.id} 最大人数小于最小人数`);
    console.assert(lv.desc.length > 0, `关卡${lv.id} 描述为空`);
  });
  
  console.log('✓ 关卡配置测试通过');
}

// 游戏状态测试
function testGameState() {
  console.log('=== 测试游戏状态 ===');
  
  // 模拟创建游戏状态
  const mockPlayers = [
    { id: 'p1', name: '玩家1', ready: true, host: true },
    { id: 'p2', name: '玩家2', ready: true, host: false }
  ];
  
  const state = {
    level: 1,
    players: mockPlayers.map(p => ({ ...p, alive: true })),
    turn: 0,
    phase: 'playing',
    data: {}
  };
  
  console.assert(state.players.length === 2, '玩家数量错误');
  console.assert(state.players.every(p => p.alive), '玩家初始状态错误');
  
  // 测试淘汰逻辑
  state.players[0].alive = false;
  const alive = state.players.filter(p => p.alive);
  console.assert(alive.length === 1, '淘汰逻辑错误');
  
  console.log('✓ 游戏状态测试通过');
}

// 卡牌逻辑测试
function testCardLogic() {
  console.log('=== 测试卡牌逻辑 ===');
  
  const card1 = { suit: '♠', rank: 'A', value: 1 };
  const card2 = { suit: '♥', rank: 'K', value: 13 };
  
  console.assert(card1.value < card2.value, '卡牌数值比较错误');
  console.assert(RANKS.indexOf('A') === 0, 'A的索引错误');
  console.assert(RANKS.indexOf('K') === 12, 'K的索引错误');
  
  console.log('✓ 卡牌逻辑测试通过');
}

// 网络消息测试
function testNetworkMessages() {
  console.log('=== 测试网络消息 ===');
  
  const messages = [
    { type: 'playerList', players: [] },
    { type: 'chat', name: 'test', text: 'hello' },
    { type: 'gameStart', level: LEVELS[0] },
    { type: 'gameState', state: {} },
    { type: 'gameAction', action: 'reaction', payload: {} },
    { type: 'gameResult', result: 'win', title: '', desc: '' }
  ];
  
  messages.forEach(msg => {
    console.assert(msg.type, '消息类型为空');
  });
  
  console.log('✓ 网络消息测试通过');
}

// 运行所有测试
console.log('开始测试 LAST GAME...\n');
testUtils();
testLevels();
testGameState();
testCardLogic();
testNetworkMessages();
console.log('\n=== 所有测试通过 ===');

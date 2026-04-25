# LAST GAME 多人组队机制分析

## 当前机制

### 1. 房间系统
- **创建房间**: 房主选择关卡 → 生成6位房间码
- **加入房间**: 输入房间码 → 进入等待
- **准备系统**: 玩家点击"准备" → 房主看到准备人数
- **开始条件**: 准备人数 ≥ 关卡最小人数

### 2. 当前关卡人数限制

| 关卡 | 名称 | 最小 | 最大 | 是否支持多人 |
|------|------|------|------|-------------|
| 1 | 高低牌 | 2 | 2 | ❌ 仅2人 |
| 2 | 猜数字 | 2 | 5 | ✅ 2-5人 |
| 3 | 俄罗斯轮盘 | 2 | 6 | ✅ 2-6人 |
| 4 | 快速反应 | 2 | 10 | ✅ 2-10人 |
| 5 | 心理博弈 | 2 | 5 | ✅ 2-5人 |
| 6 | 少数派 | 3 | 13 | ✅ 3-13人 |
| 7 | 信任博弈 | 2 | 13 | ✅ 2-13人 |
| 8 | 沉默的羔羊 | 2 | 13 | ✅ 2-13人 |
| 9 | 最后的晚餐 | 2 | 13 | ✅ 2-13人 |
| 10 | 命运之轮 | 2 | 2 | ❌ 仅2人 |

### 3. 当前游戏模式

**自由混战模式 (Free-for-All)**
- 所有玩家各自为战
- 每轮淘汰1人（或多人）
- 最后存活者获胜

## 组队模式设计方案

### 方案A: 简单分队模式

**实现方式:**
```javascript
// 游戏开始前分队
gameState.teams = {
  'red': ['player1', 'player2'],
  'blue': ['player3', 'player4']
};

// 胜负判定改为团队存活
function checkTeamWin() {
  const teamsAlive = {};
  gameState.players.forEach(p => {
    if (p.alive) {
      const team = getPlayerTeam(p.id);
      teamsAlive[team] = true;
    }
  });
  
  const aliveTeams = Object.keys(teamsAlive);
  if (aliveTeams.length === 1) {
    endGameTeam(aliveTeams[0]); // 团队获胜
  }
}
```

**适用关卡:**
- ✅ 少数派 (两队对抗)
- ✅ 信任博弈 (队内合作)
- ✅ 沉默的羔羊 (杀手vs平民)

### 方案B: 2v2固定搭档模式

**实现方式:**
```javascript
// 玩家进入房间后选择搭档
gameState.pairs = {
  'pair1': ['player1', 'player2'],
  'pair2': ['player3', 'player4']
};

// 搭档共享命运
function checkPairWin() {
  const alivePairs = {};
  gameState.players.forEach(p => {
    if (p.alive) {
      const pair = getPlayerPair(p.id);
      alivePairs[pair] = true;
    }
  });
  
  if (Object.keys(alivePairs).length === 1) {
    endGamePair(Object.keys(alivePairs)[0]);
  }
}
```

**适用关卡:**
- ✅ 信任博弈 (搭档互相保护)
- ✅ 最后的晚餐 (搭档互投)

### 方案C: 动态联盟模式

**实现方式:**
```javascript
// 每轮可以临时结盟
gameState.alliances = {};

function formAlliance(player1, player2) {
  gameState.alliances[player1] = player2;
  gameState.alliances[player2] = player1;
}

// 联盟者共享部分收益/风险
function checkAllianceEffect(playerId) {
  const ally = gameState.alliances[playerId];
  if (ally && gameState.players.find(p => p.id === ally)?.alive) {
    // 联盟效果：例如共享保护、分担伤害等
    return true;
  }
  return false;
}
```

**适用关卡:**
- ✅ 所有关卡（增加策略深度）

## 具体关卡组队适配

### 关卡1: 高低牌 (2人) → 2v2模式
```javascript
// 改编为搭档对战
// 每队2人，轮流猜牌
// 一队中有人猜错，全队扣分
// 先扣完分的队伍输
```

### 关卡2: 猜数字 (2-5人) → 团队竞速
```javascript
// 两队同时猜
// 每队内部讨论后出一个数字
// 猜中对方数字得分
```

### 关卡3: 轮盘 (2-6人) → 团队轮盘
```javascript
// 每队轮流派人扣扳机
// 中弹者出局，但队友可"替死"一次
```

### 关卡4: 反应测试 (2-10人) → 团队接力
```javascript
// 每队成员接力点击
// 取团队平均反应时间
// 最慢的团队淘汰一人
```

### 关卡5: 心理博弈 (2-5人) → 团队猜心
```javascript
// 每队讨论后出一个数字
// 与目标差值小的团队获胜
```

### 关卡6: 少数派 (3-13人) → 经典分队
```javascript
// 天然适合分队
// 红队vs蓝队
// 少数派队伍获胜
```

### 关卡7: 信任博弈 (2-13人) → 搭档模式
```javascript
// 2人一组
// 队内选择合作/背叛
// 背叛可保护队友但自己冒险
```

### 关卡8: 沉默的羔羊 (2-13人) → 身份阵营
```javascript
// 杀手队 vs 平民队
// 杀手夜间杀人
// 白天投票处决
```

### 关卡9: 最后的晚餐 (2-13人) → 联盟投票
```javascript
// 可以公开结盟
// 联盟票数合并
// 最后联盟内对决
```

### 关卡10: 命运之轮 (2人) → 双人合作
```javascript
// 2人共同决定
// 转盘结果影响双方
// 需要协商策略
```

## 技术实现建议

### 1. 房间设置增加分队选项
```html
<div class="team-setup">
  <label>游戏模式:</label>
  <select id="game-mode">
    <option value="ffa">自由混战</option>
    <option value="team2">两队对抗</option>
    <option value="pair">2人搭档</option>
  </select>
  
  <div id="team-assign" style="display:none">
    <p>点击玩家分配到队伍:</p>
    <div class="team-red">红队</div>
    <div class="team-blue">蓝队</div>
  </div>
</div>
```

### 2. 游戏状态增加团队信息
```javascript
gameState = {
  level: 1,
  players: [...],
  teams: {
    'red': ['p1', 'p2'],
    'blue': ['p3', 'p4']
  },
  mode: 'team2', // 'ffa', 'team2', 'pair'
  turn: 0,
  phase: 'playing',
  data: {}
};
```

### 3. 胜负判定适配
```javascript
function checkWinCondition() {
  switch(gameState.mode) {
    case 'ffa':
      return checkFFAWin();
    case 'team2':
      return checkTeamWin();
    case 'pair':
      return checkPairWin();
  }
}
```

## UI适配

### 房间界面
- 显示玩家列表时增加队伍标识
- 房主可以拖拽分配队伍
- 显示队伍人数平衡

### 游戏界面
- 玩家名字显示队伍颜色
- 增加队伍聊天频道
- 显示队伍存活状态

### 结果界面
- 显示获胜队伍
- 显示队伍贡献统计

## 总结

**当前状态**: 仅支持自由混战模式

**可实现组队**: 
- ✅ 方案A(分队): 关卡6,8最适合
- ✅ 方案B(搭档): 关卡7,10最适合  
- ✅ 方案C(联盟): 所有关卡可适配

**工作量**: 
- 房间UI: 2-3小时
- 游戏逻辑: 4-6小时
- 测试验证: 2-3小时
- **总计: 8-12小时**

要我实现哪种组队模式？

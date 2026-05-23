const STORAGE_KEYS = {
  config: "photoHero.config",
  save: "photoHero.save",
  statsVisitor: "photoHero.stats.visitor",
  statsLastUvDate: "photoHero.stats.lastUvDate",
  statsGameRuns: "photoHero.stats.gameRuns",
};

const pendingDuplicatePhotoKey = "pending";
const STATS_COUNTER_RPC_URL = "https://ypefmpeekfucmarbbdov.supabase.co";
const STATS_COUNTER_RPC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZWZtcGVla2Z1Y21hcmJiZG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTA2NTYsImV4cCI6MjA4MTUyNjY1Nn0.XTOQNFuuwfu9nwDTnO9-NEqlzZnzdCVnEmYEJh0rXf8";
const STATS_COUNTER_IDS = {
  totalPv: "photo_hero_pv_total",
  totalUv: "photo_hero_uv_total",
  totalGames: "photo_hero_game_total",
  totalKills: "photo_hero_kills_total",
  totalAppraisals: "photo_hero_appraisals_total",
  totalFloors: "photo_hero_floors_total",
  totalClears: "photo_hero_clears_total",
  dailyPvPrefix: "photo_hero_pv_day",
  dailyUvPrefix: "photo_hero_uv_day",
  dailyGamesPrefix: "photo_hero_game_day",
  dailyKillsPrefix: "photo_hero_kills_day",
  dailyAppraisalsPrefix: "photo_hero_appraisals_day",
  dailyFloorsPrefix: "photo_hero_floors_day",
  dailyClearsPrefix: "photo_hero_clears_day",
};

const SILICONFLOW_MODELS = [
  { value: "Qwen/Qwen3.6-35B-A3B" },
  { value: "Pro/moonshotai/Kimi-K2.6" },
  { value: "Pro/moonshotai/Kimi-K2.5" },
  { value: "Qwen/Qwen3.6-27B" },
  { value: "Qwen/Qwen3.5-397B-A17B" },
  { value: "Qwen/Qwen3.5-122B-A10B" },
];

const ZHIPU_MODELS = [
  { value: "glm-5v-turbo" },
];

const MICU_MODELS = [
  { value: "gpt-5.5" },
  { value: "gpt-5.4" },
  { value: "kimi-k2.5" },
  { value: "kimi-k2.6" },
  { value: "qwen3.5-plus" },
  { value: "qwen3.6-plus" },
];

const API_PRESETS = {
  siliconflow: {
    label: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen3.6-35B-A3B",
    models: SILICONFLOW_MODELS,
    note: "",
    links: [
      { label: "硅基流动邀请链接", url: "https://cloud.siliconflow.cn/i/GOrKhgP7" },
      { label: "API 文档", url: "https://docs.siliconflow.cn/" },
    ],
    supportsVision: true,
  },
  zhipu: {
    label: "智谱",
    baseUrl: "https://api.z.ai/api/paas/v4",
    model: "glm-5v-turbo",
    models: ZHIPU_MODELS,
    note: "",
    links: [
      { label: "智谱邀请链接", url: "https://www.bigmodel.cn/invite?icode=fXJBq%2BPW8gOvcw6tMwvM0nHEaazDlIZGj9HxftzTbt4%3D" },
      { label: "Z.AI API 文档", url: "https://docs.z.ai/" },
    ],
    supportsVision: true,
  },
  micu: {
    label: "米醋中转",
    baseUrl: "https://www.micuapi.ai/v1",
    model: "gpt-5.5",
    models: MICU_MODELS,
    note: "",
    links: [
      { label: "米醋邀请链接", url: "https://www.micuapi.ai/register?aff=5j18" },
      { label: "米醋文档", url: "https://docs.micuapi.ai/#/" },
    ],
    supportsVision: true,
  },
  custom: {
    label: "自定义",
    baseUrl: "",
    model: "",
    models: [],
    note: "",
    links: [],
    supportsVision: true,
  },
};

const customDraft = {
  baseUrl: "",
  model: "",
};

const providerApiKeys = {};

const equipmentVisibleSlots = 10;
const equipmentSlotLimit = 10;
const battleReportLimit = 18;
const modelMaxTokens = 512;
const modelImageDetail = "low";
const defaultPhotoValueMin = 5;
const defaultPhotoValueMax = 20;
const battleSpeedOptions = [1, 2, 4];
const battleRoundBaseMs = 1000;
const battleHitEffectMs = 260;
const battleRoundLimitsByEnemyCount = [0, 100, 150, 200];
const bossBattleRoundLimit = 200;
const visionTestTimeoutMs = 30000;
const photoAnalyzeTimeoutMs = 45000;
const duplicateCompareTimeoutMs = 20000;
const imageDecodeTimeoutMs = 15000;
const uploadImageMaxBytes = 24 * 1024 * 1024;
const analysisImageMaxEdge = 1024;
const analysisImageQuality = 0.78;
const inventoryImageMaxEdge = 420;
const inventoryImageQuality = 0.72;
const maxFloor = 40;
const gameSaveVersion = 18;
const initialFilmRolls = 3;
const heroFormUpgradeKills = 12;
const bossFloors = new Set([10, 20, 30, 40]);
const rewardBossFloors = new Set([25, 35, 38]);
const bossRewardChoiceFloors = [10, 20, 25, 30, 35, 38];
const bossRewardChoiceCount = bossRewardChoiceFloors.length;
const bossMonsterKeys = new Set(["skeletonCaptain", "vampire", "knightCaptain", "demon", "octopus", "dragon", "archmage"]);

const statLabels = {
  hp: "生命上限",
  attack: "攻击",
  defense: "防御",
  speed: "速度",
  regen: "回复",
  shield: "护盾",
  lifesteal: "吸血",
};

const statValueWeights = {
  hp: 0.5,
  attack: 5,
  defense: 6,
  speed: 12,
  shield: 2,
  lifesteal: 6,
  regen: 8,
};

const itemQualityRefunds = {
  common: 0.2,
  rare: 0.4,
  epic: 0.6,
  legendary: 0.8,
};

const photoSpecialEffects = [
  { key: "killAttack", label: "每击杀7怪攻击+1", value: 15, kind: "killThreshold", threshold: 7, stat: "attack", amount: 1 },
  { key: "killDefense", label: "每击杀7怪防御+1", value: 16, kind: "killThreshold", threshold: 7, stat: "defense", amount: 1 },
  { key: "killShield", label: "每击杀2怪护盾+1", value: 14, kind: "killThreshold", threshold: 2, stat: "shield", amount: 1 },
  { key: "killSpeed", label: "每击杀10怪速度+1", value: 16, kind: "killThreshold", threshold: 10, stat: "speed", amount: 1 },
  { key: "dealDamageAttack", label: "造成伤害临时攻击+1", value: 15, kind: "dealDamageTemp", stat: "attack", amount: 1, cap: 6 },
  { key: "takeDamageDefense", label: "受到伤害临时防御+1", value: 15, kind: "takeDamageTemp", stat: "defense", amount: 1, cap: 5 },
  { key: "killMaxHp", label: "每次击杀生命上限+3", value: 14, kind: "killPermanent", stat: "hp", amount: 3 },
  { key: "killHpBoost", label: "每次击杀生命+10", value: 14, kind: "killHeal", amount: 10 },
  { key: "doubleStrikeSpeedDown", label: "速度-2，攻击-2，连击翻倍", value: 16, kind: "passive", stat: "speed", amount: -2, attackAmount: -2, doubleStrikeMultiplier: 2 },
  { key: "shieldCrashAttackDown", label: "攻击-3，附带当前护盾伤害", value: 16, kind: "passive", stat: "attack", amount: -3, shieldDamageRatio: 1 },
  { key: "regenMultiplier", label: "回复翻倍", value: 15, kind: "passive", stat: "regen", multiplier: 2 },
  { key: "lifestealMultiplier", label: "吸血翻倍", value: 15, kind: "passive", stat: "lifesteal", multiplier: 2 },
];

const photoSpecialEffectMap = new Map(photoSpecialEffects.map((effect) => [effect.key, effect]));

const portableEquipmentPattern = /锤|锤子|榔头|工具|扳手|螺丝刀|钳|剪刀|刀|指甲刀|键盘|鼠标|笔|尺子|直尺|卷尺|书|本|杯|瓶|伞|雨伞|镜|锅盖|盒|包|鞋|拖鞋|滑板|风扇|橡皮|橡皮擦|胶带|刷|梳|钥匙|锁|球|砖|石|玩具|摆件|模型|饰品|衣服|帽|手机|耳机|充电器|遥控器|凳|小桌|台灯|相机|眼镜|贴纸|卡片|纸|包装|图案|屏幕|车模|小车|乐高|公仔|手办|盆栽|小物件|桌面物|毛巾|纸巾|湿巾|电池|灯|勺|叉|筷|盘|碗|玩偶|娃娃|徽章|挂件/i;
const oversizedScenePattern = /汽车|车辆|公交|火车|飞机|船|房|楼|建筑|天空|风景|街道|道路|公路|山|海|河|湖|森林|荒原|全景|远景|大型家具|床|沙发|衣柜|冰箱|洗衣机|大面积背景/i;
const explicitOversizePattern = /比人.{0,8}(大|高)|比一个人.{0,8}(大|高)|尺寸.{0,8}(超过|大于|高于).{0,4}人|人.{0,4}(还要)?大|巨大|无法搬动|不能搬动|主要是.{0,6}(场景|背景)|大面积背景/i;

const photoIdentificationSystemPrompt = [
  "你是《照片勇者》的照片装备鉴定器，负责识别照片主体、判断尺寸、评价照片质量，并给出装备语义倾向。",
  "你必须只输出一个 JSON 对象，不要 Markdown，不要代码块，不要额外解释。",
  "第一字符必须是 {，最后一个字符必须是 }。",
  "你不负责计算最终价值、最终属性点或最终特殊效果；这些数值由本地游戏规则统一结算。",
  "你的目标不是保守拒绝，而是把玩家亲自拍到的现实主体转成有趣、可解释的装备素材；高分奖励现实实拍、主体清楚、近距离、背景干净、有互动感的小物件。",
  "不要奖励网图、搜索图、截图、游戏装备图、AI 渲染图、插画、卡牌素材或纯虚拟道具；这些不是现实物体，不能因为画得酷就当成强装备。",
].join("\n");

const photoIdentificationUserPrompt = [
  "请按步骤鉴定图片里的一个主要主体，生成《照片勇者》装备素材 JSON。",
  "",
  "识别规则：",
  "1. 先找画面中最大、最清楚、最像单个实体的主体；忽略背景、桌面、墙面和边缘杂物。",
  "2. 主体尺寸小于或接近手持/桌面/可搬动小物时，isEquipable=true，即使它普通、破旧、包装、贴纸、玩具、模型、小型植物、石头、叶片或装饰物也可以。",
  "3. 真实汽车、公交、火车、飞机、船、整栋建筑、整间房、床、沙发、冰箱、道路、天空、山海河湖等人尺寸以上主体必须 isEquipable=false。",
  "4. 如果图片里有巨大背景但前景有明确小物品，优先鉴定前景小物品，不要因为背景过大而拒绝。",
  "5. 如果画面只是网页、相册、截图、游戏界面、游戏装备卡图、AI 渲染、插画、原画、透明背景素材或白底电商图，说明它不是玩家拍到的现实物体：isEquipable=false，realPhoto=0 或 1，specialAffinity=[]。",
  "6. 如果玩家拍到的是现实中的纸质卡片、贴纸、包装、海报或屏幕载体，主体应写成卡片/贴纸/包装/屏幕本身，不要把里面的幻想武器、角色或游戏道具当成实物；这类载体通常只给低 photoQuality、低 statAffinity，specialAffinity=[]。",
  "7. 现实玩具、模型、手办、摆件、道具、纸板/塑料/金属小物可以正常鉴定；关键是它必须像真实存在、可触碰、被玩家实际拍摄的物体。",
  "",
  "必须输出这个 JSON 结构，字段名使用英文：",
  "{\"itemName\":\"短装备名\",\"subjectName\":\"照片主体\",\"objectType\":\"主体物品类型\",\"identityDescription\":\"用于判断是否同一个现实物体的详细外观描述\",\"sizeClass\":\"handheld\",\"isScene\":false,\"isEquipable\":true,\"photoQuality\":{\"clarity\":0,\"subjectArea\":0,\"backgroundClean\":0,\"realPhoto\":0,\"focusLight\":0,\"interesting\":0},\"statAffinity\":[{\"stat\":\"attack\",\"score\":3}],\"specialAffinity\":[],\"description\":\"面向玩家的一句短描述\",\"reason\":\"一句短判断依据\",\"tags\":[\"标签\"],\"confidence\":0.0}",
  "",
  "字段规则：",
  "1. itemName 要具体、短、有画面感，例如 蓝柄剪刀、旧陶瓷杯、青蛙贴纸、黑色键盘；不要叫 照片装备、神秘物品。",
  "2. sizeClass 只能写 handheld、pocket、tabletop、small_furniture、human_scale、vehicle、building、landscape、scene、unknown 之一。",
  "3. isEquipable 表示是否不是比人大的可携带/可当道具的小物件；模型、小车、玩具车可以 true，但真实汽车/巴士/火车/飞机/船必须 false。",
  "4. isScene 只有在画面主体是风景、天空、街道、建筑、大型车辆、房间整体等场景时才 true。",
  "5. 不要输出最终 value、最终 stats 或最终 specialEffects；本地规则会根据 photoQuality、statAffinity、specialAffinity 计算。",
  "6. 同一个现实物体只能鉴定一次，但同类型不同款式的物体可以分别鉴定。identityDescription 必须写清颜色、材质、形状、品牌/文字、磨损、纹理、局部特征、背景位置等可区分细节，用于后续和旧照片比较是否同一个物体。",
  "",
  "照片质量 photoQuality：",
  "clarity 主体清楚程度 0-3；subjectArea 主体占图面积 0-3；backgroundClean 背景干净 0-2；realPhoto 现实实拍感 0-3；focusLight 光线/对焦 0-2；interesting 有趣、让人想装备 0-2。",
  "评分校准：只有主体边缘清晰且不需猜测时 clarity=3；主体占画面接近一半或更大时 subjectArea=3；如果画面里有多个显眼物品、主体只是其中一个、或主体占比不到三分之一，subjectArea 通常只能给 1；背景和其他物品明显抢注意力时 backgroundClean=0 或 1，不能给 2；确实像玩家亲自拍摄的现实物体时 realPhoto=3；普通但不惊喜的物品 interesting 通常只能给 0 或 1。",
  "高分应该奖励玩家主动拍好的照片：主体明确、近距离、主体占比大、背景干净、光线清楚、物品或主体有互动感、故事感或装备联想；不要只按物品贵不贵、是不是生活用品来评分。",
  "请主动拉开分值：随手拍、主体偏小、物品很多或普通背景通常总分 6-9；主体清楚但构图一般通常 9-12；主体很清楚且有装备联想通常 12-14；只有主体近景占比大、背景干净、实拍感强且有趣的照片才给 14-15。",
  "如果主体模糊、占比小、背景杂、只是风景/大场景的一小部分，或只是抽象光斑/远景纹理，应降低 clarity、subjectArea、backgroundClean、realPhoto 或 interesting。",
  "网图、搜索图、截图、游戏装备图、AI 渲染图、插画、卡牌素材、透明背景图、白底商品图的 realPhoto 必须很低；即使画面精美、武器很酷，也不能给高分或特殊效果。",
  "普通生活用品、自然小物、现实玩具模型、现实贴纸/包装/桌面摆件只要清晰拍好都可以高分；昂贵物、宏大景观、真实载具、人物整体、抽象光影、虚拟装备图即使好看，也不能因为好看就高分。",
  "",
  "属性语义：",
  "statAffinity 只输出属性倾向，score 用 1-3，最多 3 项。可选 stat：hp、attack、defense、speed、shield、lifesteal、regen。",
  "hp=生命上限：食物、饮料、药品、植物、柔软温暖物、能量补给、可爱治愈物；本地结算为生命上限+1。",
  "生命恢复、回血、被打后恢复都属于 regen，不属于 hp；只有明确增加生命上限/耐久上限时才倾向 hp。",
  "attack=攻击：工具、硬物、敲击物、键盘鼠标、笔、砖石、运动器材、尖锐或能主动施力的物品。",
  "defense=防御：厚重、坚硬、支撑、抗压、保护、外壳、锁具、金属/硬塑料物品。",
  "speed=速度：鞋、轮子、滑板、风扇、空气流动、轻便快速、旋转、遥控器；没有运动/气流/轮/鞋含义时不要给高 speed。",
  "shield=护盾：容器、盒、包、锅盖、伞、镜子、壳、套、罩、防护用品、能挡在身前的物品。",
  "lifesteal=吸血：刀、剪刀、针、钩、指甲刀、尖锐小工具、吸附/抽取/红色血感物品；没有尖锐/吸附/夺取含义时不要给。",
  "regen=回复：水、咖啡、药品、清洁用品、空气净化器/过滤器、毛巾纸巾、灯、充电器、电池、修复/补能/清洁感物品。",
  "空气净化器、滤芯、过滤器这类净化空气的物品，优先倾向 regen 和 defense，不要倾向 hp，除非它同时明显像食物/药品/植物/治愈物。",
  "属性倾向必须来自物品功能或形态，不要为了凑满 3 项而添加牵强属性；不确定时只给 1-2 项。",
  "",
  `特殊效果倾向 specialAffinity 只能从这些 key 里选，最多 2 个候选：${photoSpecialEffects.map((effect) => `${effect.key}=${effect.label}(价值${effect.value})`).join("；")}。`,
  "特殊效果只给语义很强的候选，普通物品可以 specialAffinity=[]；不要为了显得厉害乱给特殊效果。",
  "只有史诗或传说装备才可能出现特殊效果；史诗只在约三分之一情况下出特殊效果，传说必出一个特殊效果。",
  "工具、现实玩具/模型武器、越打越顺手的现实物品可选 dealDamageAttack；盾牌、外壳、硬保护物可选 takeDamageDefense 或 shieldCrashAttackDown；奖杯、种子、书、训练器、成长感物品可选 killAttack/killDefense/killShield/killSpeed/killMaxHp/killHpBoost；鞋、风扇、滑板、成对/双件/高速物品可选 doubleStrikeSpeedDown；喝的、补给、净化、回复感物品可选 regenMultiplier；带尖锐、抽取、血感、锋利联想的物品可选 lifestealMultiplier。",
  "不要给网图、截图、游戏装备图、AI 渲染图、插画、卡牌素材 specialAffinity；现实卡片/贴纸/包装上的幻想武器也不要因为图案像武器就给强攻击或特殊效果。",
  "",
  "命名和描述：",
  "itemName、subjectName、objectType、description、reason、tags 都用中文；只有图片主体本身是英文品牌/文字时，才可保留必要英文。",
  "description 用一句中文写成装备味道，像玩家捡到一件奇怪但能上阵的小道具；不要直接承诺最终属性数值或战斗效果，例如不要写 攻击+、回复+、被打回血、吸血、加护盾。",
  "description 必须和 statAffinity 一致：剪刀、刀、针、钩、指甲刀等尖锐工具不要写修复/补能/回血味道；水杯、药、净化器、毛巾等补给清洁物不要写锋利或吸血。",
  "description 要有一点冒险感，但保持克制，不要使用夸张神器、无敌、传说降临这类空泛词。",
  "reason 只写一句内部依据，格式尽量像：主体=剪刀；尺寸=手持；质量=清晰；倾向=锋利。",
  "",
  "输出示例：",
  "{\"itemName\":\"蓝柄剪刀\",\"subjectName\":\"剪刀\",\"objectType\":\"手持工具\",\"identityDescription\":\"蓝色塑料手柄、金属剪刀刃、桌面近景、主体占画面大，没有明显品牌文字。\",\"sizeClass\":\"handheld\",\"isScene\":false,\"isEquipable\":true,\"photoQuality\":{\"clarity\":3,\"subjectArea\":3,\"backgroundClean\":2,\"realPhoto\":3,\"focusLight\":2,\"interesting\":2},\"statAffinity\":[{\"stat\":\"attack\",\"score\":3},{\"stat\":\"lifesteal\",\"score\":2}],\"specialAffinity\":[\"dealDamageAttack\"],\"description\":\"锋利的剪刀适合切开敌人的防线。\",\"reason\":\"手持尖锐工具，主体清晰。\",\"tags\":[\"尖锐\",\"工具\"],\"confidence\":0.9}",
].join("\n");

const statOrder = ["hp", "attack", "defense", "speed", "shield", "lifesteal", "regen"];

const heroForms = [
  {
    id: "hp",
    label: "生命",
    image: "form-hp.png",
    levels: {
      1: { stats: { hp: 30 }, effects: ["生命上限 +30"] },
      2: { stats: { hp: 40 }, effects: ["生命上限 +40", "战后生命上限 +3"], afterVictoryMaxHp: 3 },
    },
  },
  {
    id: "attack",
    label: "攻击",
    image: "form-attack.png",
    levels: {
      1: { stats: { attack: 3, defense: -1 }, effects: ["攻击 +3", "防御 -1"] },
      2: { stats: { attack: 3, defense: -1 }, effects: ["攻击 +3", "防御 -1", "无视25%防御（下取整）"], ignoreDefenseRatio: 0.25 },
    },
  },
  {
    id: "lifesteal",
    label: "吸血",
    image: "form-lifesteal.png",
    levels: {
      1: { stats: { lifesteal: 1 }, effects: ["吸血 +1"] },
      2: { stats: { lifesteal: 2 }, effects: ["吸血 +2", "击杀回血 4"], killHeal: 4 },
    },
  },
  {
    id: "regen",
    label: "回复",
    image: "form-regen.png",
    levels: {
      1: { stats: { regen: 1 }, effects: ["回复 +1"] },
      2: { stats: { regen: 2 }, effects: ["回复 +2", "战后回血 6"], afterVictoryHeal: 6 },
    },
  },
  {
    id: "speed",
    label: "速度",
    image: "form-speed.png",
    levels: {
      1: { stats: { speed: 1 }, effects: ["速度 +1"] },
      2: { stats: { speed: 2 }, effects: ["速度 +2", "战前先攻击每个怪"], preBattleStrike: true },
    },
  },
  {
    id: "defense",
    label: "防御",
    image: "form-defense.png",
    levels: {
      1: { stats: { defense: 3, attack: -1 }, effects: ["防御 +3", "攻击 -1"] },
      2: { stats: { defense: 3, attack: -1 }, effects: ["防御 +3", "攻击 -1", "免疫前2次伤害"], damageImmunity: 2 },
    },
  },
  {
    id: "shield",
    label: "护盾",
    image: "form-shield.png",
    levels: {
      1: { stats: { shield: 10 }, effects: ["护盾 +10"] },
      2: { stats: { shield: 10 }, effects: ["护盾 +10", "护盾减少转为治疗"], shieldLossToHeal: true },
    },
  },
  {
    id: "greedy",
    label: "财迷",
    image: "form-greedy.png",
    levels: {
      1: { stats: {}, effects: ["胶卷掉落 +0.1"], filmDropBonus: 1 },
      2: { stats: {}, effects: ["胶卷掉落 +0.2"], filmDropBonus: 2 },
    },
  },
  {
    id: "angry",
    label: "生气",
    image: "form-angry.png",
    levels: {
      1: { stats: { attack: 5, defense: 5 }, effects: ["攻防 +5", "不获得胶卷"], noFilmDrop: true },
      2: { stats: { attack: 6, defense: 6 }, effects: ["攻防 +6", "不获得胶卷"], noFilmDrop: true },
    },
  },
];

const heroFormMap = new Map(heroForms.map((form) => [form.id, form]));
const defaultHeroFormId = heroForms[0].id;
const heroFormImageBase = "./assets/heroes/";
const monsterImageBase = "./assets/monsters/";
const rewardIconBase = "./assets/rewards/";

const monsterImages = {
  slime: "slime.png",
  skeleton: "skeleton.png",
  bat: "bat.png",
  mage: "mage.png",
  wizard: "wizard.png",
  guard: "guard.png",
  knight: "knight.png",
  golem: "golem.png",
  patrol: "patrol.png",
  octopus: "octopus.png",
  dragon: "dragon.png",
  vampire: "vampire.png",
  demon: "demon.png",
  orc: "orc.png",
  swordsman: "swordsman.png",
  warrior: "warrior.png",
  archmage: "archmage.png",
  skeletonCaptain: "skeleton-captain.png",
  knightCaptain: "knight-captain.png",
};

const monsterTypes = {
  slime: { name: "史莱姆", atk: 6, def: 0, hp: 18, speed: 2, traits: [{ type: "regen", value: 1, text: "回复1" }] },
  skeleton: { name: "骷髅", atk: 8, def: 5, hp: 32, speed: 3, traits: [{ type: "noLifesteal", text: "制裁：无法吸血" }] },
  bat: { name: "蝙蝠", atk: 8, def: 0, hp: 16, speed: 6, traits: [{ type: "lifesteal", value: 1, text: "吸血1" }] },
  mage: { name: "法师", atk: 6, def: 2, hp: 30, speed: 3, traits: [{ type: "magic", text: "魔攻：无视防御" }] },
  wizard: { name: "巫师", atk: 10, def: 5, hp: 42, speed: 4, traits: [{ type: "magic", text: "魔攻：无视防御" }] },
  guard: { name: "卫兵", atk: 8, def: 8, hp: 50, speed: 2, traits: [{ type: "shield", value: 30, text: "护盾30" }] },
  knight: { name: "骑士", atk: 15, def: 6, hp: 45, speed: 4, traits: [{ type: "noRegen", text: "红莲：无法回复" }] },
  golem: { name: "石头人", atk: 12, def: 15, hp: 8, speed: 1, traits: [{ type: "sturdy", text: "坚固：每回合最多受到1伤害" }] },
  patrol: { name: "警卫", atk: 16, def: 6, hp: 50, speed: 4, traits: [{ type: "ignoreShield", text: "无视护盾" }] },
  octopus: { name: "章鱼", atk: 1, def: 0, hp: 120, speed: 4, traits: [{ type: "giant", value: 120, text: "巨物：攻击增加生命差" }] },
  dragon: { name: "魔龙", atk: 24, def: 10, hp: 80, speed: 3, traits: [{ type: "speedDownOnAttack", value: 1, text: "龙威：每次攻击速度-1" }] },
  vampire: { name: "吸血鬼", atk: 15, def: 0, hp: 66, speed: 6, traits: [{ type: "lifesteal", value: 6, text: "吸血6" }] },
  demon: { name: "魔王", atk: 25, def: 15, hp: 75, speed: 5, traits: [{ type: "attackDownOnAttack", value: 1, text: "压制：每次攻击攻击-1" }] },
  orc: { name: "兽人", atk: 12, def: 7, hp: 60, speed: 2, traits: [{ type: "regen", value: 5, text: "回复5" }] },
  swordsman: { name: "剑士", atk: 30, def: 0, hp: 20, speed: 5, traits: [{ type: "multiHit", value: 2, text: "连击2" }] },
  warrior: { name: "战士", atk: 15, def: 8, hp: 30, speed: 3, traits: [{ type: "noRegen", text: "红莲：无法回复" }] },
  archmage: { name: "大法师", atk: 16, def: 5, hp: 72, speed: 4, traits: [{ type: "promotion", text: "晋升：攻击涨防，被攻击涨攻" }] },
  skeletonCaptain: { name: "骷髅队长", atk: 12, def: 5, hp: 44, speed: 3, traits: [{ type: "noLifesteal", text: "制裁：无法吸血" }] },
  knightCaptain: { name: "骑士队长", atk: 15, def: 3, hp: 40, speed: 4, traits: [{ type: "guardedByGuards", value: 50, text: "护驾：每个卫兵减伤50%" }] },
};

const normalMonsterUnlocks = [
  { floor: 1, key: "slime", weight: 20, tier: 1 },
  { floor: 2, key: "bat", weight: 9, tier: 1 },
  { floor: 3, key: "skeleton", weight: 9, tier: 1 },
  { floor: 5, key: "mage", weight: 7, tier: 2 },
  { floor: 6, key: "orc", weight: 7, tier: 2 },
  { floor: 8, key: "golem", weight: 5, tier: 2 },
  { floor: 11, key: "wizard", weight: 6, tier: 3 },
  { floor: 13, key: "guard", weight: 5, tier: 3 },
  { floor: 15, key: "knight", weight: 6, tier: 3 },
  { floor: 17, key: "patrol", weight: 5, tier: 4 },
  { floor: 21, key: "warrior", weight: 5, tier: 4 },
  { floor: 23, key: "swordsman", weight: 4, tier: 4 },
];

const floorNarratives = {
  1: "塔门打开，潮湿的石阶上只剩一点胶卷味。先用最弱的怪物试试手。",
  2: "墙缝里有翅影掠过，速度开始变得重要。",
  3: "旧骨头敲着地面，防御高的敌人会考验你的破防能力。",
  5: "空气里亮起细小火星，法师会绕过防御直接烧到生命。",
  8: "石块在楼道尽头滚动，低攻击会被坚固外壳拖住。",
  11: "楼层开始变冷，前面的弱怪仍会出现，但塔里混进了更硬的东西。",
  21: "墙上的划痕变深，之后每多贪一只怪，都要认真算血。",
  37: "塔顶的风从门缝灌下来，最后几层不会给勇者太多喘息。",
};

const bossFloorNarratives = {
  10: "第十层的门自己合上了。骷髅队长守着第一道坎，只有打赢才能继续往上。",
  20: "烛火变成暗红色，吸血鬼正在等一个生命值不够谨慎的勇者。",
  30: "骑士队长带着两名卫兵列阵。盾墙不急着杀人，只等勇者自己撞上去。",
  40: "塔顶只剩魔王的影子。照片里的每一点数值都会在这里结算。",
};

const rewardBossFloorNarratives = {
  25: "水声从楼梯下方漫上来。章鱼挡着一张可跳过的奖励牌。",
  35: "龙翼扫过墙面，击败魔龙会让之后的拍照更有价值。",
  38: "大法师把通往塔顶的路照得发白。这一战之后，还有一层缓冲。",
};

const els = {
  playerHpText: byId("playerHpText"),
  playerHpBar: byId("playerHpBar"),
  playerAtk: byId("playerAtk"),
  playerDef: byId("playerDef"),
  playerSpeed: byId("playerSpeed"),
  playerRegen: byId("playerRegen"),
  playerShield: byId("playerShield"),
  playerLifesteal: byId("playerLifesteal"),
  heroAvatarImage: byId("heroAvatarImage"),
  formGrid: byId("formGrid"),
  floorText: byId("floorText"),
  enemyField: byId("enemyField"),
  battleSpeedBtn: byId("battleSpeedBtn"),
  fleeBtn: byId("fleeBtn"),
  attackBtn: byId("attackBtn"),
  resetGameBtn: byId("resetGameBtn"),
  fileInput: byId("fileInput"),
  filmCountBadge: byId("filmCountBadge"),
  configToggleBtn: byId("configToggleBtn"),
  secondaryArea: byId("secondaryArea"),
  presetNote: byId("presetNote"),
  providerLinks: byId("providerLinks"),
  baseUrlInput: byId("baseUrlInput"),
  apiKeyInput: byId("apiKeyInput"),
  toggleKeyBtn: byId("toggleKeyBtn"),
  presetModelField: byId("presetModelField"),
  modelInput: byId("modelInput"),
  customModelField: byId("customModelField"),
  customModelInput: byId("customModelInput"),
  saveConfigBtn: byId("saveConfigBtn"),
  testChatBtn: byId("testChatBtn"),
  chatResult: byId("chatResult"),
  globalStatsPanel: byId("globalStatsPanel"),
  globalStatsStatus: byId("globalStatsStatus"),
  equipmentGrid: byId("equipmentGrid"),
  equipmentDetail: byId("equipmentDetail"),
  equipmentDetailName: byId("equipmentDetailName"),
  equipmentDetailStats: byId("equipmentDetailStats"),
  equipmentDetailDesc: byId("equipmentDetailDesc"),
  equipmentActions: byId("equipmentActions"),
  photoActionBtn: byId("photoActionBtn"),
  analyzePhotoBtn: byId("analyzePhotoBtn"),
  pendingPhotoPreview: byId("pendingPhotoPreview"),
  pendingPhotoImage: byId("pendingPhotoImage"),
  discardItemBtn: byId("discardItemBtn"),
  loadingState: byId("loadingState"),
  battleLog: byId("battleLog"),
  imageViewer: byId("imageViewer"),
  imageViewerImage: byId("imageViewerImage"),
  imageViewerCaption: byId("imageViewerCaption"),
};

const state = {
  player: createDefaultPlayer(),
  runSeed: makeRunSeed(),
  floor: 1,
  encounterId: "",
  enemies: [],
  selectedEnemyIds: [],
  activeEnemyIds: [],
  battleClock: null,
  battleReports: [],
  battleReportSeq: 0,
  currentBattle: null,
  battleSnapshot: null,
  infoMode: "item",
  gameClear: false,
  bossReward: null,
  formProgress: createDefaultFormProgress(),
  photoValueMin: defaultPhotoValueMin,
  photoValueMax: defaultPhotoValueMax,
  globalFilmDropBonus: 0,
  battleSpeed: 1,
  hitEffectToken: 0,
  heroHitEffectUntil: 0,
  enemyHitEffectUntilById: {},
  inventory: createEmptyInventorySlots(),
  selectedSlotIndex: 0,
  pendingPhotoSlotIndex: 0,
  selectedItemId: "",
  lastPhoto: "",
  latestItem: null,
  filmShards: 0,
  filmRolls: initialFilmRolls,
  lootError: "",
  log: ["选择空装备格，在详情栏拍照鉴定。"],
  autoBattleTimer: 0,
  battleSpecial: createDefaultBattleSpecial(),
  testEnemyOverride: null,
  enemyFlipEncounterId: "",
  enemyFaceDownIds: new Set(),
  enemyFlipDownIds: new Set(),
  battleStartTimer: 0,
  floorAdvanceTimer: 0,
  pendingFloorAdvance: false,
  analysisRequest: null,
  careerSummary: null,
  careerSummaryRequest: null,
  bossRewardDeck: null,
  globalStats: createDefaultGlobalStats(),
  globalStatsStatus: "统计加载中...",
};

loadConfig();
loadSave();
initGlobalStats();
ensureEncounter();
ensureInitialFloorNarrative();
bindEvents();
render();

function bindEvents() {
  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => setSecondaryPanel(button.dataset.panelTarget || "none"));
  });

  document.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset || "custom", true));
  });

  document.querySelectorAll("[data-info-tab]").forEach((button) => {
    button.addEventListener("click", () => setInfoTab(button.dataset.infoTab || "about"));
  });

  [els.baseUrlInput, els.modelInput, els.customModelInput, els.apiKeyInput].forEach((input) => {
    input.addEventListener("input", () => {
      if (getActivePresetId() === "custom") {
        rememberCustomDraft();
      }

      renderApiStatus();
      renderEquipmentDetail();

      if (els.chatResult.dataset.state === "missing") {
        setChatResult("配置已更新，可以重新测试。");
      }
    });
  });

  [els.modelInput].forEach((input) => {
    input.addEventListener("change", () => {
      if (getActivePresetId() === "custom") {
        rememberCustomDraft();
      }
      renderApiStatus();
      renderEquipmentDetail();
    });
  });

  els.fileInput.addEventListener("change", async () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;
    await preparePhotoFromFile(file, "", "照片读取失败");
  });

  els.equipmentDetail.addEventListener("click", handleEquipmentDetailClick);
  els.equipmentDetail.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleEquipmentDetailClick(event);
  });
  els.equipmentDetail.addEventListener("paste", handleEquipmentDetailPaste);
  els.equipmentDetail.addEventListener("dragenter", handleEquipmentDetailDragEnter);
  els.equipmentDetail.addEventListener("dragover", handleEquipmentDetailDragOver);
  els.equipmentDetail.addEventListener("dragleave", handleEquipmentDetailDragLeave);
  els.equipmentDetail.addEventListener("drop", handleEquipmentDetailDrop);
  document.addEventListener("click", handleDocumentClickForInfoMode);
  els.saveConfigBtn.addEventListener("click", saveConfig);
  els.testChatBtn.addEventListener("click", testVisionApi);
  els.toggleKeyBtn.addEventListener("click", toggleApiKeyVisibility);
  els.attackBtn.addEventListener("click", handlePrimaryAction);
  els.fleeBtn.addEventListener("click", fleeCurrentFloor);
  els.battleSpeedBtn.addEventListener("click", cycleBattleSpeed);
  els.resetGameBtn.addEventListener("click", resetGame);
  els.photoActionBtn.addEventListener("click", openPhotoPickerForSelectedSlot);
  els.analyzePhotoBtn.addEventListener("click", () => {
    if (state.gameClear && isCareerSummaryOpen()) {
      downloadCareerSummaryImage();
      return;
    }
    if (isAnalyzingPhoto()) {
      cancelAnalyzePhoto();
      return;
    }
    analyzePhoto();
  });
  els.pendingPhotoPreview.addEventListener("click", () => openImageViewer(state.lastPhoto, "待鉴定照片"));
  els.discardItemBtn.addEventListener("click", handleDiscardAction);
  els.imageViewer.addEventListener("click", closeImageViewer);
  renderHeroForms();
}

function openPhotoPicker() {
  els.fileInput.value = "";
  els.fileInput.click();
}

function openPhotoPickerForSelectedSlot() {
  if (state.gameClear && isCareerSummaryOpen()) {
    requestCareerSummary(true);
    return;
  }
  if (isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || state.bossReward) return;
  const index = getSelectedSlotIndex();
  if (getInventoryItemAt(index)) return;
  state.pendingPhotoSlotIndex = index;
  state.infoMode = "item";
  openPhotoPicker();
}

function handleEquipmentDetailClick(event) {
  if (event.target.closest("button")) return;
}

function canPreparePhotoInDetail() {
  if (isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || state.bossReward || state.gameClear) return false;
  return !getInventoryItemAt(getSelectedSlotIndex());
}

async function preparePhotoFromDetailFile(file, errorPrefix, successMessage = "") {
  if (!file) return false;
  if (!canPreparePhotoInDetail()) {
    showInputNotice(getPhotoInputBlockedMessage());
    return false;
  }
  state.pendingPhotoSlotIndex = getSelectedSlotIndex();
  state.infoMode = "item";
  await preparePhotoFromFile(file, successMessage, errorPrefix);
  els.equipmentDetail.focus({ preventScroll: true });
  return true;
}

function getPhotoInputBlockedMessage() {
  if (state.gameClear) return "通关总结中不能继续拍照。";
  if (isPlayerDefeated()) return "照片勇者已经倒下，只能重开。";
  if (state.bossReward) return "先选择 Boss 奖励。";
  if (isAnalyzingPhoto()) return "正在鉴定照片，先等待或取消鉴定。";
  if (hasPendingPhoto()) return "已有待鉴定照片，先鉴定或放弃。";
  if (isEquipmentLocked()) return "战斗中不能拍照鉴定。";
  if (getInventoryItemAt(getSelectedSlotIndex())) return "当前装备格已有装备，请选择空格。";
  return "现在不能放入照片。";
}

async function handleEquipmentDetailPaste(event) {
  if (!els.equipmentDetail.contains(document.activeElement)) return;
  const file = getImageFileFromDataTransfer(event.clipboardData);
  if (!file) return;
  event.preventDefault();
  await preparePhotoFromDetailFile(file, "粘贴图片失败");
}

function handleEquipmentDetailDragEnter(event) {
  if (!dataTransferHasImage(event.dataTransfer)) return;
  event.preventDefault();
  els.equipmentDetail.classList.add("is-drag-over");
}

function handleEquipmentDetailDragOver(event) {
  if (!dataTransferHasImage(event.dataTransfer)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = canPreparePhotoInDetail() ? "copy" : "none";
  els.equipmentDetail.classList.add("is-drag-over");
}

function handleEquipmentDetailDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  els.equipmentDetail.classList.remove("is-drag-over");
}

async function handleEquipmentDetailDrop(event) {
  const file = getImageFileFromDataTransfer(event.dataTransfer);
  if (!file) return;
  event.preventDefault();
  els.equipmentDetail.classList.remove("is-drag-over");
  await preparePhotoFromDetailFile(file, "拖入图片失败");
}

function handleDocumentClickForInfoMode(event) {
  if (event.target.closest("#fileInput")) return;
  if (event.target.closest(".equipment-slot, .equipment-detail, .image-viewer, .secondary-area, [data-panel-target], .preset-button")) {
    return;
  }
  if (hasPendingPhoto()) return;
  if (state.infoMode === "item") {
    state.infoMode = "log";
    renderEquipmentDetail();
  }
}

function openImageViewer(src, caption = "", quality = null) {
  if (!src) return;
  const safeQuality = quality && quality.key ? quality : null;
  els.imageViewerImage.src = src;
  els.imageViewerCaption.textContent = safeQuality?.label ? `${safeQuality.label} · ${caption}` : caption;
  if (safeQuality) {
    els.imageViewer.dataset.quality = safeQuality.key;
    els.imageViewerCaption.dataset.quality = safeQuality.label || "";
  } else {
    delete els.imageViewer.dataset.quality;
    delete els.imageViewerCaption.dataset.quality;
  }
  els.imageViewer.hidden = false;
}

function closeImageViewer() {
  els.imageViewer.hidden = true;
  els.imageViewerImage.removeAttribute("src");
  els.imageViewerCaption.textContent = "";
  delete els.imageViewer.dataset.quality;
  delete els.imageViewerCaption.dataset.quality;
}

async function downloadCareerSummaryImage() {
  if (!state.gameClear) return;
  const summary = state.careerSummary || buildLocalCareerSummary();
  const snapshot = summary.snapshot || buildCareerSnapshot();
  const image = await makeCareerSummaryImage(summary, snapshot);
  const link = document.createElement("a");
  link.href = image;
  link.download = `photo-hero-career-${new Date().toISOString().slice(0, 10)}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  addLog("通关分享图已生成。");
}

async function makeCareerSummaryImage(summary, snapshot) {
  const width = 900;
  const height = 1260;
  const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  drawCareerSummaryCanvas(ctx, width, height, summary, snapshot);
  return canvas.toDataURL("image/png");
}

function drawCareerSummaryCanvas(ctx, width, height, summary, snapshot) {
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#edf4e8";
  for (let x = 0; x < width; x += 54) ctx.fillRect(x, 0, 2, height);
  for (let y = 0; y < height; y += 54) ctx.fillRect(0, y, width, 2);

  const margin = 62;
  roundRect(ctx, margin, margin, width - margin * 2, height - margin * 2, 28);
  ctx.fillStyle = "#fffdf8";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#17130f";
  ctx.stroke();

  ctx.fillStyle = "#245f9a";
  ctx.font = "900 46px sans-serif";
  ctx.fillText("照片勇者通关纪念", margin + 34, margin + 82);
  ctx.fillStyle = "#6f665c";
  ctx.font = "800 24px sans-serif";
  ctx.fillText(getCareerSummaryStatusText(summary), margin + 36, margin + 122);

  const statY = margin + 168;
  const statWidth = (width - margin * 2 - 88) / 3;
  [
    ["怪物", snapshot.killCount],
    ["Boss", snapshot.bossKillCount],
    ["装备", snapshot.equipmentCount],
  ].forEach(([label, value], index) => {
    const x = margin + 34 + index * (statWidth + 10);
    roundRect(ctx, x, statY, statWidth, 74, 12);
    ctx.fillStyle = "#f6dfb4";
    ctx.fill();
    ctx.strokeStyle = "#cdbb9a";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#17130f";
    ctx.font = "900 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${label} ${value}`, x + statWidth / 2, statY + 47);
    ctx.textAlign = "left";
  });

  const ability = `生命${snapshot.stats.maxHp}  攻击${snapshot.stats.atk}  防御${snapshot.stats.def}  速度${snapshot.stats.speed}  护盾${snapshot.stats.shield}  回复${snapshot.stats.regen}  吸血${snapshot.stats.lifesteal}`;
  ctx.fillStyle = "#17130f";
  ctx.font = "900 24px sans-serif";
  wrapCanvasText(ctx, `${snapshot.formLabel} · ${ability}`, margin + 36, statY + 126, width - margin * 2 - 72, 34, 2);

  ctx.fillStyle = "#245f9a";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("生涯总结", margin + 36, statY + 228);
  ctx.fillStyle = "#17130f";
  ctx.font = "600 25px sans-serif";
  const summaryText = sanitizeCareerSummaryText(summary.text || "").replace(/\n+/g, "\n");
  let textY = statY + 270;
  for (const paragraph of summaryText.split(/\n+/).filter(Boolean).slice(0, 4)) {
    textY = wrapCanvasText(ctx, paragraph, margin + 36, textY, width - margin * 2 - 72, 38, 4) + 16;
    if (textY > height - 300) break;
  }

  ctx.fillStyle = "#245f9a";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("代表装备", margin + 36, height - 258);
  ctx.fillStyle = "#17130f";
  ctx.font = "800 24px sans-serif";
  const items = snapshot.topItems.length ? snapshot.topItems.slice(0, 4) : [{ quality: "空", name: "没有照片装备记录", score: 0 }];
  items.forEach((item, index) => {
    const y = height - 218 + index * 38;
    ctx.fillText(`${item.quality} · ${item.name}${item.score ? `  ${item.score}` : ""}`, margin + 42, y);
  });

  ctx.fillStyle = "#6f665c";
  ctx.font = "700 22px sans-serif";
  ctx.fillText("photo-hero · 现实物品生成的爬塔生涯", margin + 36, height - 84);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
  const chars = Array.from(String(text || ""));
  let line = "";
  let lines = 0;
  for (const char of chars) {
    if (char === "\n") {
      ctx.fillText(line, x, y);
      line = "";
      y += lineHeight;
      lines += 1;
      if (lines >= maxLines) return y;
      continue;
    }
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
      lines += 1;
      if (lines >= maxLines) return y;
    } else {
      line = testLine;
    }
  }
  if (line && lines < maxLines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function toggleApiKeyVisibility() {
  const showing = els.apiKeyInput.type === "text";
  const label = showing ? "显示 API Key" : "隐藏 API Key";
  els.apiKeyInput.type = showing ? "password" : "text";
  els.toggleKeyBtn.classList.toggle("is-visible", !showing);
  els.toggleKeyBtn.setAttribute("aria-label", label);
  els.toggleKeyBtn.querySelector(".visually-hidden").textContent = label;
}

function setSecondaryPanel(panelId) {
  const target = ["config", "forms", "info"].includes(panelId) ? panelId : "";
  els.secondaryArea.classList.toggle("is-collapsed", !target);
  if (target === "info") setInfoTab(getActiveInfoTab());

  document.querySelectorAll(".secondary-content").forEach((panel) => {
    panel.hidden = panel.dataset.secondaryPanel !== target;
  });

  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.panelTarget === target));
  });
}

function getActiveInfoTab() {
  return document.querySelector("[data-info-tab][aria-selected='true']")?.dataset.infoTab || "about";
}

function setInfoTab(tabId) {
  const target = ["about", "photo", "battle"].includes(tabId) ? tabId : "about";
  document.querySelectorAll("[data-info-tab]").forEach((button) => {
    const active = button.dataset.infoTab === target;
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-info-page]").forEach((page) => {
    page.hidden = page.dataset.infoPage !== target;
  });
}

function applyPreset(presetId, persist = false) {
  rememberCurrentApiKey();
  if (persist && getActivePresetId() === "custom" && presetId !== "custom") {
    rememberCustomDraft();
  }

  const preset = API_PRESETS[presetId] || API_PRESETS.custom;
  const isCustom = presetId === "custom";
  const selectedModel = isCustom ? customDraft.model : preset.model;

  if (isCustom) {
    els.baseUrlInput.value = customDraft.baseUrl;
    els.customModelInput.value = customDraft.model;
  } else {
    els.baseUrlInput.value = preset.baseUrl;
    els.customModelInput.value = preset.editableModel ? customDraft.model : "";
  }
  els.apiKeyInput.value = providerApiKeys[presetId] || "";
  renderModelOptions(preset, selectedModel);

  els.baseUrlInput.readOnly = !isCustom;
  els.baseUrlInput.classList.toggle("is-locked", !isCustom);
  els.presetModelField.hidden = isCustom || Boolean(preset.editableModel);
  els.customModelField.hidden = !isCustom && !preset.editableModel;
  if (preset.editableModel) {
    els.customModelInput.value = selectedModel || customDraft.model;
  }
  els.presetNote.textContent = preset.note;
  els.presetNote.hidden = !preset.note;
  renderProviderLinks(preset);

  document.querySelectorAll(".preset-button").forEach((button) => {
    const isActive = button.dataset.preset === presetId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    saveConfig(false);
    setChatResult(`${preset.label} 已选中。`);
  } else {
    renderApiStatus();
  }
}

function renderModelOptions(preset, selectedModel) {
  els.modelInput.innerHTML = "";
  const options = preset.models?.length
    ? preset.models
    : selectedModel
      ? [{ value: selectedModel }]
      : [{ value: "", label: "手动填写下方模型名" }];

  for (const model of options) {
    const option = document.createElement("option");
    option.value = model.value;
    option.textContent = model.label || model.value;
    els.modelInput.append(option);
  }

  const values = new Set(options.map((model) => model.value));
  els.modelInput.value = values.has(selectedModel) ? selectedModel : options[0]?.value || "";
}

function renderProviderLinks(preset) {
  els.providerLinks.innerHTML = "";

  if (!preset.links?.length) {
    const hint = document.createElement("span");
    hint.textContent = "自定义接口请优先使用服务商官网提供的 API Key 和文档。";
    els.providerLinks.append(hint);
    return;
  }

  for (const link of preset.links) {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;
    els.providerLinks.append(anchor);
  }
}

function getActivePresetId() {
  return document.querySelector(".preset-button.is-active")?.dataset.preset || "siliconflow";
}

function rememberCurrentApiKey() {
  const activePreset = document.querySelector(".preset-button.is-active")?.dataset.preset;
  if (!API_PRESETS[activePreset]) return;
  providerApiKeys[activePreset] = els.apiKeyInput.value.trim();
}

function rememberCustomDraft() {
  customDraft.baseUrl = els.baseUrlInput.value;
  customDraft.model = els.customModelInput.value || els.modelInput.value;
}

async function preparePhotoFromFile(file, successMessage, errorPrefix) {
  if (isPlayerDefeated() || state.bossReward) return;
  setBusy("处理图片...");
  try {
    state.lastPhoto = await compressImage(file);
    state.pendingPhotoSlotIndex = getSelectedSlotIndex();
    state.lootError = "";
    state.infoMode = "item";
    renderCameraStatus();
    if (successMessage) {
      addLog(successMessage);
      showInputNotice(successMessage);
    } else {
      setBusy("");
    }
    render();
  } catch (error) {
    showInputNotice(`${errorPrefix}：${error.message || "无法处理该图片"}`);
  } finally {
    if (els.loadingState.dataset.notice !== "true") setBusy("");
    renderGameTextOnly();
  }
}

function getImageFileFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return null;

  const file = Array.from(dataTransfer.files || []).find((item) => item.type?.startsWith("image/"));
  if (file) return file;

  const item = Array.from(dataTransfer.items || []).find((entry) => entry.kind === "file" && entry.type?.startsWith("image/"));
  const blob = item?.getAsFile?.();
  return blob || null;
}

function dataTransferHasImage(dataTransfer) {
  if (!dataTransfer) return false;
  if (getImageFileFromDataTransfer(dataTransfer)) return true;
  return Array.from(dataTransfer.items || []).some((entry) => (
    entry.kind === "file" && (!entry.type || entry.type.startsWith("image/"))
  ));
}

function showInputNotice(message) {
  if (!message) return;
  addLog(message);
  els.loadingState.textContent = message;
  els.loadingState.dataset.notice = "true";
}

async function testVisionApi() {
  const config = getConfigFromInputs();
  const missing = getMissingConfigFields(config);

  if (missing.length) {
    setChatResult(`缺少配置：${missing.join("、")}。`, true, "missing");
    addLog("图文模型测试缺少配置。");
    render();
    return;
  }

  saveConfig(false);
  els.testChatBtn.disabled = true;
  setChatResult("正在测试图文模型...");

  try {
    const content = await callVisionText(config, makeVisionTestImage());
    setChatResult(formatVisionTestResult(content), false);
    addLog("图文模型测试成功。");
  } catch (error) {
    setChatResult(normalizeAnalyzeError(error), true);
    addLog("图文模型测试失败。");
  } finally {
    els.testChatBtn.disabled = false;
    render();
  }
}

async function callVisionText(config, image) {
  let response;
  const body = withProviderRequestOptions(config, {
    model: config.model,
    temperature: 0.2,
    max_tokens: 96,
    messages: [
      {
        role: "system",
        content: "只输出最终回答，不要输出分析过程、步骤、编号或 Markdown。",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "请识别图片文字，只回复一句中文，格式为“图文模型测试成功：图片里写着……”。不要解释。",
          },
          {
            type: "image_url",
            image_url: { url: image, detail: modelImageDetail },
          },
        ],
      },
    ],
  });

  try {
    response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    }, visionTestTimeoutMs, "图文模型测试");
  } catch (error) {
    if (isAbortError(error) || isTimeoutError(error)) throw error;
    throw new Error(`浏览器直连失败：${error.message || "请求被浏览器拦截"}。如果这是 CORS 错误，说明该 API 不允许网页直接调用。`);
  }

  if (!response.response.ok) {
    throw new Error(readUpstreamError(response.payload) || `模型接口返回 ${response.response.status}`);
  }

  const payload = response.payload;
  const content = readModelText(payload);
  if (content) return content;
  const reasoning = readModelText(payload, { reasoningOnly: true });
  if (reasoning) return reasoning;
  throw new Error(`模型没有返回最终文本内容。响应结构：${summarizePayloadShape(payload)}`);
}

function formatVisionTestResult(content) {
  const text = normalizeModelContent(content);
  if (!text) return "模型返回为空。";

  const lines = text
    .split(/\r?\n+/)
    .map(cleanModelDisplayLine)
    .filter(Boolean);
  let successIndex = -1;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index].includes("图文模型测试成功")) {
      successIndex = index;
      break;
    }
  }

  if (successIndex >= 0) {
    const successLine = lines[successIndex];
    if (/图片|写着|VISION OK|照片勇者/i.test(successLine)) {
      return shortenText(successLine.replace(/\s+/g, " "), 120);
    }

    const imageLine = lines
      .slice(Math.max(0, successIndex - 4), successIndex)
      .reverse()
      .find((line) => /图片|写着|VISION OK|照片勇者/i.test(line) && !/分析|要求|步骤|构建|检查/.test(line));
    if (imageLine) {
      return shortenText(`图文模型测试成功：${imageLine}`.replace(/\s+/g, " "), 120);
    }

    return shortenText(successLine.replace(/\s+/g, " "), 120);
  }

  return shortenText(lines.join(" ").replace(/\s+/g, " "), 120);
}

function cleanModelDisplayLine(line) {
  return String(line || "")
    .trim()
    .replace(/^\s*(?:[-*•]\s*)+/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function setChatResult(message, isError = false, stateName = "") {
  els.chatResult.textContent = message;
  els.chatResult.style.color = isError ? "var(--red)" : "var(--ink)";
  els.chatResult.dataset.state = stateName || (isError ? "error" : "ok");
}

function getMissingConfigFields(config) {
  const missing = [];
  if (!config.baseUrl) missing.push("API Base URL");
  if (!config.model) missing.push("Model");
  if (!config.apiKey) missing.push("API Key");
  return missing;
}

function getPhotoApiConfigHint() {
  const missing = getMissingConfigFields(getConfigFromInputs());
  if (!missing.length) return "";
  if (missing.includes("API Key")) return "先点右上角 API配置，填入图文模型的 API Key 后再鉴定照片。";
  return `先点右上角 API配置，补全 ${missing.join("、")} 后再鉴定照片。`;
}

async function analyzePhoto() {
  if (isPlayerDefeated() || state.bossReward) return;
  if (!state.lastPhoto) {
    addLog("还没有照片。");
    render();
    return;
  }

  const targetSlot = clampSlotIndex(state.pendingPhotoSlotIndex);
  if (getInventoryItemAt(targetSlot)) {
    const message = "当前装备格已有装备，请先选择空装备格。";
    showLootError(message);
    addLog(message);
    render();
    return;
  }

  if (state.filmRolls < 1) {
    const message = "需要先获得胶卷：每击败 1 个怪物获得胶卷 +0.1。";
    showLootError(message);
    addLog(message);
    render();
    return;
  }

  const config = getConfigFromInputs();
  if (!config.baseUrl || !config.apiKey || !config.model) {
    addLog("先填写并保存 API 地址、Key 和模型名。");
    render();
    return;
  }

  if (!isLikelyVisionModel(config)) {
    const message =
      "当前模型看起来不支持图片输入；照片鉴定请换成支持 vision/image_url 的模型。";
    showLootError(message);
    addLog("图片鉴定需要视觉模型。");
    render();
    return;
  }

  const photoKey = makePhotoDuplicateKey(state.lastPhoto);
  const photoDuplicate = findCurrentPhotoDuplicate(photoKey);
  if (photoDuplicate) {
    const message = `当前装备栏已经有这张照片生成的装备：${formatItemDisplayName(photoDuplicate)}。`;
    showLootError(`${message} 请拍摄新的物品。`);
    addLog(`${message} 胶卷未消耗。`);
    render();
    return;
  }

  saveConfig(false);
  const request = startAnalysisRequest();
  setBusy("鉴定中...");
  render();
  try {
    const item = await analyzeDirectly(config, state.lastPhoto, { signal: request.controller.signal });
    if (request.id !== state.analysisRequest?.id) return;
    const inventoryImage = await makeInventoryImage(state.lastPhoto);
    if (request.id !== state.analysisRequest?.id) return;
    const balancedItem = balanceItem({ ...item, photoKey }, inventoryImage);
    balancedItem.image = inventoryImage;
    const failureReason = getAppraisalFailureReason(balancedItem);
    if (failureReason) {
      throw new Error(failureReason);
    }
    const duplicate = await findDuplicateIdentifiedItem(balancedItem, config, request.controller.signal);
    if (request.id !== state.analysisRequest?.id) return;
    if (duplicate) {
      throw new Error(`这个物品已经鉴定过：${formatItemDisplayName(duplicate)}。请拍摄新的物品。`);
    }
    if (!consumeFilm()) {
      throw new Error("胶卷不足，未生成装备。");
    }
    receiveItem(balancedItem, "鉴定完成。");
  } catch (error) {
    if (request.id !== state.analysisRequest?.id && isAbortError(error)) return;
    const message = normalizeAnalyzeError(error);
    showLootError(message);
    addLog(`鉴定失败：${message}（胶卷未消耗）`);
    clearPendingPhoto();
  } finally {
    if (request.id === state.analysisRequest?.id) {
      finishAnalysisRequest(request.id);
      setBusy("");
      render();
    }
  }
}

function isLikelyVisionModel(config) {
  const baseUrl = config.baseUrl.toLowerCase();

  return true;
}

function normalizeAnalyzeError(error) {
  const message = error?.message || "未知错误";
  if (isAbortError(error)) return "鉴定已取消。";
  if (isTimeoutError(error)) return message;
  if (
    message.includes("unknown variant `image_url`") ||
    message.includes("expected `text`") ||
    message.toLowerCase().includes("image_url")
  ) {
    return "当前接口不接受图片输入，请换成支持 vision/image_url 的模型。";
  }
  if (message.includes("没有按 JSON 格式") || message.includes("没有按游戏要求返回 JSON")) {
    return "模型没有按游戏要求返回 JSON。";
  }
  if (message.includes("模型返回了文本")) {
    return "模型返回内容不符合游戏约束。";
  }
  return shortenText(message, 96);
}

function getAppraisalFailureReason(item) {
  if (!item) return "模型没有返回可用装备。";
  const name = formatItemDisplayName(item) || "这张照片";
  if (item.virtualImage) {
    return `${name}看起来像网图、截图或虚拟装备，没有转化成现实装备。`;
  }
  if (item.tooLarge || item.isEquipable === false) {
    return `${name}无法作为装备使用。`;
  }
  if (getItemEffectValue(item) <= 0) {
    return `${name}没有形成可用属性，请换一张主体更明确的现实物品照片。`;
  }
  return "";
}

function isInvalidAppraisalItem(item) {
  return Boolean(item && (
    item.virtualImage ||
    item.tooLarge ||
    item.isEquipable === false ||
    getItemEffectValue(item) <= 0
  ));
}

function showLootError(message) {
  state.latestItem = null;
  state.lootError = message;
}

function clearPendingPhoto() {
  state.lastPhoto = "";
  state.pendingPhotoSlotIndex = getSelectedSlotIndex();
}

function abandonPendingPhoto(message = "已放弃待鉴定照片。") {
  if (!state.lastPhoto || isAnalyzingPhoto()) return false;
  clearPendingPhoto();
  state.lootError = "";
  state.infoMode = "log";
  addLog(message);
  saveGame();
  render();
  return true;
}

function isAnalyzingPhoto() {
  return Boolean(state.analysisRequest);
}

function startAnalysisRequest() {
  finishAnalysisRequest();
  const request = {
    id: makeId("analysis"),
    controller: new AbortController(),
    startedAt: Date.now(),
  };
  state.analysisRequest = request;
  return request;
}

function finishAnalysisRequest(id = "") {
  if (id && state.analysisRequest?.id !== id) return;
  state.analysisRequest = null;
}

function cancelAnalyzePhoto() {
  if (!state.analysisRequest) return;
  const request = state.analysisRequest;
  request.controller.abort();
  finishAnalysisRequest(request.id);
  const message = "已取消鉴定，胶卷未消耗。";
  showLootError(message);
  addLog(message);
  clearPendingPhoto();
  setBusy("");
  saveGame();
  render();
}

async function analyzeDirectly(config, image, options = {}) {
  let response;
  const body = withProviderRequestOptions(config, {
    model: config.model,
    temperature: 0.35,
    max_tokens: modelMaxTokens,
    messages: [
      {
        role: "system",
        content: photoIdentificationSystemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: getPhotoIdentificationPrompt(),
          },
          {
            type: "image_url",
            image_url: { url: image, detail: modelImageDetail },
          },
        ],
      },
    ],
  });

  try {
    response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: options.signal,
    }, photoAnalyzeTimeoutMs, "照片鉴定");
  } catch (error) {
    if (isAbortError(error) || isTimeoutError(error)) throw error;
    throw new Error(`浏览器直连失败：${error.message || "请求被浏览器拦截"}。常见原因是模型服务没有允许 CORS。`);
  }

  if (!response.response.ok) {
    throw new Error(readUpstreamError(response.payload) || `模型接口返回 ${response.response.status}`);
  }

  const payload = response.payload;
  const finalText = readModelText(payload);
  if (finalText) return extractJson(finalText, payload);

  const reasoningText = readModelText(payload, { reasoningOnly: true });
  if (reasoningText) {
    return extractJson(reasoningText, payload);
  }

  const anyText = readModelText(payload, { includeReasoning: true });
  if (anyText) return extractJson(anyText, payload);

  return extractJson("", payload);
}

async function compareIdentifiedObjects(config, currentItem, knownItem, signal = null) {
  if (!currentItem?.image || !knownItem?.image) return false;
  let response;
  const prompt = [
    "请判断两张图片中的主要装备主体是否是同一个现实物体。",
    "只比较主要主体，不要因为同类型、同颜色、同品牌或都是白色小风扇就判定相同。",
    "如果是同一个实体在不同角度、距离、光线下拍摄，sameObject=true。",
    "如果只是同类但款式、结构、贴纸、纹理、磨损、背景位置或可见细节不同，sameObject=false。",
    "必须只输出 JSON：{\"sameObject\":false,\"confidence\":0.0,\"reason\":\"一句中文理由\"}。",
    "",
    `已存物品描述：${knownItem.identityDescription || knownItem.description || knownItem.reason || formatItemDisplayName(knownItem)}`,
    `新物品描述：${currentItem.identityDescription || currentItem.description || currentItem.reason || formatItemDisplayName(currentItem)}`,
  ].join("\n");
  const body = withProviderRequestOptions(config, {
    model: config.model,
    temperature: 0.1,
    max_tokens: 160,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: knownItem.image, detail: modelImageDetail } },
          { type: "image_url", image_url: { url: currentItem.image, detail: modelImageDetail } },
        ],
      },
    ],
  });

  try {
    response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    }, duplicateCompareTimeoutMs, "重复物品比对");
  } catch {
    return false;
  }

  const payload = response.payload;
  if (!response.response.ok) return false;
  const text = readModelText(payload) || readModelText(payload, { reasoningOnly: true });
  let parsed = null;
  for (const candidate of collectJsonCandidates(text)) {
    parsed = parseJsonCandidate(candidate);
    if (parsed) break;
  }
  const source = parsed || {};
  const sameObject = parseBooleanLike(source.sameObject ?? source.same_object ?? source.same ?? source["同一物体"]);
  const rawConfidence = source.confidence ?? source.score ?? source["置信度"];
  const confidence = Number.isFinite(Number(rawConfidence)) ? clampNumber(rawConfidence, 0, 1) : sameObject ? 0.75 : 0;
  return sameObject && confidence >= 0.65;
}

function withProviderRequestOptions(config, body) {
  const next = { ...body };
  if (shouldDisableThinking(config)) {
    next.enable_thinking = false;
    next.thinking = { type: "disabled" };
  }
  return next;
}

function shouldDisableThinking(config) {
  const preset = String(config?.presetId || "").toLowerCase();
  const baseUrl = String(config?.baseUrl || "").toLowerCase();
  const model = String(config?.model || "").toLowerCase();
  return preset === "siliconflow" || baseUrl.includes("siliconflow") || model.includes("qwen");
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 30000, label = "请求") {
  const upstreamSignal = options.signal || null;
  if (upstreamSignal?.aborted) {
    throw new DOMException("请求已取消。", "AbortError");
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort(new DOMException(`${label}超时。`, "TimeoutError"));
  }, timeoutMs);

  const abortFromUpstream = () => controller.abort(upstreamSignal.reason || new DOMException("请求已取消。", "AbortError"));
  if (upstreamSignal) upstreamSignal.addEventListener("abort", abortFromUpstream, { once: true });

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const payload = await response.json().catch(() => null);
    return { response, payload };
  } catch (error) {
    if (isAbortError(error)) {
      if (upstreamSignal?.aborted) {
        throw new DOMException("请求已取消。", "AbortError");
      }
      throw new Error(`${label}超过${Math.round(timeoutMs / 1000)}秒没有响应，请重试或换一张更简单清晰的照片。`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    if (upstreamSignal) upstreamSignal.removeEventListener("abort", abortFromUpstream);
  }
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function isTimeoutError(error) {
  return error?.name === "TimeoutError" || /超时|timeout/i.test(error?.message || "");
}

function buildChatEndpoint(input) {
  const raw = String(input).trim();
  const url = new URL(raw);
  const cleanPath = url.pathname.replace(/\/+$/, "");

  if (cleanPath.endsWith("/chat/completions")) {
    return url.toString();
  }

  url.pathname = `${cleanPath}/chat/completions`;
  return url.toString();
}

function getPhotoIdentificationPrompt() {
  return `${photoIdentificationUserPrompt}\n\n当前本局本地结算的装备价值范围：${getPhotoValueMin()} 到 ${getPhotoValueMax()}。你仍然不要输出最终 value 或最终 stats，只需要按 rubric 输出质量分与倾向。`;
}

function readModelText(payload, options = {}) {
  const includeReasoning = Boolean(options.includeReasoning);
  const reasoningOnly = Boolean(options.reasoningOnly);
  const parts = [];
  const visit = (value, path = "", depth = 0) => {
    if (value == null || depth > 6) return;
    if (typeof value === "string") {
      if (isModelTextPath(path, { includeReasoning, reasoningOnly }) && value.trim()) parts.push(value.trim());
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}[${index}]`, depth + 1));
      return;
    }
    if (typeof value === "object") {
      const type = String(value.type || "").toLowerCase();
      if (!includeReasoning && !reasoningOnly && (type.includes("reasoning") || type.includes("thinking"))) return;
      if (reasoningOnly && type && !(type.includes("reasoning") || type.includes("thinking"))) return;
      for (const [key, next] of Object.entries(value)) {
        visit(next, path ? `${path}.${key}` : key, depth + 1);
      }
    }
  };

  visit(payload);
  return [...new Set(parts)].join("\n").trim();
}

function isModelTextPath(path, options = {}) {
  const includeReasoning = Boolean(options.includeReasoning);
  const reasoningOnly = Boolean(options.reasoningOnly);
  const normalized = String(path || "").toLowerCase();
  if (!normalized) return false;
  if (normalized.includes("prompt") || normalized.includes("system_fingerprint")) return false;
  if (normalized.includes("messages[") || normalized.includes(".request.")) return false;
  const isReasoningPath = /reasoning|thinking|chain_of_thought/.test(normalized);
  if (reasoningOnly) {
    return isReasoningPath && (normalized.endsWith(".message.reasoning_content") || normalized.endsWith(".delta.reasoning_content") || normalized.endsWith(".reasoning_content") || normalized.endsWith(".thinking"));
  }
  if (!includeReasoning && isReasoningPath) return false;
  const tokens = [
    ".message.content",
    ".delta.content",
    ".text",
    "output_text",
    ".output.content",
    ".content.text",
    ".result",
    ".reply",
    ".answer",
    ".response",
  ];
  if (includeReasoning) {
    tokens.push(".message.reasoning_content", ".delta.reasoning_content");
  }
  return tokens.some((token) => {
    const plain = token.replace(/^\./, "");
    return normalized === plain || normalized.endsWith(token) || normalized.includes(token);
  });
}

function extractJson(content, payload = null) {
  const text = normalizeModelContent(content);
  if (!text) {
    throw new Error(`模型没有返回文本内容。响应结构：${summarizePayloadShape(payload)}`);
  }

  const candidates = collectJsonCandidates(text);
  for (const candidate of candidates) {
    const parsed = parseJsonCandidate(candidate);
    if (parsed) return normalizeModelItem(parsed);
  }

  const looseParsed = parseLooseModelJsonFields(text);
  if (looseParsed) return normalizeModelItem(looseParsed);

  const fallback = makeFallbackItemFromModelText(text);
  if (fallback) return fallback;

  throw new Error("模型没有按游戏要求返回 JSON。");
}

function normalizeModelContent(content) {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        if (typeof part?.content === "string") return part.content;
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  if (content && typeof content === "object") {
    if (typeof content.text === "string") return content.text.trim();
    if (typeof content.content === "string") return content.content.trim();
  }
  return "";
}

function summarizePayloadShape(payload) {
  if (!payload || typeof payload !== "object") return "空响应";
  const seen = new Set();
  const walk = (value, path = "$", depth = 0, output = []) => {
    if (output.length >= 18 || value == null || typeof value !== "object" || depth > 3 || seen.has(value)) return output;
    seen.add(value);
    const entries = Array.isArray(value)
      ? value.slice(0, 3).map((item, index) => [index, item])
      : Object.entries(value).slice(0, 12);
    for (const [key, next] of entries) {
      const nextPath = Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`;
      const type = Array.isArray(next) ? "array" : next === null ? "null" : typeof next;
      if (type === "string") {
        output.push(`${nextPath}: string(${shortenText(next, 32)})`);
      } else {
        output.push(`${nextPath}: ${type}`);
      }
      if (next && typeof next === "object") walk(next, nextPath, depth + 1, output);
      if (output.length >= 18) break;
    }
    return output;
  };
  return walk(payload).join("；") || "无法读取响应结构";
}

function collectJsonCandidates(text) {
  const normalized = String(text || "").trim();
  const candidates = [normalized];
  const fencedMatches = normalized.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi);
  for (const match of fencedMatches) {
    if (match[1]) candidates.push(match[1].trim());
  }

  let start = -1;
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        candidates.push(normalized.slice(start, i + 1));
        start = -1;
      }
    }
  }

  if (start >= 0) {
    candidates.push(normalized.slice(start).trim());
  }

  return [...new Set(candidates.filter(Boolean))];
}

function parseJsonCandidate(candidate) {
  for (const text of makeJsonVariants(candidate)) {
    try {
      const parsed = JSON.parse(text);
      const object = pickJsonObject(parsed);
      if (object) return object;
    } catch {
      // Try the next relaxed variant.
    }
  }
  return null;
}

function parseLooseModelJsonFields(text) {
  const source = String(text || "").trim();
  if (!source || !/"?(?:itemName|subjectName|objectType|sizeClass|photoQuality|statAffinity)"?\s*[:：]/i.test(source)) {
    return null;
  }

  const object = {};
  const stringKeys = [
    ["itemName", "itemName"],
    ["subjectName", "subjectName"],
    ["objectType", "objectType"],
    ["identityDescription", "identityDescription"],
    ["sizeClass", "sizeClass"],
    ["description", "description"],
    ["reason", "reason"],
  ];
  for (const [key, outputKey] of stringKeys) {
    const value = extractLooseStringField(source, key);
    if (value) object[outputKey] = value;
  }

  const equipable = extractLooseBooleanField(source, "isEquipable");
  const scene = extractLooseBooleanField(source, "isScene");
  if (equipable !== null) object.isEquipable = equipable;
  if (scene !== null) object.isScene = scene;

  const confidence = extractLooseNumberField(source, "confidence");
  if (Number.isFinite(confidence)) object.confidence = confidence;

  const quality = extractLoosePhotoQuality(source);
  if (quality) object.photoQuality = quality;

  const statAffinity = extractLooseStatAffinity(source);
  if (statAffinity.length) object.statAffinity = statAffinity;

  const specialAffinity = extractLooseArrayStrings(source, "specialAffinity");
  if (specialAffinity.length) object.specialAffinity = specialAffinity;

  const tags = extractLooseArrayStrings(source, "tags");
  if (tags.length) object.tags = tags;

  return object.itemName || object.subjectName || object.objectType ? object : null;
}

function extractLooseStringField(source, key) {
  const pattern = new RegExp(`["“]?${key}["”]?\\s*[:：]\\s*["“]([^"”\\n]{1,120})["”]?`, "i");
  const match = source.match(pattern);
  return cleanupLooseFieldValue(match?.[1] || "");
}

function extractLooseBooleanField(source, key) {
  const pattern = new RegExp(`["“]?${key}["”]?\\s*[:：]\\s*(true|false|是|否)`, "i");
  const value = source.match(pattern)?.[1];
  if (!value) return null;
  return /true|是/i.test(value);
}

function extractLooseNumberField(source, key) {
  const pattern = new RegExp(`["“]?${key}["”]?\\s*[:：]\\s*([0-9]+(?:\\.[0-9]+)?)`, "i");
  const value = Number(source.match(pattern)?.[1]);
  return Number.isFinite(value) ? value : NaN;
}

function extractLoosePhotoQuality(source) {
  const keys = ["clarity", "subjectArea", "backgroundClean", "realPhoto", "focusLight", "interesting"];
  const result = {};
  for (const key of keys) {
    const value = extractLooseNumberField(source, key);
    if (Number.isFinite(value)) result[key] = value;
  }
  return Object.keys(result).length ? result : null;
}

function extractLooseStatAffinity(source) {
  const block = extractLooseBlock(source, "statAffinity");
  if (!block) return [];
  const result = [];
  for (const match of block.matchAll(/\{([\s\S]*?)\}/g)) {
    const chunk = match[1] || "";
    const stat = cleanupLooseFieldValue(chunk.match(/["“]?stat["”]?\s*[:：]\s*["“]?([A-Za-z]+|生命|攻击|防御|速度|护盾|吸血|回复)["”]?/i)?.[1] || "");
    const score = Number(chunk.match(/["“]?score["”]?\s*[:：]\s*([0-9]+)/i)?.[1] || 1);
    if (stat) result.push({ stat, score: Number.isFinite(score) ? score : 1 });
  }
  return result.slice(0, 3);
}

function extractLooseArrayStrings(source, key) {
  const block = extractLooseBlock(source, key);
  if (!block) return [];
  return Array.from(block.matchAll(/["“]([^"”\n]{1,32})["”]/g))
    .map((match) => cleanupLooseFieldValue(match[1]))
    .filter(Boolean)
    .slice(0, 8);
}

function extractLooseBlock(source, key) {
  const pattern = new RegExp(`["“]?${key}["”]?\\s*[:：]\\s*\\[`, "i");
  const match = pattern.exec(source);
  if (!match) return "";
  const start = source.indexOf("[", match.index);
  if (start < 0) return "";
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }
    if (char === '"' || char === "“") {
      inString = true;
      quote = char === "“" ? "”" : char;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return source.slice(start);
}

function cleanupLooseFieldValue(value) {
  return String(value || "")
    .replace(/[{}[\]"“”'‘’]/g, "")
    .replace(/[,，]\s*$/, "")
    .trim();
}

function makeJsonVariants(candidate) {
  const base = String(candidate || "")
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/^\s*JSON\s*[:：]\s*/i, "");
  const relaxed = base
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    .replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, ': "$1"');
  const variants = [base, relaxed];
  for (const text of [base, relaxed]) {
    variants.push(...makeJsonCompletionVariants(text));
  }
  return [...new Set(variants.filter(Boolean))];
}

function makeJsonCompletionVariants(text) {
  const source = String(text || "").trim();
  if (!source || !source.includes("{")) return [];
  const variants = [];
  const sliced = source.slice(source.indexOf("{"));
  const closingIndex = Math.max(sliced.lastIndexOf("}"), sliced.lastIndexOf("]"));
  if (closingIndex >= 0) variants.push(sliced.slice(0, closingIndex + 1));

  const fixed = completeLikelyJsonObject(sliced);
  if (fixed && fixed !== sliced) variants.push(fixed);
  return variants;
}

function completeLikelyJsonObject(text) {
  let source = String(text || "").trim();
  if (!source.startsWith("{")) return "";

  let objectDepth = 0;
  let arrayDepth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }
    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }
    if (char === "{") objectDepth += 1;
    if (char === "}") objectDepth = Math.max(0, objectDepth - 1);
    if (char === "[") arrayDepth += 1;
    if (char === "]") arrayDepth = Math.max(0, arrayDepth - 1);
  }

  if (inString) source += quote || '"';
  source = source.replace(/,\s*$/, "");
  while (arrayDepth > 0) {
    source += "]";
    arrayDepth -= 1;
  }
  while (objectDepth > 0) {
    source += "}";
    objectDepth -= 1;
  }
  return source;
}

function pickJsonObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (Array.isArray(value)) {
    return value.find((item) => item && typeof item === "object" && !Array.isArray(item)) || null;
  }
  return null;
}

function normalizeModelItem(raw) {
  const source = [raw?.equipment, raw?.result, raw?.data, raw?.item]
    .find((value) => value && typeof value === "object" && !Array.isArray(value)) || raw;
  const safe = source && typeof source === "object" ? source : {};
  const stats = normalizeModelStats(safe.stats || safe.attributes || safe["属性"] || {});
  const subjectName = safe.subjectName || safe.subject_name || safe.subject || safe["主体名称"] || safe["主体"];
  const itemName = safe.itemName || safe.name || (typeof safe.item === "string" ? safe.item : "") || subjectName || safe["物品名称"] || safe["装备名"] || safe["名称"];
  const value = safe.value ?? safe.score ?? (typeof safe.quality === "object" ? null : safe.quality) ?? safe["价值"] ?? safe["品质"];
  const tooLarge = safe.tooLarge ?? safe.too_large ?? safe.oversized ?? safe["过大"] ?? safe["无法装备"];
  const objectType = safe.objectType || safe.object_type || safe.category || safe.type || safe["主体类型"] || safe["类型"];
  const sizeClass = safe.sizeClass || safe.size_class || safe.size || safe["尺寸类型"] || safe["大小"];
  const isScene = parseBooleanMaybe(safe.isScene ?? safe.is_scene ?? safe.scene ?? safe["场景"]);
  const isEquipable = parseBooleanMaybe(safe.isEquipable ?? safe.is_equipable ?? safe.equipable ?? safe["可装备"]);
  const rawPhotoQuality = safe.photoQuality || safe.photo_quality || safe.qualityScore || (typeof safe.quality === "object" ? safe.quality : null) || safe["照片质量"];
  const rawStatAffinity = safe.statAffinity || safe.stat_affinity || safe.affinity || safe.statPreference || safe["属性倾向"];
  const rawSpecialAffinity = safe.specialAffinity || safe.special_affinity || safe.specialCandidates || safe["特殊倾向"];
  const photoQuality = normalizePhotoQuality(rawPhotoQuality || {});
  const statAffinity = normalizeStatAffinity(rawStatAffinity);
  const specialAffinity = normalizeSpecialEffects(rawSpecialAffinity);
  const tags = normalizeStringList(safe.tags || safe.keywords || safe["标签"] || safe["关键词"]);
  const reason = safe.reason || safe.analysis || safe.rationale || safe["理由"] || safe["判断依据"] || safe["分析"];
  const description = safe.description || safe.desc || safe["描述"] || reason;
  const identityDescription = safe.identityDescription || safe.identity_description || safe.appearance || safe.objectIdentity || safe["外观描述"] || safe["身份描述"];
  const specialEffects = safe.specialEffects || safe.special_effects || safe.effects || safe.special || safe.specialEffect || safe["特殊效果"] || safe["特效"];
  const cleanName = cleanText(itemName, "照片装备", 18);
  const rejected = parseBooleanLike(tooLarge);
  const sceneRejected = isScene === true || isOversizedSizeClass(sizeClass);
  const contextText = [cleanName, subjectName, objectType, sizeClass, description, reason, tags.join(" ")].filter(Boolean).join(" ");
  const modelRejectsEquipment = rejected || sceneRejected || isScene === true || isEquipable === false;
  const correctedTooLarge = shouldTreatAsTooLarge(cleanName, contextText, modelRejectsEquipment);
  return {
    itemName: cleanName,
    subjectName: cleanText(subjectName, cleanName, 18),
    objectType: cleanText(objectType, "", 18),
    sizeClass: cleanText(sizeClass, "", 18),
    isScene: isScene === true,
    isEquipable: isEquipable !== false && !correctedTooLarge,
    value: correctedTooLarge ? 0 : normalizeOptionalValue(value),
    tooLarge: correctedTooLarge,
    stats,
    photoQuality,
    statAffinity,
    specialAffinity,
    semanticAppraisal: hasSemanticIdentificationData({
      subjectName,
      sizeClass,
      isScene,
      isEquipable,
      photoQuality: rawPhotoQuality,
      statAffinity: rawStatAffinity,
      specialAffinity: rawSpecialAffinity,
    }),
    specialEffects: normalizeSpecialEffects(specialEffects),
    description: cleanText(description, "由照片鉴定出的装备。", 72),
    identityDescription: cleanText(identityDescription, "", 160),
    reason: cleanText(reason, "", 72),
    tags,
    confidence: clampNumber(safe.confidence ?? safe["置信度"], 0, 1),
  };
}

function normalizeStringList(input) {
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(/[，,、;；\s]+/)
      : [];
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))].slice(0, 8);
}

function normalizePhotoQuality(input) {
  const safe = input && typeof input === "object" ? input : {};
  return {
    clarity: clampInt(safe.clarity ?? safe.clear ?? safe.subjectClear ?? safe["清晰度"] ?? safe["主体清楚"], 0, 3),
    subjectArea: clampInt(safe.subjectArea ?? safe.area ?? safe.subjectSize ?? safe["主体占比"], 0, 3),
    backgroundClean: clampInt(safe.backgroundClean ?? safe.cleanBackground ?? safe.background ?? safe["背景干净"], 0, 2),
    realPhoto: clampInt(safe.realPhoto ?? safe.realism ?? safe.lifeLike ?? safe["实拍感"] ?? safe["现实感"], 0, 3),
    focusLight: clampInt(safe.focusLight ?? safe.light ?? safe.lighting ?? safe.focus ?? safe["光线对焦"], 0, 2),
    interesting: clampInt(safe.interesting ?? safe.fun ?? safe.charm ?? safe["有趣"], 0, 2),
  };
}

function normalizeStatAffinity(input) {
  const values = Array.isArray(input)
    ? input
    : input && typeof input === "object"
      ? (input.stat || input.key || input.name || input.type || input["属性"])
        ? [input]
        : Object.entries(input).map(([stat, score]) => ({ stat, score }))
      : typeof input === "string"
        ? input.split(/[，,、;；>\s]+/).filter(Boolean).map((stat, index) => ({ stat, score: 3 - index }))
        : [];
  const best = new Map();
  for (const value of values) {
    const rawStat = typeof value === "string" ? value : value?.stat || value?.key || value?.name || value?.type || value?.["属性"];
    const stat = normalizeStatKey(rawStat);
    if (!stat) continue;
    const score = clampInt(
      typeof value === "string" ? 2 : value.score ?? value.weight ?? value.value ?? value["分数"],
      1,
      3,
    );
    best.set(stat, Math.max(best.get(stat) || 0, score));
  }
  return [...best.entries()]
    .map(([stat, score]) => ({ stat, score }))
    .sort((a, b) => b.score - a.score || statOrder.indexOf(a.stat) - statOrder.indexOf(b.stat))
    .slice(0, 3);
}

function normalizeStatKey(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  const direct = {
    hp: "hp",
    health: "hp",
    maxhp: "hp",
    max_hp: "hp",
    attack: "attack",
    atk: "attack",
    defense: "defense",
    def: "defense",
    speed: "speed",
    spd: "speed",
    shield: "shield",
    lifesteal: "lifesteal",
    life_steal: "lifesteal",
    regen: "regen",
    recovery: "regen",
  };
  if (direct[text]) return direct[text];
  if (/生命恢复|恢复生命|回血|回复/.test(text)) return "regen";
  if (/生命|血|体力/.test(text)) return "hp";
  if (/攻击|攻|伤害/.test(text)) return "attack";
  if (/防御|防/.test(text)) return "defense";
  if (/速度|速|敏捷/.test(text)) return "speed";
  if (/护盾|盾/.test(text)) return "shield";
  if (/吸血|吸/.test(text)) return "lifesteal";
  if (/回复|恢复|回/.test(text)) return "regen";
  return "";
}

function parseBooleanMaybe(value) {
  if (typeof value === "boolean") return value;
  if (value == null || value === "") return null;
  return parseBooleanLike(value);
}

function isOversizedSizeClass(value) {
  return /^(?:human_scale|vehicle|building|landscape|scene)$/i.test(String(value || "").trim());
}

function normalizeOptionalValue(value) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? clampInt(numeric, getPhotoValueMin(), getPhotoValueMax()) : null;
}

function shouldTreatAsTooLarge(itemName, description = "", modelRejected = false) {
  const text = `${itemName || ""} ${description || ""}`;
  if (isClearlyOversizedSubjectText(text)) return true;
  if (isSceneDisguisedAsPortableText(text)) return true;
  if (isLivingCreatureMainSubjectText(text)) return true;
  if (isDefinitelyPortableEquipmentText(text)) return false;
  if (isSmallEquipableNaturalText(text)) return false;
  if (isClearlySmallModelOrPatternText(text)) return false;
  if (oversizedScenePattern.test(text) || explicitOversizePattern.test(text)) return true;
  if (modelRejected) return true;
  return false;
}

function isClearlyOversizedSubjectText(text) {
  const source = String(text || "");
  if (/(?:车模|玩具车|小车|模型车|微缩|摆件|乐高|公仔|手办|贴纸|海报|图案|屏幕|包装)/.test(source)) return false;
  return /(?:真实|大型|整辆|一辆|一台|双层|重型|交通工具|载具|车辆主体|人尺寸|人型|成人|巨大|无法搬动).{0,12}(?:汽车|车顶|公交|巴士|火车|飞机|船|自行车|摩托|拖拉机|沙发|床|冰箱|建筑|房子|楼)|(?:汽车|车顶|公交|巴士|火车|飞机|船|自行车|摩托|拖拉机|沙发|床|冰箱|建筑|房子|楼).{0,12}(?:真实|大型|整辆|一辆|双层|重型|交通工具|载具|车辆主体|尺寸超过|人尺寸|人型|巨大|无法搬动)/.test(source);
}

function isPortableEquipmentText(text) {
  return portableEquipmentPattern.test(String(text || ""));
}

function isDefinitelyPortableEquipmentText(text) {
  const source = String(text || "");
  if (isClearlyOversizedSubjectText(source)) return false;
  if (!isPortableEquipmentText(source)) return false;
  if (/(?:风景|场景|天空|道路|公路|街道|地平线|山|海|河|湖|建筑|房子|楼|整间房|大面积背景|延伸|远景)/.test(source)) return false;
  if (/(?:真实|大型|整辆|一辆|路上|公路|道路|街道).{0,8}(?:汽车|车辆|公交|火车|飞机|船)|(?:汽车|车辆|公交|火车|飞机|船).{0,8}(?:道路|街道|公路|路上|真实|大型|整辆)/.test(source)) return false;
  return true;
}

function isSmallEquipableNaturalText(text) {
  const source = String(text || "");
  if (isClearlyOversizedSubjectText(source)) return false;
  if (/(?:风景|远景|全景|森林|草地|花园|道路|街道|人物|人像|动物整体|猫|狗|鸟|鱼|昆虫整体|landscape|forest|road|street|portrait|animal|cat|dog)/i.test(source)) return false;
  return /(?:叶片|叶子|花朵|花瓣|种子|松果|果实|石头|石子|贝壳|羽毛|树枝|树叶|水滴|冰块|小植物|盆栽|多肉|仙人掌|小自然物|leaf|flower|seed|pinecone|stone|pebble|shell|feather|twig|droplet|ice|succulent|cactus)/i.test(source);
}

function isClearlySmallModelOrPatternText(text) {
  const source = String(text || "");
  if (isClearlyOversizedSubjectText(source)) return false;
  if (isSceneDisguisedAsPortableText(source)) return false;
  if (!/(?:模型|微缩|玩具|手办|公仔|贴纸|卡片|图案|摆件|包装|屏幕|model|miniature|toy|figure|sticker|card|pattern)/i.test(source)) return false;
  return /(?:手持|桌面|小型|小物|可搬动|pocket|handheld|tabletop|small|miniature|toy)/i.test(source);
}

function getVirtualImagePenalty(text, photoQuality = {}) {
  const source = String(text || "");
  if (!source.trim()) {
    return { level: "none", noEffect: false, cap: null, suppressSpecial: false, description: "" };
  }
  const quality = normalizePhotoQuality(photoQuality);
  const physicalCarrier = isPhysicalImageCarrierText(source);
  const realObjectEvidence = isRealObjectPhotoEvidenceText(source);
  const realToyOrProp = isRealToyModelOrPropText(source);
  const screenshot = isScreenshotOnlyText(source);
  const digitalImage = isWebOrDigitalImageText(source);
  const gameArt = isGameOrCardArtText(source);
  const fantasyEquipment = isFantasyEquipmentImageText(source);
  const lowRealismFantasy = quality.realPhoto <= 1 && (gameArt || fantasyEquipment || isImageLikeSubjectText(source));
  const explicitDigital = digitalImage || gameArt || isScreenshotOnlyText(source);

  if (screenshot) {
    return makeVirtualImagePenalty("noEffect");
  }

  if (explicitDigital && !physicalCarrier && !realToyOrProp) {
    return makeVirtualImagePenalty("noEffect");
  }

  if ((digitalImage || gameArt || lowRealismFantasy) && !physicalCarrier && !realToyOrProp && !realObjectEvidence) {
    return makeVirtualImagePenalty("noEffect");
  }

  if (fantasyEquipment && !physicalCarrier && !realToyOrProp && !realObjectEvidence) {
    return makeVirtualImagePenalty("noEffect");
  }

  if ((digitalImage || gameArt || fantasyEquipment || isPrintedFantasyCarrierText(source)) && physicalCarrier && !realToyOrProp) {
    return makeVirtualImagePenalty("ordinaryCap");
  }

  return { level: "none", noEffect: false, cap: null, suppressSpecial: false, description: "" };
}

function makeVirtualImagePenalty(level) {
  if (level === "noEffect") {
    return {
      level,
      noEffect: true,
      cap: 0,
      suppressSpecial: true,
      description: "这更像网图或虚拟装备，没有转化成现实装备。",
    };
  }
  return {
    level,
    noEffect: false,
    cap: 12,
    suppressSpecial: true,
    description: "",
  };
}

function isScreenshotOnlyText(text) {
  return /(?:截图|屏幕截图|游戏截图|网页截图|聊天截图|相册截图|screenshot|screen capture)/i.test(String(text || ""));
}

function isWebOrDigitalImageText(text) {
  return /(?:网图|网络图片|网上图片|搜索图|搜图|下载图片|线上图片|网页图片|素材图|素材|透明背景|免抠|图标|图鉴|壁纸|白底商品图|电商图|商品展示图|AI图|AI生成|AI绘图|AI作图|生成图|渲染图|3D渲染|CG|概念图|设定图|原画|立绘|插画|二次元|虚拟道具|虚拟装备|digital image|web image|stock image|asset|icon|render|rendered|illustration|concept art|game asset)/i.test(String(text || ""));
}

function isGameOrCardArtText(text) {
  return /(?:游戏.{0,8}(装备|道具|卡牌|物品|界面|图标|图鉴)|(?:装备|道具|卡牌|物品).{0,8}(游戏|图鉴|界面)|卡牌素材|卡面|装备图|道具图|游戏图|卡牌图|武器图|盾牌图|角色卡|技能卡|game item|game card|card art|item card|weapon card)/i.test(String(text || ""));
}

function isFantasyEquipmentImageText(text) {
  return /(?:龙胆亮银枪|狮纹金盾|金盾配剑|恶魔之眼|恶魔.*巨刃|巨刃|亮银枪|神器|神兵|魔剑|圣剑|神剑|宝剑|战斧|法杖|魔杖|权杖|符文|龙鳞|魔法武器|奇幻武器|幻想武器|史诗武器|传说武器|暗黑武器|legendary weapon|fantasy weapon|magic weapon|artifact weapon)/i.test(String(text || ""));
}

function isImageLikeSubjectText(text) {
  return /(?:图片|图像|图案|画面|卡图|卡面|海报|插画|图标|image|picture|artwork|poster)/i.test(String(text || ""));
}

function isPhysicalImageCarrierText(text) {
  const source = String(text || "");
  if (isScreenshotOnlyText(source)) return false;
  if (hasNegatedRealPhotoText(source)) return false;
  if (/(?:纸质|印刷|印刷品|实体|实物|现实|真实|实拍|拍摄|手持|桌面|相框|画框|明信片|照片纸|包装|贴纸|卡片|海报|手机屏幕|显示器|屏幕上|屏幕里的|屏幕显示|printed|physical|real photo|photographed|paper card|sticker|package|poster|phone screen|monitor)/i.test(source)) return true;
  return /(?:卡片|贴纸|包装|海报|屏幕).{0,16}(?:放在|贴在|拿着|手持|桌面|拍摄|实拍|纸质|印刷|实体|实物)|(?:放在|贴在|拿着|手持|桌面|拍摄|实拍|纸质|印刷|实体|实物).{0,16}(?:卡片|贴纸|包装|海报|屏幕)/i.test(source);
}

function isRealObjectPhotoEvidenceText(text) {
  const source = String(text || "");
  if (isScreenshotOnlyText(source)) return false;
  if (hasNegatedRealPhotoText(source)) return false;
  return /(?:实拍|拍摄|现实|真实|实物|实体|手持|桌面|近景|放在|拿着|材质|塑料|金属|木质|纸质|陶瓷|玻璃|橡胶|布料|磨损|纹理|阴影|反光|real photo|photographed|physical|real object|on desk|handheld)/i.test(source);
}

function hasNegatedRealPhotoText(text) {
  return /(?:不是|并非|非|不像|没有).{0,6}(?:现实|真实|实物|实体|实拍|拍摄|可触碰|可拿|real|physical|photographed)|(?:现实|真实|实物|实体|实拍|拍摄|可触碰|可拿).{0,6}(?:不是|并非|没有)|not.{0,8}(?:real|physical|photographed|photo)/i.test(String(text || ""));
}

function isRealToyModelOrPropText(text) {
  const source = String(text || "");
  if (isScreenshotOnlyText(source)) return false;
  if (isWebOrDigitalImageText(source) && !isRealObjectPhotoEvidenceText(source)) return false;
  return /(?:玩具|模型|手办|公仔|摆件|道具|车模|乐高|积木|塑料模型|金属模型|木质模型|纸板道具|toy|model|figure|prop|lego|miniature)/i.test(source)
    && isRealObjectPhotoEvidenceText(source);
}

function isPrintedFantasyCarrierText(text) {
  const source = String(text || "");
  if (!isPhysicalImageCarrierText(source)) return false;
  return /(?:游戏|幻想|奇幻|虚拟|装备|武器|盾牌|角色|二次元|插画|原画|渲染|AI|卡牌|卡面|artwork|fantasy|game|weapon|shield|character)/i.test(source);
}

function makePhysicalCarrierStatText(text) {
  const source = String(text || "");
  if (/(?:屏幕|手机|显示器|平板|电脑|screen|monitor|phone|tablet)/i.test(source)) {
    return "现实拍摄的屏幕载体 玻璃 电子设备 外壳 防御 回复";
  }
  if (/(?:贴纸|sticker)/i.test(source)) {
    return "现实拍摄的贴纸 纸张 胶面 小物件 防御 回复";
  }
  if (/(?:包装|package|packaging)/i.test(source)) {
    return "现实拍摄的包装 纸盒 外壳 容器 防御 护盾";
  }
  if (/(?:海报|poster)/i.test(source)) {
    return "现实拍摄的海报 纸张 印刷品 防御 回复";
  }
  return "现实拍摄的纸质卡片 印刷品 纸张 小物件 防御 回复";
}

function isSceneDisguisedAsPortableText(text) {
  const source = String(text || "");
  const scenePhoto = /(?:风景照片|海景照片|山景照片|街景照片|天空照片|道路照片|城市全景|自然景观|海岸风景|山丘风景|海边风景|照片主体为(?:风景|天空|道路|街道|海岸|山|海|建筑)|landscape photo|sky photo|road photo|street photo|scenery)/i.test(source);
  if (!scenePhoto) return false;
  return !/(?:明信片|海报|卡片|贴纸|相框|画框|纸质|印刷|包装|屏幕|显示器|postcard|poster|card|sticker|frame|printed|package|screen)/i.test(source);
}

function isLivingCreatureMainSubjectText(text) {
  const source = String(text || "");
  if (/(?:玩具|模型|手办|公仔|贴纸|卡通|图案|标本|局部|鼻头|爪|羽毛|壳|玩偶|toy|model|figure|sticker|cartoon|pattern|specimen|part|nose|paw|feather|shell|plush)/i.test(source)) return false;
  return /(?:主体为|主体=|subjectName|照片主体).{0,16}(?:人物|儿童|小孩|成人|男人|女人|人群|猫|狗|鸟|鹦鹉|飞鸟|鱼|动物|昆虫|活体|person|people|child|man|woman|cat|dog|bird|fish|animal|insect)/i.test(source);
}

function hasStrongEquipmentFantasyText(text) {
  const source = String(text || "");
  return /(?:锋利|尖锐|厚重|坚硬|防护|护盾|容器|外壳|工具|武器|速度|旋转|气流|修复|补能|吸附|抽取|成长|训练|奖牌|有趣|动心|奇特|故事感|装备联想|sharp|solid|protect|shield|tool|weapon|speed|rotate|airflow|heal|energy|grow|medal|interesting|fantasy)/i.test(source);
}

function hasAirPurifierSemanticText(text) {
  return /(?:空气净化器|净化器|过滤器|滤芯|滤网|空气过滤|净化空气|清新空气|污浊空气|除尘|除味|除菌|防尘|空气清洁|air purifier|air filter|purify air|clean air)/i.test(String(text || ""));
}

function hasHpSemanticText(text) {
  return /(?:咖啡|矿泉水|饮料|药|汤|茶|牛奶|果汁|食物|饭团|面包|糖果|饼干|肉|蔬菜|水果|香蕉|番茄|西红柿|能量|植物|花朵|叶片|种子|可爱|治愈|毛绒|玩偶|娃娃|贴纸|卡通|图案|青蛙|coffee|water|drink|medicine|tea|milk|juice|food|bread|candy|fruit|banana|tomato|energy|plant|flower|seed|cute|heal|healing|plush|doll|toy|sticker|cartoon|pattern)/i.test(String(text || ""));
}

function hasStrongHpSemanticText(text) {
  return /(?:咖啡|矿泉水|饮料|药|汤|茶|牛奶|果汁|食物|饭团|面包|糖果|饼干|肉|蔬菜|水果|香蕉|番茄|西红柿|能量|植物|花朵|叶片|种子|治愈|毛绒|玩偶|娃娃|coffee|water|drink|medicine|tea|milk|juice|food|bread|candy|fruit|banana|tomato|energy|plant|flower|seed|heal|healing|plush|doll)/i.test(String(text || ""));
}

function hasStrongSpeedSemanticText(text) {
  return /(?:风扇|小风扇|桌面小风扇|空气动力|气流|旋转|扇叶|电扇|fan|airflow|rotate|blade)/i.test(String(text || ""));
}

function hasShieldSemanticText(text) {
  return /(?:盾|护盾|防护|保护|挡|遮挡|容器|盒|箱|包|壳|套|罩|伞|镜|锅盖|杯|瓶|碗|盘|盖|帽|头盔|眼镜|锁|门|甲|外壳|金属板|木板|shield|protect|guard|block|container|box|case|bag|shell|cover|umbrella|mirror|lid|helmet|glasses|armor)/i.test(String(text || ""));
}

function hasDefenseSemanticText(text) {
  const source = String(text || "");
  return hasAirPurifierSemanticText(source) || /(?:厚|重|硬|坚|金属|石|木|壳|骨|甲|板|锁|支撑|抗压|防御|防护|保护|过滤|防尘|框|架|陶瓷|玻璃|橡胶|岩|盾|hard|solid|metal|stone|wood|shell|armor|lock|support|ceramic|glass|rubber|filter)/i.test(source);
}

function hasAttackSemanticText(text) {
  return /(?:工具|武器|敲|打|锤|棒|棍|枪|长枪|短枪|矛|戟|砖|石|球|键盘|鼠标|笔|刀|剪|针|钩|刺|尖|刃|爪|牙|攻击|冲击|运动|飞行|展翅|风车|旋转|数字|显示屏|tool|weapon|hit|hammer|club|spear|lance|pike|brick|stone|ball|keyboard|mouse|pen|knife|scissor|needle|hook|sharp|claw|tooth|attack|sport|fly|wing|windmill|rotate|screen)/i.test(String(text || ""));
}

function isSharpToolSemanticText(text) {
  return /(?:刀|剪|剪刀|针|钩|指甲刀|锥|刃|锯|尖|尖锐|夹|钳|不锈钢剪刀|knife|scissor|scissors|needle|hook|clipper|blade|sharp|pliers|saw)/i.test(String(text || ""));
}

function hasOffensiveToolSemanticText(text) {
  return isSharpToolSemanticText(text) || hasAttackSemanticText(text) || hasLifestealSemanticText(text);
}

function hasSpeedSemanticText(text) {
  return /(?:鞋|轮|滑板|风|扇|羽|飞|跑|跳|旋转|气流|车模|遥控|线缆|电|速度|敏捷|运动|球|shoe|wheel|skateboard|wind|fan|feather|fly|run|jump|rotate|airflow|remote|cable|electric|speed|sport|ball)/i.test(String(text || ""));
}

function hasLifestealSemanticText(text) {
  return /(?:吸血|吸附|抽取|红色|血|刀|剪|针|钩|刺|尖|刃|指甲刀|夹|钳|牙|爪|leech|blood|absorb|knife|scissor|needle|hook|sharp|blade|claw|tooth|plier)/i.test(String(text || ""));
}

function hasRegenSemanticText(text) {
  const source = String(text || "");
  return hasAirPurifierSemanticText(source) || /(?:回复|恢复|治愈|修复|补能|清洁|净化|清新|水|咖啡|饮|药|茶|奶|充电|电池|灯|纸巾|毛巾|植物|花|叶|种子|可爱|柔软|贴纸|卡通|图案|青蛙|heal|regen|repair|clean|purify|water|coffee|drink|medicine|charger|battery|light|tissue|towel|plant|flower|leaf|seed|cute|soft|sticker|cartoon|pattern)/i.test(source);
}

function hasStrongRegenSemanticText(text) {
  const source = String(text || "");
  return hasAirPurifierSemanticText(source) || /(?:回复|恢复|治愈|回血|药|水|咖啡|饮|茶|奶|充电|电池|清洁|净化|过滤|滤芯|纸巾|毛巾|heal|regen|medicine|water|coffee|drink|charger|battery|clean|purify|filter|tissue|towel)/i.test(source);
}

function normalizeModelStats(stats) {
  const safe = stats && typeof stats === "object" ? stats : {};
  return normalizeStats({
    hp: safe.hp ?? safe.health ?? safe.maxHp ?? safe["生命"] ?? safe["生命上限"] ?? safe["血量"],
    attack: safe.attack ?? safe.atk ?? safe["攻击"] ?? safe["攻"],
    defense: safe.defense ?? safe.def ?? safe["防御"] ?? safe["防"],
    speed: safe.speed ?? safe.spd ?? safe["速度"] ?? safe["速"],
    shield: safe.shield ?? safe["护盾"] ?? safe["盾"],
    lifesteal: safe.lifesteal ?? safe.lifeSteal ?? safe["吸血"] ?? safe["吸"],
    regen: safe.regen ?? safe.recovery ?? safe.restore ?? safe["回复"] ?? safe["回"],
  }, 99);
}

function parseBooleanLike(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const text = String(value || "").trim().toLowerCase();
  return ["true", "yes", "1", "是", "对", "过大", "无法装备"].includes(text);
}

function makeFallbackItemFromModelText(text) {
  const source = String(text || "").trim();
  if (!source) return null;
  if (looksLikeVisionFailure(source)) {
    throw new Error(`模型返回了文本，但没有识别图片内容；请确认当前模型支持图片输入。原始回复：${shortenText(source, 72)}`);
  }

  const tooLarge = looksTooLargeFromText(source);
  const itemName = inferItemNameFromModelText(source) || (tooLarge ? inferRejectedItemNameFromText(source) : "");
  if (!itemName) return null;
  const correctedTooLarge = shouldTreatAsTooLarge(itemName, source, tooLarge);
  return {
    itemName,
    subjectName: itemName,
    value: correctedTooLarge ? 0 : inferFallbackValue(source),
    tooLarge: correctedTooLarge,
    stats: {},
    photoQuality: normalizePhotoQuality({}),
    statAffinity: normalizeStatAffinity([]),
    specialAffinity: [],
    identityDescription: cleanText(source, "", 160),
    description: cleanText(`按模型文字保守鉴定：${source}`, "由照片鉴定出的装备。", 72),
    reason: cleanText(source, "", 72),
    tags: normalizeStringList(source),
    confidence: 0.45,
  };
}

function looksLikeVisionFailure(text) {
  return /(?:无法|不能|看不到|未能|没有能力).{0,12}(?:图片|图像|照片)|(?:不支持|无法处理).{0,12}(?:图片|图像|image)|(?:作为|身为).{0,8}AI.{0,12}(?:无法|不能)/i.test(text);
}

function looksTooLargeFromText(text) {
  const source = String(text || "");
  if (isPortableEquipmentText(source)) return false;
  return /(?:tooLarge\s*=\s*true|too_large\s*=\s*true|风景|天空|建筑|真实汽车|大型汽车|车辆主体|房子|街道|道路|大型家具|大面积背景|比人.{0,8}(?:大|高)|尺寸.{0,8}(?:超过|大于|高于).{0,4}人|主要是.{0,6}(?:场景|背景))/i.test(source);
}

function inferItemNameFromModelText(text) {
  const patterns = [
    /(?:物品|主体|装备名|名称|itemName)\s*(?:是|为|[:：])\s*["“]?([^"，。；;\n]{1,18})/i,
    /(?:图中|图片里|照片里|画面中|这张图里)(?:主要)?(?:是|有|显示|看到)\s*(?:一个|一件|一把|一只|一台|一瓶|一双|一些|个)?\s*([^，。；;\n]{1,18})/,
    /这是\s*(?:一个|一件|一把|一只|一台|一瓶|一双|个)?\s*([^，。；;\n]{1,18})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const name = cleanupItemName(match?.[1] || "");
    if (name) return name;
  }
  return "";
}

function inferRejectedItemNameFromText(text) {
  const patterns = [
    /(?:这个|这张)?图片(?:是|为)\s*(?:一个|一件|一只|一张|个)?\s*([^，。；;\n]{1,18})/,
    /(?:图中|图片里|照片里|画面中)(?:主要)?(?:是|有|显示|看到)\s*(?:一个|一件|一只|一张|个)?\s*([^，。；;\n]{1,18})/,
    /不是(?:一个|一件|一只|一张|个)?\s*([^，。；;\n]{1,18})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const name = cleanupItemName(match?.[1] || "");
    if (name) return name;
  }
  return "不可装备物";
}

function cleanupItemName(value) {
  return String(value || "")
    .replace(/[{}[\]"“”'‘’]/g, "")
    .replace(/^(现实生活中(?:的)?|可随身装备(?:的)?|清晰(?:的)?|普通(?:的)?|一张|一个|一件|一把|一只|一台|一瓶|一双|一幅|个)+/, "")
    .replace(/(?:等物品|这个物品|这件物品|也不是|不是现实|不是可|可以作为装备|根据规则).*$/, "")
    .trim()
    .slice(0, 18);
}

function inferFallbackValue(text) {
  if (/(?:清晰|主体突出|背景干净|占比大|有趣|动心)/.test(text)) return 12;
  if (/(?:模糊|杂乱|不清楚|遮挡|占比小)/.test(text)) return 6;
  return 8;
}

function shortenText(text, maxLength) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  return source.length > maxLength ? `${source.slice(0, maxLength)}...` : source;
}

function readUpstreamError(payload) {
  if (!payload) return "";
  const message =
    typeof payload.error === "string"
      ? payload.error
      : typeof payload.error?.message === "string"
        ? payload.error.message
        : typeof payload.message === "string"
          ? payload.message
          : "";

  if (/model disabled/i.test(message) || message.includes("模型已禁用")) {
    return "当前模型在服务商侧不可用或你的账号未开通；请换成服务商后台显示可用且支持图片输入的模型，或切到自定义复制后台模型名。";
  }

  return message;
}

function receiveItem(item, message) {
  const fullItem = {
    ...item,
    id: makeId("item"),
  };
  const targetSlot = Number.isInteger(state.pendingPhotoSlotIndex) ? state.pendingPhotoSlotIndex : getSelectedSlotIndex();
  state.lastPhoto = "";
  state.pendingPhotoSlotIndex = targetSlot;
  const rewardText = fullItem.tooLarge
    ? `${message} 记录 ${fullItem.itemName}，无法提供属性。`
    : `${message} 获得 ${fullItem.itemName}。`;
  if (addInventoryItem(fullItem, rewardText, targetSlot)) {
    if (!fullItem.tooLarge) recordGlobalGameMetric("Appraisals", 1);
    saveGame();
    render();
  }
}

async function findDuplicateIdentifiedItem(item, config = null, signal = null) {
  const duplicate = findDuplicateByStoredIdentity(item);
  if (!duplicate) return null;
  if (duplicate.confidence !== "possible") return duplicate.item || null;
  if (!duplicate.item?.image || !item?.image || !config) return null;
  const same = await compareIdentifiedObjects(config, item, duplicate.item, signal);
  return same ? duplicate.item : null;
}

function findCurrentPhotoDuplicate(photoKey) {
  const normalized = makePhotoDuplicateKey(photoKey);
  if (!normalized) return null;
  return getKnownIdentifiedItems().find((known) => known.photoKey === normalized)?.item || null;
}

function findDuplicateByStoredIdentity(item) {
  const candidates = getKnownIdentifiedItems()
    .filter((known) => known.item && !known.item.tooLarge);
  for (const known of candidates) {
    const match = compareObjectIdentity(item, known.item);
    if (match) return { item: known.item, confidence: match };
  }
  return null;
}

function getKnownIdentifiedItems() {
  const known = [];
  for (const item of state.inventory || []) {
    if (!item) continue;
    known.push({
      item,
      photoKey: makePhotoDuplicateKey(item.photoKey),
      objectKey: makeStoredObjectDuplicateKey(item),
    });
  }

  return known.filter((entry) => entry.photoKey || entry.objectKey);
}

function makePhotoDuplicateKey(image) {
  const text = String(image || "").trim();
  if (!text) return "";
  if (text === pendingDuplicatePhotoKey) return pendingDuplicatePhotoKey;
  if (/^img:[a-z0-9]+$/i.test(text)) return text.toLowerCase();
  return `img:${fnv1aHash(text)}`;
}

function makeObjectDuplicateKey(item) {
  if (!item || item.tooLarge) return "";
  return makeExactObjectDuplicateKey(item) || makeObjectTypeKey(item);
}

function makeStoredObjectDuplicateKey(item) {
  if (!item || item.tooLarge) return "";
  return makeObjectDuplicateKey(item);
}

function makeExactObjectDuplicateKey(item) {
  if (!item || item.tooLarge) return "";
  if (typeof item.objectKey === "string" && /^obj:exact:/i.test(item.objectKey)) return item.objectKey.toLowerCase();
  const identity = normalizeDuplicateText(item.identityDescription);
  if (!identity || identity.length < 8) return "";
  const subject = normalizeDuplicateText(item.subjectName || item.itemName);
  const parts = normalizeDuplicateTokens([subject, identity]);
  return parts ? `obj:exact:${fnv1aHash(parts)}` : "";
}

function makeObjectTypeKey(item) {
  if (!item || item.tooLarge) return "";
  if (typeof item.objectKey === "string" && /^obj:type:/i.test(item.objectKey)) return item.objectKey.toLowerCase();
  const subject = normalizeDuplicateText(item.subjectName);
  const objectType = normalizeDuplicateText(item.objectType);
  const itemName = normalizeDuplicateText(item.itemName);
  const tags = normalizeStringList(item.tags)
    .map(normalizeDuplicateText)
    .filter((tag) => tag && !isGenericObjectToken(tag));
  const parts = subject
    ? [subject, objectType && objectType !== subject ? objectType : ""]
    : [objectType, itemName, tags.slice(0, 2).join(" ")];
  const normalized = normalizeDuplicateTokens(parts);
  return normalized ? `obj:type:${normalized}` : "";
}

function compareObjectIdentity(a, b) {
  if (!a || !b || a.tooLarge || b.tooLarge) return "";
  const photoA = makePhotoDuplicateKey(a.photoKey);
  const photoB = makePhotoDuplicateKey(b.photoKey);
  if (photoA && photoB && photoA !== pendingDuplicatePhotoKey && photoB !== pendingDuplicatePhotoKey && photoA === photoB) return "exact";
  if (photoA === pendingDuplicatePhotoKey || photoB === pendingDuplicatePhotoKey) return "";
  const exactA = makeExactObjectDuplicateKey(a);
  const exactB = makeExactObjectDuplicateKey(b);
  if (exactA && exactB && exactA === exactB) return "exact";

  const typeA = makeObjectTypeKey(a);
  const typeB = makeObjectTypeKey(b);
  if (!typeA || !typeB || typeA !== typeB) return "";

  const identityA = normalizeDuplicateText(a.identityDescription);
  const identityB = normalizeDuplicateText(b.identityDescription);
  if (identityA && identityB && identityA === identityB) return "exact";
  if (!identityA || !identityB) return "";
  if (identityA.length < 8 || identityB.length < 8) return "";
  if (identityA.includes(identityB) || identityB.includes(identityA)) return "exact";
  return "possible";
}

function normalizeDuplicateTokens(parts) {
  const tokens = [];
  for (const part of parts) {
    const token = normalizeDuplicateText(part);
    if (!token || isGenericObjectToken(token) || tokens.includes(token)) continue;
    tokens.push(token);
  }
  return tokens.slice(0, 4).join("|").slice(0, 64);
}

function normalizeDuplicateText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/^(?:一个|一件|一把|一只|一台|一瓶|一双|一张|普通|清晰|现实|实拍|极简|旧|新|黑柄|蓝柄|红色|银色|白色|黑色)+/u, "")
    .replace(/(?:装备|照片|图案|卡通|实物|物品|主体|主要|清晰|现实|实拍)+$/u, "")
    .replace(/[^\p{L}\p{N}\u4e00-\u9fff]+/gu, "")
    .slice(0, 24);
}

function isGenericObjectToken(text) {
  return /^(?:handheld|pocket|tabletop|smallfurniture|unknown|手持|桌面|小物|桌面物品|手持小物|口袋小物|小家具|工具|物品|东西|道具|图案|卡通图案|实物|主体|可装备|装备|普通|清晰)$/.test(normalizeDuplicateText(text));
}

function normalizeKeyList(list) {
  return Array.isArray(list)
    ? [...new Set(list.map((item) => String(item || "").trim()).filter(Boolean))]
    : [];
}

function fnv1aHash(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function getSelectedInventoryItem() {
  return getInventoryItemAt(getSelectedSlotIndex());
}

function addInventoryItem(item, message, preferredSlotIndex = getSelectedSlotIndex()) {
  state.latestItem = item;
  state.lootError = "";
  const oldStats = getPlayerStats();
  const oldShield = state.player.shield;
  const slotIndex = addInventoryItemDirect(item, preferredSlotIndex);
  if (slotIndex < 0) {
    showLootError("装备格已满，先丢弃一个装备再鉴定。");
    addLog("装备格已满。");
    render();
    return false;
  }
  state.selectedSlotIndex = slotIndex;
  state.selectedItemId = item.id;
  state.infoMode = "item";
  const newStats = getPlayerStats();
  state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  syncShieldAfterEquipmentChange(oldStats.shield, newStats.shield, oldShield);
  addLog(message);
  addBattleEvent(message, "item");
  saveGame();
  render();
  return true;
}

function addInventoryItemDirect(item, preferredSlotIndex = getSelectedSlotIndex()) {
  ensureInventorySlots();
  const preferred = clampSlotIndex(preferredSlotIndex);
  const slotIndex = !state.inventory[preferred] ? preferred : findFirstEmptyInventorySlot();
  if (slotIndex < 0) {
    return -1;
  }
  state.inventory[slotIndex] = item;
  return slotIndex;
}

function syncShieldAfterEquipmentChange(oldMaxShield, newMaxShield, oldCurrentShield = state.player.shield) {
  const oldMax = Math.max(0, Number(oldMaxShield) || 0);
  const newMax = Math.max(0, Number(newMaxShield) || 0);
  const current = Math.max(0, Number(oldCurrentShield) || 0);
  if (newMax > oldMax) {
    state.player.shield = newMax;
  } else {
    state.player.shield = Math.min(current, newMax);
  }
  state.player.shieldMonsterId = "";
}

function formatItemDisplayName(item) {
  return item?.itemName || "装备";
}

function createEmptyInventorySlots() {
  return Array.from({ length: equipmentVisibleSlots }, () => null);
}

function ensureInventorySlots() {
  if (!Array.isArray(state.inventory)) {
    state.inventory = createEmptyInventorySlots();
  }
  state.inventory = state.inventory.slice(0, equipmentVisibleSlots);
  while (state.inventory.length < equipmentVisibleSlots) state.inventory.push(null);
  state.inventory = state.inventory.map((item) => item || null);
  state.selectedSlotIndex = clampSlotIndex(state.selectedSlotIndex);
  state.pendingPhotoSlotIndex = clampSlotIndex(state.pendingPhotoSlotIndex);
  state.selectedItemId = state.inventory[state.selectedSlotIndex]?.id || "";
}

function clampSlotIndex(index) {
  const numeric = Number(index);
  if (!Number.isInteger(numeric)) return 0;
  return Math.max(0, Math.min(equipmentVisibleSlots - 1, numeric));
}

function getSelectedSlotIndex() {
  if (!Array.isArray(state.inventory)) {
    state.inventory = createEmptyInventorySlots();
  }
  state.selectedSlotIndex = clampSlotIndex(state.selectedSlotIndex);
  return state.selectedSlotIndex;
}

function getInventoryItemAt(index) {
  ensureInventorySlots();
  return state.inventory[clampSlotIndex(index)] || null;
}

function findFirstEmptyInventorySlot() {
  ensureInventorySlots();
  return state.inventory.findIndex((item) => !item);
}

function toggleAutoBattle() {
  if (isBattleActionLocked()) return;
  if (state.autoBattleTimer || state.gameClear || isPlayerDefeated()) return;
  state.infoMode = "log";
  startAutoBattle();
}

function handlePrimaryAction() {
  if (state.gameClear) {
    showCareerSummary();
    return;
  }
  if (state.bossReward) {
    confirmSelectedBossReward();
    return;
  }
  toggleAutoBattle();
}

function fleeCurrentFloor() {
  if (canRetreatCurrentBattle()) return retreatCurrentBattle();
  if (!canBypassCurrentFloor()) return false;
  state.infoMode = "log";
  addBattleEvent(`第${state.floor}层没有恋战，照片勇者继续向上。`, "info");
  advanceFloor();
  saveGame();
  render();
  return true;
}

function canFleeCurrentFloor() {
  return canBypassCurrentFloor() || canRetreatCurrentBattle();
}

function canBypassCurrentFloor() {
  if (state.gameClear || state.bossReward || isCareerSummaryOpen()) return false;
  if (isPlayerDefeated() || state.currentBattle || state.autoBattleTimer || state.battleStartTimer || state.pendingFloorAdvance) return false;
  if (isEquipmentLocked() || hasPendingPhoto()) return false;
  return !isBossRewardFloor(state.floor);
}

function canRetreatCurrentBattle() {
  if (state.gameClear || state.bossReward || isCareerSummaryOpen()) return false;
  if (isPlayerDefeated() || !state.currentBattle) return false;
  if (state.battleStartTimer || state.pendingFloorAdvance || hasPendingPhoto() || isAnalyzingPhoto()) return false;
  return !isBossRewardFloor(state.currentBattle.floor || state.floor);
}

function retreatCurrentBattle() {
  if (!canRetreatCurrentBattle()) return false;
  const snapshot = state.battleSnapshot;
  stopAutoBattle();
  restoreBattleSnapshot(snapshot);
  saveGame();
  render();
  return true;
}

function cycleBattleSpeed() {
  const currentIndex = battleSpeedOptions.indexOf(getBattleSpeed());
  state.battleSpeed = battleSpeedOptions[(currentIndex + 1) % battleSpeedOptions.length];
  restartAutoBattleInterval();
  saveGame();
  render();
}

function getBattleSpeed() {
  return battleSpeedOptions.includes(state.battleSpeed) ? state.battleSpeed : 1;
}

function getBattleIntervalMs() {
  return battleRoundBaseMs / getBattleSpeed();
}

function restartAutoBattleInterval() {
  if (!state.autoBattleTimer) return;
  window.clearInterval(state.autoBattleTimer);
  state.autoBattleTimer = window.setInterval(runAutoBattleTick, getBattleIntervalMs());
}

function runAutoBattleTick() {
  resolveBattleAction();
  saveGame();
  render();
}

function startAutoBattle() {
  if (isPlayerDefeated()) return;
  if (state.battleStartTimer || state.pendingFloorAdvance) return;

  ensureEncounter();
  if (!canStartSelectedBattle()) return;
  const selectedEnemies = getSelectedEnemies();
  if (!selectedEnemies.length) return;
  recordGlobalGameStart();

  const selectedIds = new Set(selectedEnemies.map((enemy) => enemy.id));
  const unselectedIds = state.enemies
    .filter((enemy) => enemy.hp > 0 && !selectedIds.has(enemy.id))
    .map((enemy) => enemy.id);
  state.enemyFlipDownIds = new Set(unselectedIds);
  render();

  state.battleStartTimer = window.setTimeout(() => {
    state.battleStartTimer = 0;
    for (const id of unselectedIds) state.enemyFaceDownIds.add(id);
    state.enemyFlipDownIds = new Set();
    beginBattle(selectedEnemies);
    resolveBattleAction();
    if (state.currentBattle && state.player.hp > 0) {
      state.autoBattleTimer = window.setInterval(runAutoBattleTick, getBattleIntervalMs());
    }
    if (!state.currentBattle || state.player.hp <= 0) {
      saveGame();
      render();
      return;
    }
    saveGame();
    render();
  }, unselectedIds.length ? 320 : 0);
  saveGame();
}

function stopAutoBattle() {
  if (!state.autoBattleTimer) return;
  window.clearInterval(state.autoBattleTimer);
  state.autoBattleTimer = 0;
}

function stopBattleTimers() {
  if (state.battleStartTimer) {
    window.clearTimeout(state.battleStartTimer);
    state.battleStartTimer = 0;
  }
  if (state.floorAdvanceTimer) {
    window.clearTimeout(state.floorAdvanceTimer);
    state.floorAdvanceTimer = 0;
  }
  state.pendingFloorAdvance = false;
}

function createDefaultBattleSpecial() {
  return {
    attack: 0,
    defense: 0,
    attackDown: 0,
    speedDown: 0,
    damageImmuneUsed: 0,
    preBattleStruck: false,
  };
}

function normalizeBattleSpecial(value) {
  const source = value && typeof value === "object" ? value : {};
  const attackCap = getTempSpecialCap("dealDamageAttack");
  const defenseCap = getTempSpecialCap("takeDamageDefense");
  return {
    attack: clampInt(source.attack, 0, attackCap || 0),
    defense: clampInt(source.defense, 0, defenseCap || 0),
    attackDown: clampInt(source.attackDown, 0, 999),
    speedDown: clampInt(source.speedDown, 0, 999),
    damageImmuneUsed: clampInt(source.damageImmuneUsed, 0, 999),
    preBattleStruck: Boolean(source.preBattleStruck),
  };
}

function resetBattleSpecial() {
  state.battleSpecial = createDefaultBattleSpecial();
}

function beginBattle(enemies) {
  const activeIds = enemies.map((enemy) => enemy.id);
  state.battleSnapshot = makeBattleSnapshot(activeIds);
  state.activeEnemyIds = activeIds;
  resetBattleSpecial();
  const stats = getBattleStats(activeIds);
  state.player.shield = stats.shield;
  state.player.shieldMonsterId = state.encounterId;
  state.battleClock = makeBattleClock(stats, enemies);
  ensureCurrentBattle(activeIds, stats);
  applyPreBattleFormEffects();
}

function makeBattleSnapshot(activeIds) {
  return cloneSerializable({
    floor: state.floor,
    encounterId: state.encounterId,
    enemies: state.enemies,
    selectedEnemyIds: state.selectedEnemyIds,
    activeEnemyIds: activeIds,
    player: state.player,
    inventory: state.inventory,
    filmShards: state.filmShards,
    filmRolls: state.filmRolls,
    latestItem: state.latestItem,
    battleReports: state.battleReports,
    battleReportSeq: state.battleReportSeq,
    infoMode: state.infoMode,
  });
}

function restoreBattleSnapshot(snapshot) {
  stopAutoBattle();
  stopBattleTimers();
  state.battleSnapshot = null;
  state.currentBattle = null;
  state.battleClock = null;
  resetBattleSpecial();
  clearEnemyCardMotion();

  if (!snapshot || typeof snapshot !== "object") {
    state.activeEnemyIds = [];
    return;
  }

  state.floor = clampInt(snapshot.floor, 1, maxFloor);
  state.encounterId = typeof snapshot.encounterId === "string" && snapshot.encounterId ? snapshot.encounterId : state.encounterId;
  state.player = normalizePlayer(snapshot.player || state.player);
  state.inventory = normalizeInventorySlots(snapshot.inventory);
  state.selectedEnemyIds = Array.isArray(snapshot.selectedEnemyIds) ? snapshot.selectedEnemyIds.filter((id) => typeof id === "string") : [];
  state.activeEnemyIds = [];
  state.enemies = Array.isArray(snapshot.enemies) ? snapshot.enemies.map(normalizeEnemy).filter(Boolean) : state.enemies;
  const validIds = new Set(state.enemies.map((enemy) => enemy.id));
  state.selectedEnemyIds = state.selectedEnemyIds.filter((id) => validIds.has(id));
  state.filmShards = clampInt(snapshot.filmShards, 0, 9);
  state.filmRolls = clampInt(snapshot.filmRolls, 0, 999);
  state.latestItem = snapshot.latestItem ? normalizeInventoryItem({ ...snapshot.latestItem, skipSpecialRoll: true }) : state.inventory.find(Boolean) || null;
  state.battleReports = Array.isArray(snapshot.battleReports) ? snapshot.battleReports.map(normalizeBattleReport).filter(Boolean) : state.battleReports;
  state.battleReportSeq = Number.isFinite(snapshot.battleReportSeq) ? snapshot.battleReportSeq : state.battleReportSeq;
  state.infoMode = snapshot.infoMode === "log" ? "log" : snapshot.infoMode === "career" && state.careerSummary ? "career" : "item";
}

function cloneSerializable(value) {
  return JSON.parse(JSON.stringify(value));
}

function getBattleRoundLimit(count = state.activeEnemyIds.length || state.selectedEnemyIds.length || 1, floor = state.floor) {
  if (isBossRewardFloor(floor)) return bossBattleRoundLimit;
  const enemyCount = clampInt(count, 1, 3);
  return battleRoundLimitsByEnemyCount[enemyCount] || battleRoundLimitsByEnemyCount[1];
}

function resolveBattleAction() {
  if (!state.currentBattle) return true;
  if (!state.battleClock) {
    state.battleClock = makeBattleClock(getBattleStats(state.activeEnemyIds), getActiveBattleEnemies());
  }
  const activeEnemies = getActiveBattleEnemies();
  if (!activeEnemies.length) {
    finishCurrentBattle("victory");
    return true;
  }

  const stats = getBattleStats(state.activeEnemyIds);
  const round = state.battleClock?.round || 1;

  const roundLimit = state.currentBattle.roundLimit || getBattleRoundLimit();
  if (round >= roundLimit) {
    const bossTimeout = isBossRewardFloor(state.currentBattle.floor);
    addBattleDetail(bossTimeout
      ? `第${roundLimit}回合照片勇者撑过强敌，继续前进。`
      : `第${roundLimit}回合敌方逃跑。`);
    for (const id of state.activeEnemyIds) state.enemyFlipDownIds.add(id);
    removeEnemiesByIds(state.activeEnemyIds, false);
    finishCurrentBattle(bossTimeout ? "boss-timeout" : "enemy-fled");
    stopAutoBattle();
    if (bossTimeout) recordGlobalGameMetric("Floors", 1);
    handleBattleEndAdvance("delay");
    return true;
  }

  const enemyClock = getNextEnemyClock();
  const heroTime = state.battleClock.hero;
  if (heroTime === Infinity && (!enemyClock || enemyClock.time === Infinity)) {
    addBattleDetail("双方速度不足，战斗陷入僵持。");
    finishCurrentBattle("enemy-fled");
    stopAutoBattle();
    handleBattleEndAdvance("delay");
    return true;
  }
  if (!enemyClock || heroTime <= enemyClock.time + Number.EPSILON) {
    resolveHeroStrike(stats, round);
    state.battleClock.hero += getActionInterval(stats.speed);
    state.battleClock.round += 1;
  } else {
    const enemy = state.enemies.find((item) => item.id === enemyClock.id);
    const enemyActionTime = enemyClock.time;
    if (enemy) resolveMonsterStrike(enemy, stats, round);
    enemyClock.time += getActionInterval(enemy?.speed || 0);
    if (enemy && hasTrait(enemy, "speedDownOnAttack")) {
      state.battleClock.hero = enemyActionTime + getActionInterval(getBattleStats(state.activeEnemyIds).speed);
    }
    state.battleClock.round += 1;
  }

  if (state.player.hp <= 0) {
    addBattleDetail("照片勇者倒下了。");
    finishCurrentBattle("defeat");
    stopAutoBattle();
    return true;
  }

  if (!getActiveBattleEnemies().length) {
    const completedFloor = state.floor;
    finishCurrentBattle("victory");
    stopAutoBattle();
    recordGlobalGameMetric("Floors", 1);
    if (completedFloor >= maxFloor) {
      advanceFloor();
      saveGame();
      render();
    } else if (isBossRewardFloor(completedFloor)) {
      startBossRewardChoice(completedFloor);
    } else {
      handleBattleEndAdvance("delay");
    }
    return true;
  }

  return false;
}

function resolveHeroStrike(stats, round) {
  void stats;
  const strikeCount = getHeroStrikeCount();
  let defeatedAny = false;

  for (let strikeIndex = 0; strikeIndex < strikeCount; strikeIndex += 1) {
    const enemy = getHeroTargetEnemy();
    if (!enemy) break;

    const currentStats = getBattleStats(state.activeEnemyIds);
    const hitResult = applyHeroDamageToEnemy(enemy, currentStats);
    const rawDamage = hitResult.rawDamage;
    const shieldCrashDamage = hitResult.shieldCrashDamage;
    const shieldLoss = hitResult.shieldLoss;
    const hpDamage = hitResult.hpDamage;
    const totalDamage = hitResult.totalDamage;
    const traitChanges = hitResult.traitChanges || [];

    let healed = 0;
    if (!hasAnyActiveTrait("noLifesteal") && currentStats.lifesteal > 0) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStats.maxHp, state.player.hp + currentStats.lifesteal);
      healed = state.player.hp - beforeHp;
    }

    if (totalDamage > 0) {
      triggerDealDamageSpecial();
    }

    const parts = [];
    if (rawDamage + shieldCrashDamage <= 0) {
      parts.push("未破防");
    } else {
      parts.push(`造成 ${hpDamage}伤害`);
    }
    if (shieldLoss > 0) parts.push(`破盾 ${shieldLoss}`);
    if (shieldCrashDamage > 0) parts.push(`护盾追加 ${shieldCrashDamage}`);
    if (healed > 0 || currentStats.lifesteal > 0) parts.push(`吸取${healed}血量`);
    if (strikeCount > 1) parts.push(`连击${strikeIndex + 1}/${strikeCount}`);
    parts.push(...traitChanges);
    addBattleDetail(`第${round}回合勇者进攻${enemy.name}，${parts.join("，")}。`);

    if (enemy.hp <= 0) {
      defeatEnemy(enemy);
      defeatedAny = true;
    }
  }

  return defeatedAny;
}

function applyHeroDamageToEnemy(enemy, stats, source = "attack") {
  const rawDamage = Math.max(0, stats.atk - getEffectiveEnemyDefense(enemy, stats));
  const shieldCrashDamage = getShieldCrashDamage();
  let damage = rawDamage + shieldCrashDamage;
  if (hasTrait(enemy, "sturdy")) damage = Math.min(damage, 1);
  damage = applyEnemyIncomingDamageModifiers(enemy, damage, getActiveBattleEnemies());

  const shieldLoss = Math.min(enemy.shield || 0, damage);
  enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
  const hpDamage = Math.max(0, damage - shieldLoss);
  enemy.hp = Math.max(0, enemy.hp - hpDamage);
  const totalDamage = shieldLoss + hpDamage;
  if (totalDamage > 0) markEnemyHit(enemy.id);
  const traitChanges = triggerEnemyDamagedTraits(enemy);

  return {
    rawDamage,
    shieldCrashDamage,
    shieldLoss,
    hpDamage,
    totalDamage,
    traitChanges,
    source,
  };
}

function applyPreBattleFormEffects() {
  const config = getHeroFormLevelConfig();
  if (!config.preBattleStrike || state.battleSpecial.preBattleStruck) return;
  state.battleSpecial.preBattleStruck = true;
  const targets = getActiveBattleEnemies();
  if (!targets.length) return;
  const hitNames = [];
  for (const enemy of targets) {
    if (enemy.hp <= 0) continue;
    const stats = getBattleStats(state.activeEnemyIds);
    const result = applyHeroDamageToEnemy(enemy, stats, "prebattle");
    hitNames.push(`${enemy.name}${result.hpDamage}`);
    if (enemy.hp <= 0) defeatEnemy(enemy);
  }
  if (hitNames.length) addBattleDetail(`速度形态先攻：${hitNames.join("，")}。`);
}

function resolveMonsterStrike(enemy, stats, round) {
  const hitCount = getTraitValue(enemy, "multiHit", 1);
  let totalHpLoss = 0;
  let totalShieldLoss = 0;
  let totalRegen = 0;
  let monsterStealTotal = 0;
  let immuneCount = 0;

  for (let i = 0; i < hitCount; i += 1) {
    const currentStatsBeforeHit = getBattleStats(state.activeEnemyIds);
    const monsterAtk = getMonsterAttackForStrike(enemy, currentStatsBeforeHit);
    const damage = hasTrait(enemy, "magic") ? Math.max(0, monsterAtk) : Math.max(0, monsterAtk - currentStatsBeforeHit.def);
    const immunity = getHeroFormLevelConfig().damageImmunity || 0;
    const isImmune = state.battleSpecial.damageImmuneUsed < immunity && damage > 0;
    if (isImmune) {
      state.battleSpecial.damageImmuneUsed += 1;
      immuneCount += 1;
    }
    const effectiveDamage = isImmune ? 0 : damage;
    const ignoresShield = hasTrait(enemy, "ignoreShield");
    const shieldLoss = ignoresShield ? 0 : Math.min(state.player.shield, effectiveDamage);
    const hpLoss = effectiveDamage - shieldLoss;
    state.player.shield -= shieldLoss;
    state.player.hp = Math.max(0, state.player.hp - hpLoss);
    totalHpLoss += hpLoss;
    totalShieldLoss += shieldLoss;
    if (shieldLoss + hpLoss > 0 || isImmune) markHeroHit();
    if (shieldLoss > 0 && getHeroFormLevelConfig().shieldLossToHeal) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStatsBeforeHit.maxHp, state.player.hp + shieldLoss);
      totalRegen += state.player.hp - beforeHp;
    }
    if (shieldLoss + hpLoss > 0) {
      triggerTakeDamageSpecial();
    }

    const currentStats = getBattleStats(state.activeEnemyIds);
    if (state.player.hp > 0 && !hasAnyActiveTrait("noRegen") && currentStats.regen > 0) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStats.maxHp, state.player.hp + currentStats.regen);
      totalRegen += state.player.hp - beforeHp;
    }

    const monsterSteal = getTraitValue(enemy, "lifesteal", 0);
    if (monsterSteal > 0) {
      const beforeHp = enemy.hp;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterSteal);
      monsterStealTotal += enemy.hp - beforeHp;
    }

    if (state.player.hp <= 0) break;
  }

  const traitChanges = triggerEnemyAttackTraits(enemy);

  const monsterRegen = getTraitValue(enemy, "regen", 0);
  let monsterHealed = 0;
  if (monsterRegen > 0 && enemy.hp > 0) {
    const beforeHp = enemy.hp;
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterRegen);
    monsterHealed = enemy.hp - beforeHp;
  }

  const parts = [];
  if (hitCount > 1) parts.push(`连击${hitCount}`);
  if (immuneCount > 0) parts.push(`免疫${immuneCount}次`);
  parts.push(totalHpLoss > 0 ? `生命损失 ${Math.max(0, totalHpLoss - totalRegen)}` : "生命无损失");
  if (totalShieldLoss > 0) parts.push(`护盾承受 ${totalShieldLoss}`);
  if (totalRegen > 0) parts.push(`回复 ${totalRegen}`);
  if (monsterHealed > 0) parts.push(`${enemy.name}回复 ${monsterHealed}`);
  if (monsterStealTotal > 0) parts.push(`${enemy.name}吸取 ${monsterStealTotal}`);
  parts.push(...traitChanges);
  if (hasTrait(enemy, "magic")) parts.push("无视防御");
  if (hasTrait(enemy, "ignoreShield")) parts.push("无视护盾");
  addBattleDetail(`第${round}回合${enemy.name}进攻，${parts.join("，")}。`);
}

function defeatEnemy(enemy) {
  const drops = getEnemyDrops(enemy);
  const defeatedIds = state.currentBattle?.defeatedIds;
  const defeatedTypes = state.currentBattle?.defeatedTypes;
  addLootNamesToCurrentBattle(drops);
  if (Array.isArray(defeatedIds)) defeatedIds.push(enemy.id);
  if (Array.isArray(defeatedTypes)) defeatedTypes.push(enemy.typeKey || "");
  addBattleDetail(`${enemy.name} 被击败。`);
  applyFormKillEffects();
  triggerKillSpecial(enemy);
  for (const drop of drops) {
    if (drop.kind === "shard") {
      addFilmShards(drop.amount);
    } else if (drop.kind === "film") {
      addFilmShards(Math.round((drop.amount || 1) * 10));
    }
  }
  removeActiveEnemyIds([enemy.id]);
  if (state.activeEnemyIds.length > 0) {
    state.enemyFlipDownIds.add(enemy.id);
  }
}

function applyFormKillEffects() {
  const heal = getHeroFormLevelConfig().killHeal || 0;
  if (heal <= 0) return;
  const stats = getBattleStats(state.activeEnemyIds);
  const beforeHp = state.player.hp;
  state.player.hp = Math.min(stats.maxHp, state.player.hp + heal);
  const healed = state.player.hp - beforeHp;
  if (healed > 0) addBattleDetail(`${getHeroForm().label}形态击杀回血 ${healed}。`);
}

function markEnemyHit(enemyId) {
  if (state.enemyHitEffectUntilById[enemyId]) return;
  const token = state.hitEffectToken + 1;
  state.hitEffectToken = token;
  state.enemyHitEffectUntilById[enemyId] = token;
  window.setTimeout(() => {
    if (state.enemyHitEffectUntilById[enemyId] !== token) return;
    delete state.enemyHitEffectUntilById[enemyId];
    render();
  }, battleHitEffectMs);
}

function markHeroHit() {
  if (state.heroHitEffectUntil) return;
  const token = state.hitEffectToken + 1;
  state.hitEffectToken = token;
  state.heroHitEffectUntil = token;
  window.setTimeout(() => {
    if (state.heroHitEffectUntil !== token) return;
    state.heroHitEffectUntil = 0;
    render();
  }, battleHitEffectMs);
}

function removeEnemiesByIds(ids, reward = true) {
  const idSet = new Set(ids);
  if (reward) {
    for (const enemy of state.enemies.filter((item) => idSet.has(item.id) && item.hp > 0)) {
      defeatEnemy(enemy);
    }
  }
  state.enemies = state.enemies.filter((enemy) => !idSet.has(enemy.id));
  removeActiveEnemyIds(ids);
}

function removeActiveEnemyIds(ids) {
  const idSet = new Set(ids);
  state.activeEnemyIds = state.activeEnemyIds.filter((id) => !idSet.has(id));
  if (state.battleClock?.enemies) {
    state.battleClock.enemies = state.battleClock.enemies.filter((clock) => !idSet.has(clock.id));
  }
}

function ensureCurrentBattle(activeIds, stats = getBattleStats(activeIds)) {
  const battleId = `${state.floor}:${activeIds.join("|")}`;
  if (state.currentBattle?.battleId === battleId) return state.currentBattle;
  const enemies = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
  state.currentBattle = {
    id: makeId("battle"),
    type: "battle",
    battleId,
    floor: state.floor,
    monsterName: enemies.map((enemy) => enemy.name).join("、"),
    startHp: state.player.hp,
    startShield: state.player.shield,
    damageEstimates: Object.fromEntries(simulateDamageEstimateForIds(activeIds, { ignoreFrozen: true })),
    initialEnemyCount: activeIds.length,
    roundLimit: getBattleRoundLimit(activeIds.length),
    details: [],
    lootNames: [],
    defeatedIds: [],
    defeatedTypes: [],
    createdAt: Date.now(),
  };
  return state.currentBattle;
}

function addBattleDetail(text) {
  if (!state.currentBattle) return;
  state.currentBattle.details.push(text);
  if (state.currentBattle.details.length > 90) {
    state.currentBattle.details = state.currentBattle.details.slice(-90);
  }
}

function addLootNamesToCurrentBattle(drops) {
  if (!state.currentBattle) return;
  for (const drop of drops) {
    const amount = drop.amount || 1;
    const name = drop.kind === "shard"
      ? "胶卷碎片"
      : drop.itemName || (drop.kind === "film" ? "胶卷 +1.0" : "胶卷 +0.1");
    if (drop.kind === "shard" || drop.kind === "film") {
      state.currentBattle.lootNames.push(drop.itemName || name);
      continue;
    }
    for (let i = 0; i < amount; i += 1) {
      state.currentBattle.lootNames.push(name);
    }
  }
}

function finishCurrentBattle(result) {
  if (!state.currentBattle) return;
  const battle = state.currentBattle;
  applyFormBattleEndEffects(result, battle);
  settleFormProgressAfterBattle(result, battle);
  recordBattleKillStats(result, battle);
  const hpDelta = state.player.hp - battle.startHp;
  const stats = getPlayerStats();
  const endHp = Math.min(state.player.hp, stats.maxHp);
  const report = {
    ...battle,
    result,
    hpDelta,
    endHp,
    endMaxHp: stats.maxHp,
    endShield: state.player.shield,
    summary: makeBattleSummary(result, battle, hpDelta),
    expanded: false,
    finishedAt: Date.now(),
  };
  state.battleReports.unshift(report);
  state.battleReports = state.battleReports.slice(0, battleReportLimit);
  state.currentBattle = null;
  state.battleSnapshot = null;
  state.selectedEnemyIds = [];
  state.activeEnemyIds = [];
  state.battleClock = null;
  resetBattleSpecial();
}

function recordBattleKillStats(result, battle) {
  if (result === "defeat") return;
  const defeatedCount = Array.isArray(battle.defeatedIds) ? battle.defeatedIds.length : 0;
  if (defeatedCount > 0) recordGlobalGameMetric("Kills", defeatedCount);
}

function applyFormBattleEndEffects(result, battle) {
  if (result !== "victory") return;
  const config = getHeroFormLevelConfig();
  const defeatedCount = Array.isArray(battle.defeatedIds) ? battle.defeatedIds.length : 0;
  if (config.afterVictoryMaxHp && defeatedCount > 0) {
    const gain = config.afterVictoryMaxHp;
    state.player.baseHp += gain;
    state.player.hp += gain;
    addBattleDetail(`${getHeroForm().label}形态战后生命上限 +${gain}。`);
  }
  if (config.afterVictoryHeal) {
    const stats = getPlayerStats();
    const beforeHp = state.player.hp;
    state.player.hp = Math.min(stats.maxHp, state.player.hp + config.afterVictoryHeal);
    const healed = state.player.hp - beforeHp;
    if (healed > 0) addBattleDetail(`${getHeroForm().label}形态战后回血 ${healed}。`);
  }
}

function settleFormProgressAfterBattle(result, battle) {
  if (result === "defeat") return;
  const defeatedCount = Array.isArray(battle.defeatedIds) ? battle.defeatedIds.length : 0;
  if (defeatedCount <= 0) return;
  addCurrentFormKill(defeatedCount);
}

function startBossRewardChoice(floor) {
  if (!isBossRewardChoiceFloor(floor)) return;
  state.bossReward = {
    floor,
    options: buildBossRewardOptions(floor),
    selectedIndex: -1,
  };
  state.pendingFloorAdvance = true;
  clearEnemyCardMotion();
  state.pendingFloorAdvance = true;
  state.infoMode = "log";
  addBattleEvent(`第${floor}层胜利，选择一张奖励牌。`, "item");
  saveGame();
  render();
}

function buildBossRewardOptions(floor) {
  const floorIndex = getBossRewardChoiceFloorIndex(floor);
  if (floorIndex < 0) return [];
  const fixed = getBossRewardCatalog().find((reward) => reward.type === "filmFlat");
  const deck = ensureBossRewardDeck();
  const start = floorIndex * 2;
  const drawn = deck.slice(start, start + 2)
    .map((type) => getBossRewardCatalog().find((reward) => reward.type === type))
    .filter(Boolean);
  return [
    { ...fixed, id: `${floor}-0-${fixed.type}` },
    ...drawn.map((reward, index) => ({ ...reward, id: `${floor}-${index + 1}-${reward.type}` })),
  ];
}

function getBossRewardCatalog() {
  return [
    { type: "filmFlat", title: "胶卷 +1.0", desc: "立刻获得 1.0 胶卷。", icon: "boss-value-min.png" },
    { type: "filmDrop", title: "胶卷掉落 +0.1", desc: "之后击败怪物永久 +0.1。", icon: "boss-film-drop.png" },
    { type: "filmPercent", title: "当前胶卷 +50%", desc: "按当前数量 +50%，向上取整。", icon: "boss-film-percent.png" },
    { type: "valueMin", title: "最低价值 +2", desc: "之后照片最低价值永久 +2。", icon: "boss-value-min-boost.png" },
    { type: "valueMax", title: "最高价值 +3", desc: "之后照片最高价值永久 +3。", icon: "boss-value-max.png" },
  ];
}

function ensureBossRewardDeck() {
  const normalized = normalizeBossRewardDeck(state.bossRewardDeck);
  if (normalized) {
    state.bossRewardDeck = normalized;
    return normalized;
  }
  state.bossRewardDeck = buildBossRewardDeck(state.runSeed || "default");
  return state.bossRewardDeck;
}

function buildBossRewardDeck(seed) {
  const source = makeBossRewardDeckTypes();
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const deck = seededShuffle(source, `${seed}:boss-reward-deck:${attempt}`);
    if (hasNoDuplicateRewardPair(deck)) return deck;
  }
  return seededShuffle(source, `${seed}:boss-reward-deck`);
}

function makeBossRewardDeckTypes() {
  return [
    ...Array.from({ length: 5 }, () => "filmPercent"),
    ...Array.from({ length: 3 }, () => "valueMax"),
    ...Array.from({ length: 3 }, () => "valueMin"),
    "filmDrop",
  ];
}

function normalizeBossRewardDeck(deck) {
  if (!Array.isArray(deck)) return null;
  const expectedCounts = countRewardTypes(makeBossRewardDeckTypes());
  const next = deck.filter((type) => Object.prototype.hasOwnProperty.call(expectedCounts, type));
  if (next.length !== bossRewardChoiceCount * 2) return null;
  const counts = countRewardTypes(next);
  for (const [type, count] of Object.entries(expectedCounts)) {
    if (counts[type] !== count) return null;
  }
  return next;
}

function countRewardTypes(types) {
  return types.reduce((counts, type) => {
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
}

function seededShuffle(items, seed) {
  const next = items.slice();
  for (let index = next.length - 1; index > 0; index -= 1) {
    const pick = hashIndex(`${seed}:${index}`, index + 1);
    [next[index], next[pick]] = [next[pick], next[index]];
  }
  return next;
}

function hasNoDuplicateRewardPair(deck) {
  for (let index = 0; index < deck.length; index += 2) {
    if (deck[index] === deck[index + 1]) return false;
  }
  return true;
}

function getBossRewardChoiceFloorIndex(floor) {
  return bossRewardChoiceFloors.indexOf(floor);
}

function isBossRewardChoiceFloor(floor) {
  return getBossRewardChoiceFloorIndex(floor) >= 0;
}

function chooseBossReward(index) {
  if (!state.bossReward) return;
  const option = state.bossReward.options?.[index];
  if (!option) return;
  const text = applyBossReward(option);
  const floor = state.bossReward.floor;
  state.bossReward = null;
  state.pendingFloorAdvance = false;
  addBattleEvent(`${text} 进入下一层。`, "item");
  clearEnemyCardMotion();
  if (state.floor === floor) {
    advanceFloor();
  }
  saveGame();
  render();
}

function selectBossReward(index) {
  if (!state.bossReward) return;
  const options = Array.isArray(state.bossReward.options) ? state.bossReward.options : [];
  if (!options[index]) return;
  state.bossReward.selectedIndex = index;
  state.infoMode = "log";
  saveGame();
  render();
}

function confirmSelectedBossReward() {
  if (!state.bossReward) return;
  const index = clampInt(state.bossReward.selectedIndex, -1, 2);
  if (index < 0) {
    addBattleEvent("先点一张 Boss 奖励牌，再点击选择。", "item");
    render();
    return;
  }
  chooseBossReward(index);
}

function applyBossReward(option) {
  if (option.type === "filmDrop") {
    state.globalFilmDropBonus = getGlobalFilmDropBonus() + 1;
    return "奖励：胶卷掉落 +0.1。";
  }
  if (option.type === "filmPercent") {
    const before = getFilmCount();
    const gain = ceilFilmTenth(before * 0.5);
    addFilmShards(Math.round(gain * 10));
    return `奖励：当前胶卷 +${gain.toFixed(1)}。`;
  }
  if (option.type === "filmFlat") {
    addFilmShards(10);
    return "奖励：胶卷 +1.0。";
  }
  if (option.type === "valueMin") {
    state.photoValueMin = getPhotoValueMin() + 2;
    if (getPhotoValueMax() < state.photoValueMin) state.photoValueMax = state.photoValueMin;
    return `奖励：鉴定最低价值提升到 ${getPhotoValueMin()}。`;
  }
  if (option.type === "valueMax") {
    state.photoValueMax = getPhotoValueMax() + 3;
    return `奖励：鉴定最高价值提升到 ${getPhotoValueMax()}。`;
  }
  return "奖励已领取。";
}

function addBattleEvent(text, type = "item") {
  state.battleReportSeq += 1;
  state.battleReports.unshift({
    id: makeId(`event-${state.battleReportSeq}`),
    type: "event",
    eventType: type,
    floor: state.floor,
    summary: text,
    details: [],
    expanded: false,
    createdAt: Date.now(),
  });
  state.battleReports = state.battleReports.slice(0, battleReportLimit);
}

function showCareerSummary() {
  if (!state.careerSummary) {
    state.careerSummary = buildLocalCareerSummary();
  }
  state.infoMode = "career";
  saveGame();
  render();
}

function isCareerSummaryOpen() {
  return state.infoMode === "career";
}

function buildLocalCareerSummary() {
  const snapshot = buildCareerSnapshot();
  const itemText = formatCareerTopItemNames(snapshot);
  return {
    status: "local",
    title: "照片勇者生涯总结",
    text: [
      `照片勇者以${snapshot.formLabel}登上塔顶，最终能力为生命${snapshot.stats.maxHp}、攻击${snapshot.stats.atk}、防御${snapshot.stats.def}、速度${snapshot.stats.speed}、护盾${snapshot.stats.shield}、回复${snapshot.stats.regen}、吸血${snapshot.stats.lifesteal}。`,
      `这趟旅程击败${snapshot.killCount}只怪物，其中Boss ${snapshot.bossKillCount}只。装备栏留下${snapshot.equipmentCount}件照片装备，${itemText}成了最有记忆点的战利品。`,
      "这是一段由现实物品拼出的爬塔生涯：每张照片都曾给勇者一点方向，每次战斗都把这些奇怪装备变成了塔顶的证据。现在，这张结算卡就是勇者从塔里带回来的纪念照。",
    ].join("\n\n"),
    snapshot,
    createdAt: Date.now(),
  };
}

function formatCareerTopItemNames(snapshot) {
  const names = snapshot.topItems.map((item) => item.name).filter(Boolean).slice(0, 3);
  if (!names.length) return "还没有被命名的照片装备";
  if (names.length === 1) return `${names[0]}`;
  return `${names.slice(0, -1).join("、")}和${names[names.length - 1]}`;
}

function buildCareerSnapshot() {
  const stats = getPlayerStats();
  const reports = state.battleReports.filter((entry) => entry && entry.type !== "event");
  const bossKeys = new Set(["skeletonCaptain", "vampire", "knightCaptain", "demon", "octopus", "dragon", "archmage"]);
  let killCount = 0;
  let bossKillCount = 0;
  for (const report of reports) {
    const defeatedIds = Array.isArray(report.defeatedIds) ? report.defeatedIds : [];
    const defeatedTypes = Array.isArray(report.defeatedTypes) ? report.defeatedTypes : [];
    killCount += defeatedIds.length;
    for (let index = 0; index < defeatedIds.length; index += 1) {
      const id = String(defeatedIds[index] || "");
      const type = String(defeatedTypes[index] || "");
      if (bossKeys.has(type) || [...bossKeys].some((bossKey) => id.includes(bossKey))) {
        bossKillCount += 1;
      }
    }
  }
  const items = state.inventory
    .filter(Boolean)
    .map((item) => ({
      name: formatItemDisplayName(item),
      score: scoreItem(item),
      quality: getItemQuality(scoreItem(item)).label,
      stats: normalizeStats(item.stats || {}, 999),
      effects: getItemSpecialKeys(item).map((key) => photoSpecialEffectMap.get(key)?.label || key),
    }))
    .sort((a, b) => b.score - a.score);
  return {
    floor: state.floor,
    formLabel: getHeroFormDisplayName(),
    stats,
    hp: state.player.hp,
    film: formatFilmCount(),
    killCount,
    bossKillCount,
    equipmentCount: items.length,
    topItems: items.slice(0, 5),
    allItems: items,
    battleHighlights: reports.slice(0, 5).map((report) => report.summary).filter(Boolean),
  };
}

async function requestCareerSummary(force = false) {
  if (!state.gameClear || state.careerSummaryRequest) return;
  if (!force && state.careerSummary?.status === "ai") return;
  const config = getConfigFromInputs();
  if (!config.baseUrl || !config.apiKey || !config.model) {
    if (!state.careerSummary) state.careerSummary = buildLocalCareerSummary();
    state.careerSummary.status = "local";
    state.careerSummary.note = "配置图文模型后，可以重新生成更有个性的通关总结。";
    saveGame();
    render();
    return;
  }

  const snapshot = buildCareerSnapshot();
  state.careerSummary = {
    ...(state.careerSummary || buildLocalCareerSummary()),
    status: "loading",
    snapshot,
    note: "正在请大模型撰写通关总结。",
  };
  render();

  const request = { startedAt: Date.now() };
  state.careerSummaryRequest = request;
  try {
    const response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(withProviderRequestOptions(config, {
        model: config.model,
        temperature: 0.8,
        max_tokens: 520,
        messages: [
          { role: "system", content: "你是照片勇者的通关吟游诗人。写适合玩家截图发社交媒体的中文通关总结，语气有画面感，简洁但有荣誉感。" },
          { role: "user", content: buildCareerSummaryPrompt(snapshot) },
        ],
      })),
    }, 45000, "生涯总结");
    if (state.careerSummaryRequest !== request) return;
    const text = sanitizeCareerSummaryText(readModelText(response.payload));
    if (!response.response.ok || !text) throw new Error("模型没有返回可用的通关总结。");
    state.careerSummary = {
      status: "ai",
      title: "照片勇者生涯总结",
      text,
      snapshot,
      createdAt: Date.now(),
    };
  } catch (error) {
    if (state.careerSummaryRequest !== request) return;
    const fallback = buildLocalCareerSummary();
    state.careerSummary = {
      ...fallback,
      status: "error",
      note: `${error?.message || "生涯总结生成失败"} 当前显示本地总结。`,
    };
  } finally {
    if (state.careerSummaryRequest === request) state.careerSummaryRequest = null;
    saveGame();
    render();
  }
}

function buildCareerSummaryPrompt(snapshot) {
  const itemLines = snapshot.topItems.length
    ? snapshot.topItems.map((item, index) => `${index + 1}. ${item.quality} ${item.name}，分数${item.score}，属性${formatSnapshotStats(item.stats)}${item.effects.length ? `，词条${item.effects.join("、")}` : ""}`).join("\n")
    : "无照片装备";
  return [
    "请基于以下通关数据写一段中文生涯总结。",
    "要求：",
    "1. 适合截图分享，输出一个短标题和2-4段短文，不要列表编号。",
    "2. 突出照片装备，至少点名2件代表装备；装备少则如实写。",
    "3. 提及Boss击杀数、怪物击杀数和最终能力。",
    "4. 可以有一点史诗感和幽默感，但不要夸张到像广告。",
    "5. 不要解释规则，不要提API、模型、JSON、推理过程或开发者。",
    "6. 只输出最终总结文本，不要输出分析过程。",
    "",
    `勇者形态：${snapshot.formLabel}`,
    `最终能力：生命${snapshot.stats.maxHp}，当前生命${snapshot.hp}，攻击${snapshot.stats.atk}，防御${snapshot.stats.def}，速度${snapshot.stats.speed}，护盾${snapshot.stats.shield}，回复${snapshot.stats.regen}，吸血${snapshot.stats.lifesteal}`,
    `击败怪物：${snapshot.killCount}只`,
    `击败Boss：${snapshot.bossKillCount}只`,
    `剩余胶卷：${snapshot.film}`,
    `装备数量：${snapshot.equipmentCount}`,
    "代表装备：",
    itemLines,
    "最近战斗：",
    snapshot.battleHighlights.join("\n") || "无",
  ].join("\n");
}

function formatSnapshotStats(stats) {
  const parts = [];
  for (const key of statOrder) {
    const value = stats[key] || 0;
    if (value) parts.push(`${statLabels[key]}${formatSignedNumber(value)}`);
  }
  return parts.join("、") || "无";
}

function sanitizeCareerSummaryText(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```(?:markdown|text|json)?/gi, "").replace(/```/g, ""))
    .replace(/^(?:分析|思考|推理|reasoning|thinking)[:：][\s\S]*?(?:最终回答|最终总结|final answer)[:：]/i, "")
    .trim()
    .slice(0, 900);
}

function addFloorNarrative(floor = state.floor) {
  const text = getFloorNarrative(floor);
  if (!text) return;
  if (hasRecentFloorNarrative(floor, text)) return;
  addBattleEvent(text, isBossRewardFloor(floor) ? "hero" : "info");
}

function ensureInitialFloorNarrative() {
  if (state.gameClear || state.currentBattle || state.bossReward) return;
  addFloorNarrative(state.floor);
}

function hasRecentFloorNarrative(floor, text) {
  return state.battleReports.some((entry) =>
    entry?.type === "event" &&
    entry.summary === text &&
    Math.abs((entry.floor || floor) - floor) <= 0
  );
}

function getFloorNarrative(floor) {
  const safeFloor = clampInt(floor, 1, maxFloor);
  if (bossFloorNarratives[safeFloor]) return bossFloorNarratives[safeFloor];
  if (rewardBossFloorNarratives[safeFloor]) return rewardBossFloorNarratives[safeFloor];
  if (floorNarratives[safeFloor]) return floorNarratives[safeFloor];
  if (safeFloor > 1 && safeFloor % 10 === 1) {
    return `第${safeFloor}层的空气换了一种味道，旧怪仍在游荡，新怪也混了进来。`;
  }
  return "";
}

function makeBattleSummary(result, battle, hpDelta) {
  const floor = Number.isFinite(battle?.floor) ? battle.floor : state.floor;
  const monsterName = typeof battle?.monsterName === "string" && battle.monsterName
    ? battle.monsterName
    : typeof battle === "string" && battle
      ? battle
      : "敌人";
  const lifeText = `生命变化 ${formatHpDelta(hpDelta)}`;
  const lootText = formatLootNames(battle?.lootNames || []);
  if (result === "victory") {
    const endHp = Number.isFinite(battle?.endHp) ? battle.endHp : state.player.hp;
    const endMaxHp = Number.isFinite(battle?.endMaxHp) ? battle.endMaxHp : getPlayerStats().maxHp;
    const hpPercent = endMaxHp ? endHp / endMaxHp : 1;
    const label = hpPercent <= 0.2
      ? "险胜"
      : hpDelta >= 0
        ? "完胜"
        : Math.abs(hpDelta) <= Math.max(3, Math.ceil(endMaxHp * 0.15))
          ? "小胜"
          : "胜";
    const remainText = label === "险胜" ? `，剩余生命 ${endHp}/${endMaxHp}` : "";
    return `${label} · 第${floor}层${monsterName}，${lifeText}${remainText}，获得：${lootText}。`;
  }
  if (result === "defeat") {
    return `败 · 第${floor}层${monsterName}击倒照片勇者，${lifeText}，获得：${lootText}。`;
  }
  if (result === "enemy-fled") {
    const roundLimit = Number.isFinite(battle?.roundLimit) ? battle.roundLimit : getBattleRoundLimit(battle?.initialEnemyCount || 1);
    return `敌逃 · 第${floor}层缠斗${roundLimit}回合，敌方逃跑，${lifeText}，获得：${lootText}。`;
  }
  if (result === "boss-timeout") {
    const roundLimit = Number.isFinite(battle?.roundLimit) ? battle.roundLimit : getBattleRoundLimit(battle?.initialEnemyCount || 1, floor);
    return `拖过 · 第${floor}层撑过${roundLimit}回合，继续前进，${lifeText}，获得：无。`;
  }
  return `战斗结束，${lifeText}，获得：${lootText}。`;
}

function formatLootNames(names) {
  const counts = new Map();
  for (const name of names) {
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  if (!counts.size) return "无";
  const parts = [];
  let filmTotal = 0;
  for (const [name, count] of counts.entries()) {
    if (name === "胶卷碎片" || name === "胶卷 +0.1") {
      filmTotal += count / 10;
      continue;
    }
    if (name.startsWith("胶卷碎片 +")) {
      const shards = Number.parseInt(name.slice("胶卷碎片 +".length), 10) || 0;
      filmTotal += (shards * count) / 10;
      continue;
    }
    if (name.startsWith("胶卷 +")) {
      const rolls = Number.parseFloat(name.slice("胶卷 +".length));
      if (Number.isFinite(rolls)) {
        filmTotal += rolls * count;
        continue;
      }
    }
    parts.push(count > 1 ? `${name}*${count}` : name);
  }
  if (filmTotal > 0) parts.unshift(`胶卷 +${filmTotal.toFixed(1)}`);
  return parts.join("、") || "无";
}

function formatHpDelta(delta) {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function hasPendingPhoto() {
  return Boolean(state.lastPhoto);
}

function isEquipmentSelectionLocked() {
  return isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || Boolean(state.bossReward) || isCareerSummaryOpen();
}

function isBattleActionLocked() {
  return hasPendingPhoto() || Boolean(state.bossReward);
}

function makeBattleClock(stats, enemies) {
  return {
    hero: getActionInterval(stats.speed),
    enemies: enemies.map((enemy) => ({
      id: enemy.id,
      time: getActionInterval(enemy.speed),
    })),
    round: 1,
    encounterId: state.encounterId,
  };
}

function getActionInterval(speed) {
  return speed > 0 ? 1 / speed : Infinity;
}

function getNextEnemyClock() {
  if (!state.battleClock?.enemies?.length) return null;
  return state.battleClock.enemies
    .filter((clock) => state.activeEnemyIds.includes(clock.id))
    .sort((a, b) => a.time - b.time || state.activeEnemyIds.indexOf(a.id) - state.activeEnemyIds.indexOf(b.id))[0] || null;
}

function getHeroTargetEnemy() {
  return state.activeEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .find(Boolean) || null;
}

function getActiveBattleEnemies() {
  return state.activeEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
}

function handleBattleEndAdvance(mode = "instant") {
  if (mode === "delay") {
    state.pendingFloorAdvance = true;
    render();
    state.floorAdvanceTimer = window.setTimeout(() => {
      state.floorAdvanceTimer = 0;
      state.pendingFloorAdvance = false;
      advanceFloor();
      saveGame();
      render();
    }, 360);
    return;
  }
  advanceFloor();
}

function advanceFloor() {
  stopAutoBattle();
  if (isPlayerDefeated()) return;
  clearEnemyCardMotion();
  if (state.floor >= maxFloor) {
    completeGame();
    return;
  }
  state.floor += 1;
  state.selectedEnemyIds = [];
  state.currentBattle = null;
  state.battleSnapshot = null;
  state.activeEnemyIds = [];
  state.battleClock = null;
  resetBattleSpecial();
  state.enemies = buildFloorEncounter(state.floor);
  state.encounterId = makeEncounterId();
  state.enemyFlipEncounterId = state.encounterId;
  applyFloorShield();
  addFloorNarrative(state.floor);
}

function completeGame() {
  const wasClear = state.gameClear;
  state.gameClear = true;
  state.bossReward = null;
  state.pendingFloorAdvance = false;
  state.enemies = [];
  state.selectedEnemyIds = [];
  state.activeEnemyIds = [];
  state.currentBattle = null;
  state.battleSnapshot = null;
  state.battleClock = null;
  state.encounterId = "clear";
  resetBattleSpecial();
  if (!state.careerSummary) {
    state.careerSummary = buildLocalCareerSummary();
  }
  state.infoMode = "career";
  addBattleEvent("塔顶的门被推开，照片勇者带着一包奇怪装备通关了40层。", "hero");
  if (!wasClear) recordGlobalGameMetric("Clears", 1);
  requestCareerSummary();
}

function clearEnemyCardMotion() {
  state.enemyFaceDownIds = new Set();
  state.enemyFlipDownIds = new Set();
  state.pendingFloorAdvance = false;
  state.enemyHitEffectUntilById = {};
  state.heroHitEffectUntil = 0;
}

function finishEnemyFlipDown(enemyId) {
  if (!state.enemyFlipDownIds.has(enemyId)) return;
  state.enemyFlipDownIds.delete(enemyId);
  state.enemyFaceDownIds.add(enemyId);
  render();
}

function ensureEncounter() {
  if (state.gameClear) return;
  if (!Number.isFinite(state.floor) || state.floor < 1) state.floor = 1;
  if (!Array.isArray(state.enemies) || !state.enemies.length) {
    state.enemies = buildFloorEncounter(state.floor);
  }
  state.enemies = state.enemies.map(normalizeEnemy).filter(Boolean);
  state.encounterId = state.encounterId || makeEncounterId();
  const validIds = new Set(state.enemies.map((enemy) => enemy.id));
  state.selectedEnemyIds = Array.isArray(state.selectedEnemyIds)
    ? state.selectedEnemyIds.filter((id, index, ids) => validIds.has(id) && ids.indexOf(id) === index)
    : [];
  applyFloorShield();
}

function buildFloorEncounter(floor) {
  if (Array.isArray(state.testEnemyOverride)) {
    const override = state.testEnemyOverride;
    state.testEnemyOverride = null;
    return override.map((enemy, index) => normalizeEnemy({
      id: enemy.id || `${floor}-test-${index}`,
      testEnemy: true,
      floor,
      slot: index,
      typeKey: enemy.typeKey || "slime",
      typeName: enemy.typeName || "史莱姆",
      name: enemy.name || enemy.typeName || "史莱姆",
      maxHp: Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1,
      hp: Number.isFinite(enemy.hp) ? enemy.hp : Number.isFinite(enemy.maxHp) ? enemy.maxHp : 1,
      atk: Number.isFinite(enemy.atk) ? enemy.atk : 1,
      def: Number.isFinite(enemy.def) ? enemy.def : 0,
      speed: Number.isFinite(enemy.speed) ? enemy.speed : 1,
      maxShield: Number.isFinite(enemy.maxShield) ? enemy.maxShield : Number.isFinite(enemy.shield) ? enemy.shield : 0,
      shield: Number.isFinite(enemy.shield) ? enemy.shield : 0,
      traits: Array.isArray(enemy.traits) ? enemy.traits : [],
    })).filter(Boolean);
  }
  const types = getFloorMonsterTypes(floor);
  return types.map((typeKey, index) => makeEnemy(typeKey, floor, index));
}

function getFloorMonsterTypes(floor) {
  if (floor === 10) return ["skeletonCaptain"];
  if (floor === 20) return ["vampire"];
  if (floor === 25) return ["octopus"];
  if (floor === 30) return ["guard", "guard", "knightCaptain"];
  if (floor === 35) return ["dragon"];
  if (floor === 38) return ["archmage"];
  if (floor === 40) return ["demon"];
  const slots = buildMonsterSlotPools(floor);
  const seed = state.runSeed || "default";
  const types = slots.map((pool, slot) => {
    const safePool = pool.length ? pool : ["slime"];
    return safePool[hashIndex(`${seed}:${floor}:monster:${slot}`, safePool.length)];
  });
  types[0] = pickGuaranteedWeakMonster(floor);
  return types;
}

function pickGuaranteedWeakMonster(floor) {
  const pool = getGuaranteedWeakMonsterPool(floor);
  return pool[hashIndex(`${state.runSeed || "default"}:${floor}:weak-anchor`, pool.length)] || "slime";
}

function getGuaranteedWeakMonsterPool(floor) {
  if (floor <= 5) return ["slime"];
  if (floor <= 10) return ["slime", "slime", "bat"];
  if (floor <= 18) return ["bat"];
  if (floor <= 25) return ["bat", "bat", "skeleton"];
  return ["skeleton"];
}

function buildMonsterSlotPools(floor) {
  const entries = getUnlockedNormalMonsterEntries(floor);
  if (!entries.length) return [["slime"], ["slime"], ["slime"]];
  const maxTier = Math.max(...entries.map((entry) => entry.tier || 1));
  const nonSlimeEntries = entries.filter((entry) => entry.key !== "slime");
  const earlyEntries = entries.filter((entry) => entry.floor <= 3);
  const weakEntries = entries.filter((entry) => (entry.tier || 1) <= Math.max(1, maxTier - 2));
  const midEntries = entries.filter((entry) => (entry.tier || 1) >= Math.max(1, maxTier - 1));
  const strongEntries = entries.filter((entry) => (entry.tier || 1) >= maxTier);
  const midSource = maxTier <= 1 && nonSlimeEntries.length ? nonSlimeEntries : midEntries.length ? midEntries : entries;
  const strongSource = maxTier <= 1 && nonSlimeEntries.length ? nonSlimeEntries : strongEntries.length ? strongEntries : entries;
  const weakPool = buildWeightedMonsterPool(floor, weakEntries.length ? weakEntries : entries, { weakRetention: true, pressure: 0.55 });
  const midPool = buildWeightedMonsterPool(floor, midSource, { pressure: 1 });
  const strongPool = buildWeightedMonsterPool(floor, strongSource, { pressure: 1.45, minimumPerEntry: 3 });
  if (earlyEntries.length) {
    weakPool.push(...buildWeightedMonsterPool(floor, earlyEntries, { weakRetention: true, pressure: 0.8 }));
  }
  return [weakPool, midPool, strongPool];
}

function getUnlockedNormalMonsterEntries(floor) {
  return normalMonsterUnlocks.filter((entry) => floor >= entry.floor && !isBossMonsterType(entry.key));
}

function buildWeightedMonsterPool(floor, entries = getUnlockedNormalMonsterEntries(floor), options = {}) {
  const weighted = [];
  for (const entry of entries) {
    const age = Math.max(0, floor - entry.floor);
    const growth = Math.floor(Math.max(0, floor - 1) / 7);
    const pressure = Number.isFinite(options.pressure) ? options.pressure : 1;
    const tierBoost = Math.round(Math.max(0, (entry.tier || 1) - 1) * (growth + 1) * pressure);
    const weakRetention = options.weakRetention && entry.floor <= 3
      ? Math.max(4, entry.weight - Math.floor(age / 4))
      : 0;
    const baseWeight = Math.max(options.minimumPerEntry || 1, entry.weight + tierBoost - Math.floor(age / 10));
    const finalWeight = Math.max(baseWeight, weakRetention);
    for (let i = 0; i < finalWeight; i += 1) weighted.push(entry.key);
  }
  return weighted.length ? weighted : ["slime"];
}

function makeEnemy(typeKey, floor, slot) {
  const type = monsterTypes[typeKey] || monsterTypes.slime;
  const shield = getTraitValueFromList(type.traits, "shield", 0) || 0;
  const traits = cloneTraits(type.traits);
  const maxHp = Math.max(1, type.hp);
  const maxShield = Math.max(0, shield);
  return {
    id: `${floor}-${slot}-${typeKey}`,
    floor,
    slot,
    typeKey,
    typeName: type.name,
    name: type.name,
    maxHp,
    hp: maxHp,
    atk: Math.max(0, type.atk),
    def: Math.max(0, type.def),
    speed: Math.max(1, type.speed),
    maxShield,
    shield: maxShield,
    traits,
  };
}

function isBossMonsterType(typeKey) {
  return bossMonsterKeys.has(typeKey);
}

function normalizeEnemy(enemy) {
  if (!enemy || typeof enemy !== "object") return null;
  if (enemy.testEnemy) {
    const maxHp = Number.isFinite(enemy.maxHp) ? Math.max(1, enemy.maxHp) : Number.isFinite(enemy.hp) ? Math.max(1, enemy.hp) : 1;
    const maxShield = Number.isFinite(enemy.maxShield) ? Math.max(0, enemy.maxShield) : Number.isFinite(enemy.shield) ? Math.max(0, enemy.shield) : 0;
    return {
      ...enemy,
      id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
      name: typeof enemy.name === "string" && enemy.name ? enemy.name : enemy.typeName || "史莱姆",
      typeKey: enemy.typeKey || "slime",
      typeName: enemy.typeName || "史莱姆",
      maxHp,
      hp: Number.isFinite(enemy.hp) ? Math.max(0, Math.min(enemy.hp, maxHp)) : maxHp,
      atk: Number.isFinite(enemy.atk) ? Math.max(0, enemy.atk) : 1,
      def: Number.isFinite(enemy.def) ? Math.max(0, enemy.def) : 0,
      speed: Number.isFinite(enemy.speed) ? Math.max(1, enemy.speed) : 1,
      maxShield,
      shield: Number.isFinite(enemy.shield) ? Math.max(0, Math.min(enemy.shield, maxShield)) : maxShield,
      traits: Array.isArray(enemy.traits) ? cloneTraits(enemy.traits) : [],
    };
  }
  return normalizeEnemyFromBase(enemy);
}

function normalizeEnemyFromBase(enemy) {
  const floor = Number.isFinite(enemy.floor) ? enemy.floor : state.floor;
  const previousMaxHp = Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1;
  const previousMaxShield = Number.isFinite(enemy.maxShield) ? enemy.maxShield : Number.isFinite(enemy.shield) ? enemy.shield : 0;
  const base = makeEnemy(enemy.typeKey || "slime", floor, Number.isFinite(enemy.slot) ? enemy.slot : 0);
  return {
    ...base,
    ...enemy,
    id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
    name: base.name,
    typeName: base.typeName,
    maxHp: base.maxHp,
    hp: Number.isFinite(enemy.hp)
      ? Math.max(0, Math.min(enemy.hp >= previousMaxHp ? base.maxHp : enemy.hp, base.maxHp))
      : base.maxHp,
    atk: base.atk,
    def: base.def,
    speed: base.speed,
    maxShield: base.maxShield,
    shield: Number.isFinite(enemy.shield)
      ? Math.max(0, Math.min(enemy.shield >= previousMaxShield ? base.maxShield : enemy.shield, base.maxShield))
      : base.maxShield,
    traits: base.traits,
  };
}

function getRawSemanticFlag(input) {
  if (!input || typeof input !== "object") return false;
  return hasSemanticIdentificationData({
    semanticAppraisal: input.semanticAppraisal,
    sizeClass: input.sizeClass || input.size_class,
    isScene: input.isScene ?? input.is_scene,
    isEquipable: input.isEquipable ?? input.is_equipable,
    photoQuality: input.photoQuality || input.photo_quality,
    statAffinity: input.statAffinity || input.stat_affinity || input.affinity || input.statPreference,
    specialAffinity: input.specialAffinity || input.special_affinity || input.specialCandidates,
  });
}

function getEnemyDrops(enemy) {
  const shardAmount = getEnemyFilmShardDrop(enemy);
  if (shardAmount <= 0) return [];
  if (shardAmount % 10 === 0) {
    return [{
      kind: "film",
      itemName: `胶卷 +${(shardAmount / 10).toFixed(1)}`,
      amount: shardAmount / 10,
    }];
  }
  return [{
    kind: "shard",
    itemName: `胶卷碎片 +${shardAmount}`,
    amount: shardAmount,
  }];
}

function addFilmShards(amount) {
  state.filmShards = normalizeFilmAmount(Math.max(0, state.filmShards + amount));
  const made = Math.floor(state.filmShards / 10);
  if (made > 0) {
    state.filmRolls += made;
    state.filmShards = normalizeFilmAmount(state.filmShards % 10);
  }
}

function addFilmAmount(amount) {
  addFilmShards(normalizeFilmAmount(amount) * 10);
}

function getHeroFormFilmShardBonus() {
  const config = getHeroFormLevelConfig();
  if (config.noFilmDrop) return 0;
  return clampInt(config.filmDropBonus || 0, -9, 9);
}

function getEnemyFilmShardDrop(enemy) {
  void enemy;
  if (getHeroFormLevelConfig().noFilmDrop) return 0;
  const baseShards = 1;
  return Math.max(0, baseShards + getGlobalFilmDropBonus() + getHeroFormFilmShardBonus());
}

function getEnemyPreviewFilmShardDrop(enemy) {
  return getEnemyFilmShardDrop(enemy);
}

function getGlobalFilmDropBonus() {
  return clampInt(state.globalFilmDropBonus, 0, 999);
}

function createDefaultFormProgress() {
  return Object.fromEntries(heroForms.map((form) => [form.id, { kills: 0, level: 1 }]));
}

function normalizeFormProgress(progress) {
  const source = progress && typeof progress === "object" ? progress : {};
  const result = createDefaultFormProgress();
  for (const form of heroForms) {
    const item = source[form.id] || {};
    const kills = clampInt(item.kills, 0, heroFormUpgradeKills);
    const level = item.level >= 2 || kills >= heroFormUpgradeKills ? 2 : 1;
    result[form.id] = {
      kills: level >= 2 ? heroFormUpgradeKills : kills,
      level,
    };
  }
  return result;
}

function getHeroFormProgress(formId = state.player.formId) {
  if (!state.formProgress || typeof state.formProgress !== "object") {
    state.formProgress = createDefaultFormProgress();
  }
  if (!state.formProgress[formId]) {
    state.formProgress[formId] = { kills: 0, level: 1 };
  }
  return state.formProgress[formId];
}

function getHeroFormLevel(form = getHeroForm()) {
  const progress = getHeroFormProgress(form?.id || defaultHeroFormId);
  return progress.level >= 2 ? 2 : 1;
}

function getHeroFormLevelConfig(form = getHeroForm(), level = getHeroFormLevel(form)) {
  return form?.levels?.[level] || form?.levels?.[1] || { stats: {}, effects: [] };
}

function getHeroFormEffectLines(form = getHeroForm(), level = getHeroFormLevel(form)) {
  return getHeroFormLevelConfig(form, level).effects || [];
}

function getHeroFormProgressText(form = getHeroForm()) {
  const progress = getHeroFormProgress(form.id);
  return `经验${Math.min(progress.kills, heroFormUpgradeKills)}/${heroFormUpgradeKills}`;
}

function getHeroFormDisplayName(form = getHeroForm()) {
  const prefix = getHeroFormLevel(form) >= 2 ? "mega" : "";
  return `${prefix}${form.label}形态`;
}

function adjustHeroResourcesAfterStatChange(oldStats, newStats, oldShield = state.player.shield) {
  if (!oldStats || !newStats) return;
  const maxHpDelta = (newStats.maxHp || 0) - (oldStats.maxHp || 0);
  if (maxHpDelta > 0) {
    state.player.hp += maxHpDelta;
  } else if (maxHpDelta < 0) {
    state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  } else {
    state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  }
  state.player.hp = Math.max(0, Math.min(state.player.hp, newStats.maxHp));
  const oldMaxShield = Math.max(0, oldStats.shield || 0);
  const newMaxShield = Math.max(0, newStats.shield || 0);
  if (newMaxShield > oldMaxShield) {
    state.player.shield = Math.min(newMaxShield, Math.max(0, oldShield) + (newMaxShield - oldMaxShield));
  } else {
    state.player.shield = Math.min(Math.max(0, oldShield), newMaxShield);
  }
}

function addCurrentFormKill(count = 1) {
  const form = getHeroForm();
  const progress = getHeroFormProgress(form.id);
  if (progress.level >= 2) return false;
  const oldStats = getPlayerStats();
  const oldShield = state.player.shield;
  progress.kills = Math.min(heroFormUpgradeKills, progress.kills + Math.max(0, clampInt(count, 0, 999)));
  if (progress.kills >= heroFormUpgradeKills) {
    progress.kills = heroFormUpgradeKills;
    progress.level = 2;
    const newStats = getPlayerStats();
    adjustHeroResourcesAfterStatChange(oldStats, newStats, oldShield);
    addBattleDetail(`${form.label}形态进化为${getHeroFormDisplayName(form)}。`);
    return true;
  }
  return false;
}

function getPhotoValueMin() {
  return clampInt(state.photoValueMin, defaultPhotoValueMin, 999);
}

function getPhotoValueMax() {
  return Math.max(getPhotoValueMin(), clampInt(state.photoValueMax, defaultPhotoValueMax, 999));
}

function formatEnemyFilmDrop(enemy) {
  return `胶卷 ${(getEnemyPreviewFilmShardDrop(enemy) / 10).toFixed(1)}`;
}

function getFilmCount() {
  return normalizeFilmAmount(state.filmRolls + state.filmShards / 10);
}

function createDefaultGlobalStats() {
  return {
    totalPv: 0,
    totalUv: 0,
    totalGames: 0,
    totalKills: 0,
    totalAppraisals: 0,
    totalFloors: 0,
    totalClears: 0,
    todayPv: 0,
    todayUv: 0,
    todayGames: 0,
    todayKills: 0,
    todayAppraisals: 0,
    todayFloors: 0,
    todayClears: 0,
  };
}

function normalizeGlobalStats(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    totalPv: clampInt(source.totalPv, 0, 99999999),
    totalUv: clampInt(source.totalUv, 0, 99999999),
    totalGames: clampInt(source.totalGames, 0, 99999999),
    totalKills: clampInt(source.totalKills, 0, 99999999),
    totalAppraisals: clampInt(source.totalAppraisals, 0, 99999999),
    totalFloors: clampInt(source.totalFloors, 0, 99999999),
    totalClears: clampInt(source.totalClears, 0, 99999999),
    todayPv: clampInt(source.todayPv, 0, 99999999),
    todayUv: clampInt(source.todayUv, 0, 99999999),
    todayGames: clampInt(source.todayGames, 0, 99999999),
    todayKills: clampInt(source.todayKills, 0, 99999999),
    todayAppraisals: clampInt(source.todayAppraisals, 0, 99999999),
    todayFloors: clampInt(source.todayFloors, 0, 99999999),
    todayClears: clampInt(source.todayClears, 0, 99999999),
  };
}

async function initGlobalStats() {
  renderGlobalStatsPanel();
  try {
    if (shouldRecordGlobalStats()) {
      await recordGlobalVisit();
    } else {
      state.globalStatsStatus = "本地预览不计入全站统计。";
    }
    await refreshGlobalStats();
  } catch (error) {
    console.warn("全站统计初始化失败:", error);
    state.globalStatsStatus = "统计加载失败，稍后会自动重试。";
    renderGlobalStatsPanel();
  }
}

async function recordGlobalVisit() {
  const today = getLocalDateKey();
  await incrementStatsCounter(STATS_COUNTER_IDS.totalPv);
  await incrementStatsCounter(makeDailyCounterId(STATS_COUNTER_IDS.dailyPvPrefix, today));

  const isKnownVisitor = localStorage.getItem(STORAGE_KEYS.statsVisitor) === "true";
  const lastUvDate = localStorage.getItem(STORAGE_KEYS.statsLastUvDate);
  if (!isKnownVisitor) {
    await incrementStatsCounter(STATS_COUNTER_IDS.totalUv);
    localStorage.setItem(STORAGE_KEYS.statsVisitor, "true");
  }
  if (lastUvDate !== today) {
    await incrementStatsCounter(makeDailyCounterId(STATS_COUNTER_IDS.dailyUvPrefix, today));
    localStorage.setItem(STORAGE_KEYS.statsLastUvDate, today);
  }
}

function recordGlobalGameStart() {
  if (!shouldRecordGlobalStats()) return;
  if (!state.runSeed) state.runSeed = makeRunSeed();
  const recordedRuns = readJson(STORAGE_KEYS.statsGameRuns, []);
  const safeRuns = Array.isArray(recordedRuns)
    ? recordedRuns.filter((seed) => typeof seed === "string" && seed).slice(-80)
    : [];
  if (safeRuns.includes(state.runSeed)) return;
  safeRuns.push(state.runSeed);
  localStorage.setItem(STORAGE_KEYS.statsGameRuns, JSON.stringify(safeRuns.slice(-80)));
  const today = getLocalDateKey();
  void Promise.all([
    incrementStatsCounter(STATS_COUNTER_IDS.totalGames),
    incrementStatsCounter(makeDailyCounterId(STATS_COUNTER_IDS.dailyGamesPrefix, today)),
  ]).then(refreshGlobalStats).catch((error) => {
    console.warn("记录全站游玩次数失败:", error);
    state.globalStatsStatus = "游玩统计同步失败。";
    renderGlobalStatsPanel();
  });
}

function recordGlobalGameMetric(metric, amount = 1) {
  if (!shouldRecordGlobalStats()) return;
  const totalKey = STATS_COUNTER_IDS[`total${metric}`];
  const dailyPrefix = STATS_COUNTER_IDS[`daily${metric}Prefix`];
  const count = clampInt(amount, 0, 999);
  if (!totalKey || !dailyPrefix || count <= 0) return;
  const today = getLocalDateKey();
  const dailyKey = makeDailyCounterId(dailyPrefix, today);
  const updates = [];
  for (let i = 0; i < count; i += 1) {
    updates.push(incrementStatsCounter(totalKey));
    updates.push(incrementStatsCounter(dailyKey));
  }
  void Promise.all(updates).then(refreshGlobalStats).catch((error) => {
    console.warn("记录全站游戏事件失败:", error);
    state.globalStatsStatus = "游戏统计同步失败。";
    renderGlobalStatsPanel();
  });
}

function shouldRecordGlobalStats() {
  const hostname = window.location.hostname;
  if (!hostname) return false;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") return false;
  return window.location.protocol === "https:" || window.location.protocol === "http:";
}

async function refreshGlobalStats() {
  const today = getLocalDateKey();
  const dailyPv = makeDailyCounterId(STATS_COUNTER_IDS.dailyPvPrefix, today);
  const dailyUv = makeDailyCounterId(STATS_COUNTER_IDS.dailyUvPrefix, today);
  const dailyGames = makeDailyCounterId(STATS_COUNTER_IDS.dailyGamesPrefix, today);
  const dailyKills = makeDailyCounterId(STATS_COUNTER_IDS.dailyKillsPrefix, today);
  const dailyAppraisals = makeDailyCounterId(STATS_COUNTER_IDS.dailyAppraisalsPrefix, today);
  const dailyFloors = makeDailyCounterId(STATS_COUNTER_IDS.dailyFloorsPrefix, today);
  const dailyClears = makeDailyCounterId(STATS_COUNTER_IDS.dailyClearsPrefix, today);
  const counters = await fetchStatsCounters([
    STATS_COUNTER_IDS.totalPv,
    STATS_COUNTER_IDS.totalUv,
    STATS_COUNTER_IDS.totalGames,
    STATS_COUNTER_IDS.totalKills,
    STATS_COUNTER_IDS.totalAppraisals,
    STATS_COUNTER_IDS.totalFloors,
    STATS_COUNTER_IDS.totalClears,
    dailyPv,
    dailyUv,
    dailyGames,
    dailyKills,
    dailyAppraisals,
    dailyFloors,
    dailyClears,
  ]);
  state.globalStats = normalizeGlobalStats({
    totalPv: counters[STATS_COUNTER_IDS.totalPv],
    totalUv: counters[STATS_COUNTER_IDS.totalUv],
    totalGames: counters[STATS_COUNTER_IDS.totalGames],
    totalKills: counters[STATS_COUNTER_IDS.totalKills],
    totalAppraisals: counters[STATS_COUNTER_IDS.totalAppraisals],
    totalFloors: counters[STATS_COUNTER_IDS.totalFloors],
    totalClears: counters[STATS_COUNTER_IDS.totalClears],
    todayPv: counters[dailyPv],
    todayUv: counters[dailyUv],
    todayGames: counters[dailyGames],
    todayKills: counters[dailyKills],
    todayAppraisals: counters[dailyAppraisals],
    todayFloors: counters[dailyFloors],
    todayClears: counters[dailyClears],
  });
  state.globalStatsStatus = "统计已更新。";
  renderGlobalStatsPanel();
}

async function incrementStatsCounter(counterId) {
  return postStatsRpc("increment_counter", { counter_id: counterId });
}

async function fetchStatsCounters(counterIds) {
  const rows = await postStatsRpc("get_counters", { counter_ids: counterIds });
  const result = Object.create(null);
  for (const id of counterIds) result[id] = 0;
  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (!row?.id) continue;
      result[row.id] = clampInt(row.count, 0, 99999999);
    }
  }
  return result;
}

async function postStatsRpc(endpoint, payload) {
  const response = await fetch(`${STATS_COUNTER_RPC_URL}/rest/v1/rpc/${endpoint}`, {
    method: "POST",
    headers: {
      apikey: STATS_COUNTER_RPC_ANON_KEY,
      Authorization: `Bearer ${STATS_COUNTER_RPC_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`统计接口 ${endpoint} 返回 ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function makeDailyCounterId(prefix, dateKey = getLocalDateKey()) {
  return `${prefix}_${dateKey.replaceAll("-", "")}`;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderGlobalStatsPanel() {
  if (!els.globalStatsPanel) return;
  const stats = normalizeGlobalStats(state.globalStats);
  const groups = [
    {
      title: "热度",
      items: [
        ["访问", stats.totalPv, stats.todayPv],
        ["访客", stats.totalUv, stats.todayUv],
        ["游玩", stats.totalGames, stats.todayGames],
        ["通关", stats.totalClears, stats.todayClears],
      ],
    },
    {
      title: "冒险",
      items: [
        ["击杀", stats.totalKills, stats.todayKills],
        ["鉴定", stats.totalAppraisals, stats.todayAppraisals],
        ["爬塔层数", stats.totalFloors, stats.todayFloors],
      ],
    },
  ];
  els.globalStatsPanel.innerHTML = `
    ${groups.map((group) => `
      <section class="global-stat-group" aria-label="${escapeHtml(group.title)}统计">
        <h4>${escapeHtml(group.title)}</h4>
        <div class="global-stats-grid">
          ${group.items.map(([label, total, today]) => `
            <div class="global-stat">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(formatCompactCount(total))}</strong>
              <em>今日 ${escapeHtml(formatCompactCount(today))}</em>
            </div>
          `).join("")}
        </div>
      </section>
      `).join("")}
  `;
  if (els.globalStatsStatus) {
    els.globalStatsStatus.textContent = state.globalStatsStatus || "";
  }
}

function formatCompactCount(value) {
  const count = clampInt(value, 0, 99999999);
  if (count >= 100000) return `${(count / 10000).toFixed(1)}万`;
  return String(count);
}

function consumeFilm() {
  if (getFilmCount() < 1) return false;
  if (state.filmRolls < 1) {
    addFilmShards(0);
  }
  if (state.filmRolls < 1) return false;
  state.filmRolls -= 1;
  return true;
}

function formatFilmCount() {
  return formatFilmAmount(getFilmCount());
}

function formatFilmAmount(value) {
  return normalizeFilmAmount(value).toFixed(1);
}

function normalizeFilmAmount(value) {
  return Math.round(Math.max(0, Number(value) || 0) * 10) / 10;
}

function toggleEnemySelection(enemyId) {
  const index = state.selectedEnemyIds.indexOf(enemyId);
  if (index >= 0) {
    state.selectedEnemyIds.splice(index, 1);
    return;
  }
  state.selectedEnemyIds.push(enemyId);
}

function getEnemySelectionOrder(enemyId) {
  const index = state.selectedEnemyIds.indexOf(enemyId);
  return index >= 0 ? index + 1 : 0;
}

function getSelectedEnemies() {
  return state.selectedEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
}

function getAliveEnemies() {
  return Array.isArray(state.enemies) ? state.enemies.filter((enemy) => enemy.hp > 0) : [];
}

function hasSelectedAllAliveEnemies() {
  const alive = getAliveEnemies();
  return alive.length > 0 && alive.every((enemy) => state.selectedEnemyIds.includes(enemy.id));
}

function canStartSelectedBattle() {
  if (isBossFloor(state.floor)) return hasSelectedAllAliveEnemies();
  return getSelectedEnemies().length > 0;
}

function getBattleStats(activeIds = state.activeEnemyIds) {
  const stats = getPlayerStats();
  const activeEnemies = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
  applyBattleSpecialPassives(stats);
  return stats;
}

function getBattleStatsForEnemies(enemies) {
  const stats = getPlayerStats();
  return applyEnemyBattleModifiers(stats, enemies);
}

function getBattleStatsForEnemiesWithSpecial(enemies, battleSpecial) {
  const stats = getPlayerStatsWithBattleSpecial(battleSpecial);
  return applyEnemyBattleModifiers(stats, enemies);
}

function applyEnemyBattleModifiers(stats, enemies) {
  applyBattleSpecialPassives(stats);
  return stats;
}

function applyBattleSpecialPassives(stats) {
  return stats;
}

function getEquippedPhotoEffectInstances(key) {
  const active = getActiveEquippedPhotoSpecialInstance();
  if (!active || (key && active.key !== key)) return [];
  return [active];
}

function getActiveEquippedPhotoSpecialInstance() {
  const candidates = [];
  ensureInventorySlots();
  const equippedItems = getEquippedItems();
  for (const item of equippedItems) {
    const slotIndex = state.inventory.findIndex((slotItem) => slotItem?.id && slotItem.id === item.id);
    for (const instance of getItemSpecialInstances(item)) {
      candidates.push({ ...instance, item, slotIndex: slotIndex < 0 ? 999 : slotIndex });
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const valueDiff = (b.effect?.value || 0) - (a.effect?.value || 0);
    if (valueDiff) return valueDiff;
    const slotDiff = a.slotIndex - b.slotIndex;
    if (slotDiff) return slotDiff;
    return photoSpecialEffects.findIndex((effect) => effect.key === a.key)
      - photoSpecialEffects.findIndex((effect) => effect.key === b.key);
  });
  return candidates[0];
}

function getHeroStrikeCount() {
  const instances = getEquippedPhotoEffectInstances("doubleStrikeSpeedDown");
  return instances.reduce((count, { effect }) => count * Math.max(1, effect.doubleStrikeMultiplier || 1), 1);
}

function createBattleSimulation(enemies) {
  const sim = {
    hp: state.player.hp,
    actualHp: state.player.hp,
    shield: 0,
    battleSpecial: createDefaultBattleSpecial(),
    theoreticalBuffer: 0,
    actualDead: false,
    activeIds: enemies.map((enemy) => enemy.id),
    heroTime: Infinity,
    enemyTimes: new Map(enemies.map((enemy) => [enemy.id, getActionInterval(enemy.speed)])),
    round: 1,
    rounds: 0,
    defeatedCount: 0,
  };
  const stats = getBattleStatsForEnemiesWithSpecial(enemies, sim.battleSpecial);
  sim.shield = stats.shield;
  sim.heroTime = getActionInterval(stats.speed);
  return sim;
}

function getSimMaxHpBonus(sim) {
  return sim.theoreticalBuffer || 0;
}

function getSimActualMaxHp(stats, sim) {
  return Math.max(1, (stats.maxHp || 0) - (sim.theoreticalBuffer || 0));
}

function healSimHero(sim, stats, amount) {
  const heal = Math.max(0, Number(amount) || 0);
  if (heal <= 0) return;
  sim.hp = Math.min(stats.maxHp, sim.hp + heal);
  if (!sim.actualDead) {
    sim.actualHp = Math.min(getSimActualMaxHp(stats, sim), sim.actualHp + heal);
  }
}

function damageSimHero(sim, amount) {
  const damage = Math.max(0, Number(amount) || 0);
  if (damage <= 0) return;
  sim.hp = Math.max(0, sim.hp - damage);
  if (!sim.actualDead) {
    sim.actualHp = Math.max(0, sim.actualHp - damage);
  }
}

function cloneEnemyForSimulation(enemy) {
  return {
    ...enemy,
    traits: cloneTraits(enemy.traits || []),
  };
}

function getNextSimEnemyId(sim) {
  return sim.activeIds
    .map((id) => ({ id, time: sim.enemyTimes.get(id) ?? Infinity }))
    .sort((a, b) => a.time - b.time || sim.activeIds.indexOf(a.id) - sim.activeIds.indexOf(b.id))[0]?.id || "";
}

function getSimActiveEnemies(sim, enemies) {
  return enemies.filter((enemy) => sim.activeIds.includes(enemy.id));
}

function simulateHeroStrike(sim, enemies, stats) {
  void stats;
  if (sim.actualDead) return [];
  const strikeCount = getHeroStrikeCount();
  const defeatedIds = [];

  for (let strikeIndex = 0; strikeIndex < strikeCount; strikeIndex += 1) {
    const enemy = sim.activeIds.map((id) => enemies.find((item) => item.id === id)).find(Boolean);
    if (!enemy) break;

    const currentStats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
    currentStats.realMaxHp = getSimActualMaxHp(currentStats, sim);
    currentStats.maxHp += getSimMaxHpBonus(sim);
    const hitResult = applySimHeroDamageToEnemy(sim, enemy, currentStats, enemies);
    const shieldLoss = hitResult.shieldLoss;
    const hpDamage = hitResult.hpDamage;

    const dealDamageGain = getTempSpecialGain("dealDamageAttack");
    if (shieldLoss + hpDamage > 0 && dealDamageGain > 0) {
      const cap = getTempSpecialCap("dealDamageAttack");
      sim.battleSpecial.attack = Math.min(cap, (sim.battleSpecial.attack || 0) + dealDamageGain);
    }

    if (!enemies.some((item) => sim.activeIds.includes(item.id) && hasTrait(item, "noLifesteal")) && currentStats.lifesteal > 0) {
      healSimHero(sim, currentStats, currentStats.lifesteal);
    }

    if (enemy.hp <= 0) {
      simulateFormKillEffects(sim, currentStats);
      simulateKillSpecial(sim, currentStats);
      sim.activeIds = sim.activeIds.filter((id) => id !== enemy.id);
      sim.enemyTimes.delete(enemy.id);
      sim.defeatedCount += 1;
      defeatedIds.push(enemy.id);
    }
  }

  return defeatedIds;
}

function simulateMonsterStrike(sim, enemy, enemies, stats) {
  const hitCount = getTraitValue(enemy, "multiHit", 1);
  for (let i = 0; i < hitCount; i += 1) {
    if (sim.actualDead) break;
    const monsterAtk = getMonsterAttackForStrike(enemy, stats);
    const damage = hasTrait(enemy, "magic") ? Math.max(0, monsterAtk) : Math.max(0, monsterAtk - stats.def);
    const immunity = getHeroFormLevelConfig().damageImmunity || 0;
    const isImmune = sim.battleSpecial.damageImmuneUsed < immunity && damage > 0;
    if (isImmune) sim.battleSpecial.damageImmuneUsed += 1;
    const effectiveDamage = isImmune ? 0 : damage;
    const shieldLoss = hasTrait(enemy, "ignoreShield") ? 0 : Math.min(sim.shield, effectiveDamage);
    const hpLoss = effectiveDamage - shieldLoss;
    sim.shield -= shieldLoss;
    damageSimHero(sim, hpLoss);
    if (shieldLoss > 0 && getHeroFormLevelConfig().shieldLossToHeal) {
      healSimHero(sim, stats, shieldLoss);
    }
    const takeDamageGain = getTempSpecialGain("takeDamageDefense");
    if (shieldLoss + hpLoss > 0 && takeDamageGain > 0) {
      const cap = getTempSpecialCap("takeDamageDefense");
      sim.battleSpecial.defense = Math.min(cap, (sim.battleSpecial.defense || 0) + takeDamageGain);
    }

    if (sim.actualHp > 0 && !enemies.some((item) => sim.activeIds.includes(item.id) && hasTrait(item, "noRegen")) && stats.regen > 0) {
      healSimHero(sim, stats, stats.regen);
    }

    const monsterSteal = getTraitValue(enemy, "lifesteal", 0);
    if (monsterSteal > 0) enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterSteal);
    if (sim.actualHp <= 0) {
      sim.actualDead = true;
      break;
    }
  }

  triggerSimEnemyAttackTraits(sim, enemy);

  const monsterRegen = getTraitValue(enemy, "regen", 0);
  if (monsterRegen > 0 && enemy.hp > 0) {
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterRegen);
  }
}

function applySimHeroDamageToEnemy(sim, enemy, stats, enemies = []) {
  const rawDamage = Math.max(0, stats.atk - getEffectiveEnemyDefense(enemy, stats));
  const shieldCrashDamage = getShieldCrashDamage(sim.shield);
  let damage = rawDamage + shieldCrashDamage;
  if (hasTrait(enemy, "sturdy")) damage = Math.min(damage, 1);
  damage = applyEnemyIncomingDamageModifiers(enemy, damage, getSimActiveEnemies(sim, enemies));
  const shieldLoss = Math.min(enemy.shield || 0, damage);
  enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
  const hpDamage = Math.max(0, damage - shieldLoss);
  enemy.hp = Math.max(0, enemy.hp - hpDamage);
  triggerSimEnemyDamagedTraits(enemy);
  return { rawDamage, shieldCrashDamage, shieldLoss, hpDamage };
}

function applySimPreBattleFormEffects(sim, enemies) {
  if (!getHeroFormLevelConfig().preBattleStrike || sim.battleSpecial.preBattleStruck) return;
  sim.battleSpecial.preBattleStruck = true;
  for (const enemy of enemies.filter((item) => sim.activeIds.includes(item.id))) {
    if (enemy.hp <= 0) continue;
    const stats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
    stats.realMaxHp = getSimActualMaxHp(stats, sim);
    stats.maxHp += getSimMaxHpBonus(sim);
    applySimHeroDamageToEnemy(sim, enemy, stats, enemies);
    if (enemy.hp <= 0) {
      simulateFormKillEffects(sim, stats);
      simulateKillSpecial(sim, stats);
      sim.activeIds = sim.activeIds.filter((id) => id !== enemy.id);
      sim.enemyTimes.delete(enemy.id);
      sim.defeatedCount += 1;
    }
  }
}

function simulateFormKillEffects(sim, stats) {
  const heal = getHeroFormLevelConfig().killHeal || 0;
  healSimHero(sim, stats, heal);
}

function simulateKillSpecial(sim, stats) {
  let maxHpGain = 0;
  let healGain = 0;
  const active = getActiveEquippedPhotoSpecialInstance();
  const effect = active?.effect;
  if (effect?.stat === "hp" && effect.kind === "killPermanent") maxHpGain += effect.amount;
  if (effect?.kind === "killHeal") healGain += effect.amount;
  void maxHpGain;
  healSimHero(sim, stats, healGain);
}

function hasAnyActiveTrait(type) {
  return getActiveBattleEnemies().some((enemy) => hasTrait(enemy, type));
}

function hasTrait(enemy, type) {
  return Array.isArray(enemy.traits) && enemy.traits.some((trait) => trait.type === type);
}

function getTraitValue(enemy, type, fallback = 0) {
  return getTraitValueFromList(enemy.traits, type, fallback);
}

function getTraitValueFromList(traits = [], type, fallback = 0) {
  const trait = traits.find((item) => item.type === type);
  return Number.isFinite(trait?.value) ? trait.value : fallback;
}

function cloneTraits(traits = []) {
  return traits.map((trait) => ({ ...trait }));
}

function getAliveGuardCount(enemies = getActiveBattleEnemies()) {
  return enemies.filter((enemy) => enemy.typeKey === "guard" && enemy.hp > 0).length;
}

function applyEnemyIncomingDamageModifiers(enemy, damage, enemies = getActiveBattleEnemies()) {
  let result = Math.max(0, Math.floor(Number(damage) || 0));
  if (hasTrait(enemy, "guardedByGuards")) {
    const guardCount = getAliveGuardCount(enemies);
    const reduction = Math.min(1, guardCount * (getTraitValue(enemy, "guardedByGuards", 50) / 100));
    result = Math.floor(result * Math.max(0, 1 - reduction));
  }
  return result;
}

function getMonsterAttackForStrike(enemy, heroStats) {
  let atk = Math.max(0, enemy?.atk || 0);
  if (hasTrait(enemy, "giant")) {
    const baseHp = getTraitValue(enemy, "giant", enemy.maxHp || 0);
    const heroMaxHp = Number.isFinite(heroStats?.realMaxHp) ? heroStats.realMaxHp : heroStats?.maxHp;
    atk += Math.max(0, baseHp - Math.max(0, heroMaxHp || 0));
  }
  return atk;
}

function triggerEnemyDamagedTraits(enemy) {
  if (hasTrait(enemy, "promotion")) {
    enemy.atk = Math.max(0, (enemy.atk || 0) + 1);
    return ["晋升攻击+1"];
  }
  return [];
}

function triggerEnemyAttackTraits(enemy) {
  const changes = [];
  if (hasTrait(enemy, "promotion")) {
    enemy.def = Math.max(0, (enemy.def || 0) + 1);
    changes.push("晋升防御+1");
  }
  if (hasTrait(enemy, "attackDownOnAttack")) {
    const value = Math.max(1, getTraitValue(enemy, "attackDownOnAttack", 1));
    state.battleSpecial.attackDown = (state.battleSpecial.attackDown || 0) + value;
    changes.push(`压制攻击-${value}`);
  }
  if (hasTrait(enemy, "speedDownOnAttack")) {
    const value = Math.max(1, getTraitValue(enemy, "speedDownOnAttack", 1));
    state.battleSpecial.speedDown = (state.battleSpecial.speedDown || 0) + value;
    changes.push(`龙威速度-${value}`);
  }
  return changes;
}

function triggerSimEnemyDamagedTraits(enemy) {
  if (hasTrait(enemy, "promotion")) {
    enemy.atk = Math.max(0, (enemy.atk || 0) + 1);
  }
}

function triggerSimEnemyAttackTraits(sim, enemy) {
  if (hasTrait(enemy, "promotion")) {
    enemy.def = Math.max(0, (enemy.def || 0) + 1);
  }
  if (hasTrait(enemy, "attackDownOnAttack")) {
    sim.battleSpecial.attackDown = (sim.battleSpecial.attackDown || 0) + Math.max(1, getTraitValue(enemy, "attackDownOnAttack", 1));
  }
  if (hasTrait(enemy, "speedDownOnAttack")) {
    sim.battleSpecial.speedDown = (sim.battleSpecial.speedDown || 0) + Math.max(1, getTraitValue(enemy, "speedDownOnAttack", 1));
  }
}

function isBossFloor(floor) {
  return bossFloors.has(floor);
}

function isRewardBossFloor(floor) {
  return rewardBossFloors.has(floor);
}

function isBossRewardFloor(floor) {
  return isBossFloor(floor) || isRewardBossFloor(floor);
}

function isPlayerDefeated() {
  return state.player.hp <= 0;
}

function makeEncounterId() {
  return `${state.floor}:${state.enemies.map((enemy) => enemy.id).join("|")}`;
}

function makeRunSeed() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function applyFloorShield() {
  const stats = getPlayerStats();
  if (state.player.shieldMonsterId === state.encounterId) return;
  state.player.shield = stats.shield;
  state.player.shieldMonsterId = state.encounterId;
}

function createDefaultPlayer() {
  const defaultForm = heroFormMap.get(defaultHeroFormId);
  const defaultStats = defaultForm?.levels?.[1]?.stats || {};
  const player = {
    formId: defaultHeroFormId,
    baseHp: 50,
    hp: 50,
    baseAtk: 4,
    baseDef: 1,
    baseSpeed: 2,
    baseRegen: 0,
    baseShield: 3,
    baseLifesteal: 0,
    shield: 0,
    shieldMonsterId: "",
  };
  player.hp = player.baseHp + (defaultStats.hp || 0);
  player.shield = player.baseShield + (defaultStats.shield || 0);
  return player;
}

function getPlayerMaxHpFromRaw(player) {
  const form = heroFormMap.get(player?.formId) || heroFormMap.get(defaultHeroFormId);
  const formStats = getHeroFormStatsFor(form);
  const equipmentStats = getInventoryStatBonus();
  return (Number.isFinite(player?.baseHp) ? player.baseHp : 50)
    + (formStats.hp || 0)
    + (equipmentStats.hp || 0);
}

function getPlayerShieldFromRaw(player) {
  const form = heroFormMap.get(player?.formId) || heroFormMap.get(defaultHeroFormId);
  const formStats = getHeroFormStatsFor(form);
  const equipmentStats = getInventoryStatBonus();
  return (Number.isFinite(player?.baseShield) ? player.baseShield : 0)
    + (formStats.shield || 0)
    + (equipmentStats.shield || 0);
}

function resetGame() {
  stopAutoBattle();
  stopBattleTimers();
  localStorage.removeItem(STORAGE_KEYS.save);
  state.player = createDefaultPlayer();
  state.runSeed = makeRunSeed();
  state.floor = 1;
  state.gameClear = false;
  state.enemies = buildFloorEncounter(1);
  state.encounterId = makeEncounterId();
  state.selectedEnemyIds = [];
  state.activeEnemyIds = [];
  state.battleClock = null;
  state.battleReports = [];
  state.battleReportSeq = 0;
  state.currentBattle = null;
  state.battleSnapshot = null;
  state.infoMode = "item";
  state.bossReward = null;
  state.formProgress = createDefaultFormProgress();
  state.photoValueMin = defaultPhotoValueMin;
  state.photoValueMax = defaultPhotoValueMax;
  state.globalFilmDropBonus = 0;
  state.bossRewardDeck = null;
  state.battleSpeed = 1;
  state.hitEffectToken = 0;
  state.heroHitEffectUntil = 0;
  state.enemyHitEffectUntilById = {};
  state.inventory = createEmptyInventorySlots();
  state.selectedSlotIndex = 0;
  state.pendingPhotoSlotIndex = 0;
  state.selectedItemId = "";
  state.lastPhoto = "";
  state.latestItem = null;
  state.filmShards = 0;
  state.filmRolls = initialFilmRolls;
  state.lootError = "";
  state.log = ["已重开。"];
  state.careerSummary = null;
  state.careerSummaryRequest = null;
  resetBattleSpecial();
  clearEnemyCardMotion();
  applyFloorShield();
  addFloorNarrative(1);
  saveGame();
  render();
}

function hashIndex(seed, length) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function getPlayerStats() {
  return getPlayerStatsWithBattleSpecial(state.battleSpecial);
}

function getPlayerStatsWithBattleSpecial(battleSpecial = createDefaultBattleSpecial()) {
  const bonus = { ...getHeroFormStats() };
  const inventoryBonus = getInventoryStatBonus();
  for (const key of statOrder) {
    bonus[key] = (bonus[key] || 0) + (inventoryBonus[key] || 0);
  }

  const passiveAttackPenalty = getEquippedPhotoEffectInstances("shieldCrashAttackDown")
    .reduce((sum, { effect }) => sum + Math.abs(effect.amount || 0), 0)
    + getEquippedPhotoEffectInstances("doubleStrikeSpeedDown")
      .reduce((sum, { effect }) => sum + Math.abs(effect.attackAmount || 0), 0);
  const passiveSpeedPenalty = getEquippedPhotoEffectInstances("doubleStrikeSpeedDown")
    .reduce((sum, { effect }) => sum + Math.abs(effect.amount || 0), 0);
  const regenMultiplier = getEquippedPhotoEffectInstances("regenMultiplier")
    .reduce((multiplier, { effect }) => multiplier * Math.max(1, effect.multiplier || 1), 1);
  const lifestealMultiplier = getEquippedPhotoEffectInstances("lifestealMultiplier")
    .reduce((multiplier, { effect }) => multiplier * Math.max(1, effect.multiplier || 1), 1);
  const regen = state.player.baseRegen + (bonus.regen || 0);
  const lifesteal = state.player.baseLifesteal + (bonus.lifesteal || 0);

  return {
    maxHp: state.player.baseHp + (bonus.hp || 0),
    atk: state.player.baseAtk + (bonus.attack || 0) + (battleSpecial?.attack || 0) - passiveAttackPenalty - (battleSpecial?.attackDown || 0),
    def: state.player.baseDef + (bonus.defense || 0) + (battleSpecial?.defense || 0),
    speed: state.player.baseSpeed + (bonus.speed || 0) - passiveSpeedPenalty - (battleSpecial?.speedDown || 0),
    regen: regen * regenMultiplier,
    shield: state.player.baseShield + (bonus.shield || 0),
    lifesteal: lifesteal * lifestealMultiplier,
  };
}

function getEffectiveEnemyDefense(enemy, stats = getBattleStats(state.activeEnemyIds)) {
  const ratio = getHeroFormLevelConfig().ignoreDefenseRatio || 0;
  const ignored = Math.floor(Math.max(0, enemy?.def || 0) * ratio);
  return (enemy?.def || 0) - ignored;
}

function getHeroForm() {
  return heroFormMap.get(state.player.formId) || heroFormMap.get(defaultHeroFormId);
}

function getHeroFormStats() {
  return normalizeSignedStats(getHeroFormLevelConfig().stats || {}, 999);
}

function getHeroFormStatsFor(form = getHeroForm()) {
  return normalizeSignedStats(getHeroFormLevelConfig(form).stats || {}, 999);
}

function getInventoryStatBonus() {
  const bonus = normalizeStats({}, 999);
  for (const item of getEquippedItems()) {
    for (const key of statOrder) {
      bonus[key] += item.stats?.[key] || 0;
    }
    const effectStats = getItemSpecialStats(item);
    for (const key of statOrder) {
      bonus[key] += effectStats[key] || 0;
    }
  }
  return bonus;
}

function getHeroFormImageUrl(form = getHeroForm()) {
  return `${heroFormImageBase}${form.image}`;
}

function setHeroForm(formId) {
  if (!heroFormMap.has(formId) || state.player.formId === formId) return;
  if (isEquipmentLocked()) return;
  const oldStats = getPlayerStats();
  const oldShield = state.player.shield;
  const targetForm = heroFormMap.get(formId);
  const currentForm = getHeroForm();
  const hpLoss = (getHeroFormLevelConfig(currentForm).stats?.hp || 0) - (getHeroFormLevelConfig(targetForm).stats?.hp || 0);
  if (hpLoss > 0 && state.player.hp <= hpLoss) {
    addBattleEvent("当前生命不足，无法切换会降低生命上限的形态。", "info");
    render();
    return;
  }
  state.player.formId = formId;
  const newStats = getPlayerStats();
  if (newStats.maxHp > oldStats.maxHp) {
    state.player.hp += newStats.maxHp - oldStats.maxHp;
  } else if (hpLoss > 0) {
    state.player.hp = Math.min(state.player.hp - hpLoss, newStats.maxHp);
  } else {
    state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  }
  state.player.hp = Math.max(0, state.player.hp);
  syncShieldAfterEquipmentChange(oldStats.shield, newStats.shield, oldShield);
  saveGame();
  render();
}

function getItemSpecialStats(item) {
  const result = normalizeStats({}, 999);
  const active = getActiveEquippedPhotoSpecialInstance();
  if (!active || active.item?.id !== item?.id) return result;
  const { effect, state: stateData } = active;
  if (effect.kind === "killThreshold" && effect.stat) {
    result[effect.stat] += clampInt(stateData.bonus, 0, 999) * effect.amount;
  } else if (effect.kind === "killPermanent" && effect.stat) {
    result[effect.stat] += clampInt(stateData.bonus, 0, 999);
  }
  return result;
}

function getItemSpecialInstances(item) {
  return getItemSpecialKeys(item).map((key) => ({
    key,
    effect: photoSpecialEffectMap.get(key),
    state: ensureItemSpecialState(item, key),
  })).filter((entry) => entry.effect);
}

function getItemSpecialKeys(item) {
  if (!item || !Array.isArray(item.specialEffects)) return [];
  return [...new Set(item.specialEffects.filter((key) => photoSpecialEffectMap.has(key)))];
}

function ensureItemSpecialState(item, key) {
  if (!item.specialState || typeof item.specialState !== "object") item.specialState = {};
  if (!item.specialState[key] || typeof item.specialState[key] !== "object") {
    item.specialState[key] = {};
  }
  const data = item.specialState[key];
  if (!Number.isFinite(data.kills)) data.kills = 0;
  if (!Number.isFinite(data.bonus)) data.bonus = 0;
  return data;
}

function getShieldCrashDamage(shield = state.player.shield) {
  const ratio = getEquippedPhotoEffectInstances("shieldCrashAttackDown")
    .reduce((sum, { effect }) => sum + (effect.shieldDamageRatio || 0), 0);
  return Math.floor(Math.max(0, shield || 0) * ratio);
}

function getTempSpecialGain(key) {
  return getEquippedPhotoEffectInstances(key).reduce((sum, { effect }) => sum + (effect.amount || 0), 0);
}

function getTempSpecialCap(key) {
  return getEquippedPhotoEffectInstances(key).reduce((sum, { effect }) => sum + (effect.cap || 0), 0);
}

function triggerDealDamageSpecial() {
  const gain = getTempSpecialGain("dealDamageAttack");
  if (gain <= 0) return;
  state.battleSpecial.attack = Math.min(getTempSpecialCap("dealDamageAttack"), (state.battleSpecial.attack || 0) + gain);
}

function triggerTakeDamageSpecial() {
  const gain = getTempSpecialGain("takeDamageDefense");
  if (gain <= 0) return;
  state.battleSpecial.defense = Math.min(getTempSpecialCap("takeDamageDefense"), (state.battleSpecial.defense || 0) + gain);
}

function triggerKillSpecial(enemy) {
  void enemy;
  const changes = [];
  const active = getActiveEquippedPhotoSpecialInstance();
  if (!active) return;
  const { key, effect, state: data, item } = active;

  if (effect.kind === "killThreshold") {
    data.kills += 1;
    const targetBonus = Math.floor(data.kills / effect.threshold);
    if (targetBonus > data.bonus) {
      const gain = (targetBonus - data.bonus) * effect.amount;
      data.bonus = targetBonus;
      changes.push(`${formatItemDisplayName(item)} ${statLabels[effect.stat] || effect.stat}+${gain}`);
    }
  } else if (effect.kind === "killPermanent") {
    data.kills += 1;
    data.bonus += effect.amount;
    changes.push(`${formatItemDisplayName(item)} ${statLabels[effect.stat] || effect.stat}+${effect.amount}`);
  } else if (effect.kind === "killHeal") {
    data.kills += 1;
    data.bonus += effect.amount;
    const stats = getBattleStats(state.activeEnemyIds);
    const beforeHp = state.player.hp;
    state.player.hp = Math.min(stats.maxHp, state.player.hp + effect.amount);
    const healed = state.player.hp - beforeHp;
    if (healed > 0) changes.push(`${formatItemDisplayName(item)} 生命+${healed}`);
  }
  ensureItemSpecialState(item, key);

  if (changes.length) {
    addBattleDetail(`击杀触发：${changes.join("；")}。`);
  }
}
function getEquippedItems() {
  ensureInventorySlots();
  const seen = [];
  return state.inventory
    .slice(0, equipmentSlotLimit)
    .filter((item) => {
      if (!item || item.tooLarge) return false;
      const key = makeExactObjectDuplicateKey(item);
      if (key && seen.includes(key)) return false;
      if (key) seen.push(key);
      return true;
    });
}

function isEquipmentLocked() {
  return Boolean(state.autoBattleTimer)
    || Boolean(state.currentBattle)
    || Boolean(state.battleStartTimer)
    || state.pendingFloorAdvance
    || isPlayerDefeated()
    || Boolean(state.bossReward)
    || isAnalyzingPhoto();
}

function handleDiscardAction() {
  if (hasPendingPhoto() && !isAnalyzingPhoto()) {
    abandonPendingPhoto();
    return true;
  }
  return dismantleSelectedItem();
}

function dismantleSelectedItem() {
  if (isEquipmentLocked()) return false;
  ensureInventorySlots();
  const index = getSelectedSlotIndex();
  const removed = state.inventory[index];
  if (!removed) return false;

  const oldStats = getPlayerStats();
  const oldShield = state.player.shield;
  const returnedFilm = getDismantleFilmReturn(removed);
  state.inventory[index] = null;
  state.selectedItemId = "";
  state.latestItem = state.inventory.find(Boolean) || null;
  state.infoMode = "log";
  addFilmAmount(returnedFilm);
  const newStats = getPlayerStats();
  if (newStats.maxHp < oldStats.maxHp) state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  syncShieldAfterEquipmentChange(oldStats.shield, newStats.shield, oldShield);
  state.lootError = "";
  setBusy("");
  addBattleEvent(`分解 ${formatItemDisplayName(removed)}，返还胶卷 +${formatFilmAmount(returnedFilm)}。`, "item");
  saveGame();
  render();
  return true;
}

function makePhotoStatEvidenceText({ itemName, subjectName, objectType, sizeClass, identityDescription }) {
  return [itemName, subjectName, objectType, sizeClass, identityDescription]
    .filter(Boolean)
    .join(" ");
}

function balanceItem(item, image = "") {
  const safe = item && typeof item === "object" ? item : {};
  const rarity = ["common", "uncommon", "rare"].includes(safe.rarity) ? safe.rarity : "common";
  const itemName = cleanText(safe.itemName, "照片装备", 18);
  const subjectName = cleanText(safe.subjectName, itemName, 18);
  const tags = normalizeStringList(safe.tags);
  const objectType = cleanText(safe.objectType, "", 18);
  const sizeClass = cleanText(safe.sizeClass, "", 18);
  const reason = cleanText(safe.reason, "", 72);
  const semanticSchema = getRawSemanticFlag(safe);
  const photoQuality = normalizePhotoQuality(safe.photoQuality || {});
  const statAffinity = normalizeStatAffinity(safe.statAffinity || []);
  const specialAffinity = normalizeSpecialEffects(safe.specialAffinity || []);
  const preserveSettledOutput = Boolean(safe.skipSpecialRoll);
  const identityDescription = cleanText(safe.identityDescription || safe.identity_description || safe.appearance || safe.objectIdentity || "", "", 160);
  const semanticText = [itemName, subjectName, objectType, sizeClass, identityDescription, safe.description, reason, tags.join(" ")].filter(Boolean).join(" ");
  const safeTooLarge = parseBooleanMaybe(safe.tooLarge) === true;
  const safeIsScene = parseBooleanMaybe(safe.isScene) === true;
  const safeIsEquipable = parseBooleanMaybe(safe.isEquipable);
  const modelRejected = safeTooLarge
    || safeIsScene
    || safeIsEquipable === false
    || isOversizedSizeClass(sizeClass);
  const tooLarge = shouldTreatAsTooLarge(itemName, semanticText, modelRejected);
  const virtualPenalty = getVirtualImagePenalty(semanticText, photoQuality);
  const noEffect = tooLarge || virtualPenalty.noEffect;
  let requestedValue = noEffect
    ? 0
    : preserveSettledOutput && Number.isFinite(safe.value)
      ? Math.max(0, safe.value)
      : calculatePhotoItemValue(safe, semanticText);
  const objectStatEvidenceText = makePhotoStatEvidenceText({ itemName, subjectName, objectType, sizeClass, identityDescription }) || itemName;
  if (!noEffect) {
    requestedValue = preserveSettledOutput
      ? requestedValue
      : adjustPhotoItemValueForSemanticMinimum(requestedValue, objectStatEvidenceText, statAffinity);
    if (!preserveSettledOutput && Number.isFinite(virtualPenalty.cap)) {
      requestedValue = Math.min(requestedValue, virtualPenalty.cap);
    }
  }
  const specialEffects = noEffect || virtualPenalty.suppressSpecial
    ? []
    : choosePhotoSpecialEffects({ ...safe, itemName, objectType, reason, tags, description: semanticText, ignoreDirectSpecialEffects: semanticSchema && !preserveSettledOutput }, image, requestedValue)
      .filter((key) => (photoSpecialEffectMap.get(key)?.value || Infinity) <= requestedValue);
  const specialValue = calculateSpecialEffectsValue(specialEffects);
  const statBudget = Math.max(0, requestedValue - specialValue);
  const targetValue = noEffect ? 0 : requestedValue;
  const statSemanticText = virtualPenalty.level === "ordinaryCap"
    ? makePhysicalCarrierStatText(semanticText)
    : objectStatEvidenceText;
  const statAffinityForAllocation = virtualPenalty.level === "ordinaryCap"
    ? []
    : sanitizeStatAffinityForSemantics(safe.statAffinity, statSemanticText);
  const stats = noEffect
      ? normalizeStats({}, 20)
      : clampStatsToValue(allocateStatsForItem(semanticSchema || virtualPenalty.level === "ordinaryCap" ? {} : safe.stats || {}, statSemanticText, statBudget, statAffinityForAllocation), statBudget);

  const balanced = {
    itemName,
    subjectName,
    objectType,
    sizeClass,
    isScene: safeIsScene || isOversizedSizeClass(sizeClass),
    isEquipable: safeIsEquipable !== false && !noEffect,
    rarity,
    value: targetValue,
    quality: getItemQuality(targetValue),
    stats,
    specialEffects,
    specialState: normalizeSpecialState(safe.specialState, specialEffects),
    description: noEffect ? virtualPenalty.description || "主体过大或主要是场景，无法提供属性。" : cleanText(safe.description || reason, "由照片鉴定出的装备。", 72),
    identityDescription,
    reason,
    tags,
    photoQuality,
    photoQualityScore: semanticSchema ? calculatePhotoQualityScore(photoQuality, semanticText) : null,
    statAffinity,
    specialAffinity,
    semanticAppraisal: semanticSchema,
    confidence: clampNumber(safe.confidence, 0, 1),
    photoKey: cleanText(safe.photoKey, "", 48),
    objectKey: cleanText(safe.objectKey, "", 80),
    film: Boolean(safe.film),
    skipSpecialRoll: Boolean(safe.skipSpecialRoll),
    tooLarge: noEffect,
    virtualImage: virtualPenalty.level !== "none",
    image,
  };
  balanced.objectKey = cleanText(balanced.objectKey || makeObjectDuplicateKey(balanced), "", 80);
  return balanced;
}

function normalizeInventoryItem(item) {
  const balanced = balanceItem({ ...(item || {}), skipSpecialRoll: true }, item?.image || makePlaceholderImage());
  const normalized = {
    ...balanced,
    id: typeof item?.id === "string" && item.id ? item.id : makeId("item"),
  };
  normalized.specialEffects = normalizeSpecialEffects(item?.specialEffects || balanced.specialEffects);
  normalized.specialState = normalizeSpecialState(item?.specialState || balanced.specialState, normalized.specialEffects);
  normalized.photoQuality = normalizePhotoQuality(item?.photoQuality || balanced.photoQuality || {});
  normalized.photoQualityScore = Number.isFinite(item?.photoQualityScore)
    ? clampInt(item.photoQualityScore, 0, 15)
    : balanced.photoQualityScore;
  normalized.statAffinity = normalizeStatAffinity(item?.statAffinity || balanced.statAffinity || []);
  normalized.specialAffinity = normalizeSpecialEffects(item?.specialAffinity || balanced.specialAffinity || []);
  normalized.semanticAppraisal = getRawSemanticFlag(item || {});
  normalized.photoKey = cleanText(item?.photoKey || balanced.photoKey, "", 48);
  normalized.objectKey = cleanText(item?.objectKey || balanced.objectKey || makeObjectDuplicateKey(normalized), "", 80);
  normalized.identityDescription = cleanText(item?.identityDescription || balanced.identityDescription, "", 160);
  delete normalized.healAmount;
  delete normalized.consumable;
  return normalized;
}

function normalizeInventorySlots(inventory) {
  const slots = createEmptyInventorySlots();
  if (!Array.isArray(inventory)) return slots;
  const source = inventory.slice(0, equipmentVisibleSlots);
  for (let i = 0; i < source.length && i < equipmentVisibleSlots; i += 1) {
    slots[i] = source[i] ? normalizeInventoryItem(source[i]) : null;
  }
  return slots;
}

function scoreItem(item) {
  if (!item) return 0;
  if (Number.isFinite(item.value)) return Math.max(0, item.value);
  return calculateStatsValue(item.stats || {}) + calculateSpecialEffectsValue(getItemSpecialKeys(item));
}

function getItemEffectValue(item) {
  if (!item || item.tooLarge) return 0;
  return calculateStatsValue(item.stats || {}) + calculateSpecialEffectsValue(getItemSpecialKeys(item));
}

function getItemQuality(value) {
  const score = Number.isFinite(value) ? value : 0;
  if (score >= 21) return { key: "legendary", label: "传说" };
  if (score >= 17) return { key: "epic", label: "史诗" };
  if (score >= 13) return { key: "rare", label: "稀有" };
  return { key: "common", label: "普通" };
}

function getItemQualityKey(item) {
  return getItemQuality(scoreItem(item)).key;
}

function getDismantleFilmReturn(item) {
  if (!item) return 0;
  if (isInvalidAppraisalItem(item)) return 1;
  if (scoreItem(item) <= 0) return 0;
  const quality = getItemQuality(scoreItem(item));
  return itemQualityRefunds[quality.key] || 0;
}

function ceilFilmTenth(value) {
  return normalizeFilmAmount(Math.ceil(Math.max(0, Number(value) || 0) * 10) / 10);
}

function normalizeStats(stats, maxValue = 20) {
  const safe = stats && typeof stats === "object" ? stats : {};
  return {
    hp: clampInt(safe.hp, 0, maxValue),
    attack: clampInt(safe.attack, 0, maxValue),
    defense: clampInt(safe.defense, 0, maxValue),
    speed: clampInt(safe.speed, 0, maxValue),
    shield: clampInt(safe.shield, 0, maxValue),
    lifesteal: clampInt(safe.lifesteal, 0, maxValue),
    regen: clampInt(safe.regen, 0, maxValue),
  };
}

function normalizeSignedStats(stats, maxAbsValue = 20) {
  const safe = stats && typeof stats === "object" ? stats : {};
  const limit = Math.max(0, Number(maxAbsValue) || 0);
  return {
    hp: clampInt(safe.hp ?? 0, -limit, limit),
    attack: clampInt(safe.attack ?? 0, -limit, limit),
    defense: clampInt(safe.defense ?? 0, -limit, limit),
    speed: clampInt(safe.speed ?? 0, -limit, limit),
    shield: clampInt(safe.shield ?? 0, -limit, limit),
    lifesteal: clampInt(safe.lifesteal ?? 0, -limit, limit),
    regen: clampInt(safe.regen ?? 0, -limit, limit),
  };
}

function calculateStatsValue(stats) {
  const safe = normalizeStats(stats, 99);
  return statOrder.reduce((total, key) => total + safe[key] * statValueWeights[key], 0);
}

function clampStatsToValue(stats, valueBudget) {
  const result = normalizeStats(stats, 20);
  let remaining = Math.max(0, valueBudget);
  for (const key of statOrder) {
    const weight = statValueWeights[key];
    const maxPoints = Math.min(result[key], Math.floor(remaining / weight));
    result[key] = maxPoints;
    remaining -= maxPoints * weight;
  }
  return result;
}

function calculatePhotoItemValue(item, semanticText = "") {
  const quality = normalizePhotoQuality(item.photoQuality);
  const hasQuality = calculatePhotoQualityTotal(quality) > 0;
  if (!hasQuality && Number.isFinite(item.value) && item.value > 0) {
    return clampInt(item.value, getPhotoValueMin(), getPhotoValueMax());
  }
  const qualityScore = hasQuality ? calculateAdjustedPhotoQualityScore(quality, semanticText) : inferFallbackQualityScore(semanticText);
  const min = getPhotoValueMin();
  const max = getPhotoValueMax();
  if (max <= min) return min;
  const normalized = Math.max(0, Math.min(1, qualityScore / 15));
  const curved = Math.pow(normalized, 1.8);
  let value = min + Math.round(curved * (max - min));
  const cap = getPhotoValueCapFromQuality(quality, semanticText);
  value = Math.min(value, cap);
  return Math.max(min, Math.min(max, value));
}

function adjustPhotoItemValueForSemanticMinimum(value, semanticText = "", statAffinity = []) {
  const current = clampInt(value, getPhotoValueMin(), getPhotoValueMax());
  if (current <= 0) return current;
  const preferredMinimum = getMinimumPreferredStatCost(semanticText, statAffinity);
  if (preferredMinimum > current && preferredMinimum <= getPhotoValueMax()) {
    const cap = getPhotoValueCapFromQuality(normalizePhotoQuality({}), semanticText);
    return Math.max(current, Math.min(preferredMinimum, cap, getPhotoValueMax()));
  }
  if (calculateStatsValue(allocateStatsForItem({}, semanticText, current, statAffinity)) > 0) return current;
  const minAffordable = getMinimumSemanticStatCost(semanticText, statAffinity);
  if (!minAffordable || minAffordable > getPhotoValueMax()) return current;
  const cap = getPhotoValueCapFromQuality(normalizePhotoQuality({}), semanticText);
  return Math.max(current, Math.min(minAffordable, cap, getPhotoValueMax()));
}

function getMinimumPreferredStatCost(text, statAffinity = []) {
  const keys = sanitizeStatAffinityForSemantics(statAffinity, text)
    .map((item) => item.stat)
    .filter((key) => hasSemanticForPhotoStat(key, text));
  const costs = [...new Set(keys)]
    .map((key) => statValueWeights[key])
    .filter((cost) => Number.isFinite(cost) && cost > 0);
  return costs.length ? Math.min(...costs) : 0;
}

function getMinimumSemanticStatCost(text, statAffinity = []) {
  const keys = [
    ...getPreferredStatKeys(text, statAffinity),
    ...getAffordableFallbackStatKeys(text, getPhotoValueMax()),
  ];
  const costs = [...new Set(keys)]
    .filter((key) => hasSemanticForPhotoStat(key, text))
    .map((key) => statValueWeights[key])
    .filter((cost) => Number.isFinite(cost) && cost > 0);
  return costs.length ? Math.min(...costs) : 0;
}

function sanitizeStatAffinityForSemantics(statAffinity = [], text = "") {
  const source = String(text || "");
  return normalizeStatAffinity(statAffinity)
    .filter((item) => isModelStatAffinityAllowed(item.stat, source));
}

function isModelStatAffinityAllowed(key, text) {
  if (!statOrder.includes(key)) return false;
  const source = String(text || "");
  if (isSharpToolSemanticText(source) && (key === "regen" || key === "hp" || key === "shield")) {
    return hasStrongStatEvidence(key, source);
  }
  if (hasAirPurifierSemanticText(source) && (key === "hp" || key === "lifesteal" || key === "attack")) {
    return hasStrongStatEvidence(key, source);
  }
  if (key === "regen" && !hasStrongRegenSemanticText(source) && hasOffensiveToolSemanticText(source)) {
    return false;
  }
  if (key === "hp" && !hasStrongHpSemanticText(source) && hasOffensiveToolSemanticText(source)) {
    return false;
  }
  return hasSemanticForPhotoStat(key, source);
}

function hasStrongStatEvidence(key, text) {
  switch (key) {
    case "hp": return hasStrongHpSemanticText(text);
    case "regen": return hasStrongRegenSemanticText(text);
    case "shield": return hasShieldSemanticText(text) && !isSharpToolSemanticText(text);
    case "attack": return hasAttackSemanticText(text);
    case "lifesteal": return hasLifestealSemanticText(text);
    case "defense": return hasDefenseSemanticText(text);
    case "speed": return hasSpeedSemanticText(text);
    default: return false;
  }
}

function getPhotoValueCapFromQuality(photoQuality, semanticText = "") {
  const quality = normalizePhotoQuality(photoQuality);
  const text = String(semanticText || "");
  const virtualPenalty = getVirtualImagePenalty(text, quality);
  if (virtualPenalty.noEffect) return 0;
  if (Number.isFinite(virtualPenalty.cap)) return Math.min(getPhotoValueMax(), virtualPenalty.cap);
  if (quality.clarity <= 1 || quality.subjectArea <= 1 || quality.realPhoto <= 1) return Math.min(getPhotoValueMax(), 12);
  if (quality.backgroundClean <= 0 || quality.focusLight <= 0) return Math.min(getPhotoValueMax(), 14);
  if (hasCrowdedOrSmallSubjectText(text)) return Math.min(getPhotoValueMax(), 14);
  if (/抽象|光斑|远景|纹理|风景|海岸|山|天空|道路|街道|森林|荒原|人物|人像|动物|猫|狗|abstract|bokeh|landscape|sky|road|street|forest|portrait|animal|cat|dog/i.test(text) && !isSmallEquipableNaturalText(text) && !isPortableEquipmentText(text)) {
    return Math.min(getPhotoValueMax(), 14);
  }
  if (quality.interesting <= 0) return Math.min(getPhotoValueMax(), 15);
  if (quality.clarity < 3 || quality.subjectArea < 2 || quality.backgroundClean < 1) return Math.min(getPhotoValueMax(), 16);
  if (quality.subjectArea < 3 || quality.backgroundClean < 2) return Math.min(getPhotoValueMax(), 16);
  if (quality.clarity < 3) return Math.min(getPhotoValueMax(), 16);
  if (quality.interesting < 2) return Math.min(getPhotoValueMax(), hasStrongEquipmentFantasyText(text) ? 17 : 16);
  return getPhotoValueMax();
}

function hasSemanticIdentificationData(item) {
  if (!item || typeof item !== "object") return false;
  if (item.semanticAppraisal === true) return true;
  const sizeClass = item.sizeClass || item.size_class;
  if (typeof sizeClass === "string" && sizeClass.trim()) return true;
  if (item.isScene === true || item.is_scene === true) return true;
  if (calculatePhotoQualityTotal(item.photoQuality || item.photo_quality || {}) > 0) return true;
  if (normalizeStatAffinity(item.statAffinity || item.stat_affinity || item.affinity || item.statPreference).length) return true;
  if (normalizeSpecialEffects(item.specialAffinity || item.special_affinity || item.specialCandidates).length) return true;
  return Boolean(
    item.isEquipable === false ||
    item.is_equipable === false,
  );
}

function calculatePhotoQualityScore(photoQuality, semanticText = "") {
  const quality = normalizePhotoQuality(photoQuality);
  const total = calculatePhotoQualityTotal(quality);
  if (total > 0) return calculateAdjustedPhotoQualityScore(quality, semanticText);
  return inferFallbackQualityScore(semanticText);
}

function calculateAdjustedPhotoQualityScore(photoQuality, semanticText = "") {
  const quality = normalizePhotoQuality(photoQuality);
  let score = calculatePhotoQualityTotal(quality);
  const text = String(semanticText || "");
  const virtualPenalty = getVirtualImagePenalty(text, quality);
  if (virtualPenalty.noEffect) return 0;

  if (quality.clarity >= 3 && quality.subjectArea >= 2 && quality.realPhoto >= 3 && quality.focusLight >= 2 && quality.interesting >= 1) score += 1;
  if (quality.clarity >= 3 && quality.subjectArea >= 3 && quality.backgroundClean >= 2) score += 1;
  if (quality.interesting >= 2 && isPortableEquipmentText(text) && virtualPenalty.level === "none") score += 1;

  if (quality.clarity <= 1) score -= 2;
  if (quality.subjectArea <= 1) score -= 2;
  if (quality.subjectArea < 3) score -= 1;
  if (quality.backgroundClean <= 0) score -= 1;
  if (quality.backgroundClean < 2) score -= 1;
  if (quality.realPhoto <= 1) score -= 3;
  if (quality.interesting <= 0) score -= 2;
  if (quality.interesting <= 1 && !hasStrongEquipmentFantasyText(text)) score -= 1;
  if (hasCrowdedOrSmallSubjectText(text)) score -= 2;
  if (virtualPenalty.level === "ordinaryCap") score -= 3;
  if (/抽象|光斑|远景|纹理|风景|海岸|山|天空|道路|街道|森林|荒原|人物|人像|动物|猫|狗|abstract|bokeh|landscape|sky|road|street|forest|portrait|animal|cat|dog/i.test(text) && !isSmallEquipableNaturalText(text) && !isPortableEquipmentText(text)) score -= 3;

  return Math.max(0, Math.min(15, score));
}

function hasCrowdedOrSmallSubjectText(text) {
  return /物品很多|很多物品|多个物品|许多物品|很多东西|一堆|堆满|杂乱|凌乱|背景杂|背景乱|背景复杂|主体(?:较|偏)?小|主体不大|占比(?:较|偏)?小|占画面(?:较|偏)?小|周围有|旁边有|其中一|角落|边缘|远处|many objects|clutter|messy|small subject|busy background/i.test(String(text || ""));
}

function calculatePhotoQualityTotal(photoQuality) {
  const quality = normalizePhotoQuality(photoQuality);
  return Math.max(0, Math.min(15,
    quality.clarity +
    quality.subjectArea +
    quality.backgroundClean +
    quality.realPhoto +
    quality.focusLight +
    quality.interesting,
  ));
}

function inferFallbackQualityScore(text) {
  const source = String(text || "");
  const virtualPenalty = getVirtualImagePenalty(source, normalizePhotoQuality({}));
  if (virtualPenalty.noEffect) return 0;
  let score = 6;
  if (/(?:清晰|主体突出|占比大|近景|干净|明亮|有趣|动心|实拍|现实)/.test(source)) score += 4;
  if (/(?:模糊|杂乱|不清楚|遮挡|占比小|背景多|昏暗)/.test(source)) score -= 3;
  if (isPortableEquipmentText(source)) score += 2;
  if (virtualPenalty.level === "ordinaryCap") score = Math.min(score, 8);
  return Math.max(0, Math.min(15, score));
}

function allocateStatsForItem(rawStats, itemName, valueBudget, statAffinity = []) {
  const normalized = normalizeStats(rawStats, 20);
  if (calculateStatsValue(normalized) > 0 && areProvidedStatsSemanticallyConsistent(normalized, itemName)) {
    return normalized;
  }
  const keys = getPreferredStatKeys(itemName, statAffinity);
  const result = normalizeStats({}, 20);
  let remaining = Math.max(0, valueBudget);
  if (!keys.length || remaining <= 0) return result;

  const affinityCount = normalizeStatAffinity(statAffinity).length;
  const targetCount = remaining >= 15
    ? Math.min(3, Math.max(1, affinityCount || 2))
    : remaining >= 8
      ? Math.min(2, Math.max(1, affinityCount || 1))
      : 1;
  const chosen = keys
    .filter((key) => canSpendOnPhotoStat(key, itemName, remaining, valueBudget))
    .slice(0, targetCount);

  chosen.forEach((key) => {
    const weight = statValueWeights[key];
    if (remaining < weight) return;
    result[key] += 1;
    remaining -= weight;
  });

  const fillKeys = keys.filter((key) => canSpendOnPhotoStat(key, itemName, remaining, valueBudget));
  let safety = 0;
  while (remaining > 0 && safety < 80) {
    safety += 1;
    let spent = false;
    for (const key of fillKeys) {
      const weight = statValueWeights[key];
      if (remaining >= weight && result[key] < getPhotoStatSoftCap(key, itemName, valueBudget)) {
        result[key] += 1;
        remaining -= weight;
        spent = true;
      }
    }
    if (!spent) break;
  }

  if (calculateStatsValue(result) <= 0) {
    for (const key of getAffordableFallbackStatKeys(itemName, valueBudget)) {
      const weight = statValueWeights[key];
      if (remaining >= weight) {
        result[key] += 1;
        remaining -= weight;
        break;
      }
    }
  }

  if (remaining > 0 && shouldConvertRemainingBudgetToHp(itemName, keys, result, remaining)) {
    result.hp += remaining;
  }
  return result;
}

function areProvidedStatsSemanticallyConsistent(stats, text) {
  const normalized = normalizeStats(stats, 20);
  const activeKeys = statOrder.filter((key) => (normalized[key] || 0) > 0);
  if (!activeKeys.length) return false;
  return activeKeys.every((key) => hasSemanticForPhotoStat(key, text));
}

function canSpendOnPhotoStat(key, text, remainingBudget, totalBudget) {
  if (!statOrder.includes(key)) return false;
  if (remainingBudget < statValueWeights[key]) return false;
  if (getPhotoStatSoftCap(key, text, totalBudget) <= 0) return false;
  if (!hasSemanticForPhotoStat(key, text)) return false;
  return true;
}

function hasSemanticForPhotoStat(key, text) {
  switch (key) {
    case "hp": return hasHpSemanticText(text);
    case "attack": return hasAttackSemanticText(text);
    case "defense": return hasDefenseSemanticText(text);
    case "speed": return hasSpeedSemanticText(text);
    case "shield": return hasShieldSemanticText(text);
    case "lifesteal": return hasLifestealSemanticText(text);
    case "regen": return hasRegenSemanticText(text);
    default: return false;
  }
}

function getAffordableSemanticStatKeys(text, statAffinity, budget) {
  return getPreferredStatKeys(text, statAffinity)
    .filter((key) => canSpendOnPhotoStat(key, text, budget, budget));
}

function getAffordableFallbackStatKeys(text, budget) {
  const keys = [];
  const add = (key) => {
    if (!keys.includes(key) && canSpendOnPhotoStat(key, text, budget, budget)) keys.push(key);
  };
  if (hasStrongSpeedSemanticText(text)) add("speed");
  if (hasAttackSemanticText(text)) add("attack");
  if (hasDefenseSemanticText(text)) add("defense");
  if (hasShieldSemanticText(text)) add("shield");
  if (hasRegenSemanticText(text)) add("regen");
  if (hasHpSemanticText(text)) add("hp");
  if (hasLifestealSemanticText(text)) add("lifesteal");
  if (hasSpeedSemanticText(text)) add("speed");
  return keys;
}

function getPhotoStatSoftCap(key, text, valueBudget) {
  if (key === "hp") return /食|饭|面|糖|饼|肉|菜|果|香蕉|番茄|西红柿|药|茶|奶|水|饮|咖啡|汤|补给|能量|植物|花|叶|种子|food|fruit|banana|tomato|coffee|water|drink|plant|flower|seed/i.test(text) ? 99 : 6;
  if (key === "shield") {
    if (valueBudget >= 18) return 4;
    if (valueBudget >= 13) return 3;
    return 2;
  }
  if (valueBudget >= 18) return 4;
  if (valueBudget >= 13) return 2;
  return 1;
}

function shouldConvertRemainingBudgetToHp(text, preferredKeys, currentStats, remaining) {
  if (remaining <= 0) return false;
  const hpSemantic = hasStrongHpSemanticText(text);
  if (preferredKeys.includes("hp") && hpSemantic && (currentStats.hp > 0 || remaining >= statValueWeights.hp)) return true;
  if (hpSemantic) return true;
  return false;
}

function choosePhotoSpecialEffects(item, image, valueBudget) {
  const provided = item.ignoreDirectSpecialEffects
    ? []
    : normalizeSpecialEffects(item.specialEffects || item.effects || item.special || item.specialEffect)
      .filter((key) => isSpecialEffectSemanticallyAllowed(key, item))
      .filter((key) => isPhotoSpecialEffectEligible(key, valueBudget, item));
  if (item.skipSpecialRoll && provided.length) return provided.slice(0, 1);
  if (item.skipSpecialRoll) return [];
  const qualityKey = getItemQuality(valueBudget).key;
  if (qualityKey !== "epic" && qualityKey !== "legendary") return [];

  const seed = `${item.itemName || ""}:${item.description || ""}:${image ? image.slice(0, 96) : ""}:${item.value || ""}`;
  const semanticText = `${item.itemName || ""} ${item.objectType || ""} ${item.description || ""} ${item.reason || ""} ${normalizeStringList(item.tags).join(" ")}`;
  const directAffinity = normalizeSpecialEffects(item.specialAffinity || item.special_affinity || item.specialCandidates);
  const inferredAffinity = inferSemanticSpecialEffects(semanticText);
  const candidateKeys = [...new Set([...directAffinity, ...inferredAffinity])];
  if (!candidateKeys.length) return [];
  const eligible = [...new Set(candidateKeys)]
    .map((key) => photoSpecialEffectMap.get(key))
    .filter((effect) => effect && isSpecialEffectSemanticallyAllowed(effect.key, item) && isPhotoSpecialEffectEligible(effect.key, valueBudget, item));
  if (!eligible.length) return [];

  if (qualityKey === "epic") {
    const roll = hashIndex(`${seed}:special-roll`, 100);
    if (roll >= 33) return [];
  }

  const picked = eligible[hashIndex(`${seed}:special-pick`, eligible.length)];
  return picked ? [picked.key] : [];
}

function isPhotoSpecialEffectEligible(effectKey, valueBudget, item = {}) {
  const effect = photoSpecialEffectMap.get(effectKey);
  if (!effect || effect.value > valueBudget) return false;
  return true;
}

function isSpecialEffectSemanticallyAllowed(effectKey, item) {
  const text = `${item?.itemName || ""} ${item?.subjectName || ""} ${item?.objectType || ""} ${item?.description || ""} ${item?.reason || ""} ${normalizeStringList(item?.tags).join(" ")}`;
  return inferSemanticSpecialEffects(text).includes(effectKey);
}

function getPreferredStatKeys(text, statAffinity = []) {
  const preferred = normalizeStatAffinity(statAffinity).map((item) => item.stat);
  const inferred = inferPreferredStats(text);
  return [...new Set([...preferred, ...inferred])]
    .filter((key) => statOrder.includes(key));
}

function inferSemanticSpecialEffect(text) {
  return inferSemanticSpecialEffects(text)[0] || "";
}

function inferSemanticSpecialEffects(text) {
  const source = String(text || "");
  const effects = [];
  const add = (key) => {
    if (photoSpecialEffectMap.has(key) && !effects.includes(key)) effects.push(key);
  };

  if (/鞋|拖鞋|滑板|轮|风扇|扇|双|一对|速度|疾|飞|跑|旋转|气流|shoe|slipper|skateboard|wheel|fan|pair|speed|run|rotate|airflow/i.test(source)) add("doubleStrikeSpeedDown");
  if (/刀|剪|针|钩|指甲刀|锥|刃|锯|尖|夹|钳|knife|scissor|needle|hook|clipper|blade|sharp|pliers/i.test(source)) add("dealDamageAttack");
  if (/锤|棍|棒|砖|石|键盘|鼠标|扳手|螺丝刀|球拍|拍子|硬物|武器|hammer|club|brick|stone|keyboard|mouse|tool|wrench|screwdriver|racket|weapon/i.test(source)) {
    add("dealDamageAttack");
    add("killAttack");
  }
  if (/盾|锅盖|壳|盒|箱|套|盔|伞|镜|护|防|金属外壳|玻璃罩|甲|shield|lid|shell|box|case|helmet|umbrella|mirror|protect|guard|armor/i.test(source)) {
    add("shieldCrashAttackDown");
    add("takeDamageDefense");
    add("killShield");
  }
  if (/水|饮|咖啡|茶|奶|药|杯|瓶|清洁|净化|过滤|毛巾|纸巾|湿巾|充电|电池|补给|修复|water|drink|coffee|tea|milk|medicine|cup|bottle|clean|purify|filter|tissue|towel|battery|charger|repair/i.test(source)) {
    add("regenMultiplier");
  }
  if (/刀|剪|针|钩|指甲刀|锥|刃|锯|尖|夹|钳|吸附|抽取|红色|血|knife|scissor|needle|hook|clipper|blade|sharp|pliers|absorb|drain|red|blood/i.test(source)) {
    add("lifestealMultiplier");
  }
  if (/书|本|笔|尺|奖|证|牌|训练|练习|种子|植物|成长|学习|日记|笔记|book|pen|ruler|award|medal|train|practice|seed|plant|grow|study|note/i.test(source)) {
    add("killAttack");
    add("killDefense");
    add("killSpeed");
  }
  if (/食|饭|面|糖|饼|肉|菜|果|西红柿|番茄|香蕉|药|茶|奶|水|饮|咖啡|汤|杯|瓶|补给|能量|food|rice|bread|candy|meat|fruit|tomato|banana|medicine|tea|milk|water|drink|coffee|soup|cup|bottle|energy/i.test(source)) {
    add("killMaxHp");
    add("killHpBoost");
  }
  return effects;
}

function normalizeSpecialEffects(input) {
  const values = Array.isArray(input) ? input : input ? [input] : [];
  return [...new Set(values.map((value) => normalizeSpecialEffectKey(value)).filter((key) => photoSpecialEffectMap.has(key)))];
}

function normalizeSpecialEffectKey(value) {
  if (typeof value === "string") {
    if (photoSpecialEffectMap.has(value)) return value;
    const text = value.trim();
    const byLabel = photoSpecialEffects.find((effect) => effect.label === text || text.includes(effect.label));
    if (byLabel) return byLabel.key;
    if (/击杀.*(?:7|8).*攻/.test(text)) return "killAttack";
    if (/击杀.*(?:7|8).*防/.test(text)) return "killDefense";
    if (/击杀.*(?:2|4).*盾/.test(text)) return "killShield";
    if (/击杀.*(?:10|12).*速/.test(text)) return "killSpeed";
    if (/造成伤害.*攻|攻击.*最多(?:4|6|10)/.test(text)) return "dealDamageAttack";
    if (/受到伤害.*防|受击.*防|防御.*最多(?:4|5|8)/.test(text)) return "takeDamageDefense";
    if (/击杀.*生命上限/.test(text)) return "killMaxHp";
    if (/击杀.*生命|击杀.*回复|击杀.*回血/.test(text)) return "killHpBoost";
    if (/二连击|连击2|连击翻倍/.test(text)) return "doubleStrikeSpeedDown";
    if (/当前护盾|护盾.*0\.?5|护盾.*一半/.test(text)) return "shieldCrashAttackDown";
    if (/回复翻倍|回复.*2倍|双倍回复/.test(text)) return "regenMultiplier";
    if (/吸血翻倍|吸血.*2倍|双倍吸血/.test(text)) return "lifestealMultiplier";
  }
  if (value && typeof value === "object") {
    return normalizeSpecialEffectKey(value.key || value.type || value.name || value.label);
  }
  return "";
}

function normalizeSpecialState(rawState, effectKeys) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const result = {};
  for (const key of effectKeys) {
    const data = source[key] && typeof source[key] === "object" ? source[key] : {};
    result[key] = {
      kills: clampInt(data.kills, 0, 9999),
      bonus: clampInt(data.bonus, 0, 9999),
    };
  }
  return result;
}

function calculateSpecialEffectsValue(effectKeys) {
  return getSpecialEffectDefinitions(effectKeys)
    .reduce((total, effect) => total + effect.value, 0);
}

function getSpecialEffectDefinitions(effectKeys) {
  return normalizeSpecialEffects(effectKeys)
    .map((key) => photoSpecialEffectMap.get(key))
    .filter(Boolean);
}

function inferPreferredStats(name) {
  const text = String(name || "");
  if (/刺|尖刺|荆棘|倒刺|玻璃片|碎玻璃|铁丝网|cactus|thorn|spike|barb|broken glass|wire fence/i.test(text)) return ["attack", "defense", "lifesteal"];
  if (hasAirPurifierSemanticText(text)) return ["regen", "defense", "shield"];
  if (/咖啡|水|饮|药|汤|茶|奶|果汁|杯|瓶|喷雾|清洁|纸巾|毛巾|湿巾|coffee|water|drink|medicine|tea|milk|juice|cup|bottle|clean|tissue|towel/i.test(text)) return ["regen", "hp", "shield"];
  if (/番茄|西红柿|香蕉|饭|面|糖|饼|肉|菜|水果|食|能量|糖果|零食|植物|花|叶|种子|tomato|banana|rice|bread|candy|meat|vegetable|fruit|food|energy|snack|plant|flower|leaf|seed/i.test(text)) return ["hp", "regen", "shield"];
  if (/刀|剪|针|钉|锥|刃|指甲刀|钩|夹|钳|锯|尖锐|knife|scissor|needle|nail|blade|clipper|hook|pliers|saw|sharp/i.test(text)) return ["lifesteal", "attack", "speed"];
  if (/键盘|鼠标|锤|棍|棒|笔|扳手|螺丝刀|砖|石|球拍|拍子|遥控器|手机|相机|keyboard|mouse|hammer|club|pen|tool|wrench|screwdriver|brick|stone|racket|remote|phone|camera/i.test(text)) return ["attack", "defense", "shield"];
  if (/锅盖|镜|盾|伞|盔|盒|箱|包|壳|套|口罩|眼镜|锁|钥匙|防护|保护|容器|lid|mirror|shield|umbrella|helmet|box|case|bag|shell|mask|glasses|lock|key|protect|container/i.test(text)) return ["shield", "defense", "hp"];
  if (/鞋|拖鞋|滑板|风扇|轮|轻|羽|飞|跑|车模|陀螺|旋转|气流|线缆|充电器|电池|shoe|slipper|skateboard|fan|wheel|lightweight|feather|fly|run|toy car|spinning|airflow|cable|charger|battery/i.test(text)) return ["speed", "attack", "regen"];
  if (/书|本|笔记|book|notebook/i.test(text)) return ["regen", "defense", "hp"];
  if (/卡片|贴纸|图案|card|sticker|pattern/i.test(text)) return ["regen", "hp", "defense"];
  if (/玩具|模型|摆件|公仔|手办|青蛙|卡通|toy|model|figure|cartoon/i.test(text)) return ["hp", "defense", "attack"];
  if (isSmallEquipableNaturalText(text)) return ["hp", "regen", "defense"];
  return [];
}

async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件。");
  }
  if (file.size > uploadImageMaxBytes) {
    throw new Error("图片文件过大，请先截图或裁剪后再上传。");
  }

  if ("createImageBitmap" in window) {
    try {
      const bitmap = await loadBitmapWithTimeout(file);
      try {
        return resizeImageToDataUrl(bitmap, analysisImageMaxEdge, analysisImageQuality);
      } finally {
        bitmap.close?.();
      }
    } catch {
      // Some mobile browsers fail createImageBitmap for camera HEIC/JPEG variants; fall back to Image decoding.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    return resizeImageToDataUrl(image, analysisImageMaxEdge, analysisImageQuality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function makeInventoryImage(src) {
  const image = await loadImage(src);
  return resizeImageToDataUrl(image, inventoryImageMaxEdge, inventoryImageQuality);
}

function loadBitmapWithTimeout(file) {
  return Promise.race([
    createImageBitmap(file, { imageOrientation: "from-image" }),
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("图片解码超时，请重新拍摄或换一张图片。")), imageDecodeTimeoutMs);
    }),
  ]);
}

function resizeImageToDataUrl(image, maxEdge, quality) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) {
    throw new Error("图片尺寸读取失败，请重新拍摄或换一张图片。");
  }
  const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.drawImage(image, 0, 0, width, height);
  try {
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    throw new Error("图片压缩失败，请尝试截图后上传。");
  }
}

function makeVisionTestImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 220;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#245f9a";
  ctx.fillRect(26, 26, 308, 168);
  ctx.fillStyle = "#fffaf0";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText("照片勇者", 78, 92);
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("VISION OK", 86, 142);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      reject(new Error("图片解码超时，请重新拍摄或换一张图片。"));
    }, imageDecodeTimeoutMs);
    image.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(image);
    };
    image.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      reject(new Error("图片解码失败。"));
    };
    image.src = src;
  });
}

function render() {
  ensureEncounter();
  ensureInventorySlots();
  const stats = getPlayerStats();
  const defeated = isPlayerDefeated();
  const bossRewardPending = Boolean(state.bossReward);
  const selectedBossReward = getSelectedBossRewardOption();

  state.player.hp = Math.max(0, Math.min(state.player.hp, stats.maxHp));
  const form = getHeroForm();
  els.heroAvatarImage.src = getHeroFormImageUrl(form);
  els.heroAvatarImage.alt = `照片勇者${form.label}形态`;
  els.heroAvatarImage.closest(".hero-form-card")?.classList.toggle("is-hit", Boolean(state.heroHitEffectUntil));
  renderHeroForms();

  els.playerHpText.textContent = `${state.player.hp}/${stats.maxHp}`;
  els.playerHpBar.style.width = `${percent(state.player.hp, stats.maxHp)}%`;
  els.playerHpBar.parentElement.classList.toggle("is-low", percent(state.player.hp, stats.maxHp) <= 30);
  els.playerAtk.textContent = stats.atk;
  els.playerDef.textContent = stats.def;
  els.playerSpeed.textContent = stats.speed;
  els.playerRegen.textContent = stats.regen;
  els.playerLifesteal.textContent = stats.lifesteal;
  els.playerShield.textContent = `${state.player.shield}/${stats.shield}`;

  els.floorText.textContent = getFloorActionLabel(bossRewardPending);
  renderEnemyField();
  const actionRow = els.attackBtn.closest(".floor-action-row");
  actionRow?.classList.toggle("is-reward-choice", bossRewardPending);
  actionRow?.classList.toggle("is-clear", state.gameClear);
  actionRow?.classList.toggle("can-flee", canFleeCurrentFloor());
  els.equipmentGrid.classList.toggle("is-collapsed", state.gameClear);
  const canStartBattle = canStartSelectedBattle();
  els.attackBtn.hidden = false;
  els.attackBtn.textContent = state.gameClear
    ? "生涯总结"
    : bossRewardPending
      ? "选择"
      : canStartBattle
        ? "战斗"
        : "选择怪物";
  els.attackBtn.disabled = bossRewardPending
    ? defeated || !selectedBossReward
    : state.gameClear
      ? false
      : defeated || isBattleActionLocked() || Boolean(state.autoBattleTimer) || state.pendingFloorAdvance || Boolean(state.battleStartTimer) || !canStartBattle;
  els.attackBtn.setAttribute("aria-pressed", String(Boolean(state.autoBattleTimer)));
  els.attackBtn.setAttribute("aria-label", state.gameClear ? "查看生涯总结" : bossRewardPending ? "确认选择 Boss 奖励" : "开始战斗");
  els.battleSpeedBtn.hidden = bossRewardPending || state.gameClear;
  els.battleSpeedBtn.textContent = bossRewardPending ? "" : `×${getBattleSpeed()}`;
  els.battleSpeedBtn.setAttribute("aria-label", bossRewardPending ? "Boss 奖励选择阶段" : `切换战斗倍速，当前 ${getBattleSpeed()} 倍`);
  els.battleSpeedBtn.disabled = defeated || state.gameClear || bossRewardPending;
  els.fleeBtn.hidden = !canFleeCurrentFloor();
  els.fleeBtn.disabled = !canFleeCurrentFloor();
  els.fleeBtn.textContent = canRetreatCurrentBattle() ? "逃跑" : "绕过";
  els.fleeBtn.setAttribute("aria-label", canRetreatCurrentBattle() ? "退出本场战斗并恢复战前状态" : "绕过本层并进入下一层");

  renderApiStatus();
  renderCameraStatus();
  renderGlobalStatsPanel();
  renderEquipmentGrid();
  renderEquipmentDetail();
  renderGameTextOnly();
}

function getFloorActionLabel(bossRewardPending = Boolean(state.bossReward)) {
  if (state.gameClear) return "已通关";
  const floor = bossRewardPending && state.bossReward?.floor ? state.bossReward.floor : state.floor;
  if (bossRewardPending) return `第 ${floor} / ${maxFloor} 层 · 奖励`;
  return `第 ${floor} / ${maxFloor} 层${isBossFloor(floor) ? " · Boss" : isRewardBossFloor(floor) ? " · 奖励Boss" : ""}`;
}

function renderApiStatus() {
  const config = getConfigFromInputs();
  const missing = getMissingConfigFields(config);
  const activePreset = API_PRESETS[config.presetId] || API_PRESETS.custom;
  let stateName = "ready";
  let title = "API 配置完整";

  if (missing.length) {
    stateName = "missing";
    title = "API 未配置";
  } else if (activePreset.supportsVision === false || !isLikelyVisionModel(config)) {
    stateName = "text-only";
    title = "当前模型可能不支持图片输入";
  }

  if (els.apiStatusBadge) {
    els.apiStatusBadge.textContent = stateName === "ready" ? "API 已配置" : stateName === "missing" ? "API 未配置" : "仅文本测试";
    els.apiStatusBadge.dataset.state = stateName;
  }
  if (els.configToggleBtn) {
    els.configToggleBtn.dataset.state = stateName;
    els.configToggleBtn.title = title;
    els.configToggleBtn.setAttribute("aria-label", title);
  }
}

function renderCameraStatus() {
  els.filmCountBadge.textContent = `胶卷 ${formatFilmCount()}`;
}

function renderEnemyField() {
  els.enemyField.innerHTML = "";
  const enemyDamageEstimates = getEnemyDamageEstimates();
  const shouldFlipIn = state.enemyFlipEncounterId === state.encounterId && !state.currentBattle && !state.autoBattleTimer;

  if (state.bossReward) {
    renderBossRewardCards();
    return;
  }

  if (state.gameClear) {
    return;
  }

  state.enemies.forEach((enemy, index) => {
    const isDefeated = enemy.hp <= 0;
    const isLocked = Boolean(state.autoBattleTimer) || Boolean(state.currentBattle) || state.pendingFloorAdvance || Boolean(state.battleStartTimer) || isDefeated;
    const selectionOrder = getEnemySelectionOrder(enemy.id);
    const isSelected = selectionOrder > 0;
    const isFaceDown = state.enemyFaceDownIds.has(enemy.id);
    const isFlippingDown = state.enemyFlipDownIds.has(enemy.id);
    const estimate = enemyDamageEstimates.get(enemy.id) || makeUnknownEstimate();
    const button = document.createElement("button");
    const isHit = Boolean(state.enemyHitEffectUntilById[enemy.id]) && !isFlippingDown && !isFaceDown;
    const isSingleBossCard = isBossRewardFloor(state.floor) && state.enemies.length === 1;
    button.className = `enemy-card enemy-select-card${isSingleBossCard ? " is-single-boss" : ""}${isSelected ? " is-selected" : ""}${state.activeEnemyIds?.includes(enemy.id) ? " is-active" : ""}${isLocked ? " is-locked" : ""}${isDefeated ? " is-defeated" : ""}${shouldFlipIn ? " is-entering" : ""}${isFaceDown ? " is-face-down" : ""}${isFlippingDown ? " is-flipping-down" : ""}${isHit ? " is-hit" : ""}`;
    button.type = "button";
    if (shouldFlipIn) {
      button.style.setProperty("--flip-delay", `${Math.min(2, index) * 80}ms`);
      button.addEventListener("animationend", () => button.classList.remove("is-entering"), { once: true });
    }
    if (isFlippingDown) {
      button.addEventListener("animationend", () => finishEnemyFlipDown(enemy.id), { once: true });
      window.setTimeout(() => finishEnemyFlipDown(enemy.id), 340);
    }
    button.setAttribute("aria-disabled", String(isLocked));
    button.addEventListener("click", () => {
      if (isLocked) return;
      toggleEnemySelection(enemy.id);
      saveGame();
      render();
    });

    const traitText = enemy.traits?.map((trait) => trait.text).filter(Boolean).join(" / ") || "";
    const imageUrl = getMonsterImageUrl(enemy.typeKey);
    const dropText = formatEnemyFilmDrop(enemy);
    button.innerHTML = `
      ${selectionOrder ? `<span class="selection-badge">${selectionOrder}</span>` : ""}
      <div class="enemy-card-head">
        <div class="monster-portrait">
          <img src="${imageUrl}" alt="${escapeHtml(enemy.typeName)}">
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(enemy.name)}</strong>
          <span>${escapeHtml(traitText)}</span>
        </div>
      </div>
      <dl class="enemy-card-stats">
        <div><dt>攻</dt><dd>${enemy.atk}</dd></div>
        <div><dt>防</dt><dd>${enemy.def}</dd></div>
        <div><dt>速</dt><dd>${enemy.speed}</dd></div>
      </dl>
      <div class="enemy-card-result">
        <span>${dropText}</span>
        <strong class="estimate-${estimate.state}">${escapeHtml(estimate.text)}</strong>
      </div>
      <div class="enemy-hp-line">
        <span>${enemy.hp}/${enemy.maxHp}</span>
        <div class="hp-track danger"><span style="width:${percent(enemy.hp, enemy.maxHp)}%"></span></div>
      </div>
      <div class="enemy-card-back" aria-hidden="true">
        <span>${isDefeated ? "已击破" : "未参战"}</span>
      </div>
    `;
    els.enemyField.append(button);
  });
  if (shouldFlipIn) state.enemyFlipEncounterId = "";
}

function renderBossRewardCards() {
  const options = Array.isArray(state.bossReward?.options) ? state.bossReward.options : [];
  const selectedIndex = getSelectedBossRewardIndex();
  const title = document.createElement("div");
  title.className = "boss-reward-prompt";
  title.textContent = selectedIndex >= 0 ? "Boss 奖励 · 点击选择按钮确认" : "Boss 奖励 · 三选一";
  els.enemyField.append(title);
  options.forEach((option, index) => {
    const button = document.createElement("button");
    const selected = index === selectedIndex;
    button.className = `enemy-card reward-card${selected ? " is-selected" : ""}`;
    button.type = "button";
    button.setAttribute("aria-pressed", String(selected));
    button.addEventListener("click", () => selectBossReward(index));
    const icon = option.icon || getBossRewardIcon(option.type);
    const footHtml = selected
      ? `<div class="reward-card-foot">
        <span>已选</span>
        <strong>待确认</strong>
      </div>`
      : "";
    button.innerHTML = `
      <div class="reward-card-main">
        <div class="monster-portrait reward-portrait">
          <img src="${rewardIconBase}${escapeHtml(icon)}" alt="" aria-hidden="true">
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(option.title || "奖励")}</strong>
          <span>${escapeHtml(option.desc || "选择后进入下一层。")}</span>
        </div>
      </div>
      ${footHtml}
    `;
    els.enemyField.append(button);
  });
}

function getSelectedBossRewardIndex() {
  if (!state.bossReward) return -1;
  const index = clampInt(state.bossReward.selectedIndex, -1, 2);
  return state.bossReward.options?.[index] ? index : -1;
}

function getSelectedBossRewardOption() {
  const index = getSelectedBossRewardIndex();
  return index >= 0 ? state.bossReward?.options?.[index] || null : null;
}

function getBossRewardIcon(type) {
  const icons = {
    filmDrop: "boss-film-drop.png",
    filmFlat: "boss-value-min.png",
    filmPercent: "boss-film-percent.png",
    valueMin: "boss-value-min-boost.png",
    valueMax: "boss-value-max.png",
  };
  return icons[type] || icons.filmDrop;
}

function getEnemyDamageEstimates() {
  const estimates = new Map();
  if (isPlayerDefeated()) return estimates;
  if (state.currentBattle?.damageEstimates) {
    for (const [id, estimate] of Object.entries(state.currentBattle.damageEstimates)) {
      estimates.set(id, estimate);
    }
    for (const enemy of state.enemies.filter((item) => item.hp > 0)) {
      if (!estimates.has(enemy.id)) estimates.set(enemy.id, makeUnknownEstimate());
    }
    return estimates;
  }

  const aliveEnemies = state.enemies.filter((enemy) => enemy.hp > 0);
  const selectedIds = state.selectedEnemyIds.filter((id) => aliveEnemies.some((enemy) => enemy.id === id));
  if (selectedIds.length) {
    for (const [id, estimate] of simulateDamageEstimateForIds(selectedIds)) {
      estimates.set(id, estimate);
    }
  }

  for (const enemy of aliveEnemies) {
    if (estimates.has(enemy.id)) continue;
    const singleEstimate = simulateDamageEstimateForIds([enemy.id]).get(enemy.id);
    if (singleEstimate) estimates.set(enemy.id, singleEstimate);
  }

  return estimates;
}

function simulateDamageEstimateForIds(enemyIds, options = {}) {
  if (!options.ignoreFrozen && state.currentBattle?.damageEstimates) {
    const frozen = new Map(Object.entries(state.currentBattle.damageEstimates));
    return new Map(enemyIds.map((id) => [id, frozen.get(id) || makeUnknownEstimate()]));
  }
  const estimates = new Map();
  const enemies = enemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean)
    .map(cloneEnemyForSimulation);
  if (!enemies.length) return estimates;

  const actualStartHp = state.player.hp;
  const theoreticalBuffer = 10000;
  const startHp = actualStartHp + theoreticalBuffer;
  const sim = createBattleSimulation(enemies);
  sim.hp = startHp;
  sim.actualHp = actualStartHp;
  sim.initialHp = startHp;
  sim.actualStartHp = actualStartHp;
  sim.theoreticalBuffer = theoreticalBuffer;
  applySimPreBattleFormEffects(sim, enemies);
  const roundLimit = getBattleRoundLimit(enemies.length);

  for (const defeatedId of enemies
    .filter((enemy) => !sim.activeIds.includes(enemy.id) || enemy.hp <= 0)
    .map((enemy) => enemy.id)) {
    estimates.set(defeatedId, formatHpLossEstimate(sim.initialHp - sim.hp, sim.actualStartHp));
  }

  while (!sim.actualDead && sim.hp > 0 && sim.activeIds.length) {
    if (sim.round >= roundLimit) {
      for (const id of sim.activeIds) {
        estimates.set(id, makeUnresolvedEstimate("round-limit", enemies.find((enemy) => enemy.id === id), enemies));
      }
      break;
    }
    const nextEnemyId = getNextSimEnemyId(sim);
    const enemyTime = nextEnemyId ? sim.enemyTimes.get(nextEnemyId) : Infinity;
    const currentStats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
    currentStats.realMaxHp = getSimActualMaxHp(currentStats, sim);
    currentStats.maxHp += getSimMaxHpBonus(sim);
    if (sim.heroTime === Infinity && (!nextEnemyId || enemyTime === Infinity)) {
      for (const id of sim.activeIds) {
        estimates.set(id, makeUnresolvedEstimate("speed", enemies.find((enemy) => enemy.id === id), enemies));
      }
      break;
    }

    if (!nextEnemyId || sim.heroTime <= enemyTime + Number.EPSILON) {
      const defeatedIds = simulateHeroStrike(sim, enemies, currentStats);
      for (const id of defeatedIds) {
        estimates.set(id, formatHpLossEstimate(sim.initialHp - sim.hp, sim.actualStartHp));
      }
      sim.heroTime += getActionInterval(currentStats.speed);
      sim.round += 1;
    } else {
      const enemy = enemies.find((item) => item.id === nextEnemyId);
      const enemyActionTime = enemyTime;
      if (enemy) simulateMonsterStrike(sim, enemy, enemies, currentStats);
      if (sim.actualDead) {
        for (const id of sim.activeIds) {
          estimates.set(id, makeUnresolvedEstimate("death", enemies.find((item) => item.id === id), enemies));
        }
        break;
      }
      sim.enemyTimes.set(nextEnemyId, enemyTime + getActionInterval(enemy?.speed || 0));
      if (enemy && hasTrait(enemy, "speedDownOnAttack")) {
        sim.heroTime = enemyActionTime + getActionInterval(getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial).speed);
      }
      sim.round += 1;
    }
  }

  for (const id of enemyIds) {
    if (!estimates.has(id)) {
      estimates.set(id, makeUnresolvedEstimate("unresolved", enemies.find((enemy) => enemy.id === id), enemies));
    }
  }
  return estimates;
}

function formatHpLossEstimate(loss, actualStartHp) {
  const value = Math.trunc(loss);
  const text = value < 0 ? `损失 +${Math.abs(value)}` : `损失 -${value}`;
  return {
    text,
    state: value >= actualStartHp ? "danger" : "safe",
  };
}

function makeUnknownEstimate() {
  return makeUnresolvedEstimate("unresolved");
}

function makeUnresolvedEstimate(reason = "unresolved", enemy = null, enemies = []) {
  const labels = {
    noDamage: "破防不足",
    speed: "速度不足",
    roundLimit: "回合不够",
    death: "会倒下",
    unresolved: "难以战胜",
  };
  const resolvedReason = reason === "round-limit" ? inferRoundLimitReason(enemy, enemies) : reason;
  return {
    text: labels[resolvedReason] || labels.unresolved,
    state: resolvedReason === "death" ? "danger" : "unknown",
  };
}

function inferRoundLimitReason(enemy, enemies = []) {
  const activeEnemies = Array.isArray(enemies) && enemies.length ? enemies : enemy ? [enemy] : [];
  const stats = getBattleStatsForEnemiesWithSpecial(activeEnemies, createDefaultBattleSpecial());
  if (getActionInterval(stats.speed) === Infinity) return "speed";
  if (enemy && getEstimatedHeroDamageToEnemy(enemy, stats) <= 0) return "noDamage";
  return "roundLimit";
}

function getEstimatedHeroDamageToEnemy(enemy, stats) {
  if (!enemy || !stats) return 0;
  const rawDamage = Math.max(0, stats.atk - enemy.def);
  const shieldCrashDamage = getShieldCrashDamage();
  let damage = rawDamage + shieldCrashDamage;
  if (hasTrait(enemy, "sturdy")) damage = Math.min(damage, 1);
  damage = applyEnemyIncomingDamageModifiers(enemy, damage, state.enemies);
  return Math.max(0, damage);
}

function getMonsterImageUrl(typeKey) {
  return `${monsterImageBase}${monsterImages[typeKey] || monsterImages.slime}`;
}

function getEnemyMaxShield(enemy) {
  return Math.max(enemy?.shield || 0, getTraitValue(enemy, "shield", 0));
}

function renderEquipmentGrid() {
  ensureInventorySlots();
  const locked = isEquipmentLocked();
  const selectionLocked = isEquipmentSelectionLocked();
  const selectedSlotIndex = getSelectedSlotIndex();

  els.equipmentGrid.innerHTML = "";
  for (let i = 0; i < equipmentVisibleSlots; i += 1) {
    const item = state.inventory[i];
    const button = document.createElement("button");
    const isSelected = i === selectedSlotIndex;
    const qualityKey = item ? getItemQualityKey(item) : "empty";
    button.className = `equipment-slot quality-${qualityKey}${item ? " has-item" : ""}${isSelected ? " is-selected" : ""}${selectionLocked ? " is-locked" : ""}`;
    button.type = "button";
    button.disabled = selectionLocked;
    button.setAttribute("aria-label", item ? `选择${item.itemName}` : `选择空装备格${i + 1}`);
    button.addEventListener("click", () => {
      if (selectionLocked) return;
      const wasSelected = i === getSelectedSlotIndex();
      const wasItemMode = state.infoMode === "item";
      const isRepeatClick = wasSelected && wasItemMode;
      state.selectedSlotIndex = i;
      state.selectedItemId = item?.id || "";
      state.lootError = "";
      state.infoMode = "item";
      if (!item) {
        state.lastPhoto = "";
        state.pendingPhotoSlotIndex = i;
      } else if (isRepeatClick && item.image) {
        openImageViewer(item.image, formatItemDisplayName(item), getItemQuality(scoreItem(item)));
      }
      saveGame();
      render();
    });

    if (item) {
      const quality = getItemQuality(scoreItem(item));
      button.innerHTML = `
        <span class="slot-image"><img src="${item.image || makePlaceholderImage()}" alt=""></span>
        <span class="slot-name" data-quality="${quality.key}">${escapeHtml(formatItemDisplayName(item))}</span>
      `;
    } else {
      button.innerHTML = `<span class="empty-slot">${getCameraIconMarkup()}</span>`;
    }

    els.equipmentGrid.append(button);
  }
}

function renderEquipmentDetail() {
  ensureInventorySlots();
  const selected = getSelectedInventoryItem();
  const locked = isEquipmentLocked();
  const analyzing = isAnalyzingPhoto();
  const showingItem = state.infoMode === "item";

  els.equipmentActions.hidden = true;
  els.photoActionBtn.hidden = true;
  els.photoActionBtn.disabled = true;
  els.analyzePhotoBtn.hidden = true;
  els.analyzePhotoBtn.disabled = true;
  els.analyzePhotoBtn.textContent = "鉴定";
  els.analyzePhotoBtn.classList.remove("is-cancel");
  els.analyzePhotoBtn.onclick = null;
  els.discardItemBtn.disabled = true;
  els.discardItemBtn.hidden = true;
  els.battleLog.hidden = true;
  els.equipmentDetailDesc.hidden = false;
  els.filmCountBadge.hidden = true;
  els.pendingPhotoPreview.hidden = true;
  els.pendingPhotoImage.removeAttribute("src");
  els.loadingState.hidden = false;
  els.equipmentDetail.classList.remove("is-error", "is-actionable", "is-log");
  clearEquipmentDetailQuality();
  els.equipmentDetailStats.hidden = false;

  if (isCareerSummaryOpen()) {
    renderCareerSummaryPanel();
    return;
  }

  if (state.lootError && !state.lastPhoto) {
    const canRetake = showingItem && !selected && !locked && state.filmRolls >= 1;
    els.equipmentDetail.classList.add("is-error");
    els.equipmentDetailName.textContent = "鉴定失败";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = `${formatLootErrorMessage(state.lootError)}\n已放弃本次照片，胶卷未消耗。可以重新拍照或继续战斗。\n${getLootErrorHint(state.lootError)}`;
    if (canRetake) {
      els.equipmentActions.hidden = false;
      els.photoActionBtn.hidden = false;
      els.photoActionBtn.disabled = false;
    }
    return;
  }

  if (state.lastPhoto && showingItem) {
    if (state.lootError) els.equipmentDetail.classList.add("is-error");
    const apiHint = getPhotoApiConfigHint();
    els.equipmentDetailName.textContent = "待鉴定照片";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = analyzing
      ? "正在鉴定照片。若接口长时间无响应，可以取消后重新拍摄更清晰、主体更明确的照片。"
      : state.lootError
      ? `${state.lootError} 可以重新鉴定。`
      : apiHint
      ? apiHint
      : state.filmRolls >= 1
        ? "确认后鉴定并装入当前装备格。"
        : "胶卷不足，先击败怪物获得资源。";
    els.equipmentActions.hidden = false;
    els.analyzePhotoBtn.hidden = false;
    els.analyzePhotoBtn.textContent = analyzing ? "取消鉴定" : "鉴定";
    els.analyzePhotoBtn.setAttribute("aria-label", analyzing ? "取消鉴定" : "鉴定照片");
    els.analyzePhotoBtn.classList.toggle("is-cancel", analyzing);
    els.analyzePhotoBtn.disabled = analyzing ? false : locked || Boolean(els.loadingState.textContent) || state.filmRolls < 1 || Boolean(apiHint);
    if (!analyzing) {
      els.discardItemBtn.hidden = false;
      els.discardItemBtn.disabled = false;
      els.discardItemBtn.classList.remove("danger-button");
      els.discardItemBtn.textContent = "放弃照片";
      els.discardItemBtn.setAttribute("aria-label", "放弃待鉴定照片");
    }
    els.pendingPhotoPreview.hidden = false;
    els.pendingPhotoImage.src = state.lastPhoto;
    return;
  }

  if (!showingItem) {
    els.equipmentDetail.classList.add("is-log");
    els.equipmentDetailName.textContent = "";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.hidden = true;
    els.battleLog.hidden = false;
    els.filmCountBadge.hidden = true;
    renderLog();
    return;
  }

  if (!selected) {
    const apiHint = getPhotoApiConfigHint();
    els.equipmentDetailName.textContent = "空装备格";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = locked
      ? isPlayerDefeated()
        ? "照片勇者已经倒下，只能重开。"
        : state.bossReward
          ? "先选择 Boss 奖励。"
          : "战斗中不能拍照鉴定。"
      : apiHint
        ? apiHint
      : state.filmRolls >= 1
        ? "拍一件现实小物，让它变成照片装备。"
        : "胶卷不足，先击败怪物获得资源。";
    els.filmCountBadge.hidden = false;
    els.equipmentActions.hidden = false;
    els.photoActionBtn.hidden = false;
    els.photoActionBtn.disabled = locked || state.filmRolls < 1;
    return;
  }

  const quality = getItemQuality(scoreItem(selected));
  setEquipmentDetailQuality(quality);
  els.equipmentDetailName.textContent = formatItemDisplayName(selected);
  els.equipmentDetailName.dataset.quality = quality.label;
  els.equipmentDetailStats.innerHTML = renderItemDetailPills(selected);
  els.equipmentDetailStats.hidden = false;
  els.equipmentDetailDesc.textContent = renderItemDescription(selected);
  els.equipmentActions.hidden = false;
  els.discardItemBtn.hidden = false;
  els.discardItemBtn.disabled = locked;
  els.discardItemBtn.classList.add("danger-button");
  const refund = getDismantleFilmReturn(selected);
  els.discardItemBtn.textContent = `分解 +${formatFilmAmount(refund)}`;
  els.discardItemBtn.setAttribute("aria-label", "分解装备");
}

function clearEquipmentDetailQuality() {
  delete els.equipmentDetail.dataset.quality;
  delete els.equipmentDetailName.dataset.quality;
}

function setEquipmentDetailQuality(quality) {
  const safe = quality && quality.key ? quality : getItemQuality(0);
  els.equipmentDetail.dataset.quality = safe.key;
}

function renderCareerSummaryPanel() {
  const summary = state.careerSummary || buildLocalCareerSummary();
  const snapshot = summary.snapshot || buildCareerSnapshot();
  els.equipmentDetail.classList.add("is-actionable", "career-summary-panel");
  els.equipmentDetailName.textContent = summary.status === "loading" ? "正在生成生涯总结" : "照片勇者生涯总结";
  els.equipmentDetailStats.innerHTML = [
    `<span>怪物 ${snapshot.killCount}</span>`,
    `<span>Boss ${snapshot.bossKillCount}</span>`,
    `<span>装备 ${snapshot.equipmentCount}</span>`,
    `<span>${escapeHtml(snapshot.formLabel)}</span>`,
  ].join("");
  els.equipmentDetailStats.hidden = false;
  els.equipmentDetailDesc.innerHTML = renderCareerSummaryCard(summary, snapshot);
  els.equipmentActions.hidden = false;
  els.photoActionBtn.hidden = false;
  els.photoActionBtn.disabled = Boolean(state.careerSummaryRequest);
  els.photoActionBtn.textContent = state.careerSummaryRequest ? "生成中" : "重新生成";
  els.photoActionBtn.setAttribute("aria-label", "重新生成生涯总结");
  els.analyzePhotoBtn.hidden = false;
  els.analyzePhotoBtn.disabled = Boolean(state.careerSummaryRequest);
  els.analyzePhotoBtn.textContent = "保存图片";
  els.analyzePhotoBtn.setAttribute("aria-label", "保存通关分享图片");
  els.discardItemBtn.hidden = true;
  els.battleLog.hidden = true;
  els.filmCountBadge.hidden = true;
}

function renderCareerSummaryCard(summary, snapshot) {
  const statusText = getCareerSummaryStatusText(summary);
  const topItems = snapshot.topItems.length
    ? snapshot.topItems.slice(0, 4).map((item) => `<li><span>${escapeHtml(item.quality)} · ${escapeHtml(item.name)}</span><b>${item.score}</b></li>`).join("")
    : "<li>没有照片装备记录</li>";
  const paragraphs = String(summary.text || "")
    .split(/\n{1,}/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  const note = summary.note ? `<small>${escapeHtml(summary.note)}</small>` : "";
  return `
    <section class="career-card" aria-label="通关分享卡">
      <div class="career-card-head">
        <span>${escapeHtml(statusText)}</span>
        <strong>照片勇者通关纪念</strong>
        <em>${escapeHtml(snapshot.formLabel)} · 剩余胶卷 ${escapeHtml(snapshot.film)}</em>
      </div>
      <div class="career-card-stats">
        <span>怪物 ${snapshot.killCount}</span>
        <span>Boss ${snapshot.bossKillCount}</span>
        <span>装备 ${snapshot.equipmentCount}</span>
      </div>
      <div class="career-card-ability">${escapeHtml(formatCareerAbilityLine(snapshot))}</div>
      <div class="career-card-body">${paragraphs || "<p>照片勇者登上塔顶，留下了一段由现实物品拼出的冒险。</p>"}</div>
      <h4>代表装备</h4>
      <ul class="career-card-items">${topItems}</ul>
      ${note}
    </section>
  `;
}

function getCareerSummaryStatusText(summary) {
  return summary?.status === "ai"
    ? "AI 生涯总结"
    : summary?.status === "loading"
      ? "正在请大模型润色"
      : summary?.status === "error"
        ? "本地总结 · 模型生成失败"
        : "本地生涯总结";
}

function formatCareerAbilityLine(snapshot) {
  return `生命${snapshot.stats.maxHp} / 攻击${snapshot.stats.atk} / 防御${snapshot.stats.def} / 速度${snapshot.stats.speed} / 护盾${snapshot.stats.shield} / 回复${snapshot.stats.regen} / 吸血${snapshot.stats.lifesteal}`;
}

function getCameraIconMarkup() {
  return `
    <svg class="camera-empty-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 8h4l1.6-2h4.8L16 8h4v11H4V8Z"></path>
      <circle cx="12" cy="13.5" r="3.2"></circle>
    </svg>
  `;
}

function renderHeroForms() {
  els.formGrid.innerHTML = "";
  const currentForm = getHeroForm();
  document.querySelectorAll("[data-form-label]").forEach((node) => {
    node.textContent = getHeroFormDisplayName(currentForm);
  });

  for (const form of heroForms) {
    const level = getHeroFormLevel(form);
    const progressText = getHeroFormProgressText(form);
    const effectLines = getHeroFormEffectLines(form, level);
    const button = document.createElement("button");
    button.className = "form-card";
    button.type = "button";
    button.dataset.formId = form.id;
    const hpLoss = (getHeroFormLevelConfig(currentForm).stats?.hp || 0) - (getHeroFormLevelConfig(form).stats?.hp || 0);
    const locked = isEquipmentLocked() || (hpLoss > 0 && state.player.hp <= hpLoss);
    button.disabled = locked;
    button.setAttribute("aria-pressed", String(form.id === currentForm.id));
    if (form.id === currentForm.id) button.classList.add("is-active");
    if (locked) button.classList.add("is-locked");

    const img = document.createElement("img");
    img.src = getHeroFormImageUrl(form);
    img.alt = `${form.label}形态`;

    const meta = document.createElement("div");
    meta.className = "form-card-meta";
    meta.innerHTML = `
      <span class="form-title-line">
        <strong>${escapeHtml(getHeroFormDisplayName(form))}</strong>
      </span>
      <small>${escapeHtml(progressText)}</small>
    `;

    const copy = document.createElement("div");
    copy.className = "form-copy";
    copy.innerHTML = effectLines.map((line) => `<i>${escapeHtml(line)}</i>`).join("");

    button.append(img, meta, copy);
    button.addEventListener("click", () => setHeroForm(form.id));
    els.formGrid.append(button);
  }
}

function getLootErrorHint(message) {
  const text = String(message || "");
  if (text.includes("image_url") || text.includes("图片输入") || text.includes("没有识别图片内容")) {
    return "当前模型可能不支持图片输入，或中转站没有把图片转发给模型。";
  }
  if (text.includes("浏览器直连") || text.toLowerCase().includes("cors")) {
    return "浏览器直连失败时，需要换支持 CORS 的接口，或后续加本地/云端代理。";
  }
  if (text.includes("响应结构")) {
    return "接口返回结构不标准，请把错误里的响应结构发给开发者适配。";
  }
  if (text.includes("JSON") || text.includes("游戏约束") || text.includes("格式")) {
    return "可以重试；如果经常出现，换一个更听指令的图文模型。";
  }
  if (text.includes("已取消鉴定")) {
    return "本次照片已经放弃，可以重新拍照。";
  }
  if (text.includes("超时") || text.includes("没有响应")) {
    return "可能是接口拥堵、图片过大、模型卡住或中转站无响应；建议重试，或换一张主体更清楚、背景更简单的照片。";
  }
  return "模型已返回内容，但格式不符合游戏约束；可以换模型或重试一张更清晰的现实物品照片。";
}

function formatLootErrorMessage(message) {
  const text = String(message || "").trim();
  if (!text) return "模型这次没有给出可用结果。";
  const cleaned = text
    .replace(/^鉴定失败[:：]\s*/, "")
    .replace(/（?胶卷未消耗）?/g, "")
    .trim();
  if (cleaned.includes("没有按 JSON 格式") || cleaned.includes("没有按游戏要求返回 JSON")) {
    return "模型没有按游戏要求返回 JSON。";
  }
  if (cleaned.includes("模型返回了文本")) {
    return "模型返回内容不符合游戏约束。";
  }
  return shortenText(cleaned, 56);
}

function renderStatPills(stats) {
  const pills = Object.entries(statLabels)
    .filter(([key]) => stats[key])
    .map(([key, label]) => `<span>${label} ${formatItemStatValue(key, stats[key] || 0)}</span>`);
  return pills.length ? pills.join("") : "<span>无属性</span>";
}

function formatItemStatValue(key, value) {
  if (key === "hp" && value > 0) return `+${value}`;
  return formatSignedNumber(value);
}

function formatSignedNumber(value) {
  const numeric = Number(value) || 0;
  return numeric > 0 ? `+${numeric}` : String(numeric);
}

function renderItemDetailPills(item) {
  const effectHtml = renderSpecialEffectPills(item);
  if (effectHtml && calculateStatsValue(item.stats || {}) <= 0) return effectHtml;
  const statHtml = renderStatPills(item.stats);
  if (effectHtml) return `${statHtml}${effectHtml}`;
  return statHtml;
}

function renderItemDescription(item) {
  if (!item) return "";
  return improveItemDescription(item);
}

function improveItemDescription(item) {
  const original = cleanText(item?.description, "", 88);
  if (original && !isGenericItemDescription(original) && isItemDescriptionConsistent(item, original)) return original;
  return makeSettledItemDescription(item);
}

function makeSettledItemDescription(item) {
  const name = formatItemDisplayName(item);
  const stats = item?.stats || {};
  const effects = getItemSpecialKeys(item || {});
  if (effects.includes("doubleStrikeSpeedDown")) return `${name}让动作变重，却能把每次进攻拆成更密的连击。`;
  if (effects.includes("shieldCrashAttackDown")) return `${name}把护盾压到锋线上，出手时顺带撞出一段额外伤害。`;
  if (effects.includes("dealDamageAttack")) return `${name}越打越顺手，命中后会临时磨出更高攻击。`;
  if (effects.includes("takeDamageDefense")) return `${name}挨打后更稳，战斗中会临时堆起防御。`;
  if (effects.includes("killMaxHp")) return `${name}会把击败的余温存进生命上限。`;
  if (effects.includes("killHpBoost")) return `${name}适合边打边补，每次击败怪物都会回复生命。`;
  if (stats.attack > 0 && stats.lifesteal > 0) return `${name}又利又贪，既能破开敌人，也能从进攻里追回生命。`;
  if (stats.attack > 0 && stats.speed > 0) return `${name}拿在手里很顺，出手更快，也更容易打出伤害。`;
  if (stats.defense > 0 && stats.shield > 0) return `${name}像一块临时护板，先挡住冲击，再稳住防线。`;
  if (stats.hp > 0 && stats.regen > 0) return `${name}带着补给感，会让上限更厚，也让挨打后更容易缓过来。`;
  if (stats.speed > 0) return `${name}带着风和惯性，适合抢在怪物前面行动。`;
  if (stats.attack > 0) return `${name}有明显的施力感，适合把照片里的棱角变成攻击。`;
  if (stats.defense > 0) return `${name}结实可靠，可以把一部分伤害硬接下来。`;
  if (stats.shield > 0) return `${name}像临时举起的遮挡物，每场战斗开始时先撑起护盾。`;
  if (stats.lifesteal > 0) return `${name}带一点尖锐的掠夺感，进攻时能吸回生命。`;
  if (stats.regen > 0) return `${name}有补能和修复的味道，被打后能慢慢把生命拉回来。`;
  if (stats.hp > 0) return `${name}让勇者更耐打，也会把生命上限撑得更高。`;
  if (item?.tooLarge) return "主体太大，照片只能留下回忆，不能塞进装备格。";
  return `${name}被收进装备格，等待下一次战斗证明它的用处。`;
}

function isGenericItemDescription(text) {
  return /^(由照片鉴定出的装备|测试用拍照特殊装备|按模型文字保守鉴定|主体过大或主要是场景|装备|物品)/.test(String(text || "").trim());
}

function isItemDescriptionConsistent(item, description) {
  if (!item || item.tooLarge) return true;
  const text = String(description || "");
  const stats = item.stats || {};
  const effects = getItemSpecialKeys(item);
  if (isSharpToolSemanticText(`${item.itemName || ""} ${item.subjectName || ""} ${item.objectType || ""}`)) {
    const onlyRecoveryClaim = /回复|恢复|回血|修复|补能|再生|regen/i.test(text)
      && !/攻击|伤害|打击|破防|锋利|进攻|输出|攻势|吸血|吸取|夺取|追回生命|attack|lifesteal/i.test(text);
    if (onlyRecoveryClaim) return false;
  }
  const claims = [
    { key: "attack", hit: /攻击|伤害|打击|破防|锋利|进攻|输出|攻势|attack/i.test(text) },
    { key: "defense", hit: /防御|防线|抗打|硬接|坚固|稳住|减伤|defen[cs]e/i.test(text) },
    { key: "speed", hit: /速度|更快|抢先|迅捷|敏捷|行动|speed/i.test(text) },
    { key: "shield", hit: /护盾|屏障|挡住|遮挡|盾|shield/i.test(text) },
    { key: "lifesteal", hit: /吸血|吸取|夺取|追回生命|lifesteal/i.test(text) },
    { key: "regen", hit: /回复|恢复|回血|修复|补能|再生|regen/i.test(text) },
  ];
  const hasStat = (key) => (stats[key] || 0) > 0 || effects.some((effectKey) => {
    const effect = photoSpecialEffectMap.get(effectKey);
    return effect?.stat === key || (key === "attack" && effect?.shieldDamageRatio);
  });
  return claims.every((claim) => !claim.hit || hasStat(claim.key));
}

function renderSpecialEffectPills(item) {
  return getVisibleItemSpecialInstances(item)
    .map(({ effect, state: data }) => `<span class="effect-pill">${escapeHtml(formatSpecialEffectText(effect, data))}</span>`)
    .join("");
}

function getVisibleItemSpecialInstances(item) {
  const instances = getItemSpecialInstances(item);
  if (!instances.length) return [];
  const active = getActiveEquippedPhotoSpecialInstance();
  if (item?.id && active?.item?.id === item.id) {
    const selected = instances.find((instance) => instance.key === active.key);
    return selected ? [selected] : [];
  }
  return [];
}

function formatSpecialEffectText(effect, data = {}) {
  const inactiveSuffix = data.inactive ? "，未激活" : "";
  if (effect.kind === "killThreshold") {
    const progress = clampInt(data.kills, 0, 9999) % effect.threshold;
    const bonus = clampInt(data.bonus, 0, 9999) * effect.amount;
    return `${effect.label}（${progress}/${effect.threshold}，已+${bonus}${inactiveSuffix}）`;
  }
  if (effect.kind === "killPermanent") {
    return `${effect.label}（已+${clampInt(data.bonus, 0, 9999)}${inactiveSuffix}）`;
  }
  if (effect.kind === "killHeal") {
    return `${effect.label}${inactiveSuffix}`;
  }
  if (effect.kind === "dealDamageTemp") return `${effect.label}，最多${effect.cap}，战后复原${inactiveSuffix}`;
  if (effect.kind === "takeDamageTemp") return `${effect.label}，最多${effect.cap}，战后复原${inactiveSuffix}`;
  return `${effect.label}${inactiveSuffix}`;
}

function renderLog() {
  els.battleLog.innerHTML = "";
  const entries = [];

  if (state.currentBattle) {
    entries.push({
      id: "current",
      type: "current",
    summary: `正在对战${state.currentBattle.monsterName}`,
      details: state.currentBattle.details,
      expanded: true,
    });
  }

  entries.push(...state.battleReports);

  if (!entries.length) {
    return;
  }

  for (const entry of entries.slice(0, battleReportLimit)) {
    if (entry.type === "current") {
      renderBattleEntry(entry, "", false);
    } else if (entry.type === "event") {
      renderBattleEntry(entry, "", false);
    } else {
      renderBattleEntry(entry, "", true);
    }
  }
}

function renderBattleEntry(entry, markText, canToggle) {
  const isBattle = entry.type !== "event";
  const li = createBattleListItem({
    mark: markText,
    markClass: "",
    text: entry.summary,
    className: `${canToggle ? "is-summary" : ""}${entry.expanded ? " is-expanded" : ""}`,
  });

  if (canToggle) {
    const button = document.createElement("button");
    button.className = "battle-report-toggle";
    button.type = "button";
    button.textContent = entry.summary;
    button.setAttribute("aria-expanded", String(Boolean(entry.expanded)));
    button.addEventListener("click", () => toggleBattleReport(entry.id));
    li.lastChild.replaceWith(button);
  }

  if (entry.type === "current" && isBattle) {
    const details = entry.details?.length ? [...entry.details].reverse() : [];
    for (const detail of details) {
      els.battleLog.append(createBattleListItem({
        mark: "·",
        markClass: "detail",
        text: detail,
        className: "is-detail is-latest-first",
      }));
    }
    els.battleLog.append(li);
    return;
  }

  els.battleLog.append(li);

  if (entry.expanded && isBattle) {
    const details = entry.details?.length ? entry.details : ["暂无详细回合。"];
    for (const detail of details) {
      els.battleLog.append(createBattleListItem({
        mark: "·",
        markClass: "detail",
        text: detail,
        className: "is-detail",
      }));
    }
  }
}

function createBattleListItem({ mark, markClass = "", text, className = "" }) {
  const li = document.createElement("li");
  li.className = className.trim();
  const textEl = document.createElement("span");
  textEl.textContent = text;
  if (mark) {
    const markEl = document.createElement("span");
    markEl.className = `log-mark ${markClass}`.trim();
    markEl.textContent = mark;
    li.append(markEl, textEl);
  } else {
    li.classList.add("no-mark");
    li.append(textEl);
  }
  return li;
}

function toggleBattleReport(id) {
  const report = state.battleReports.find((entry) => entry.id === id);
  if (!report || report.type === "event") return;
  report.expanded = !report.expanded;
  saveGame();
  render();
}

function renderGameTextOnly() {
  const equippedItems = getEquippedItems();
  const selectedEquipment = getSelectedInventoryItem();
  const enemyDamageEstimates = getEnemyDamageEstimates();
  const inventoryItems = state.inventory.filter(Boolean);
  window.__photoHeroState = {
    runSeed: state.runSeed,
    player: {
      hp: state.player.hp,
      shield: state.player.shield,
      form: {
        id: getHeroForm().id,
        label: getHeroForm().label,
        level: getHeroFormLevel(),
        progress: getHeroFormProgressText(),
        effects: getHeroFormEffectLines(),
        stats: getHeroFormStats(),
        filmDropBonus: getHeroFormFilmShardBonus() / 10,
        noFilmDrop: Boolean(getHeroFormLevelConfig().noFilmDrop),
      },
      stats: getPlayerStats(),
      equipmentCount: inventoryItems.length,
      equippedCount: equippedItems.length,
      filmRolls: state.filmRolls,
      filmShards: state.filmShards,
      filmCount: getFilmCount(),
    photoValueMin: getPhotoValueMin(),
    photoValueMax: getPhotoValueMax(),
    globalFilmDropBonus: getGlobalFilmDropBonus() / 10,
    battleSpeed: getBattleSpeed(),
    heroHit: Boolean(state.heroHitEffectUntil),
    enemyHitIds: Object.keys(state.enemyHitEffectUntilById || {}),
    battleSpecial: { ...(state.battleSpecial || {}) },
      selectedEquipment: selectedEquipment ? formatItemDisplayName(selectedEquipment) : null,
      selectedSlotIndex: getSelectedSlotIndex(),
      equippedItems: equippedItems.map((item) => formatItemDisplayName(item)),
      equippedEffects: equippedItems.flatMap((item) => getItemSpecialKeys(item)),
    },
    floor: state.floor,
    maxFloor,
    gameClear: Boolean(state.gameClear),
    enemies: state.enemies.map((enemy, index) => ({
      index,
      id: enemy.id,
      name: enemy.name,
      typeKey: enemy.typeKey,
      image: getMonsterImageUrl(enemy.typeKey),
      typeName: enemy.typeName,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      shield: enemy.shield,
      atk: enemy.atk,
      def: enemy.def,
      speed: enemy.speed,
      traits: enemy.traits?.map((trait) => trait.text || trait.type) || [],
      drop: formatEnemyFilmDrop(enemy),
      damageEstimate: enemyDamageEstimates.get(enemy.id)?.text || "",
      damageEstimateState: enemyDamageEstimates.get(enemy.id)?.state || "",
      selected: state.selectedEnemyIds.includes(enemy.id),
      selectionOrder: getEnemySelectionOrder(enemy.id),
      active: state.activeEnemyIds.includes(enemy.id),
    })),
    selectedEnemyIds: [...state.selectedEnemyIds],
    selectedEnemyCount: state.selectedEnemyIds.length,
    activeEnemyIds: [...state.activeEnemyIds],
    bossReward: state.bossReward ? {
      floor: state.bossReward.floor,
      options: state.bossReward.options,
      selectedIndex: getSelectedBossRewardIndex(),
    } : null,
    careerSummary: state.careerSummary ? {
      status: state.careerSummary.status,
      title: state.careerSummary.title,
      text: state.careerSummary.text,
      note: state.careerSummary.note || "",
    } : null,
    hasPhoto: Boolean(state.lastPhoto),
    latestItem: state.latestItem,
    inventory: state.inventory.map((item, slotIndex) => item ? ({
      slotIndex,
      name: formatItemDisplayName(item),
      score: scoreItem(item),
      quality: item.quality?.label || getItemQuality(scoreItem(item)).label,
      appraisal: item.semanticAppraisal ? {
        subjectName: item.subjectName || "",
        objectType: item.objectType || "",
        identityDescription: item.identityDescription || "",
        sizeClass: item.sizeClass || "",
        photoQualityScore: Number.isFinite(item.photoQualityScore) ? item.photoQualityScore : null,
        statAffinity: normalizeStatAffinity(item.statAffinity || []),
        specialAffinity: normalizeSpecialEffects(item.specialAffinity || []),
        reason: item.reason || "",
      } : null,
      stats: item.stats || {},
      effects: getItemSpecialKeys(item),
      photoKey: item.photoKey || "",
      objectKey: item.objectKey || makeObjectDuplicateKey(item),
      specialState: item.specialState || {},
      equipped: !item.tooLarge,
    }) : null),
    battleClock: state.battleClock,
    currentBattle: state.currentBattle
      ? {
          monsterName: state.currentBattle.monsterName,
          initialEnemyCount: state.currentBattle.initialEnemyCount,
          roundLimit: state.currentBattle.roundLimit,
          details: state.currentBattle.details,
        }
      : null,
    battleReports: state.battleReports.slice(0, 4).map((entry) => ({
      type: entry.type,
      result: entry.result || entry.eventType || "",
      summary: entry.summary,
      expanded: Boolean(entry.expanded),
      details: entry.expanded ? entry.details : [],
    })),
  };
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 20);
}

function setBusy(message) {
  els.loadingState.textContent = message;
  els.loadingState.dataset.notice = message ? "false" : "";
}

function saveConfig(showLog = true) {
  rememberCurrentApiKey();
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(getConfigFromInputs()));
  if (showLog) addLog("API 配置已保存到当前浏览器。");
  render();
}

function loadConfig() {
  const config = readJson(STORAGE_KEYS.config, {});
  const presetId = API_PRESETS[config.presetId] ? config.presetId : "siliconflow";
  customDraft.baseUrl = presetId === "custom" ? config.baseUrl || "" : config.customBaseUrl || "";
  customDraft.model = presetId === "custom" ? config.model || "" : config.customModel || "";
  Object.assign(providerApiKeys, config.apiKeys || {});
  if (config.apiKey && !providerApiKeys[presetId]) {
    providerApiKeys[presetId] = config.apiKey;
  }
  els.apiKeyInput.value = providerApiKeys[presetId] || "";
  applyPreset(presetId, false);
}

function getConfigFromInputs() {
  const activePreset = getActivePresetId();
  const baseUrl = els.baseUrlInput.value.trim();
  const activePresetConfig = API_PRESETS[activePreset] || API_PRESETS.custom;
  const model = activePreset === "custom" || activePresetConfig.editableModel
    ? (els.customModelInput.value.trim() || els.modelInput.value.trim())
    : els.modelInput.value.trim();

  return {
    presetId: activePreset,
    baseUrl,
    apiKey: els.apiKeyInput.value.trim(),
    apiKeys: { ...providerApiKeys, [activePreset]: els.apiKeyInput.value.trim() },
    model,
    customBaseUrl: activePreset === "custom" ? baseUrl : customDraft.baseUrl.trim(),
    customModel: activePreset === "custom" ? model : customDraft.model.trim(),
  };
}

function saveGame() {
  const save = {
    version: gameSaveVersion,
    runSeed: state.runSeed,
    player: state.player,
    floor: state.floor,
    encounterId: state.encounterId,
    enemies: state.enemies,
    selectedEnemyIds: state.selectedEnemyIds,
    activeEnemyIds: state.activeEnemyIds,
    gameClear: state.gameClear,
    bossReward: state.bossReward,
    photoValueMin: state.photoValueMin,
    photoValueMax: state.photoValueMax,
    globalFilmDropBonus: state.globalFilmDropBonus,
    bossRewardDeck: ensureBossRewardDeck(),
    formProgress: state.formProgress,
    battleSpeed: getBattleSpeed(),
    filmShards: state.filmShards,
    filmRolls: state.filmRolls,
    battleClock: state.battleClock,
    battleReports: state.battleReports,
    battleReportSeq: state.battleReportSeq,
    currentBattle: state.currentBattle,
    battleSnapshot: state.battleSnapshot,
    infoMode: state.infoMode,
    battleSpecial: state.battleSpecial,
    careerSummary: state.careerSummary,
    inventory: state.inventory,
    selectedSlotIndex: state.selectedSlotIndex,
    pendingPhotoSlotIndex: state.pendingPhotoSlotIndex,
    selectedItemId: state.selectedItemId,
    latestItem: state.latestItem,
    log: state.log,
  };
  localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(save));
}

function loadSave() {
  const save = readJson(STORAGE_KEYS.save, null);
  if (!save) return;

  if (save.version !== gameSaveVersion) {
    localStorage.removeItem(STORAGE_KEYS.save);
    return;
  }

  state.floor = clampInt(save.floor, 1, maxFloor);
  state.gameClear = Boolean(save.gameClear);
  state.bossReward = normalizeBossReward(save.bossReward);
  state.photoValueMin = clampInt(save.photoValueMin, defaultPhotoValueMin, 999);
  state.photoValueMax = Math.max(state.photoValueMin, clampInt(save.photoValueMax, defaultPhotoValueMax, 999));
  state.globalFilmDropBonus = clampInt(save.globalFilmDropBonus, 0, 999);
  state.formProgress = normalizeFormProgress(save.formProgress);
  state.battleSpeed = battleSpeedOptions.includes(save.battleSpeed) ? save.battleSpeed : 1;
  state.inventory = normalizeInventorySlots(save.inventory);
  state.player = normalizePlayer(save.player || state.player);
  state.runSeed = typeof save.runSeed === "string" && save.runSeed ? save.runSeed : makeRunSeed();
  state.bossRewardDeck = normalizeBossRewardDeck(save.bossRewardDeck) || buildBossRewardDeck(state.runSeed || "default");
  state.selectedSlotIndex = clampSlotIndex(save.selectedSlotIndex);
  state.pendingPhotoSlotIndex = clampSlotIndex(save.pendingPhotoSlotIndex ?? state.selectedSlotIndex);
  state.selectedItemId = state.inventory[state.selectedSlotIndex]?.id || "";
  state.latestItem = save.latestItem ? normalizeInventoryItem({ ...save.latestItem, skipSpecialRoll: true }) : state.inventory.find(Boolean) || null;
  state.log = Array.isArray(save.log) ? save.log : state.log;

  state.enemies = Array.isArray(save.enemies) ? save.enemies.map(normalizeEnemy).filter(Boolean) : [];
  state.encounterId = typeof save.encounterId === "string" ? save.encounterId : "";
  if (!state.enemies.length && !state.gameClear) {
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
  }
  state.selectedEnemyIds = Array.isArray(save.selectedEnemyIds)
    ? save.selectedEnemyIds.filter((id) => typeof id === "string" && state.enemies.some((enemy) => enemy.id === id))
    : [];
  state.activeEnemyIds = Array.isArray(save.activeEnemyIds)
    ? save.activeEnemyIds.filter((id) => typeof id === "string" && state.enemies.some((enemy) => enemy.id === id))
    : [];
  state.filmShards = clampInt(save.filmShards, 0, 9);
  state.filmRolls = clampInt(save.filmRolls, 0, 999);
  state.battleReports = Array.isArray(save.battleReports) ? save.battleReports.map(normalizeBattleReport).filter(Boolean) : [];
  state.battleReportSeq = Number.isFinite(save.battleReportSeq) ? save.battleReportSeq : state.battleReports.length;
  state.currentBattle = normalizeCurrentBattle(save.currentBattle);
  state.battleSnapshot = state.currentBattle ? normalizeBattleSnapshot(save.battleSnapshot) : null;
  state.careerSummary = normalizeCareerSummary(save.careerSummary);
  state.infoMode = save.infoMode === "career" && state.careerSummary ? "career" : save.infoMode === "log" ? "log" : "item";
  state.battleClock = normalizeBattleClock(save.battleClock);
  state.battleSpecial = state.currentBattle ? normalizeBattleSpecial(save.battleSpecial) : createDefaultBattleSpecial();
  clearEnemyCardMotion();
}

function normalizePlayer(player) {
  const defaults = createDefaultPlayer();
  const normalized = {
    formId: heroFormMap.has(player.formId) ? player.formId : defaults.formId,
    baseHp: Number.isFinite(player.baseHp) ? player.baseHp : defaults.baseHp,
    hp: Number.isFinite(player.hp) ? player.hp : defaults.hp,
    baseAtk: Number.isFinite(player.baseAtk) ? player.baseAtk : defaults.baseAtk,
    baseDef: Number.isFinite(player.baseDef) ? player.baseDef : defaults.baseDef,
    baseSpeed: Number.isFinite(player.baseSpeed) ? player.baseSpeed : defaults.baseSpeed,
    baseRegen: Number.isFinite(player.baseRegen) ? player.baseRegen : defaults.baseRegen,
    baseShield: Number.isFinite(player.baseShield) ? player.baseShield : defaults.baseShield,
    baseLifesteal: Number.isFinite(player.baseLifesteal) ? player.baseLifesteal : defaults.baseLifesteal,
    shield: Number.isFinite(player.shield) ? player.shield : defaults.shield,
    shieldMonsterId: typeof player.shieldMonsterId === "string" ? player.shieldMonsterId : "",
  };
  normalized.hp = Math.max(0, Math.min(normalized.hp, getPlayerMaxHpFromRaw(normalized)));
  normalized.shield = Math.max(0, Math.min(normalized.shield, getPlayerShieldFromRaw(normalized)));
  return normalized;
}

function normalizeBossReward(reward) {
  if (!reward || typeof reward !== "object") return null;
  const floor = clampInt(reward.floor, 1, maxFloor);
  const options = Array.isArray(reward.options)
    ? reward.options
        .map((option, index) => normalizeBossRewardOption(option, floor, index))
        .filter(Boolean)
        .slice(0, 3)
    : [];
  const selectedIndex = clampInt(reward.selectedIndex, -1, 2);
  return options.length ? { floor, options, selectedIndex: options[selectedIndex] ? selectedIndex : -1 } : null;
}

function normalizeBossRewardOption(option, floor, index) {
  const validTypes = new Set(["filmDrop", "filmFlat", "filmPercent", "valueMin", "valueMax"]);
  if (!option || typeof option !== "object" || !validTypes.has(option.type)) return null;
  const fallback = getBossRewardCatalog().find((item) => item.type === option.type)
    || buildBossRewardOptions(floor).find((item) => item.type === option.type)
    || {};
  return {
    id: typeof option.id === "string" && option.id ? option.id : `${floor}-${index}-${option.type}`,
    type: option.type,
    title: fallback.title || cleanText(option.title, "奖励", 24),
    desc: fallback.desc || cleanText(option.desc, "选择后进入下一层。", 64),
    icon: fallback.icon || option.icon || getBossRewardIcon(option.type),
  };
}

function normalizeCareerSummary(summary) {
  if (!summary || typeof summary !== "object") return null;
  const status = ["local", "loading", "ai", "error"].includes(summary.status) ? summary.status : "local";
  return {
    status: status === "loading" ? "local" : status,
    title: cleanText(summary.title, "照片勇者生涯总结", 32),
    text: cleanText(summary.text, "", 1200),
    note: cleanText(summary.note, "", 160),
    snapshot: summary.snapshot && typeof summary.snapshot === "object" ? summary.snapshot : null,
    createdAt: Number.isFinite(summary.createdAt) ? summary.createdAt : Date.now(),
  };
}

function normalizeBattleClock(clock) {
  if (!clock || typeof clock !== "object" || clock.encounterId !== state.encounterId || !state.currentBattle) return null;
  const activeIds = new Set(state.activeEnemyIds);
  const enemies = Array.isArray(clock.enemies)
    ? clock.enemies
        .filter((item) => typeof item?.id === "string" && activeIds.has(item.id))
        .map((item) => ({
          id: item.id,
          time: Number.isFinite(item.time) ? Math.max(0, item.time) : getActionInterval(state.enemies.find((enemy) => enemy.id === item.id)?.speed || 0),
        }))
    : [];
  const fallbackEnemies = getActiveBattleEnemies();
  return {
    hero: Number.isFinite(clock.hero) ? Math.max(0, clock.hero) : getActionInterval(getBattleStats(state.activeEnemyIds).speed),
    enemies: enemies.length ? enemies : fallbackEnemies.map((enemy) => ({ id: enemy.id, time: getActionInterval(enemy.speed) })),
    round: Number.isFinite(clock.round) ? Math.max(1, clock.round) : 1,
    encounterId: state.encounterId,
  };
}

function normalizeCurrentBattle(battle) {
  if (!battle || typeof battle !== "object") return null;
  const activeIds = Array.isArray(state.activeEnemyIds) ? state.activeEnemyIds : [];
  const names = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id)?.name)
    .filter(Boolean)
    .join("、");
  return {
    id: typeof battle.id === "string" ? battle.id : makeId("battle"),
    type: "battle",
    battleId: typeof battle.battleId === "string" ? battle.battleId : `${state.floor}:${activeIds.join("|")}`,
    floor: Number.isFinite(battle.floor) ? battle.floor : state.floor,
    monsterName: typeof battle.monsterName === "string" && battle.monsterName ? battle.monsterName : names || "敌人",
    startHp: Number.isFinite(battle.startHp) ? battle.startHp : state.player.hp,
    startShield: Number.isFinite(battle.startShield) ? battle.startShield : state.player.shield,
    damageEstimates: battle.damageEstimates && typeof battle.damageEstimates === "object" ? battle.damageEstimates : {},
    initialEnemyCount: clampInt(battle.initialEnemyCount || activeIds.length || 1, 1, 3),
    roundLimit: getBattleRoundLimit(battle.initialEnemyCount || activeIds.length || 1, Number.isFinite(battle.floor) ? battle.floor : state.floor),
    details: Array.isArray(battle.details) ? battle.details.filter((item) => typeof item === "string").slice(-90) : [],
    lootNames: Array.isArray(battle.lootNames) ? battle.lootNames.filter((item) => typeof item === "string") : [],
    defeatedIds: Array.isArray(battle.defeatedIds) ? battle.defeatedIds.filter((item) => typeof item === "string") : [],
    defeatedTypes: Array.isArray(battle.defeatedTypes) ? battle.defeatedTypes.filter((item) => typeof item === "string") : [],
    createdAt: Number.isFinite(battle.createdAt) ? battle.createdAt : Date.now(),
  };
}

function normalizeBattleSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return null;
  const enemies = Array.isArray(snapshot.enemies) ? snapshot.enemies.map(normalizeEnemy).filter(Boolean) : [];
  if (!enemies.length) return null;
  const validIds = new Set(enemies.map((enemy) => enemy.id));
  return {
    floor: clampInt(snapshot.floor, 1, maxFloor),
    encounterId: typeof snapshot.encounterId === "string" && snapshot.encounterId ? snapshot.encounterId : state.encounterId,
    enemies,
    selectedEnemyIds: Array.isArray(snapshot.selectedEnemyIds)
      ? snapshot.selectedEnemyIds.filter((id) => typeof id === "string" && validIds.has(id))
      : [],
    activeEnemyIds: Array.isArray(snapshot.activeEnemyIds)
      ? snapshot.activeEnemyIds.filter((id) => typeof id === "string" && validIds.has(id))
      : [],
    player: normalizePlayer(snapshot.player || state.player),
    inventory: normalizeInventorySlots(snapshot.inventory),
    filmShards: clampInt(snapshot.filmShards, 0, 9),
    filmRolls: clampInt(snapshot.filmRolls, 0, 999),
    latestItem: snapshot.latestItem ? normalizeInventoryItem({ ...snapshot.latestItem, skipSpecialRoll: true }) : null,
    battleReports: Array.isArray(snapshot.battleReports) ? snapshot.battleReports.map(normalizeBattleReport).filter(Boolean) : [],
    battleReportSeq: Number.isFinite(snapshot.battleReportSeq) ? snapshot.battleReportSeq : 0,
    infoMode: snapshot.infoMode === "log" || snapshot.infoMode === "item" ? snapshot.infoMode : "log",
  };
}

function normalizeBattleReport(entry) {
  if (!entry || typeof entry !== "object") return null;
  const type = entry.type === "event" ? "event" : "battle";

  if (type === "event") {
    return {
      id: typeof entry.id === "string" ? entry.id : makeId("event"),
      type,
      eventType: typeof entry.eventType === "string" ? entry.eventType : "item",
      summary: typeof entry.summary === "string" ? entry.summary : "获得装备。",
      details: [],
      expanded: false,
      createdAt: Number.isFinite(entry.createdAt) ? entry.createdAt : Date.now(),
    };
  }

  return {
    id: typeof entry.id === "string" ? entry.id : makeId("battle"),
    type,
    battleId: typeof entry.battleId === "string" ? entry.battleId : "",
    floor: Number.isFinite(entry.floor) ? entry.floor : 1,
    monsterName: typeof entry.monsterName === "string" && entry.monsterName ? entry.monsterName : "敌人",
    startHp: Number.isFinite(entry.startHp) ? entry.startHp : state.player.hp,
    startShield: Number.isFinite(entry.startShield) ? entry.startShield : 0,
    lootNames: Array.isArray(entry.lootNames) ? entry.lootNames.filter((item) => typeof item === "string") : [],
    defeatedIds: Array.isArray(entry.defeatedIds) ? entry.defeatedIds.filter((item) => typeof item === "string") : [],
    defeatedTypes: Array.isArray(entry.defeatedTypes) ? entry.defeatedTypes.filter((item) => typeof item === "string") : [],
    result: typeof entry.result === "string" ? entry.result : "battle",
    hpDelta: Number.isFinite(entry.hpDelta) ? entry.hpDelta : 0,
    endHp: Number.isFinite(entry.endHp) ? entry.endHp : state.player.hp,
    endShield: Number.isFinite(entry.endShield) ? entry.endShield : state.player.shield,
    summary: typeof entry.summary === "string" ? entry.summary : makeBattleSummary(entry.result, entry, entry.hpDelta || 0),
    details: Array.isArray(entry.details) ? entry.details.filter((item) => typeof item === "string").slice(-60) : [],
    expanded: Boolean(entry.expanded),
    createdAt: Number.isFinite(entry.createdAt) ? entry.createdAt : Date.now(),
    finishedAt: Number.isFinite(entry.finishedAt) ? entry.finishedAt : Date.now(),
  };
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function byId(id) {
  return document.getElementById(id);
}

function percent(value, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function clampInt(value, min, max) {
  const numeric = Number.parseInt(value, 10);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function makeId(idStem) {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  state.battleReportSeq += 1;
  return `${idStem}-${Date.now()}-${state.battleReportSeq}`;
}

function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function cleanText(value, fallback, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";
  return (text || fallback).slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makePlaceholderImage() {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="12" fill="#f5ebd7"/>
      <circle cx="60" cy="48" r="22" fill="#245f9a"/>
      <path d="M28 92c10-24 54-24 64 0" fill="#bd3d36"/>
      <text x="60" y="109" text-anchor="middle" font-size="14" font-family="Arial" font-weight="700" fill="#17130f">PHOTO</text>
    </svg>
  `);
}

window.render_game_to_text = () => JSON.stringify(window.__photoHeroState || {});
window.advanceTime = () => render();
window.__photoHeroTestHooks = {
  compressImage,
  makeInventoryImage,
  loadImage,
  addTestItem(input) {
    const item = balanceItem(input || {}, input?.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-item") }, "测试装备已加入。");
  },
  addSpecialItem(effectKey, input = {}) {
    const effect = photoSpecialEffectMap.get(effectKey);
    const value = Math.max(effect?.value || 16, input.value || 16);
    const item = balanceItem({
      itemName: input.itemName || "测试特装",
      rarity: input.rarity || "rare",
      value,
      stats: input.stats || {},
      specialEffects: [effectKey],
      skipSpecialRoll: true,
      description: input.description || "测试用拍照特殊装备。",
      identityDescription: input.identityDescription || "",
      photoKey: input.photoKey || pendingDuplicatePhotoKey,
      confidence: 1,
    }, input.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-special") }, "测试特殊装备已加入。");
  },
  addRawItem(input) {
    const item = {
      ...balanceItem({ ...(input || {}), photoKey: input?.photoKey || pendingDuplicatePhotoKey, skipSpecialRoll: input?.skipSpecialRoll ?? true }, input?.image || makePlaceholderImage()),
      stats: normalizeStats(input?.stats || {}, 999),
      id: makeId("test-item"),
    };
    addInventoryItem(item, "测试装备已加入。");
  },
  makePhotoDuplicateKey,
  makeObjectDuplicateKey,
  findDuplicateIdentifiedItem,
  setPhoto(image) {
    state.lastPhoto = image || "";
    if (state.lastPhoto) state.infoMode = "item";
    render();
  },
  setHeroStats(next) {
    Object.assign(state.player, next || {});
    saveGame();
    render();
  },
  setRunRewards(next = {}) {
    if (Number.isFinite(next.photoValueMin)) state.photoValueMin = next.photoValueMin;
    if (Number.isFinite(next.photoValueMax)) state.photoValueMax = next.photoValueMax;
    if (Number.isFinite(next.globalFilmDropBonus)) state.globalFilmDropBonus = next.globalFilmDropBonus;
    if (Number.isFinite(next.filmRolls)) state.filmRolls = next.filmRolls;
    if (Number.isFinite(next.filmShards)) state.filmShards = next.filmShards;
    saveGame();
    render();
  },
  setFormProgress(next = {}) {
    state.formProgress = normalizeFormProgress(next);
    const stats = getPlayerStats();
    state.player.hp = Math.min(state.player.hp, stats.maxHp);
    state.player.shield = Math.min(state.player.shield, stats.shield);
    saveGame();
    render();
  },
  addFormKills(count = 1) {
    const upgraded = addCurrentFormKill(count);
    saveGame();
    render();
    return upgraded;
  },
  getFormProgress() {
    return JSON.parse(JSON.stringify(state.formProgress));
  },
  getPlayerStats,
  getActiveSpecialForTest() {
    const active = getActiveEquippedPhotoSpecialInstance();
    return active ? { key: active.key, itemName: active.item?.itemName || "", value: active.effect?.value || 0 } : null;
  },
  getHeroStateForTest() {
    return { hp: state.player.hp, maxHp: getPlayerStats().maxHp, shield: state.player.shield };
  },
  getInventoryForTest() {
    return state.inventory.map((item) => (item ? { id: item.id, itemName: item.itemName, value: item.value, stats: item.stats, specialEffects: item.specialEffects } : null));
  },
  resetGameForTest() {
    resetGame();
  },
  startBossRewardChoice,
  chooseBossReward,
  balanceItem,
  async identifyImageForTest(config, image) {
    const item = await analyzeDirectly(config, image);
    return balanceItem(item, makePlaceholderImage());
  },
  parseModelTextForTest(text) {
    return balanceItem(extractJson(text, null), makePlaceholderImage());
  },
  renderItemDescriptionForTest(item) {
    return renderItemDescription(item);
  },
  getAppraisalFailureReasonForTest(item) {
    return getAppraisalFailureReason(item);
  },
  getDismantleFilmReturnForTest(item) {
    return getDismantleFilmReturn(item);
  },
  dismantleSelectedItemForTest() {
    return dismantleSelectedItem();
  },
  showLootErrorForTest(message) {
    showLootError(message);
    state.lastPhoto = "";
    state.infoMode = "item";
    render();
  },
  getPhotoValueRange() {
    return { min: getPhotoValueMin(), max: getPhotoValueMax() };
  },
  setHeroForm,
  getMonsterAttackForStrike,
  applyHeroDamageToEnemy,
  resolveMonsterStrike,
  beginBattle,
  monsterTypes,
  state,
  selectEnemies(ids) {
    state.selectedEnemyIds = Array.isArray(ids) ? ids : [];
    saveGame();
    render();
  },
  setFloor(floor) {
    stopAutoBattle();
    stopBattleTimers();
    state.floor = clampInt(floor, 1, maxFloor);
    state.gameClear = false;
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = [];
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleSnapshot = null;
    state.battleClock = null;
    resetBattleSpecial();
    clearEnemyCardMotion();
    state.enemyFlipEncounterId = state.encounterId;
    applyFloorShield();
    addFloorNarrative(state.floor);
    saveGame();
    render();
  },
  setEnemies(enemies) {
    stopAutoBattle();
    stopBattleTimers();
    state.testEnemyOverride = Array.isArray(enemies) ? enemies : [];
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleSnapshot = null;
    state.battleClock = null;
    resetBattleSpecial();
    clearEnemyCardMotion();
    state.enemyFlipEncounterId = state.encounterId;
    applyFloorShield();
    saveGame();
    render();
  },
  getEnemyDamageEstimates,
  buildFloorEncounter,
  startAutoBattle,
  resolveBattleAction() {
    const finished = resolveBattleAction();
    saveGame();
    render();
    return finished;
  },
  getFirstInventoryId() {
    return state.inventory.find(Boolean)?.id || "";
  },
};

const STORAGE_KEYS = {
  config: "photoHero.config",
  save: "photoHero.save",
  statsVisitor: "photoHero.stats.visitor",
  statsLastUvDate: "photoHero.stats.lastUvDate",
  statsGameRuns: "photoHero.stats.gameRuns",
  statsAppraisalId: "photoHero.stats.appraisalId",
  statsAppraisalRecorded: "photoHero.stats.appraisalRecorded",
  statsLastAppraisalDate: "photoHero.stats.lastAppraisalDate",
};

const pendingDuplicatePhotoKey = "pending";
const STATS_COUNTER_RPC_URL = "https://ypefmpeekfucmarbbdov.supabase.co";
const STATS_COUNTER_RPC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZWZtcGVla2Z1Y21hcmJiZG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTA2NTYsImV4cCI6MjA4MTUyNjY1Nn0.XTOQNFuuwfu9nwDTnO9-NEqlzZnzdCVnEmYEJh0rXf8";
const STATS_COUNTER_IDS = {
  totalPv: "photo_hero_pv_total",
  totalUv: "photo_hero_uv_total",
  totalGames: "photo_hero_game_total",
  totalKills: "photo_hero_kills_total",
  totalBossKills: "photo_hero_boss_kills_total",
  totalAppraisals: "photo_hero_appraisal_players_total",
  totalEquipment: "photo_hero_appraisals_total",
  totalPhotoEquipment: "photo_hero_appraisals_total",
  totalDrawingEquipment: "photo_hero_drawing_equipment_total",
  totalSuperForms: "photo_hero_super_forms_total",
  totalFloors: "photo_hero_floors_total",
  totalClears: "photo_hero_clears_total",
  dailyPvPrefix: "photo_hero_pv_day",
  dailyUvPrefix: "photo_hero_uv_day",
  dailyGamesPrefix: "photo_hero_game_day",
  dailyKillsPrefix: "photo_hero_kills_day",
  dailyBossKillsPrefix: "photo_hero_boss_kills_day",
  dailyAppraisalsPrefix: "photo_hero_appraisal_players_day",
  dailyEquipmentPrefix: "photo_hero_appraisals_day",
  dailyPhotoEquipmentPrefix: "photo_hero_appraisals_day",
  dailyDrawingEquipmentPrefix: "photo_hero_drawing_equipment_day",
  dailySuperFormsPrefix: "photo_hero_super_forms_day",
  dailyFloorsPrefix: "photo_hero_floors_day",
  dailyClearsPrefix: "photo_hero_clears_day",
};

let appraisalPlayerRecordPending = false;

const SILICONFLOW_MODELS = [
  { value: "Qwen/Qwen3.5-35B-A3B" },
  { value: "Qwen/Qwen3.6-35B-A3B" },
  { value: "Pro/moonshotai/Kimi-K2.6" },
  { value: "Pro/moonshotai/Kimi-K2.5" },
  { value: "Qwen/Qwen3.6-27B" },
  { value: "Qwen/Qwen3.5-397B-A17B" },
  { value: "Qwen/Qwen3.5-122B-A10B" },
];

const defaultApiPresetId = "experience";
const experienceModelName = "Qwen/Qwen3.5-35B-A3B";
const experienceApiKeyMask = "••••••••••••••••••••••••";
const experienceWorkerBaseUrl = "https://photo-hero-experience.1092043672.workers.dev";
const experienceProxyBaseUrl = (() => {
  const configured = window.PHOTO_HERO_EXPERIENCE_PROXY_BASE_URL || "";
  if (configured) return configured.replace(/\/+$/, "");
  if (/^https?:$/.test(window.location.protocol) && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)) {
    return `${window.location.origin}/api/experience`;
  }
  return experienceWorkerBaseUrl;
})();

const ZHIPU_MODELS = [
  { value: "glm-5v-turbo" },
];

const XIAOMI_VISION_MODEL_VALUES = ["mimo-v2.5", "mimo-v2-omni"];

const XIAOMI_MODELS = [
  { value: "mimo-v2.5" },
  { value: "mimo-v2-omni" },
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
  experience: {
    label: "体验",
    baseUrl: experienceProxyBaseUrl,
    model: experienceModelName,
    models: [{ value: experienceModelName }],
    note: "体验模式免配置，使用公共鉴定台；公共额度有限，繁忙或失败时可切到自定义 API。",
    links: [],
    supportsVision: true,
    lockedKey: true,
    lockedModel: true,
  },
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
  xiaomi: {
    label: "小米",
    baseUrl: "https://api.xiaomimimo.com/v1",
    model: "mimo-v2.5",
    models: XIAOMI_MODELS,
    note: "小米当前图片理解接口支持 mimo-v2.5 / mimo-v2-omni；mimo-v2.5-pro 不是图文鉴定模型。",
    links: [
      { label: "小米邀请链接", url: "https://platform.xiaomimimo.com?ref=GV8ULT" },
      { label: "小米文档", url: "https://platform.xiaomimimo.com/docs/zh-CN/welcome" },
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
    label: "米醋",
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
const heroModes = {
  photo: {
    id: "photo",
    title: "照片勇者",
    resource: "胶卷",
    resourceShard: "胶卷碎片",
    action: "拍照",
    pending: "照片",
    equipment: "照片装备",
    sourceMode: "photo",
  },
  drawing: {
    id: "drawing",
    title: "画图勇者",
    resource: "画布",
    resourceShard: "画布碎片",
    action: "画图",
    pending: "画作",
    equipment: "画作装备",
    sourceMode: "drawing",
  },
};
const defaultHeroMode = "photo";
const drawingCanvasSize = 768;
const defaultDrawingState = {
  open: false,
  drawing: false,
  tool: "brush",
  color: "#17130f",
  size: 12,
  hasMarks: false,
  lastPoint: null,
};

const equipmentVisibleSlots = 10;
const equipmentSlotLimit = 10;
const battleReportLimit = 18;
const modelMaxTokens = 512;
const modelImageDetail = "low";
const defaultPhotoValueMin = 5;
const defaultPhotoValueMax = 20;
const basePhotoScoreMin = 5;
const basePhotoScoreMax = 15;
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
const analysisImageMaxEdge = 896;
const analysisImageQuality = 0.72;
const inventoryImageMaxEdge = 420;
const inventoryImageQuality = 0.72;
const maxFloor = 40;
const introFloor = 0;
const gameSaveVersion = 24;
const initialFilmRolls = 0;
const introFilmRewardCount = 3;
const heroFormUpgradeKills = 10;
const bossFloors = new Set([10, 20, 30, 40]);
const rewardBossFloors = new Set([25, 35, 38]);
const bossRewardChoiceFloors = [10, 20, 25, 30, 35, 38];
const bossRewardChoiceCount = bossRewardChoiceFloors.length;
const bossMonsterKeys = new Set(["skeletonCaptain", "vampire", "knightCaptain", "demon", "octopus", "dragon", "archmage"]);
const highFilmBossMonsterKeys = new Set(["skeletonCaptain", "vampire", "knightCaptain", "demon", "octopus", "dragon", "archmage"]);

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
  hp: 1,
  attack: 5,
  defense: 6,
  speed: 12,
  shield: 4,
  lifesteal: 6,
  regen: 8,
};

const itemQualityRefunds = {
  common: 0.3,
  rare: 0.5,
  epic: 0.7,
  legendary: 0.9,
};

const photoSpecialEffects = [
  { key: "killAttack", label: "每击杀7怪攻击+1", value: 15, kind: "killThreshold", threshold: 7, stat: "attack", amount: 1 },
  { key: "killDefense", label: "每击杀7怪防御+1", value: 16, kind: "killThreshold", threshold: 7, stat: "defense", amount: 1 },
  { key: "killShield", label: "每击杀2怪护盾+1", value: 14, kind: "killThreshold", threshold: 2, stat: "shield", amount: 1 },
  { key: "killSpeed", label: "每击杀10怪速度+1", value: 16, kind: "killThreshold", threshold: 10, stat: "speed", amount: 1 },
  { key: "dealDamageAttack", label: "进攻临时攻击+1", value: 15, kind: "dealDamageTemp", stat: "attack", amount: 1, cap: 6 },
  { key: "takeDamageDefense", label: "受击临时防御+1", value: 15, kind: "takeDamageTemp", stat: "defense", amount: 1, cap: 5 },
  { key: "killMaxHp", label: "每次击杀生命上限+3", value: 14, kind: "killPermanent", stat: "hp", amount: 3 },
  { key: "killHpBoost", label: "每次击杀生命+10", value: 14, kind: "killHeal", amount: 10 },
  { key: "sweep", label: "横扫：伤害50%扩散", value: 15, kind: "passive", spreadRatio: 0.5 },
  { key: "peerless", label: "无双：击杀后攻防+3", value: 15, kind: "killBattleTemp", amount: 3 },
  { key: "doubleStrikeSpeedDown", label: "速度-2，攻击-2，连击翻倍", value: 16, kind: "passive", stat: "speed", amount: -2, attackAmount: -2, doubleStrikeMultiplier: 2 },
  { key: "shieldCrashAttackDown", label: "攻击-3，附带当前护盾伤害", value: 16, kind: "passive", stat: "attack", amount: -3, shieldDamageRatio: 1 },
  { key: "regenMultiplier", label: "回复翻倍", value: 15, kind: "passive", stat: "regen", multiplier: 2 },
  { key: "lifestealMultiplier", label: "吸血翻倍", value: 15, kind: "passive", stat: "lifesteal", multiplier: 2 },
];

const photoSpecialEffectMap = new Map(photoSpecialEffects.map((effect) => [effect.key, effect]));

const portableEquipmentPattern = /锤|锤子|榔头|工具|扳手|螺丝刀|钳|剪刀|刀|指甲刀|键盘|鼠标|笔|尺子|直尺|卷尺|书|本|杯|瓶|伞|雨伞|镜|锅盖|盒|包|袋|钱包|卡包|鞋|拖鞋|滑板|风扇|音箱|音响|喇叭|橡皮|橡皮擦|胶带|刷|梳|钥匙|钥匙扣|锁|球|砖|石|玩具|摆件|模型|饰品|衣服|帽|手机|耳机|充电器|遥控器|凳|小桌|台灯|相机|眼镜|贴纸|卡片|纸|包装|图案|屏幕|车模|小车|乐高|公仔|手办|盆栽|小物件|桌面物|毛巾|纸巾|湿巾|电池|灯|勺|叉|筷|盘|碗|玩偶|娃娃|徽章|挂件/i;
const oversizedScenePattern = /汽车|车辆|公交|火车|飞机|船|房|楼|建筑|天空|风景|街道|道路|公路|山|海|河|湖|森林|荒原|全景|远景|大型家具|床|沙发|衣柜|冰箱|洗衣机|大面积背景/i;
const explicitOversizePattern = /比人.{0,8}(大|高)|比一个人.{0,8}(大|高)|尺寸.{0,8}(超过|大于|高于).{0,4}人|人.{0,4}(还要)?大|巨大|无法搬动|不能搬动|主要是.{0,6}(场景|背景)|大面积背景/i;

const photoIdentificationSystemPrompt = [
  "你是《照片勇者》的照片装备鉴定器，负责识别照片主体、判断尺寸、评价照片质量，并给出装备语义倾向。",
  "你必须只输出一个 JSON 对象，不要 Markdown，不要代码块，不要额外解释。",
  "第一字符必须是 {，最后一个字符必须是 }。",
  "你不负责计算最终价值、最终属性点或最终特殊效果；这些数值由本地游戏规则统一结算。",
  "优先把玩家拍到的现实小主体转成有趣装备素材；真实实物和玩家随手拍的证据最重要，其次看主体是否清楚，最后才考虑背景干净和趣味性。",
  "不要一概拒绝网图或截图；正常拍摄的现实实物可以鉴定。压制游戏装备图、AI 渲染图、动画/插画、透明素材、白底电商图、精修宣传图和纯虚拟道具。",
  "大范围实拍、桌面杂物或生活背景不等于网图或虚拟图；只要背景没有抢走主体，并且能找到明确现实小主体，就鉴定该主体。",
  "现实玩具、模型、玩偶可以鉴定，但孤立黑白底、抠图、商品图、素材图、卡通设定图不能按高真实感处理。",
].join("\n");

const photoIdentificationUserPrompt = [
  "鉴定图片里的一个主要主体，生成《照片勇者》装备素材 JSON。",
  "",
  "识别规则：",
  "1. 找最大、最清楚、最像单个实体的主体；忽略背景、桌面、墙面和边缘杂物。",
  "2. 手持、口袋、桌面、可搬动小物都 isEquipable=true；普通、破旧、包装、贴纸、玩具、模型、小型植物、石头、叶片、装饰物都可以。",
  "3. 真实汽车、公交、火车、飞机、船、整栋建筑、整间房、床、沙发、冰箱、道路、天空、山海河湖等人尺寸以上主体 isEquipable=false。",
  "4. 大背景中有明确前景小物时，鉴定前景小物；大范围、室内、桌面杂物、远构图只轻微影响 subjectArea/backgroundClean，不要直接判成网图或虚拟图。",
  "5. 网图/截图不自动无效；正常拍摄的现实实物仍按实物鉴定。游戏界面、游戏装备卡图、AI 渲染、动画、插画、原画、透明素材、白底电商图、精修宣传图才低 realPhoto。",
  "6. 纸质卡片、贴纸、包装、海报、屏幕载体按载体本身鉴定，不把里面的幻想武器、角色或游戏道具当实物；通常低 photoQuality、低 statAffinity、specialAffinity=[]。",
  "7. 玩具、模型、手办、摆件、道具、纸板/塑料/金属小物可鉴定；但孤立黑白底、抠图、商品图、素材图、渲染图只能低 realPhoto、低分、无特殊效果。",
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
  "clarity 主体清楚程度 0-3；subjectArea 主体占图面积 0-3；backgroundClean 背景干净 0-2；realPhoto 现实实拍感 0-3；focusLight 光线/对焦/光影可信度 0-2；interesting 有趣、让人想装备 0-2。",
  "评分校准：clarity=3 需要主体边缘清晰、不用猜；主体约占四分之一到三分之一可给 subjectArea=2，接近半屏才给 3，角落小物给 0-1；背景不抢主体即可 backgroundClean=1，普通桌面、手边杂物、生活环境不是失败项；确实像玩家实拍现实物体可 realPhoto=3；普通但有装备联想可 interesting=1。",
  "光影校准：focusLight=2 不只是亮，还要看物体和环境是否融合，例如接触阴影、投影方向、桌面反光、边缘高光、色温、轻微噪点/模糊是否自然一致。真实照片可以有普通室内光、阴影和背景；白底商品图、棚拍、抠图、AI/渲染图即使光影漂亮也不能因此高 realPhoto。",
  "主动拉开分值：先按照片本身判断基础分 5-15。真实感是第一门槛：随手实拍但主体偏小/背景生活化通常 7-10；主体清楚但构图一般 9-12；清楚实拍且主体明确、有装备联想 12-14；近景清晰、实拍感强、有趣或很适合装备 14-15。背景干净和有趣只能在 realPhoto 足够高、主体真实清楚时加分。",
  "大范围真实照片只要有清楚现实小主体，realPhoto 仍可给 2-3；不要因范围大、桌面杂物、房间背景降到 0-1。白底商品图、精修图、PS 摆拍、棚拍、透明素材、游戏装备图、AI 图、动画/插画、卡牌素材 realPhoto 必须低，不能因为背景干净、有趣、构图精美、光影漂亮而高分或给特殊效果。",
  "生活用品、自然小物、现实玩具模型、现实贴纸/包装、桌面摆件、电脑外设只要主体清晰都可得分；游戏鼠标/键盘是现实外设。昂贵物、宏大景观、真实载具、人物整体、抽象光影、虚拟装备图不能因为好看而高分。",
  "",
  "属性语义：",
  "statAffinity 只输出属性倾向，score 用 1-3，最多 3 项。可选 stat：hp、attack、defense、speed、shield、lifesteal、regen。",
  "hp=生命上限：食物、饮料、药品、植物、柔软温暖物、能量补给、可爱治愈物；本地结算为生命上限+1。餐具、空杯瓶、碗盘勺叉筷是物品本体，不是食物；除非明确装着可食用/可饮用内容，否则不要倾向 hp。",
  "生命恢复、回血、被打后恢复都属于 regen，不属于 hp；只有明确增加生命上限/耐久上限时才倾向 hp。",
  "attack=攻击：工具、硬物、敲击物、键盘鼠标、笔、砖石、运动器材、音响/喇叭等有冲击感的发声物、尖锐或能主动施力的物品。",
  "defense=防御：厚重、坚硬、支撑、抗压、保护、外壳、锁具、电子设备外壳、金属/硬塑料物品。",
  "speed=速度：鞋、轮子、滑板、风扇、空气流动、轻便快速、旋转、遥控器；没有运动/气流/轮/鞋含义时不要给高 speed。",
  "shield=护盾：容器、盒、包、锅盖、伞、镜子、壳、套、罩、防护用品、能挡在身前的物品。",
  "lifesteal=吸血：刀、剪刀、针、钩、指甲刀、尖锐小工具、吸附/抽取/红色血感物品；没有尖锐/吸附/夺取含义时不要给。",
  "regen=回复：水、咖啡、药品、清洁用品、空气净化器/过滤器、毛巾纸巾、灯、充电器、电池、修复/补能/清洁感物品。杯瓶更偏 regen/shield，餐具更偏 attack/defense/shield，不要只因为名称里有汤就当成食物。",
  "空气净化器、滤芯、过滤器这类净化空气的物品，优先倾向 regen 和 defense，不要倾向 hp，除非它同时明显像食物/药品/植物/治愈物。",
  "属性倾向必须来自物品功能或形态，不要为了凑满 3 项而添加牵强属性；不确定时只给 1-2 项。",
  "",
  `特殊效果倾向 specialAffinity 只能从这些 key 里选，最多 2 个候选：${photoSpecialEffects.map((effect) => `${effect.key}=${effect.label}(价值${effect.value})`).join("；")}。`,
  "特殊效果只给语义很强的候选，普通物品可以 specialAffinity=[]；不要为了显得厉害乱给特殊效果。",
  "只有史诗或传说装备才可能出现特殊效果；史诗只在约三分之一情况下出特殊效果，传说必出一个特殊效果。",
  "宽、长、扫帚、扇面、拍子、刷子等有横向扫开联想的实物可选 sweep；奖杯、徽章、冠军感、英雄感、强烈战斗胜利联想的实物可选 peerless。",
  "工具、现实玩具/模型武器、越打越顺手的现实物品可选 dealDamageAttack；盾牌、外壳、硬保护物可选 takeDamageDefense 或 shieldCrashAttackDown；奖杯、种子、书、训练器、成长感物品可选 killAttack/killDefense/killShield/killSpeed/killMaxHp/killHpBoost；鞋、风扇、滑板、成对/双件/高速物品可选 doubleStrikeSpeedDown；宽面、扫帚、刷子、拍子、扇面等横向扫开联想可选 sweep；喝的、补给、净化、回复感物品可选 regenMultiplier；带尖锐、抽取、血感、锋利联想的物品可选 lifestealMultiplier。",
  "不要给游戏装备图、AI 渲染图、动画、插画、精修素材、卡牌素材 specialAffinity；普通拍摄的现实实物网图/截图可以有正常属性，但不应因为来源是网图而额外变强。现实卡片/贴纸/包装上的幻想武器也不要因为图案像武器就给强攻击或特殊效果。",
  "",
  "命名和描述：",
  "itemName、subjectName、objectType、description、reason、tags 都用中文；只有图片主体本身是英文品牌/文字时，才可保留必要英文。",
  "description 用一句中文写成装备味道，像玩家捡到一件奇怪但能上阵的小道具；不要直接承诺最终属性数值或战斗效果，例如不要写 攻击+、回复+、被打回血、吸血、加护盾。",
  "description 必须和 statAffinity 一致：剪刀、刀、针、钩、指甲刀等尖锐工具不要写修复/补能/回血味道；水杯、药、净化器、毛巾等补给清洁物不要写锋利或吸血。",
  "description 要贴着照片里的实体写，不要把玩偶、贴纸、模型、图案写成真的活物；例如不要写它会跳出盘子、突然袭击、自己奔跑、活过来。",
  "description 要有一点冒险感，但保持克制，不要使用夸张神器、无敌、传说降临这类空泛词。",
  "reason 只写一句内部依据，格式尽量像：主体=剪刀；尺寸=手持；质量=清晰；倾向=锋利。",
  "",
  "输出示例：",
  "{\"itemName\":\"蓝柄剪刀\",\"subjectName\":\"剪刀\",\"objectType\":\"手持工具\",\"identityDescription\":\"蓝色塑料手柄、金属剪刀刃、桌面近景、主体占画面大，没有明显品牌文字。\",\"sizeClass\":\"handheld\",\"isScene\":false,\"isEquipable\":true,\"photoQuality\":{\"clarity\":3,\"subjectArea\":3,\"backgroundClean\":2,\"realPhoto\":3,\"focusLight\":2,\"interesting\":2},\"statAffinity\":[{\"stat\":\"attack\",\"score\":3},{\"stat\":\"lifesteal\",\"score\":2}],\"specialAffinity\":[\"dealDamageAttack\"],\"description\":\"锋利的剪刀适合切开敌人的防线。\",\"reason\":\"手持尖锐工具，主体清晰。\",\"tags\":[\"尖锐\",\"工具\"],\"confidence\":0.9}",
].join("\n");

const drawingIdentificationSystemPrompt = [
  "你是《画图勇者》的涂鸦装备鉴定器。输入是一张玩家随手画的涂鸦/手绘图，你要先观察线条、颜色、形状和构图，再猜测它最像什么装备、道具、符号或部件。",
  "你必须只输出一个 JSON 对象，不要 Markdown，不要代码块，不要额外解释。",
  "第一字符必须是 {，最后一个字符必须是 }。",
  "你不负责计算最终 value、最终 stats 或最终 specialEffects；这些数值由本地游戏规则统一结算。",
  "画图模式鼓励玩家画有趣、酷炫、天马行空的东西；不要因为它不是现实照片、不是现实物体、是幻想符号或卡通图案就直接判低分。",
  "但是你必须仔细辨别画的到底是什么，不要把看不清的圆形、线团、笑脸、爱心、星星默认说成魔杖、法杖、神器或幻想武器。",
  "魔杖/法杖只有在能看出长柄、杖身、顶端宝石/星尖/魔法棒轮廓时才可以命名；剑/刀/弓/箭也必须有刃、柄、弓弦、箭头等明确特征。",
  "命名和玩家描述里要抛开“手绘/涂鸦/画布/纸面”这层媒介，直接写它在魔塔里会是什么装备。只有 identityDescription 和 reason 可以提到线条、颜色和画面判断。",
  "只在画面几乎空白、纯随机线条、没有可识别主体、纯场景背景或明显无法转成装备概念时，才把 isEquipable 设为 false 或给很低分。",
].join("\n");

const drawingIdentificationUserPrompt = [
  "鉴定这张玩家涂鸦/手绘图里的一个主要主体，生成《画图勇者》装备素材 JSON。",
  "",
  "识别规则：",
  "1. 分两步判断：先看线条/颜色/形状/构图，写清楚可见证据；再猜主体。不要先套魔杖、神器、幻想武器模板。",
  "2. 优先找最醒目、最完整、最像装备/道具/符号/生物部件/幻想概念的主体；忽略零散背景线条。",
  "3. 盾、剑、翅膀、心形、火焰、星星、眼睛、机器人、怪物面具、可爱小图标都可以鉴定，只要主体可辨认；如果只是圆圈/方块/笑脸/爱心，按圆环、石板、徽记、护符这类形状装备处理，不要强行说成魔杖。",
  "4. 画出来的巨大物、怪物或生物默认按“装备概念/符号化部件”处理，不按现实尺寸判定 tooLarge；只有纯风景、整片天空、道路、房间这类没有道具主体的画面才 isScene=true。",
  "5. 不要输出最终 value、最终 stats 或最终 specialEffects；本地规则会根据 photoQuality、statAffinity、specialAffinity 计算。",
  "6. itemName、subjectName、objectType、description 面向玩家时不要出现 手绘、涂鸦、画作、画布、纸面、简笔画、线稿、草图、画出来的 这些媒介词；identityDescription 可以写线条、颜色和构图用于查重。",
  "",
  "必须输出这个 JSON 结构，字段名使用英文：",
  "{\"itemName\":\"短装备名\",\"subjectName\":\"画布主体\",\"objectType\":\"主体类型\",\"identityDescription\":\"用于判断是否同一幅画的详细外观描述\",\"sizeClass\":\"handheld\",\"isScene\":false,\"isEquipable\":true,\"photoQuality\":{\"clarity\":0,\"subjectArea\":0,\"backgroundClean\":0,\"realPhoto\":0,\"focusLight\":0,\"interesting\":0},\"statAffinity\":[{\"stat\":\"attack\",\"score\":3}],\"specialAffinity\":[],\"description\":\"面向玩家的一句短描述\",\"reason\":\"一句短判断依据\",\"tags\":[\"标签\"],\"confidence\":0.0}",
  "",
  "画作质量 photoQuality，必须主动拉开差距：",
  "clarity=主体可识别性 0-3：0空白/乱线；1只能猜大概；2能认出主体；3一眼能认出。",
  "subjectArea=主体占比和完整度 0-3：0没有主体；1很小或残缺；2占主要位置；3完整且突出。",
  "backgroundClean=背景/杂线干扰 0-2：0杂线严重；1有少量干扰；2背景干净。",
  "realPhoto=绘制意图和完成度 0-3：0随机痕迹；1草率少线；2轮廓完整；3有细节或完成感。这里不是现实实拍感。",
  "focusLight=线条和配色控制 0-2：0线条断裂混乱或颜色干扰；1线条/颜色基本可读；2线条稳定、配色帮助识别。",
  "interesting=美观/创意/装备吸引力 0-2：0普通或无设计；1有一点造型；2美观、酷炫或有趣。",
  "质量参考：乱线/空白 0-3；勉强可辨认 4-7；主体清楚但普通 8-11；线条配色较好、有明确装备联想 12-13；主体鲜明且美观/有创意 14-15。",
  "",
  "属性语义：",
  "statAffinity 只输出属性倾向，score 用 1-3，最大 3 项。可选 stat：hp、attack、defense、speed、shield、lifesteal、regen。",
  "属性必须跟画出来的主体强相关，不要为了让装备变强而乱配。attack=剑刃、刀、斧、弓箭、尖刺、爪牙、火焰、雷电、爆炸等进攻证据；defense=铠甲、墙、龟壳、厚重外壳；shield=盾牌、圆环屏障、保护罩；speed=翅膀、风、闪电、轮子、飞行、箭头、靴子；lifesteal=吸血、尖牙、血滴、黑暗抽取；regen=水、草、药、光、治愈、泉水；hp=生命、食物、果实、爱心、能量核心。",
  "圆形/星形/笑脸/普通符号不要默认 attack；更常见是护符、徽记、圆环、屏障、生命或回复倾向。魔杖/法杖只有在长柄和杖头明确时才能给 attack 或特殊效果。",
  `特殊效果倾向 specialAffinity 只能从这些 key 里选，最多 2 个候选：${photoSpecialEffects.map((effect) => `${effect.key}=${effect.label}(价值${effect.value})`).join("；")}。`,
  "",
  "命名和描述：",
  "itemName 要具体、短、有画面感，像是在给真实装备命名，例如 星火短剑、蓝纹护符、龙鳞坠饰、笑脸圆盾、风羽靴、尖牙项链。只有确实画出长柄杖形，才可以叫星纹魔杖或法杖；不要叫 画作装备、神秘涂鸦、手绘短剑、万能魔杖、幻想武器。",
  "description 用一句中文写成装备味道，可以比照片模式更有想象力，但不要直接承诺最终数值或战斗效果，也不要说这是一幅画或纸上的东西。",
  "reason 只写一句内部依据，格式尽量像：主体=火焰短剑；证据=黑线剑身+红橙火焰；质量=线条清楚；倾向=攻击。",
  "",
  "输出示例：",
  "{\"itemName\":\"星火短剑\",\"subjectName\":\"火焰短剑\",\"objectType\":\"幻想武器\",\"identityDescription\":\"白色底上有一把黑线短剑，剑身有握柄和尖端，剑尖带红橙色火焰，左侧有两颗蓝色星点。\",\"sizeClass\":\"handheld\",\"isScene\":false,\"isEquipable\":true,\"photoQuality\":{\"clarity\":3,\"subjectArea\":3,\"backgroundClean\":2,\"realPhoto\":3,\"focusLight\":2,\"interesting\":2},\"statAffinity\":[{\"stat\":\"attack\",\"score\":3},{\"stat\":\"speed\",\"score\":1}],\"specialAffinity\":[\"dealDamageAttack\"],\"description\":\"短剑的星火沿着剑脊跳动，适合在塔里劈开暗影。\",\"reason\":\"主体=火焰短剑；证据=剑身握柄+红橙火焰；质量=线条清楚；倾向=攻击。\",\"tags\":[\"火焰\",\"短剑\"],\"confidence\":0.86}",
].join("\n");

const statOrder = ["hp", "attack", "defense", "speed", "shield", "lifesteal", "regen"];

const heroForms = [
  {
    id: "hp",
    label: "生命",
    image: "form-hp.png",
    levels: {
      1: { stats: { hp: 30 }, effects: ["生命上限 +30"] },
      2: { stats: { hp: 40 }, effects: ["生命上限 +40", "击杀生命上限 +3", "击杀回复 6"], killMaxHp: 3, killHeal: 6 },
    },
  },
  {
    id: "attack",
    label: "攻击",
    image: "form-attack.png",
    levels: {
      1: { stats: { attack: 3, defense: -1 }, effects: ["攻击 +3", "防御 -1"] },
      2: { stats: { attack: 4 }, effects: ["攻击 +4", "无视25%防御（下取整）"], ignoreDefenseRatio: 0.25 },
    },
  },
  {
    id: "lifesteal",
    label: "吸血",
    image: "form-lifesteal.png",
    levels: {
      1: { stats: { lifesteal: 1 }, effects: ["吸血 +1"] },
      2: { stats: { lifesteal: 4, defense: -2 }, effects: ["吸血 +4", "防御 -2"] },
    },
  },
  {
    id: "regen",
    label: "回复",
    image: "form-regen.png",
    levels: {
      1: { stats: { regen: 1 }, effects: ["回复 +1"] },
      2: { stats: { regen: 2 }, effects: ["回复 +2", "回复也补护盾"], regenAffectsShield: true },
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
      2: { stats: { defense: 4 }, effects: ["防御 +4", "免疫前2次伤害"], damageImmunity: 2 },
    },
  },
  {
    id: "shield",
    label: "护盾",
    image: "form-shield.png",
    levels: {
      1: { stats: { shield: 10 }, effects: ["护盾 +10"] },
      2: { stats: { shield: 15 }, effects: ["护盾 +15", "护盾减少转为治疗"], shieldLossToHeal: true },
    },
  },
  {
    id: "greedy",
    label: "财迷",
    image: "form-greedy.png",
    levels: {
      1: { stats: {}, effects: ["胶卷掉落 +0.1"], filmDropBonus: 1 },
      2: { stats: {}, effects: ["胶卷掉落 +0.1", "携带胶卷依次增加攻防速"], filmDropBonus: 1, filmStatCycle: true },
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
const monsterAnimationBase = "./assets/monster-animations/";
const rewardIconBase = "./assets/rewards/";
const audioAssetBase = "./assets/audio/";
const musicAssetBase = "./assets/music/";

const defaultAudioSettings = {
  sfxEnabled: true,
  bgmEnabled: true,
  sfxVolume: 0.45,
  bgmVolume: 0.22,
};

const sfxGainBoost = 2.1;
let gameAudioContext = null;
const mediaAudioNodes = new WeakMap();
const sfxAudioBaseVolumes = new WeakMap();
const intentionalBgmPauseUntil = new WeakMap();
const bgmLoopHoldUntil = new WeakMap();
const bgmFadeScales = new WeakMap();
const bgmFadeTimers = new WeakMap();
const bgmAudioCache = {};
const activeSfxAudios = new Set();
const pooledSfxAudios = new WeakSet();
const sfxCleanupCallbacks = new WeakMap();
let bgmPreloadStarted = false;
let bgmPlayAttemptToken = 0;
let bgmFallbackStopTimer = 0;
let bgmLoopRestartTimer = 0;
let bgmLoopRestartKey = "";
let bgmLoopRestartAudio = null;
let audioRecoveryRetryTimer = 0;
const audioRecoveryCooldownMs = 180;
const bgmLoopDelayMs = 1000;
const bgmCrossfadeMs = 720;
const bgmCrossfadeStepMs = 60;
const sfxPoolSize = 5;
const sfxPoolMaxSize = 8;

const defaultTutorialState = {
  photoStarted: false,
  battleHintSeen: false,
  postKillHintShown: false,
  introEnteredTower: false,
};

const soundEffects = {
  appraisalSuccess: { file: "appraisal-success.mp3", volume: 0.74, cooldown: 260 },
  battleHit: { file: "battle-hit.mp3", volume: 0.58, cooldown: 90 },
  dismantle: { file: "dismantle.mp3", volume: 0.7, cooldown: 260 },
  nextFloor: { file: "next-floor.mp3", volume: 0.66, cooldown: 220 },
};

const bgmTracks = {
  opening: { file: "opening-nightmare.mp3", title: "噩梦" },
  area1: { file: "area-01-bloody-labyrinth.mp3", title: "血之迷宫" },
  area2: { file: "area-02-immortal-corps.mp3", title: "不朽军团" },
  area3: { file: "area-03-killer-trap.mp3", title: "杀人陷阱" },
  area4: { file: "area-04-rock-n-roll.mp3", title: "忠于摇滚" },
  skeletonCaptain: { file: "boss-skeleton-captain.mp3", title: "骷髅队长" },
  vampire: { file: "boss-vampire.mp3", title: "吸血鬼" },
  knightCaptain: { file: "boss-knight-captain.mp3", title: "黄金骑士" },
  octopus: { file: "boss-octopus.mp3", title: "梦想未来" },
  dragon: { file: "boss-dragon.mp3", title: "魔王芝诺" },
  archmage: { file: "boss-archmage.mp3", title: "大法师" },
  demon: { file: "boss-final-demon.mp3", title: "最终决战" },
  reward: { file: "reward-lucky-gold.mp3", title: "幸运金币" },
  ending: { file: "ending.mp3", title: "终曲" },
  defeat: { file: "defeat-conversation.mp3", title: "Conversation" },
};

const bgmPreloadOrder = [
  "opening",
  "area1",
  "skeletonCaptain",
  "area2",
  "vampire",
  "octopus",
  "area3",
  "knightCaptain",
  "dragon",
  "archmage",
  "area4",
  "demon",
  "reward",
  "ending",
  "defeat",
];

const introRewardOptions = [
  { id: "intro-film-1", title: "胶卷", effect: "+1.0 胶卷", desc: "点亮空装备格，按下拍照，把身边小物带进塔中。", icon: "boss-film-drop.png" },
  { id: "intro-film-2", title: "胶卷", effect: "+1.0 胶卷", desc: "在鉴定台填好图文 API，按钮亮起后再鉴定照片。", icon: "boss-film-drop.png" },
  { id: "intro-film-3", title: "胶卷", effect: "+1.0 胶卷", desc: "入塔后点击怪物卡选定目标，按战斗夺回新的胶卷。", icon: "boss-film-drop.png" },
];

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

const monsterAnimations = {
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
  slime: { name: "史莱姆", atk: 6, def: 0, hp: 20, speed: 2, traits: [{ type: "regen", value: 1, text: "回复1" }] },
  skeleton: { name: "骷髅", atk: 8, def: 5, hp: 32, speed: 3, traits: [{ type: "noLifesteal", text: "制裁：无法吸血" }] },
  bat: { name: "蝙蝠", atk: 8, def: 0, hp: 16, speed: 6, traits: [{ type: "lifesteal", value: 1, text: "吸血1" }] },
  mage: { name: "法师", atk: 6, def: 2, hp: 30, speed: 3, traits: [{ type: "magic", text: "魔攻：无视防御" }] },
  wizard: { name: "巫师", atk: 10, def: 5, hp: 42, speed: 4, traits: [{ type: "defenseBreakAura", value: 50, text: "阻击：敌方防御-50%" }] },
  guard: { name: "卫兵", atk: 8, def: 8, hp: 50, speed: 2, traits: [{ type: "teamShield", value: 20, text: "护阵：全体护盾+20" }] },
  knight: { name: "骑士", atk: 15, def: 6, hp: 45, speed: 4, traits: [{ type: "noRegen", text: "红莲：无法回复" }] },
  golem: { name: "石头人", atk: 15, def: 18, hp: 8, speed: 1, traits: [{ type: "sturdy", text: "坚固：防御至少为敌方攻击-1" }] },
  patrol: { name: "警卫", atk: 16, def: 6, hp: 50, speed: 4, traits: [{ type: "breakShield", text: "破盾：开局护盾清0" }] },
  octopus: { name: "章鱼", atk: 1, def: 0, hp: 120, speed: 2, traits: [{ type: "giant", value: 120, text: "巨物：攻击增加与勇者的生命上限差" }] },
  dragon: { name: "魔龙", atk: 24, def: 10, hp: 80, speed: 3, traits: [{ type: "speedUpOnAttack", value: 1, text: "龙威：每次攻击速度+1" }] },
  vampire: { name: "吸血鬼", atk: 15, def: 0, hp: 66, speed: 6, traits: [{ type: "lifesteal", value: 6, text: "吸血6" }] },
  demon: { name: "魔王", atk: 18, def: 8, hp: 100, speed: 4, traits: [{ type: "promotion", text: "晋升：攻击涨防，被攻击涨攻" }] },
  orc: { name: "兽人", atk: 12, def: 7, hp: 60, speed: 2, traits: [{ type: "regen", value: 5, text: "回复5" }] },
  swordsman: { name: "剑士", atk: 30, def: 0, hp: 20, speed: 5, traits: [{ type: "multiHit", value: 2, text: "连击2" }] },
  warrior: { name: "战士", atk: 12, def: 5, hp: 30, speed: 2, traits: [{ type: "teamWarcry", atk: 3, def: 3, speed: 1, text: "战意：全体攻防+3，速+1" }] },
  archmage: { name: "大法师", atk: 10, def: 5, hp: 72, speed: 3, traits: [{ type: "magic", text: "魔攻：无视防御" }, { type: "summonMageOnAttack", text: "召唤：有空位则召唤法师" }] },
  skeletonCaptain: { name: "骷髅队长", atk: 12, def: 5, hp: 44, speed: 3, traits: [{ type: "noLifesteal", text: "制裁：无法吸血" }] },
  knightCaptain: { name: "骑士队长", atk: 15, def: 3, hp: 40, speed: 4, traits: [{ type: "summonGuards", text: "群殴：开战召唤2个卫兵" }] },
};

const normalMonsterUnlocks = [
  { floor: 1, key: "slime", weight: 20, tier: 1 },
  { floor: 2, key: "bat", weight: 9, tier: 1 },
  { floor: 3, key: "skeleton", weight: 9, tier: 1 },
  { floor: 5, key: "mage", weight: 7, tier: 2 },
  { floor: 10, key: "orc", weight: 7, tier: 2 },
  { floor: 10, key: "golem", weight: 5, tier: 2 },
  { floor: 11, key: "wizard", weight: 6, tier: 3 },
  { floor: 13, key: "guard", weight: 5, tier: 3 },
  { floor: 15, key: "knight", weight: 6, tier: 3 },
  { floor: 17, key: "patrol", weight: 5, tier: 4 },
  { floor: 21, key: "warrior", weight: 5, tier: 4 },
  { floor: 23, key: "swordsman", weight: 4, tier: 4 },
];

const floorNarratives = {
  1: "塔门在身后合上，石阶潮得发亮。先从这些黏糊糊的守门怪身上找找手感。",
  2: "墙缝里掠过翅影，脚步声被拉得很长。接下来，谁更快出手会更要命。",
  3: "旧骨头敲着地面靠近，硬壳和骨盾开始挡在路中央。",
  5: "细小火星在空气里游走。法师的火不会问你防御有多高。",
  8: "楼道尽头传来石块滚动声。打不穿外壳，就会被它们拖进漫长缠斗。",
  11: "寒气从更高处落下来。熟悉的弱怪还在游荡，真正麻烦的东西也混了进来。",
  21: "墙上的爪痕一层比一层深。想多收胶卷，就要把每一次战损都算清楚。",
  37: "塔顶的风从门缝灌下来，火把被吹得几乎贴住墙面。最后几层不会给勇者太多喘息。",
};

const bossFloorNarratives = {
  10: "第十层的封门骨锁咔哒落下。骷髅队长举起锈剑，像在点名第一位真正的登塔者。",
  20: "暗红烛火沿墙面倒流，吸血鬼在门前欠身。它守的不是楼梯，是勇者每一次松懈。",
  30: "骑士队长把长枪钉进石缝，卫兵影子从两侧合拢。封门者已经列阵，只等勇者选定顺序。",
  40: "塔顶风声忽然停了。魔王立在最后一扇门前，所有照片装备的来历，都将在这里写成结局。",
};

const rewardBossFloorNarratives = {
  25: "水声从楼梯缝里漫上来，章鱼把奖励牌压在湿滑台阶上。绕过去很稳，伸手去拿就要付价。",
  35: "龙翼扫过墙面，灰尘像雨一样落下。魔龙并不封路，只守着一份足以改变后续鉴定的贪念。",
  38: "大法师把通往塔顶的路照得发白。这不是必经的门，却可能是登顶前最后一次豪赌。",
};

const els = {
  gameModeBtn: byId("gameModeBtn"),
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
  musicToggleBtn: byId("musicToggleBtn"),
  sfxEnabledInput: byId("sfxEnabledInput"),
  sfxVolumeInput: byId("sfxVolumeInput"),
  sfxVolumeText: byId("sfxVolumeText"),
  bgmEnabledInput: byId("bgmEnabledInput"),
  bgmVolumeInput: byId("bgmVolumeInput"),
  bgmVolumeText: byId("bgmVolumeText"),
  nowPlayingText: byId("nowPlayingText"),
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
  savePhotoBtn: byId("savePhotoBtn"),
  equipmentDetailImageBtn: byId("equipmentDetailImageBtn"),
  equipmentDetailImage: byId("equipmentDetailImage"),
  pendingPhotoPreview: byId("pendingPhotoPreview"),
  pendingPhotoImage: byId("pendingPhotoImage"),
  pendingCropOverlay: byId("pendingCropOverlay"),
  pendingCropBox: byId("pendingCropBox"),
  discardItemBtn: byId("discardItemBtn"),
  loadingState: byId("loadingState"),
  desktopInputHint: byId("desktopInputHint"),
  battleLog: byId("battleLog"),
  imageViewer: byId("imageViewer"),
  imageViewerImage: byId("imageViewerImage"),
  imageViewerCaption: byId("imageViewerCaption"),
  viewerCropOverlay: byId("viewerCropOverlay"),
  viewerCropBox: byId("viewerCropBox"),
  viewerCropActions: byId("viewerCropActions"),
  viewerCropConfirm: byId("viewerCropConfirm"),
  viewerCropCancel: byId("viewerCropCancel"),
  drawingModal: byId("drawingModal"),
  drawingCanvas: byId("drawingCanvas"),
  drawingCancelBtn: byId("drawingCancelBtn"),
  drawingUseBtn: byId("drawingUseBtn"),
  drawingClearBtn: byId("drawingClearBtn"),
};

const state = {
  playMode: defaultHeroMode,
  player: createDefaultPlayer(),
  runSeed: makeRunSeed(),
  floor: introFloor,
  encounterId: "",
  enemies: [],
  selectedEnemyIds: [],
  introRewardSelectedIds: [],
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
  pendingSourceMode: defaultHeroMode,
  pendingCropRect: null,
  cropMode: false,
  cropDrag: null,
  viewerCropActive: false,
  viewerCropDrag: null,
  latestItem: null,
  filmShards: 0,
  filmRolls: initialFilmRolls,
  lootError: "",
  log: ["选择空装备格，拍下身边物品开始鉴定。"],
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
  lastAppraisalTiming: null,
  careerSummary: null,
  careerSummaryRequest: null,
  bossRewardDeck: null,
  globalStats: createDefaultGlobalStats(),
  globalStatsStatus: "统计加载中...",
  audioUnlocked: false,
  audioLastPlayedAt: {},
  audioEvents: [],
  audioSettings: { ...defaultAudioSettings },
  bgmAudio: null,
  bgmKey: "",
  bgmEvents: [],
  audioLastRecoveryAt: 0,
  audioRecoveryCount: 0,
  audioLastRecoveryReason: "",
  audioLastContextState: "",
  lastAudioResumeError: "",
  lastBgmPlayError: "",
  lastSfxPlayError: "",
  bgmWatchKey: "",
  bgmWatchCurrentTime: 0,
  bgmWatchProgressAt: 0,
  drawing: { ...defaultDrawingState },
  tutorial: { ...defaultTutorialState },
};

loadConfig();
loadSave();
initGlobalStats();
ensureEncounter();
ensureInitialFloorNarrative();
bindEvents();
ensureBgmForGameState(true);
render();

function normalizeHeroMode(mode) {
  return heroModes[mode]?.id || defaultHeroMode;
}

function getHeroMode(mode = state.playMode) {
  return heroModes[normalizeHeroMode(mode)];
}

function isDrawingMode(mode = state.playMode) {
  return normalizeHeroMode(mode) === "drawing";
}

function getPendingSourceMode() {
  return normalizeHeroMode(state.pendingSourceMode || state.playMode);
}

function getGameTitle(mode = state.playMode) {
  return getHeroMode(mode).title;
}

function getResourceName(mode = state.playMode) {
  return getHeroMode(mode).resource;
}

function getResourceShardName(mode = state.playMode) {
  return getHeroMode(mode).resourceShard;
}

function getInputActionName(mode = state.playMode) {
  return getHeroMode(mode).action;
}

function getPendingImageLabel(mode = getPendingSourceMode()) {
  return getHeroMode(mode).pending;
}

function getEquipmentSourceLabel(mode = state.playMode) {
  return getHeroMode(mode).equipment;
}

function modeText(text, mode = state.playMode) {
  if (!isDrawingMode(mode)) return String(text || "");
  return String(text || "")
    .replace(/照片勇者/g, "画图勇者")
    .replace(/照片装备/g, "画作装备")
    .replace(/照片/g, "画作")
    .replace(/拍照/g, "画图")
    .replace(/胶卷碎片/g, "画布碎片")
    .replace(/胶卷/g, "画布")
    .replace(/胶片/g, "画纸");
}

function renderGameMode() {
  const mode = getHeroMode();
  document.body.dataset.playMode = mode.id === "drawing" ? "drawing" : "photo";
  document.title = mode.title;
  if (els.gameModeBtn) {
    const nextTitle = isDrawingMode() ? "照片勇者" : "画图勇者";
    els.gameModeBtn.textContent = mode.title;
    els.gameModeBtn.title = `切换为${nextTitle}`;
    els.gameModeBtn.setAttribute("aria-label", `当前是${mode.title}，点击切换为${nextTitle}`);
  }
  if (els.desktopInputHint) {
    els.desktopInputHint.textContent = isDrawingMode()
      ? "桌面端点击画图打开画布；画完后放入装备格，再交给鉴定台。"
      : "桌面端可把图片拖到这里，或点击信息框后按 Ctrl+V 粘贴图片。";
  }
}

function toggleHeroMode() {
  state.playMode = isDrawingMode() ? "photo" : "drawing";
  closeDrawingModal();
  saveConfig(false);
  saveGame();
  render({ skipBgmEnsure: true });
}

function getSoundEffectAudio(key) {
  const effect = soundEffects[key];
  if (!effect) return null;
  if (!effect.audio) {
    effect.audio = createSoundEffectAudioElement(effect);
  }
  return effect.audio;
}

function createSoundEffectAudioElement(effect, pooled = false) {
  const audio = new Audio(`${audioAssetBase}${effect.file}`);
  audio.preload = "auto";
  audio.volume = getElementSafeSfxVolume(effect.volume);
  sfxAudioBaseVolumes.set(audio, effect.volume);
  if (pooled) pooledSfxAudios.add(audio);
  return audio;
}

function primeSoundEffectPool(key) {
  const effect = soundEffects[key];
  if (!effect) return [];
  const created = !effect.pool;
  if (!effect.pool) {
    effect.pool = Array.from({ length: sfxPoolSize }, () => createSoundEffectAudioElement(effect, true));
    effect.poolIndex = 0;
  }
  for (const audio of effect.pool) {
    audio.volume = getElementSafeSfxVolume(effect.volume);
    try {
      if (created || (audio.paused && audio.readyState === 0)) audio.load?.();
    } catch {
      // Preloading SFX is best-effort.
    }
  }
  return effect.pool;
}

function getSoundEffectPlaybackAudio(key) {
  const effect = soundEffects[key];
  if (!effect) return null;
  const pool = primeSoundEffectPool(key);
  const reusable = pool.find((audio) => audio.paused || audio.ended);
  if (reusable) return reusable;
  if (pool.length < sfxPoolMaxSize) {
    const audio = createSoundEffectAudioElement(effect, true);
    pool.push(audio);
    try {
      audio.load?.();
    } catch {
      // Loading a just-in-time SFX slot is best-effort.
    }
    return audio;
  }
  const index = effect.poolIndex || 0;
  effect.poolIndex = (index + 1) % pool.length;
  return pool[index] || getSoundEffectAudio(key);
}

function unlockGameAudio() {
  if (state.audioUnlocked) {
    recoverGameAudio("unlock-repeat");
    return;
  }
  state.audioUnlocked = true;
  resumeGameAudioContext();
  for (const key of Object.keys(soundEffects)) {
    const audio = getSoundEffectAudio(key);
    audio?.load?.();
    primeSoundEffectPool(key);
  }
  preloadBgmTracksInOrder();
  ensureBgmForGameState(true);
  recoverGameAudio("unlock", { force: true });
}

function formatAudioError(error) {
  if (!error) return "";
  const name = error.name ? `${error.name}: ` : "";
  const message = error.message || String(error);
  return `${name}${message}`.slice(0, 180);
}

function shouldBgmBeAudible() {
  return Boolean(
    state.audioUnlocked &&
    state.audioSettings.bgmEnabled &&
    state.audioSettings.bgmVolume > 0 &&
    state.bgmKey,
  );
}

function updateActiveSfxAudioVolumes() {
  const context = gameAudioContext;
  for (const audio of activeSfxAudios) {
    const baseVolume = sfxAudioBaseVolumes.get(audio) ?? 1;
    if (context?.state === "running" && setBoostedAudioGain(audio, getEffectiveSfxGain(baseVolume))) {
      audio.volume = 1;
    } else {
      audio.volume = getElementSafeSfxVolume(baseVolume);
    }
  }
}

function clearAudioRecoveryRetry() {
  if (!audioRecoveryRetryTimer) return;
  window.clearTimeout(audioRecoveryRetryTimer);
  audioRecoveryRetryTimer = 0;
}

function clearBgmLoopRestart(key = "", audio = null) {
  if (key && bgmLoopRestartKey && key !== bgmLoopRestartKey) return;
  if (audio && bgmLoopRestartAudio && audio !== bgmLoopRestartAudio) return;
  if (bgmLoopRestartTimer) window.clearTimeout(bgmLoopRestartTimer);
  bgmLoopRestartTimer = 0;
  bgmLoopRestartKey = "";
  bgmLoopRestartAudio = null;
}

function getBgmLoopHoldRemaining(audio = state.bgmAudio) {
  return Math.max(0, (bgmLoopHoldUntil.get(audio) || 0) - Date.now());
}

function scheduleAudioRecovery(reason = "scheduled", delay = 360) {
  if (audioRecoveryRetryTimer) return;
  audioRecoveryRetryTimer = window.setTimeout(() => {
    audioRecoveryRetryTimer = 0;
    recoverGameAudio(reason, { force: true });
  }, delay);
}

function recoverGameAudio(reason = "recover", options = {}) {
  if (!state.audioUnlocked) return false;
  const now = Date.now();
  if (!options.force && now - state.audioLastRecoveryAt < audioRecoveryCooldownMs) return false;
  state.audioLastRecoveryAt = now;
  state.audioRecoveryCount += 1;
  state.audioLastRecoveryReason = reason;

  const context = resumeGameAudioContext();
  state.audioLastContextState = context?.state || "";
  updateActiveSfxAudioVolumes();

  if (!shouldBgmBeAudible()) return true;

  const expectedKey = getBgmKeyForGameState();
  if (expectedKey && expectedKey !== state.bgmKey) {
    playBgm(expectedKey, { restart: true });
    return true;
  }

  if (!state.bgmAudio) state.bgmAudio = getBgmAudio(state.bgmKey);
  const audio = state.bgmAudio;
  if (!audio) return true;

  updateBgmAudioElementVolume(audio);
  if (getBgmLoopHoldRemaining(audio) > 0) return true;
  if (isBgmPlaying(audio) && !options.restartPlaying) {
    updateBgmWatchProgress(audio);
    return true;
  }
  if (audio.error) {
    state.lastBgmPlayError = formatAudioError(audio.error);
    try {
      audio.load();
    } catch {
      // Loading recovery is best-effort.
    }
  } else if (audio.readyState === 0) {
    try {
      audio.load();
    } catch {
      // Loading recovery is best-effort.
    }
  }
  if (audio.ended) audio.currentTime = 0;

  const contextNeedsResume = Boolean(context && context.state !== "running" && context.state !== "closed");
  if (options.restartPlaying && isBgmPlaying(audio)) {
    try {
      const resumeAt = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      intentionalBgmPauseUntil.set(audio, Date.now() + 360);
      audio.pause();
      audio.currentTime = Math.max(0, resumeAt);
    } catch {
      // If a browser rejects seeking during recovery, play() below still gets a chance.
    }
  }
  const shouldForcePlay = Boolean(audio.paused || audio.ended || contextNeedsResume || options.restartPlaying);
  if (options.force || shouldForcePlay) {
    playCurrentBgmAudio({ force: shouldForcePlay });
  }
  return true;
}

function updateBgmWatchProgress(audio) {
  if (!audio || audio.paused || audio.ended) return;
  state.bgmWatchKey = state.bgmKey;
  state.bgmWatchCurrentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  state.bgmWatchProgressAt = Date.now();
}

function resetBgmWatchProgress() {
  state.bgmWatchKey = "";
  state.bgmWatchCurrentTime = 0;
  state.bgmWatchProgressAt = 0;
}

function isBgmPlaying(audio = state.bgmAudio) {
  return Boolean(audio && !audio.paused && !audio.ended && !audio.error);
}

function checkBgmWatchdog() {
  if (!shouldBgmBeAudible()) return;
  if (state.lastBgmPlayError && Date.now() - state.audioLastRecoveryAt < 2500) return;
  const audio = state.bgmAudio;
  if (!audio) {
    recoverGameAudio("watchdog-missing-bgm", { force: true });
    return;
  }

  if (audio.paused || audio.ended || audio.error) {
    if (!audio.error && getBgmLoopHoldRemaining(audio) > 0) return;
    recoverGameAudio(audio.error ? "watchdog-bgm-error" : "watchdog-bgm-paused", { force: true });
    return;
  }

  const now = Date.now();
  const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  const sameTrack = state.bgmWatchKey === state.bgmKey;
  const progressed = !sameTrack || Math.abs(currentTime - state.bgmWatchCurrentTime) > 0.08;
  if (progressed) {
    updateBgmWatchProgress(audio);
    return;
  }

  if (now - state.bgmWatchProgressAt > 2600) {
    recoverGameAudio("watchdog-bgm-stalled", { force: true, restartPlaying: true });
    state.bgmWatchProgressAt = now;
  }
}

function playSoundEffect(key, options = {}) {
  const effect = soundEffects[key];
  if (!effect) return;
  const now = Date.now();
  const cooldown = Number.isFinite(options.cooldown) ? options.cooldown : effect.cooldown || 0;
  if (!options.force && now - (state.audioLastPlayedAt[key] || 0) < cooldown) return;
  state.audioLastPlayedAt[key] = now;
  state.audioEvents.push({ key, at: now });
  if (state.audioEvents.length > 24) state.audioEvents = state.audioEvents.slice(-24);
  if (!state.audioUnlocked || !state.audioSettings.sfxEnabled || state.audioSettings.sfxVolume <= 0) return;

  try {
    recoverGameAudio(`sfx:${key}`);
    const audio = getSoundEffectPlaybackAudio(key);
    if (!audio) return;
    const previousCleanup = sfxCleanupCallbacks.get(audio);
    previousCleanup?.();
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Some mobile browsers may reject currentTime before metadata is ready.
    }
    audio.preload = "auto";
    const baseVolume = Number.isFinite(options.volume) ? options.volume : effect.volume;
    sfxAudioBaseVolumes.set(audio, baseVolume);
    audio.volume = getElementSafeSfxVolume(baseVolume);
    const context = gameAudioContext;
    if (context?.state === "running" && attachBoostedAudioNode(audio, getEffectiveSfxGain(baseVolume))) {
      audio.volume = 1;
    }
    activeSfxAudios.add(audio);
    let cleanupTimer = 0;
    const cleanup = () => {
      audio.removeEventListener("ended", cleanup);
      audio.removeEventListener("error", cleanup);
      if (cleanupTimer) window.clearTimeout(cleanupTimer);
      cleanupTimer = 0;
      if (!pooledSfxAudios.has(audio)) detachBoostedAudioNode(audio);
      activeSfxAudios.delete(audio);
      sfxCleanupCallbacks.delete(audio);
    };
    sfxCleanupCallbacks.set(audio, cleanup);
    audio.addEventListener("ended", cleanup, { once: true });
    audio.addEventListener("error", cleanup, { once: true });
    cleanupTimer = window.setTimeout(cleanup, 3000);
    audio.play().catch((error) => {
      state.lastSfxPlayError = formatAudioError(error);
      cleanup();
    });
  } catch (error) {
    state.lastSfxPlayError = formatAudioError(error);
    // Audio is a cosmetic layer; never block combat or appraisal.
  }
}

function getElementSafeSfxVolume(baseVolume = 1) {
  return clampNumber((Number(baseVolume) || 0) * state.audioSettings.sfxVolume, 0, 1);
}

function getElementSafeBgmVolume() {
  return clampNumber(state.audioSettings.bgmVolume, 0, 1);
}

function getBgmVolumeForAudio(audio) {
  const scale = bgmFadeScales.has(audio) ? bgmFadeScales.get(audio) : 1;
  return clampNumber(getElementSafeBgmVolume() * clampNumber(scale, 0, 1), 0, 1);
}

function getEffectiveSfxGain(baseVolume = 1) {
  return Math.max(0, (Number(baseVolume) || 0) * state.audioSettings.sfxVolume * sfxGainBoost);
}

function getEffectiveBgmGain() {
  return getElementSafeBgmVolume();
}

function ensureGameAudioContext() {
  if (gameAudioContext) return gameAudioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    gameAudioContext = new AudioContextClass();
    return gameAudioContext;
  } catch {
    return null;
  }
}

function resumeGameAudioContext() {
  const context = ensureGameAudioContext();
  if (context?.state === "suspended") {
    context.resume?.()
      .then(() => {
        state.audioLastContextState = context.state || "";
        state.lastAudioResumeError = "";
        updateActiveSfxAudioVolumes();
      })
      .catch((error) => {
        state.lastAudioResumeError = formatAudioError(error);
        scheduleAudioRecovery("context-resume-failed", 800);
      });
  }
  state.audioLastContextState = context?.state || "";
  return context;
}

function attachBoostedAudioNode(audio, gainValue) {
  if (!audio) return false;
  const context = ensureGameAudioContext();
  if (!context || context.state !== "running") return false;
  try {
    const existing = mediaAudioNodes.get(audio);
    if (existing) {
      existing.gain.gain.value = Math.max(0, gainValue);
      return true;
    }
    const source = context.createMediaElementSource(audio);
    const gain = context.createGain();
    gain.gain.value = Math.max(0, gainValue);
    source.connect(gain).connect(context.destination);
    mediaAudioNodes.set(audio, { source, gain });
    return true;
  } catch {
    return false;
  }
}

function setBoostedAudioGain(audio, gainValue) {
  const existing = mediaAudioNodes.get(audio);
  if (existing) {
    existing.gain.gain.value = Math.max(0, gainValue);
    return true;
  }
  return attachBoostedAudioNode(audio, gainValue);
}

function detachBoostedAudioNode(audio) {
  const existing = mediaAudioNodes.get(audio);
  if (!existing) return;
  try {
    existing.source.disconnect();
    existing.gain.disconnect();
  } catch {
    // Ignore cleanup failures.
  }
  mediaAudioNodes.delete(audio);
}

function getBgmAudio(key) {
  const track = bgmTracks[key];
  if (!track) return null;
  if (bgmAudioCache[key]) {
    updateBgmAudioElementVolume(bgmAudioCache[key]);
    return bgmAudioCache[key];
  }
  const audio = document.createElement("audio");
  audio.preload = "auto";
  audio.loop = false;
  audio.src = `${musicAssetBase}${track.file}`;
  audio.addEventListener("ended", () => {
    scheduleBgmLoopRestart(key, audio);
  });
  audio.addEventListener("pause", () => {
    if (state.bgmKey !== key || state.bgmAudio !== audio) return;
    if ((intentionalBgmPauseUntil.get(audio) || 0) > Date.now()) return;
    if (getBgmLoopHoldRemaining(audio) > 0) return;
    if (!state.audioUnlocked || !state.audioSettings.bgmEnabled || state.audioSettings.bgmVolume <= 0) return;
    window.setTimeout(() => {
      if ((intentionalBgmPauseUntil.get(audio) || 0) > Date.now()) return;
      if (getBgmLoopHoldRemaining(audio) > 0) return;
      if (state.bgmKey === key && state.bgmAudio === audio && audio.paused) playCurrentBgmAudio();
    }, 160);
  });
  updateBgmAudioElementVolume(audio);
  bgmAudioCache[key] = audio;
  return audio;
}

function scheduleBgmLoopRestart(key, audio) {
  if (state.bgmKey !== key || state.bgmAudio !== audio) return;
  clearBgmLoopRestart(key, audio);
  bgmLoopHoldUntil.set(audio, Date.now() + bgmLoopDelayMs + 180);
  bgmLoopRestartKey = key;
  bgmLoopRestartAudio = audio;
  bgmLoopRestartTimer = window.setTimeout(() => {
    bgmLoopRestartTimer = 0;
    bgmLoopRestartKey = "";
    bgmLoopRestartAudio = null;
    if (state.bgmKey !== key || state.bgmAudio !== audio || !shouldBgmBeAudible()) return;
    audio.currentTime = 0;
    playCurrentBgmAudio({ force: true, reason: "loop" });
  }, bgmLoopDelayMs);
}

function updateBgmAudioElementVolume(audio) {
  if (!audio) return;
  audio.volume = getBgmVolumeForAudio(audio);
}

function clearBgmFade(audio) {
  if (!audio) return;
  const timer = bgmFadeTimers.get(audio);
  if (timer) window.clearInterval(timer);
  bgmFadeTimers.delete(audio);
}

function isBgmFading(audio) {
  return Boolean(audio && bgmFadeTimers.has(audio));
}

function fadeBgmAudioTo(audio, targetScale, options = {}) {
  if (!audio) return;
  clearBgmFade(audio);
  const duration = Math.max(0, Number(options.duration) || 0);
  const startScale = bgmFadeScales.has(audio) ? bgmFadeScales.get(audio) : 1;
  const endScale = clampNumber(targetScale, 0, 1);
  if (duration <= 0 || Math.abs(startScale - endScale) < 0.001) {
    bgmFadeScales.set(audio, endScale);
    updateBgmAudioElementVolume(audio);
    if (options.stopAfterFade) stopBgmAudioElement(audio);
    return;
  }
  const startedAt = Date.now();
  const tick = () => {
    const progress = clampNumber((Date.now() - startedAt) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const nextScale = startScale + (endScale - startScale) * eased;
    bgmFadeScales.set(audio, nextScale);
    updateBgmAudioElementVolume(audio);
    if (progress >= 1) {
      clearBgmFade(audio);
      bgmFadeScales.set(audio, endScale);
      updateBgmAudioElementVolume(audio);
      if (options.stopAfterFade) stopBgmAudioElement(audio);
    }
  };
  tick();
  bgmFadeTimers.set(audio, window.setInterval(tick, bgmCrossfadeStepMs));
}

function preloadBgmTracksInOrder() {
  if (bgmPreloadStarted) return;
  bgmPreloadStarted = true;
  bgmPreloadOrder
    .filter((key) => bgmTracks[key])
    .forEach((key, index) => {
      window.setTimeout(() => {
        const audio = getBgmAudio(key);
        if (key === state.bgmKey && audio === state.bgmAudio) return;
        try {
          audio?.load?.();
        } catch {
          // Preloading is best-effort; playback still falls back to normal loading.
        }
      }, index * 90);
    });
}

function stopBgmAudioElement(audio) {
  if (!audio) return;
  try {
    clearBgmFade(audio);
    bgmFadeScales.set(audio, 1);
    intentionalBgmPauseUntil.set(audio, Date.now() + 320);
    clearBgmLoopRestart("", audio);
    bgmLoopHoldUntil.set(audio, 0);
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // Ignore audio cleanup failures.
  }
}

function stopOtherBgmAudioElements(activeAudio) {
  Object.values(bgmAudioCache).forEach((audio) => {
    if (audio && audio !== activeAudio && !bgmFadeTimers.has(audio)) stopBgmAudioElement(audio);
  });
}

function playBgm(key, options = {}) {
  const track = bgmTracks[key];
  if (!track) return;
  if (state.bgmKey === key) {
    if (isBgmPlaying(state.bgmAudio)) return;
    if (getBgmLoopHoldRemaining(state.bgmAudio) > 0) return;
    pauseOrResumeBgm();
    return;
  }

  const previousAudio = state.bgmAudio;
  clearBgmLoopRestart();
  state.bgmKey = key;
  resetBgmWatchProgress();
  state.bgmEvents.push({ key, at: Date.now() });
  if (state.bgmEvents.length > 24) state.bgmEvents = state.bgmEvents.slice(-24);
  if (!state.audioUnlocked || !state.audioSettings.bgmEnabled || state.audioSettings.bgmVolume <= 0) {
    if (previousAudio) stopBgmAudioElement(previousAudio);
    state.bgmAudio = null;
    return;
  }
  state.bgmAudio = getBgmAudio(key);
  if (!state.bgmAudio) {
    if (previousAudio) stopBgmAudioElement(previousAudio);
    return;
  }
  try {
    state.bgmAudio.load?.();
  } catch {
    // Loading is best-effort; play() will retry through the recovery layer.
  }
  playCurrentBgmAudio({ previousAudio });
}

function stopBgm(clearKey = true) {
  clearAudioRecoveryRetry();
  if (bgmFallbackStopTimer) {
    window.clearTimeout(bgmFallbackStopTimer);
    bgmFallbackStopTimer = 0;
  }
  if (state.bgmAudio) stopBgmAudioElement(state.bgmAudio);
  stopOtherBgmAudioElements(state.bgmAudio);
  state.bgmAudio = null;
  resetBgmWatchProgress();
  if (clearKey) state.bgmKey = "";
}

function updateBgmVolume() {
  Object.values(bgmAudioCache).forEach(updateBgmAudioElementVolume);
}

function pauseOrResumeBgm() {
  if (!state.bgmAudio) {
    if (!state.audioUnlocked || !state.audioSettings.bgmEnabled || state.audioSettings.bgmVolume <= 0 || !state.bgmKey) return;
    state.bgmAudio = getBgmAudio(state.bgmKey);
    playCurrentBgmAudio();
    return;
  }
  updateBgmVolume();
  if (!state.audioUnlocked || !state.audioSettings.bgmEnabled || state.audioSettings.bgmVolume <= 0) {
    stopBgmAudioElement(state.bgmAudio);
    resetBgmWatchProgress();
    return;
  }
  if (isBgmPlaying(state.bgmAudio)) return;
  if (getBgmLoopHoldRemaining(state.bgmAudio) > 0) return;
  if (state.bgmAudio.ended) state.bgmAudio.currentTime = 0;
  playCurrentBgmAudio();
}

function playCurrentBgmAudio(options = {}) {
  const audio = state.bgmAudio;
  if (!audio) return;
  if (isBgmPlaying(audio) && !options.force) return;
  if (!options.force && getBgmLoopHoldRemaining(audio) > 0) return;
  clearBgmLoopRestart("", audio);
  bgmLoopHoldUntil.set(audio, 0);
  const previousAudio = options.previousAudio && options.previousAudio !== audio ? options.previousAudio : null;
  if (previousAudio && previousAudio !== audio) {
    bgmFadeScales.set(audio, 0);
  }
  updateBgmAudioElementVolume(audio);
  if (audio.ended) audio.currentTime = 0;
  const attemptToken = ++bgmPlayAttemptToken;
  const stopPrevious = () => {
    if (!previousAudio) return;
    fadeBgmAudioTo(previousAudio, 0, { duration: Math.min(320, bgmCrossfadeMs), stopAfterFade: true });
  };
  const startCurrentFadeIn = () => {
    if (!previousAudio) {
      bgmFadeScales.set(audio, 1);
      updateBgmAudioElementVolume(audio);
      return;
    }
    if (!isBgmFading(audio) && (bgmFadeScales.get(audio) || 0) < 0.999) {
      fadeBgmAudioTo(audio, 1, { duration: bgmCrossfadeMs });
    }
  };
  if (bgmFallbackStopTimer) {
    window.clearTimeout(bgmFallbackStopTimer);
    bgmFallbackStopTimer = 0;
  }
  const playPromise = audio.play();
  if (previousAudio) {
    startCurrentFadeIn();
    fadeBgmAudioTo(previousAudio, 0.015, { duration: Math.min(360, bgmCrossfadeMs) });
  }
  if (playPromise?.then) {
    playPromise
      .then(() => {
        if (attemptToken !== bgmPlayAttemptToken) return;
        state.lastBgmPlayError = "";
        clearAudioRecoveryRetry();
        updateBgmWatchProgress(audio);
        startCurrentFadeIn();
        stopPrevious();
        stopOtherBgmAudioElements(audio);
      })
      .catch((error) => {
        if (attemptToken !== bgmPlayAttemptToken) return;
        state.lastBgmPlayError = formatAudioError(error);
        clearBgmFade(audio);
        bgmFadeScales.set(audio, 0);
        updateBgmAudioElementVolume(audio);
        if (previousAudio && shouldBgmBeAudible()) {
          fadeBgmAudioTo(previousAudio, 1, { duration: 120 });
        }
        scheduleAudioRecovery("bgm-play-failed", 900);
      });
  } else {
    state.lastBgmPlayError = "";
    clearAudioRecoveryRetry();
    startCurrentFadeIn();
    stopPrevious();
    stopOtherBgmAudioElements(audio);
    updateBgmWatchProgress(audio);
  }
  if (previousAudio) {
    bgmFallbackStopTimer = window.setTimeout(() => {
      if (previousAudio !== state.bgmAudio && state.bgmAudio === audio && !audio.paused && !audio.ended && !state.lastBgmPlayError) {
        stopBgmAudioElement(previousAudio);
      }
      bgmFallbackStopTimer = 0;
    }, 1600);
  }
}

function getBgmKeyForGameState() {
  if (isPlayerDefeated()) return "defeat";
  if (state.gameClear) return "ending";
  if (state.bossReward) return "reward";
  const floorKey = getFloorBgmKey(state.floor);
  if (floorKey) return floorKey;
  return getAreaBgmKey(state.floor);
}

function getFloorBgmKey(floor = state.floor) {
  if (floor === 10) return "skeletonCaptain";
  if (floor === 20) return "vampire";
  if (floor === 25) return "octopus";
  if (floor === 30) return "knightCaptain";
  if (floor === 35) return "dragon";
  if (floor === 38) return "archmage";
  if (floor === 40) return "demon";
  return "";
}

function getAreaBgmKey(floor) {
  if (floor <= 0) return "opening";
  if (floor <= 10) return "area1";
  if (floor <= 20) return "area2";
  if (floor <= 30) return "area3";
  return "area4";
}

function ensureBgmForGameState(force = false) {
  const key = getBgmKeyForGameState();
  if (!key) {
    stopBgm();
    return;
  }
  if (state.bgmKey !== key) {
    playBgm(key, { restart: true });
  } else if (!isBgmPlaying(state.bgmAudio) && getBgmLoopHoldRemaining(state.bgmAudio) <= 0) {
    pauseOrResumeBgm();
  }
  renderAudioSettings();
}

function normalizeAudioSettings(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    sfxEnabled: source.sfxEnabled !== false,
    bgmEnabled: source.bgmEnabled !== false,
    sfxVolume: clampNumber(Number.isFinite(source.sfxVolume) ? source.sfxVolume : defaultAudioSettings.sfxVolume, 0, 1),
    bgmVolume: clampNumber(Number.isFinite(source.bgmVolume) ? source.bgmVolume : defaultAudioSettings.bgmVolume, 0, 1),
  };
}

function readAudioSettingsFromInputs() {
  return {
    sfxEnabled: els.sfxEnabledInput?.checked !== false,
    bgmEnabled: els.bgmEnabledInput?.checked !== false,
    sfxVolume: clampNumber((Number(els.sfxVolumeInput?.value) || 0) / 100, 0, 1),
    bgmVolume: clampNumber((Number(els.bgmVolumeInput?.value) || 0) / 100, 0, 1),
  };
}

function applyAudioSettingsFromInputs(persist = true) {
  state.audioSettings = normalizeAudioSettings(readAudioSettingsFromInputs());
  for (const effect of Object.values(soundEffects)) {
    if (effect.audio) effect.audio.volume = getElementSafeSfxVolume(effect.volume);
  }
  updateActiveSfxAudioVolumes();
  updateBgmVolume();
  pauseOrResumeBgm();
  renderAudioSettings();
  if (persist) saveConfig(false);
}

function renderAudioSettings() {
  if (!els.sfxEnabledInput) return;
  const settings = state.audioSettings;
  els.sfxEnabledInput.checked = settings.sfxEnabled;
  els.bgmEnabledInput.checked = settings.bgmEnabled;
  els.sfxVolumeInput.value = String(Math.round(settings.sfxVolume * 100));
  els.bgmVolumeInput.value = String(Math.round(settings.bgmVolume * 100));
  els.sfxVolumeText.textContent = `${Math.round(settings.sfxVolume * 100)}%`;
  els.bgmVolumeText.textContent = `${Math.round(settings.bgmVolume * 100)}%`;
  updateVolumeSliderFill(els.sfxVolumeInput);
  updateVolumeSliderFill(els.bgmVolumeInput);
  const track = bgmTracks[state.bgmKey || getBgmKeyForGameState()];
  els.nowPlayingText.textContent = track
    ? `正在播放：${track.title}`
    : "正在播放：塔内回声";
  els.musicToggleBtn?.setAttribute("data-muted", String(!settings.sfxEnabled && !settings.bgmEnabled));
  if (els.musicToggleBtn) {
    els.musicToggleBtn.title = track ? `当前音乐：${track.title}` : "音乐设置";
  }
}

function updateVolumeSliderFill(input) {
  if (!input) return;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value || min);
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty("--slider-fill", `${clampNumber(percent, 0, 100)}%`);
}

function bindEvents() {
  document.addEventListener("pointerdown", unlockGameAudio, { once: true, passive: true });
  document.addEventListener("keydown", unlockGameAudio, { once: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.drawingModal?.hidden) closeDrawingModal();
  });
  document.addEventListener("pointerdown", () => recoverGameAudio("gesture"), { passive: true });
  document.addEventListener("touchstart", () => recoverGameAudio("touch"), { passive: true });
  document.addEventListener("keydown", () => recoverGameAudio("keydown"));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) recoverGameAudio("visible", { force: true });
  });
  window.addEventListener("focus", () => recoverGameAudio("focus", { force: true }));
  window.addEventListener("pageshow", () => recoverGameAudio("pageshow", { force: true }));
  window.setInterval(checkBgmWatchdog, 1200);
  els.gameModeBtn?.addEventListener("click", toggleHeroMode);

  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => toggleSecondaryPanel(button.dataset.panelTarget || "none"));
  });

  [els.sfxEnabledInput, els.bgmEnabledInput, els.sfxVolumeInput, els.bgmVolumeInput].forEach((input) => {
    input?.addEventListener("input", () => applyAudioSettingsFromInputs(true));
    input?.addEventListener("change", () => applyAudioSettingsFromInputs(true));
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
  els.photoActionBtn.addEventListener("click", handlePhotoActionButtonClick);
  els.savePhotoBtn.addEventListener("click", handleSavePhotoButtonClick);
  els.analyzePhotoBtn.addEventListener("click", () => {
    if (isCareerSummaryOpen() && state.careerSummary) {
      downloadCareerSummaryImage();
      return;
    }
    if (isAnalyzingPhoto()) {
      cancelAnalyzePhoto();
      return;
    }
    analyzePhoto();
  });
  els.pendingPhotoPreview.addEventListener("click", handlePendingPhotoPreviewClick);
  els.pendingPhotoImage.addEventListener("load", renderPendingCropOverlay);
  els.equipmentDetailImageBtn.addEventListener("click", handleEquipmentDetailImageClick);
  els.discardItemBtn.addEventListener("click", handleDiscardAction);
  els.imageViewer.addEventListener("click", (event) => {
    if (event.target.closest(".viewer-crop-actions")) return;
    if (state.viewerCropActive) return;
    if (event.target === els.imageViewerImage) return;
    closeImageViewer();
  });
  els.imageViewerImage.addEventListener("pointerdown", handleViewerCropPointerDown);
  els.imageViewerImage.addEventListener("pointermove", handleViewerCropPointerMove);
  els.imageViewerImage.addEventListener("pointerup", handleViewerCropPointerUp);
  els.imageViewerImage.addEventListener("pointercancel", handleViewerCropPointerUp);
  els.imageViewerImage.addEventListener("load", renderViewerCropOverlay);
  els.viewerCropConfirm.addEventListener("click", confirmPendingCrop);
  els.viewerCropCancel.addEventListener("click", cancelViewerCropMode);
  [els.viewerCropConfirm, els.viewerCropCancel].forEach((button) => {
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      button.click();
    });
  });
  bindDrawingCanvasEvents();
  renderHeroForms();
}

function bindDrawingCanvasEvents() {
  const canvas = els.drawingCanvas;
  if (!canvas) return;
  canvas.addEventListener("pointerdown", handleDrawingPointerDown);
  canvas.addEventListener("pointermove", handleDrawingPointerMove);
  canvas.addEventListener("pointerup", handleDrawingPointerUp);
  canvas.addEventListener("pointercancel", handleDrawingPointerUp);
  els.drawingCancelBtn?.addEventListener("click", closeDrawingModal);
  els.drawingUseBtn?.addEventListener("click", useDrawingAsPendingPhoto);
  els.drawingClearBtn?.addEventListener("click", clearDrawingCanvas);
  document.querySelectorAll("[data-drawing-tool]").forEach((button) => {
    button.addEventListener("click", () => setDrawingTool(button.dataset.drawingTool || "brush"));
  });
  document.querySelectorAll("[data-drawing-color]").forEach((button) => {
    button.addEventListener("click", () => setDrawingColor(button.dataset.drawingColor || defaultDrawingState.color));
  });
  document.querySelectorAll("[data-drawing-size]").forEach((button) => {
    button.addEventListener("click", () => setDrawingSize(Number(button.dataset.drawingSize) || defaultDrawingState.size));
  });
}

function getDrawingContext() {
  return els.drawingCanvas?.getContext("2d", { willReadFrequently: true }) || null;
}

function prepareDrawingCanvas() {
  const canvas = els.drawingCanvas;
  const ctx = getDrawingContext();
  if (!canvas || !ctx) return;
  if (canvas.width !== drawingCanvasSize || canvas.height !== drawingCanvasSize) {
    canvas.width = drawingCanvasSize;
    canvas.height = drawingCanvasSize;
  }
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  state.drawing.hasMarks = false;
  state.drawing.lastPoint = null;
}

function openDrawingCanvasForSelectedSlot() {
  if (isCareerSummaryOpen() && state.careerSummary) {
    return;
  }
  const redrawPending = Boolean(state.lastPhoto && getPendingSourceMode() === "drawing");
  if (isEquipmentLocked() || (!redrawPending && hasPendingPhoto()) || isPlayerDefeated() || state.bossReward) {
    showInputNotice(getPhotoInputBlockedMessage());
    render();
    return;
  }
  const index = redrawPending ? clampSlotIndex(state.pendingPhotoSlotIndex) : getSelectedSlotIndex();
  if (getInventoryItemAt(index)) {
    showInputNotice(getPhotoInputBlockedMessage());
    render();
    return;
  }
  if (state.filmRolls < 1) {
    showInputNotice(`${getResourceName()}不足，先击败怪物攒到新的${getInputActionName()}机会。`);
    render();
    return;
  }
  state.tutorial.photoStarted = true;
  state.pendingPhotoSlotIndex = index;
  state.selectedSlotIndex = index;
  state.infoMode = "item";
  state.drawing.open = true;
  state.drawing.drawing = false;
  state.drawing.lastPoint = null;
  els.photoActionBtn.classList.remove("is-photo-callout");
  prepareDrawingCanvas();
  renderDrawingToolbar();
  els.drawingModal.hidden = false;
  saveGame();
  renderGameTextOnly();
}

function closeDrawingModal() {
  state.drawing.open = false;
  state.drawing.drawing = false;
  state.drawing.lastPoint = null;
  if (els.drawingModal) els.drawingModal.hidden = true;
}

function setDrawingTool(tool) {
  state.drawing.tool = tool === "eraser" ? "eraser" : "brush";
  renderDrawingToolbar();
}

function setDrawingColor(color) {
  state.drawing.color = /^#[0-9a-f]{6}$/i.test(String(color || "")) ? color : defaultDrawingState.color;
  state.drawing.tool = "brush";
  renderDrawingToolbar();
}

function setDrawingSize(size) {
  state.drawing.size = clampInt(size, 2, 48);
  renderDrawingToolbar();
}

function renderDrawingToolbar() {
  document.querySelectorAll("[data-drawing-tool]").forEach((button) => {
    const active = (button.dataset.drawingTool || "brush") === state.drawing.tool;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-drawing-color]").forEach((button) => {
    const active = (button.dataset.drawingColor || "") === state.drawing.color && state.drawing.tool === "brush";
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-drawing-size]").forEach((button) => {
    const active = Number(button.dataset.drawingSize) === state.drawing.size;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function getDrawingPoint(event) {
  const rect = els.drawingCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * els.drawingCanvas.width,
    y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * els.drawingCanvas.height,
  };
}

function handleDrawingPointerDown(event) {
  if (els.drawingModal.hidden) return;
  event.preventDefault();
  els.drawingCanvas.setPointerCapture?.(event.pointerId);
  state.drawing.drawing = true;
  const point = getDrawingPoint(event);
  state.drawing.lastPoint = point;
  drawOnCanvas(point, point);
}

function handleDrawingPointerMove(event) {
  if (!state.drawing.drawing || els.drawingModal.hidden) return;
  event.preventDefault();
  const point = getDrawingPoint(event);
  drawOnCanvas(state.drawing.lastPoint || point, point);
  state.drawing.lastPoint = point;
}

function handleDrawingPointerUp(event) {
  if (!state.drawing.drawing) return;
  event.preventDefault();
  state.drawing.drawing = false;
  state.drawing.lastPoint = null;
  els.drawingCanvas.releasePointerCapture?.(event.pointerId);
}

function drawOnCanvas(from, to) {
  const ctx = getDrawingContext();
  if (!ctx) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = state.drawing.tool === "eraser" ? state.drawing.size * 1.8 : state.drawing.size;
  ctx.strokeStyle = state.drawing.tool === "eraser" ? "#fffaf0" : state.drawing.color;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
  if (state.drawing.tool !== "eraser") state.drawing.hasMarks = true;
}

function clearDrawingCanvas() {
  prepareDrawingCanvas();
}

function useDrawingAsPendingPhoto() {
  if (!state.drawing.hasMarks) {
    showInputNotice("画布还是空的，先画一个主体再放入装备格。");
    render();
    return;
  }
  const dataUrl = els.drawingCanvas.toDataURL("image/jpeg", 0.88);
  state.lastPhoto = dataUrl;
  state.pendingSourceMode = "drawing";
  state.pendingCropRect = null;
  state.cropMode = false;
  state.cropDrag = null;
  state.pendingPhotoSlotIndex = getSelectedSlotIndex();
  state.lootError = "";
  state.infoMode = "item";
  state.tutorial.photoStarted = true;
  closeDrawingModal();
  setBusy("");
  render();
  renderGameTextOnly();
}

function openPhotoPicker() {
  els.fileInput.value = "";
  els.fileInput.click();
}

function openPhotoPickerForSelectedSlot() {
  if (isDrawingMode()) {
    openDrawingCanvasForSelectedSlot();
    return;
  }
  if (isCareerSummaryOpen() && state.careerSummary) {
    return;
  }
  if (isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || state.bossReward) {
    showInputNotice(getPhotoInputBlockedMessage());
    render();
    return;
  }
  const index = getSelectedSlotIndex();
  if (getInventoryItemAt(index)) {
    showInputNotice(getPhotoInputBlockedMessage());
    render();
    return;
  }
  state.tutorial.photoStarted = true;
  state.pendingPhotoSlotIndex = index;
  state.infoMode = "item";
  state.pendingSourceMode = "photo";
  els.photoActionBtn.classList.remove("is-photo-callout");
  openPhotoPicker();
  saveGame();
  renderGameTextOnly();
}

function handlePhotoActionButtonClick() {
  if (isCareerSummaryOpen() && state.careerSummary) return;
  if (state.lastPhoto && !isAnalyzingPhoto()) {
    if (getPendingSourceMode() === "drawing") {
      openDrawingCanvasForSelectedSlot();
      return;
    }
    if (state.cropMode) {
      confirmPendingCrop();
    } else {
      togglePendingCropMode();
    }
    return;
  }
  openPhotoPickerForSelectedSlot();
}

function handleSavePhotoButtonClick() {
  if (state.lastPhoto && !isAnalyzingPhoto()) {
    resetPendingCrop();
    return;
  }
  saveSelectedPhotoImage();
}

function handleEquipmentDetailClick(event) {
  if (event.target.closest("button")) return;
}

function handlePendingPhotoPreviewClick(event) {
  if (!state.lastPhoto || state.cropMode) return;
  event.stopPropagation();
  openImageViewer(state.lastPhoto, "待鉴定照片");
}

function handleEquipmentDetailImageClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const item = getSelectedInventoryItem();
  const image = item?.fullImage || item?.image || "";
  if (!image) return;
  openImageViewer(image, formatItemDisplayName(item), getItemQuality(scoreItem(item)));
}

function togglePendingCropMode() {
  if (!state.lastPhoto || isAnalyzingPhoto()) return;
  state.cropMode = true;
  state.viewerCropActive = true;
  if (!state.pendingCropRect) state.pendingCropRect = makeDefaultCropRect();
  state.cropDrag = null;
  state.viewerCropDrag = null;
  openImageViewer(state.lastPhoto, "圈定主体", null, { cropMode: true });
  renderEquipmentDetail();
}

function confirmPendingCrop() {
  if (!state.lastPhoto || !state.cropMode) return;
  state.pendingCropRect = normalizeCropRect(state.pendingCropRect || makeDefaultCropRect());
  state.cropMode = false;
  state.cropDrag = null;
  state.viewerCropActive = false;
  state.viewerCropDrag = null;
  closeImageViewer();
  renderEquipmentDetail();
  renderGameTextOnly();
}

function cancelViewerCropMode() {
  if (!state.cropMode) {
    closeImageViewer();
    return;
  }
  state.cropMode = false;
  state.viewerCropActive = false;
  state.cropDrag = null;
  state.viewerCropDrag = null;
  closeImageViewer();
  renderEquipmentDetail();
  renderGameTextOnly();
}

function resetPendingCrop() {
  if (!state.lastPhoto) return;
  state.pendingCropRect = null;
  state.cropMode = false;
  state.cropDrag = null;
  state.viewerCropActive = false;
  state.viewerCropDrag = null;
  closeImageViewer();
  renderEquipmentDetail();
  renderGameTextOnly();
}

function makeDefaultCropRect() {
  return { x: 0.12, y: 0.12, width: 0.76, height: 0.76 };
}

function normalizeCropRect(rect) {
  if (!rect || typeof rect !== "object") return null;
  let rawX = clampNumber(rect.x, 0, 1);
  let rawY = clampNumber(rect.y, 0, 1);
  let rawWidth = clampNumber(rect.width, 0.08, 1);
  let rawHeight = clampNumber(rect.height, 0.08, 1);
  if (rawX + rawWidth > 1 && rawWidth > 0.08) rawWidth = Math.max(0.08, 1 - rawX);
  if (rawY + rawHeight > 1 && rawHeight > 0.08) rawHeight = Math.max(0.08, 1 - rawY);
  const x = Math.min(rawX, 1 - rawWidth);
  const y = Math.min(rawY, 1 - rawHeight);
  return { x, y, width: Math.min(rawWidth, 1 - x), height: Math.min(rawHeight, 1 - y) };
}

function cropRectsAlmostEqual(a, b) {
  const rectA = normalizeCropRect(a);
  const rectB = normalizeCropRect(b);
  if (!rectA || !rectB) return false;
  return Math.abs(rectA.x - rectB.x) < 0.01
    && Math.abs(rectA.y - rectB.y) < 0.01
    && Math.abs(rectA.width - rectB.width) < 0.01
    && Math.abs(rectA.height - rectB.height) < 0.01;
}

function pointerToImagePoint(event, rect) {
  const x = clampNumber((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
  const y = clampNumber((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
  return { x, y };
}

function pointerToPreviewPoint(event) {
  return pointerToImagePoint(event, getPendingImageRenderedRect());
}

function getPendingImageRenderedRect() {
  const wrapper = els.pendingPhotoPreview.getBoundingClientRect();
  const image = els.pendingPhotoImage;
  const naturalWidth = image.naturalWidth || 1;
  const naturalHeight = image.naturalHeight || 1;
  const wrapperRatio = wrapper.width / Math.max(1, wrapper.height);
  const imageRatio = naturalWidth / Math.max(1, naturalHeight);
  if (imageRatio > wrapperRatio) {
    const height = wrapper.height;
    const width = height * imageRatio;
    return {
      left: wrapper.left - (width - wrapper.width) / 2,
      top: wrapper.top,
      width,
      height,
    };
  }
  const width = wrapper.width;
  const height = width / imageRatio;
  return {
    left: wrapper.left,
    top: wrapper.top - (height - wrapper.height) / 2,
    width,
    height,
  };
}

function getPendingImageBoxStyle() {
  const wrapper = els.pendingPhotoPreview.getBoundingClientRect();
  if (!wrapper.width || !wrapper.height) return null;
  const rendered = getPendingImageRenderedRect();
  return {
    left: ((rendered.left - wrapper.left) / wrapper.width) * 100,
    top: ((rendered.top - wrapper.top) / wrapper.height) * 100,
    width: (rendered.width / wrapper.width) * 100,
    height: (rendered.height / wrapper.height) * 100,
  };
}

function handlePendingCropPointerDown(event) {
  if (!state.cropMode || isAnalyzingPhoto() || !state.lastPhoto) return;
  event.preventDefault();
  event.stopPropagation();
  const point = pointerToPreviewPoint(event);
  state.cropDrag = { start: point, current: point };
  state.pendingCropRect = { x: point.x, y: point.y, width: 0.08, height: 0.08 };
  els.pendingPhotoPreview.setPointerCapture?.(event.pointerId);
  renderPendingCropOverlay();
}

function handlePendingCropPointerMove(event) {
  if (!state.cropMode || !state.cropDrag) return;
  event.preventDefault();
  const current = pointerToPreviewPoint(event);
  const start = state.cropDrag.start;
  state.cropDrag.current = current;
  state.pendingCropRect = normalizeCropRect({
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y),
  });
  renderPendingCropOverlay();
}

function handlePendingCropPointerUp(event) {
  if (!state.cropMode || !state.cropDrag) return;
  event.preventDefault();
  event.stopPropagation();
  state.cropDrag = null;
  state.pendingCropRect = normalizeCropRect(state.pendingCropRect || makeDefaultCropRect());
  els.pendingPhotoPreview.releasePointerCapture?.(event.pointerId);
  renderEquipmentDetail();
}

function getViewerImageRenderedRect() {
  return els.imageViewerImage.getBoundingClientRect();
}

function pointerToViewerPoint(event) {
  return pointerToImagePoint(event, getViewerImageRenderedRect());
}

function handleViewerCropPointerDown(event) {
  if (!state.viewerCropActive || !state.cropMode || isAnalyzingPhoto() || !state.lastPhoto) return;
  event.preventDefault();
  event.stopPropagation();
  const point = pointerToViewerPoint(event);
  state.viewerCropDrag = { start: point, current: point };
  state.pendingCropRect = { x: point.x, y: point.y, width: 0.08, height: 0.08 };
  els.imageViewerImage.setPointerCapture?.(event.pointerId);
  renderViewerCropOverlay();
}

function handleViewerCropPointerMove(event) {
  if (!state.viewerCropActive || !state.cropMode || !state.viewerCropDrag) return;
  event.preventDefault();
  const current = pointerToViewerPoint(event);
  const start = state.viewerCropDrag.start;
  state.viewerCropDrag.current = current;
  state.pendingCropRect = normalizeCropRect({
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y),
  });
  renderViewerCropOverlay();
}

function handleViewerCropPointerUp(event) {
  if (!state.viewerCropActive || !state.cropMode || !state.viewerCropDrag) return;
  event.preventDefault();
  event.stopPropagation();
  state.viewerCropDrag = null;
  state.pendingCropRect = normalizeCropRect(state.pendingCropRect || makeDefaultCropRect());
  els.imageViewerImage.releasePointerCapture?.(event.pointerId);
  renderViewerCropOverlay();
}

function canPreparePhotoInDetail() {
  if (isDrawingMode()) return false;
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
  if (state.gameClear) return modeText("通关后可以查看和保存本局装备，重开后照片会清空。");
  if (isPlayerDefeated()) return `${getGameTitle()}已经倒下，只能重开。`;
  if (state.bossReward) return "先确认一张 Boss 奖励牌。";
  if (isAnalyzingPhoto()) return `正在鉴定${getPendingImageLabel()}，先等待或取消鉴定。`;
  if (hasPendingPhoto()) return `已有待鉴定${getPendingImageLabel()}，先鉴定或放弃。`;
  if (isEquipmentLocked()) return `战斗中不能${getInputActionName()}鉴定。`;
  if (getInventoryItemAt(getSelectedSlotIndex())) return "当前装备格已有装备，请选择空格。";
  return `当前还不能放入${getPendingImageLabel(state.playMode)}。`;
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
  if (event.target.closest(".equipment-slot, .equipment-detail, .image-viewer, .drawing-modal, .secondary-area, .floor-action-row, [data-panel-target], .preset-button")) {
    return;
  }
  if (hasPendingPhoto()) return;
  if (state.infoMode === "item") {
    state.infoMode = "log";
    renderEquipmentDetail();
  }
}

function openImageViewer(src, caption = "", quality = null, options = {}) {
  if (!src) return;
  const safeQuality = quality && quality.key ? quality : null;
  els.imageViewerImage.src = src;
  const captionText = safeQuality?.label ? `${safeQuality.label} · ${caption}` : caption;
  els.imageViewerCaption.textContent = options.cropMode ? "拖出主体范围后点确认" : options.saveHint ? `${captionText} · 长按图片保存` : captionText;
  els.imageViewer.classList.toggle("is-save-fallback", Boolean(options.saveHint));
  els.imageViewer.classList.toggle("is-crop-editor", Boolean(options.cropMode));
  els.viewerCropActions.hidden = !options.cropMode;
  if (safeQuality) {
    els.imageViewer.dataset.quality = safeQuality.key;
    els.imageViewerCaption.dataset.quality = safeQuality.label || "";
  } else {
    delete els.imageViewer.dataset.quality;
    delete els.imageViewerCaption.dataset.quality;
  }
  els.imageViewer.hidden = false;
  renderViewerCropOverlay();
}

function closeImageViewer() {
  els.imageViewer.hidden = true;
  els.imageViewerImage.removeAttribute("src");
  els.imageViewerCaption.textContent = "";
  els.imageViewer.classList.remove("is-save-fallback", "is-crop-editor");
  els.viewerCropActions.hidden = true;
  state.viewerCropActive = false;
  state.viewerCropDrag = null;
  renderViewerCropOverlay();
  delete els.imageViewer.dataset.quality;
  delete els.imageViewerCaption.dataset.quality;
}

async function downloadCareerSummaryImage() {
  if (!state.careerSummary && !state.gameClear && !isPlayerDefeated()) return;
  const summary = state.careerSummary || buildLocalCareerSummary();
  const snapshot = summary.snapshot || buildCareerSnapshot();
  const outcome = getCareerSummaryOutcome(summary);
  const image = await makeCareerSummaryImage(summary, snapshot);
  await saveImageDataUrl(image, `photo-hero-${outcome}-ending-${new Date().toISOString().slice(0, 10)}.png`, "塔史分享图已保存。", {
    fallbackCaption: outcome === "defeat" ? "战败塔史分享图" : "通关塔史分享图",
  });
}

async function saveSelectedPhotoImage() {
  const item = getSelectedInventoryItem();
  const source = item?.fullImage || item?.image || "";
  if (!source) return;
  const fileName = makePhotoSaveFileName(item);
  await saveImageDataUrl(source, fileName, "照片已保存。", {
    fallbackCaption: formatItemDisplayName(item),
    fallbackQuality: getItemQuality(scoreItem(item)),
  });
}

async function saveImageDataUrl(image, fileName, successMessage = "图片已保存。", options = {}) {
  const mobileLike = isMobileLikeBrowser();
  try {
    const blob = await dataUrlToBlob(image);
    const shouldUseMobileShare = mobileLike && navigator.canShare && navigator.share && typeof File === "function";
    if (shouldUseMobileShare) {
      const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: getGameTitle() });
          addLog(successMessage);
          return "share";
        } catch (error) {
          showMobileSaveFallback(image, fileName, options);
          return "viewer";
        }
      }
    }

    if (mobileLike) {
      showMobileSaveFallback(image, fileName, options);
      return "viewer";
    }

    if (window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: "图片",
          accept: { [blob.type || "image/jpeg"]: [getFileExtension(fileName)] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      addLog(successMessage);
      return "file-picker";
    }

    downloadImageDataUrl(image, fileName);
    addLog(successMessage);
    return "download";
  } catch (error) {
    if (mobileLike) {
      showMobileSaveFallback(image, fileName, options);
      return "viewer";
    }
    if (error?.name === "AbortError") return "abort";
    downloadImageDataUrl(image, fileName);
    addLog("已改用浏览器下载保存。");
    return "download";
  } finally {
    render();
  }
}

function isMobileBrowser() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
}

function isMobileLikeBrowser() {
  return isMobileBrowser()
    || navigator.maxTouchPoints > 1
    || window.matchMedia?.("(pointer: coarse)")?.matches
    || window.innerWidth <= 620;
}

function showMobileSaveFallback(image, fileName, options = {}) {
  const caption = options.fallbackCaption || fileName.replace(/\.[^.]+$/, "");
  openImageViewer(image, caption, options.fallbackQuality || null, { saveHint: true });
  addLog("已打开原图，长按图片保存。");
}

function downloadImageDataUrl(image, fileName) {
  const link = document.createElement("a");
  link.href = image;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function makePhotoSaveFileName(item) {
  const name = sanitizeFileName(formatItemDisplayName(item) || getEquipmentSourceLabel(item?.sourceMode || state.playMode));
  return `photo-hero-${name}-${new Date().toISOString().slice(0, 10)}.jpg`;
}

function sanitizeFileName(name) {
  const clean = String(name || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 32);
  return clean || "photo";
}

function getFileExtension(fileName) {
  const match = String(fileName || "").match(/\.[a-z0-9]+$/i);
  return match ? match[0].toLowerCase() : ".jpg";
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
  await drawCareerSummaryCanvas(ctx, width, height, summary, snapshot);
  return canvas.toDataURL("image/png");
}

async function drawCareerSummaryCanvas(ctx, width, height, summary, snapshot) {
  const outcome = getCareerSummaryOutcome(summary);
  const isDefeat = outcome === "defeat";
  const accent = isDefeat ? "#d65b4f" : "#d09b3e";
  const accentSoft = isDefeat ? "#5a2e2b" : "#5b4324";
  ctx.fillStyle = "#0b0d0b";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#131713";
  for (let x = 0; x < width; x += 72) ctx.fillRect(x, 0, 3, height);
  for (let y = 0; y < height; y += 48) ctx.fillRect(0, y, width, 3);
  ctx.fillStyle = "rgba(255, 248, 216, 0.035)";
  for (let y = 26; y < height; y += 96) {
    for (let x = 34; x < width; x += 144) {
      ctx.fillRect(x, y, 46, 3);
    }
  }

  const margin = 62;
  roundRect(ctx, margin, margin, width - margin * 2, height - margin * 2, 18);
  ctx.fillStyle = "#202621";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#5f6a60";
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(margin + 14, margin + 14, width - margin * 2 - 28, height - margin * 2 - 28);

  const parsedSummary = getCareerSummaryParagraphs(summary);
  const floor = snapshot.defeatFloor || snapshot.floor || state.floor;
  const subtitle = isDefeat
    ? `${getCareerSummaryStatusText(summary)} · 止步第${floor}层`
    : `${getCareerSummaryStatusText(summary)} · 第${maxFloor}层通关`;
  const statRows = isDefeat
    ? [["层数", floor], ["击败", snapshot.killCount], ["装备", snapshot.equipmentCount]]
    : [["怪物", snapshot.killCount], ["Boss", snapshot.bossKillCount], ["装备", snapshot.equipmentCount]];

  ctx.fillStyle = accent;
  ctx.font = "900 46px sans-serif";
  ctx.fillText(isDefeat ? `${getGameTitle()}塔史残页` : `${getGameTitle()}塔顶旧史`, margin + 34, margin + 78);
  ctx.fillStyle = "#b9c2b8";
  ctx.font = "800 24px sans-serif";
  ctx.fillText(subtitle, margin + 36, margin + 118);

  const statY = margin + 168;
  const statWidth = (width - margin * 2 - 88) / 3;
  statRows.forEach(([label, value], index) => {
    const x = margin + 34 + index * (statWidth + 10);
    roundRect(ctx, x, statY, statWidth, 74, 12);
    ctx.fillStyle = "#111511";
    ctx.fill();
    ctx.strokeStyle = index === 0 ? accent : "#424c43";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f4ead2";
    ctx.font = "900 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${label} ${value}`, x + statWidth / 2, statY + 47);
    ctx.textAlign = "left";
  });

  const ability = `形态 ${snapshot.formLabel}  生命${snapshot.stats.maxHp}  攻击${snapshot.stats.atk}  防御${snapshot.stats.def}  速度${snapshot.stats.speed}  护盾${snapshot.stats.shield}  回复${snapshot.stats.regen}  吸血${snapshot.stats.lifesteal}`;
  ctx.fillStyle = "#d8dfd2";
  ctx.font = "900 23px sans-serif";
  wrapCanvasText(ctx, ability, margin + 36, statY + 124, width - margin * 2 - 72, 32, 2);

  ctx.fillStyle = accent;
  ctx.font = "900 34px sans-serif";
  ctx.fillText(parsedSummary.title, margin + 36, statY + 214);
  ctx.fillStyle = "#e0c07a";
  ctx.font = "900 20px sans-serif";
  ctx.fillText(isDefeat ? "旧账没有合上，只停在这一页" : "多年后仍在塔里流传", margin + 38, statY + 246);

  ctx.fillStyle = "#f4ead2";
  ctx.font = "700 24px sans-serif";
  let textY = statY + 288;
  for (const paragraph of parsedSummary.paragraphs.slice(0, 3)) {
    textY = wrapCanvasText(ctx, paragraph, margin + 38, textY, width - margin * 2 - 76, 34, 3) + 18;
    if (textY > height - 328) break;
  }

  ctx.fillStyle = accent;
  ctx.font = "900 28px sans-serif";
  ctx.fillText(isDefeat ? "遗落在塔中的装备" : "塔史记名装备", margin + 36, height - 298);
  await drawCareerEquipmentCanvas(ctx, snapshot, margin + 36, height - 268, width - margin * 2 - 72, 176);

  ctx.fillStyle = "#aeb8ac";
  ctx.font = "700 22px sans-serif";
  ctx.fillText(isDefeat ? modeText("photo-hero · 现实物品留在魔塔残页") : modeText("photo-hero · 现实物品写入魔塔旧史"), margin + 36, height - 84);
  ctx.fillStyle = accentSoft;
  ctx.fillRect(margin + 34, height - 70, width - margin * 2 - 68, 4);
}

async function drawCareerEquipmentCanvas(ctx, snapshot, x, y, width, height) {
  const items = (snapshot.allItems || snapshot.topItems || []).slice(0, equipmentVisibleSlots);
  const columns = 5;
  const gap = 10;
  const cellWidth = (width - gap * (columns - 1)) / columns;
  const cellHeight = (height - gap) / 2;
  if (!items.length) {
    ctx.fillStyle = "#aeb8ac";
    ctx.font = "800 24px sans-serif";
    ctx.fillText(modeText("没有照片装备记录"), x, y + 62);
    return;
  }
  const loaded = await Promise.all(items.map(async (item) => {
    try {
      return item.image ? await loadImage(item.image) : null;
    } catch {
      return null;
    }
  }));
  items.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const cellX = x + col * (cellWidth + gap);
    const cellY = y + row * (cellHeight + gap);
    const quality = getItemQuality(item.score || 0);
    const color = getQualityCanvasColor(quality.key);
    roundRect(ctx, cellX, cellY, cellWidth, cellHeight, 10);
    ctx.fillStyle = color.bg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color.border;
    ctx.stroke();

    const image = loaded[index];
    const imageX = cellX + 6;
    const imageY = cellY + 6;
    const imageW = cellWidth - 12;
    const imageH = Math.max(44, cellHeight - 34);
    ctx.save();
    roundRect(ctx, imageX, imageY, imageW, imageH, 7);
    ctx.clip();
    if (image) {
      drawImageCover(ctx, image, imageX, imageY, imageW, imageH);
    } else {
      ctx.fillStyle = "#151a16";
      ctx.fillRect(imageX, imageY, imageW, imageH);
      ctx.fillStyle = "#6b756c";
      ctx.font = "900 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PHOTO", imageX + imageW / 2, imageY + imageH / 2 + 6);
      ctx.textAlign = "left";
    }
    ctx.restore();

    ctx.fillStyle = "rgba(8, 10, 8, 0.84)";
    ctx.fillRect(cellX + 6, cellY + cellHeight - 28, cellWidth - 12, 22);
    ctx.fillStyle = color.text;
    ctx.font = "900 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(shortenText(item.name || "装备", 7), cellX + cellWidth / 2, cellY + cellHeight - 12);
    ctx.textAlign = "left";
  });
}

function drawImageCover(ctx, image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function getQualityCanvasColor(key) {
  const colors = {
    common: { border: "#6f776f", bg: "#151a16", text: "#ddd8cc" },
    rare: { border: "#4f8fd6", bg: "#17202a", text: "#75b8ff" },
    epic: { border: "#8b5fce", bg: "#211a2b", text: "#caa7ff" },
    legendary: { border: "#d98520", bg: "#2b2014", text: "#ffc35a" },
  };
  return colors[key] || colors.common;
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
  if (isActivePresetLockedKey()) {
    els.apiKeyInput.type = "password";
    els.toggleKeyBtn.classList.remove("is-visible");
    els.toggleKeyBtn.setAttribute("aria-label", "体验模式的 API Key 已隐藏");
    els.toggleKeyBtn.querySelector(".visually-hidden").textContent = "体验模式的 API Key 已隐藏";
    return;
  }

  const showing = els.apiKeyInput.type === "text";
  const label = showing ? "显示 API Key" : "隐藏 API Key";
  els.apiKeyInput.type = showing ? "password" : "text";
  els.toggleKeyBtn.classList.toggle("is-visible", !showing);
  els.toggleKeyBtn.setAttribute("aria-label", label);
  els.toggleKeyBtn.querySelector(".visually-hidden").textContent = label;
}

function setSecondaryPanel(panelId) {
  const target = ["config", "forms", "info", "music"].includes(panelId) ? panelId : "";
  els.secondaryArea.classList.toggle("is-collapsed", !target);
  if (target === "info") setInfoTab(getActiveInfoTab());
  if (target === "music") renderAudioSettings();

  document.querySelectorAll(".secondary-content").forEach((panel) => {
    panel.hidden = panel.dataset.secondaryPanel !== target;
  });

  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.panelTarget === target));
  });
}

function toggleSecondaryPanel(panelId) {
  const target = ["config", "forms", "info", "music"].includes(panelId) ? panelId : "";
  const activeTarget = els.secondaryArea.classList.contains("is-collapsed")
    ? ""
    : document.querySelector(".secondary-content:not([hidden])")?.dataset.secondaryPanel || "";
  setSecondaryPanel(target && activeTarget === target ? "" : target);
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
  const targetPresetId = API_PRESETS[presetId] ? presetId : defaultApiPresetId;
  if (persist && getActivePresetId() === "custom" && targetPresetId !== "custom") {
    rememberCustomDraft();
  }

  const preset = API_PRESETS[targetPresetId] || API_PRESETS.custom;
  const isCustom = targetPresetId === "custom";
  const isLockedKey = Boolean(preset.lockedKey);
  const selectedModel = isCustom ? customDraft.model : preset.model;

  if (isCustom) {
    els.baseUrlInput.value = customDraft.baseUrl;
    els.customModelInput.value = customDraft.model;
  } else {
    els.baseUrlInput.value = preset.baseUrl;
    els.customModelInput.value = preset.editableModel ? customDraft.model : "";
  }
  els.apiKeyInput.value = isLockedKey ? experienceApiKeyMask : providerApiKeys[targetPresetId] || "";
  els.apiKeyInput.type = "password";
  renderModelOptions(preset, selectedModel);

  els.baseUrlInput.readOnly = !isCustom;
  els.baseUrlInput.classList.toggle("is-locked", !isCustom);
  els.apiKeyInput.readOnly = isLockedKey;
  els.apiKeyInput.classList.toggle("is-locked", isLockedKey);
  els.apiKeyInput.setAttribute("aria-readonly", String(isLockedKey));
  els.toggleKeyBtn.disabled = isLockedKey;
  els.toggleKeyBtn.hidden = isLockedKey;
  els.toggleKeyBtn.classList.remove("is-visible");
  els.toggleKeyBtn.setAttribute("aria-label", isLockedKey ? "体验模式的 API Key 已隐藏" : "显示 API Key");
  els.toggleKeyBtn.querySelector(".visually-hidden").textContent = isLockedKey ? "体验模式的 API Key 已隐藏" : "显示 API Key";
  els.modelInput.disabled = Boolean(preset.lockedModel);
  els.modelInput.classList.toggle("is-locked", Boolean(preset.lockedModel));
  els.presetModelField.hidden = isCustom || Boolean(preset.editableModel);
  els.customModelField.hidden = !isCustom && !preset.editableModel;
  if (preset.editableModel) {
    els.customModelInput.value = selectedModel || customDraft.model;
  }
  els.presetNote.textContent = preset.note;
  els.presetNote.hidden = !preset.note;
  renderProviderLinks(preset);

  document.querySelectorAll(".preset-button").forEach((button) => {
    const isActive = button.dataset.preset === targetPresetId;
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
    hint.textContent = preset.lockedKey
      ? "体验模式免配置，公共额度有限；如遇繁忙或失败，可切到自定义使用自己的 API。"
      : "自定义接口请优先使用服务商官网提供的 API Key 和文档。";
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
  return document.querySelector(".preset-button.is-active")?.dataset.preset || defaultApiPresetId;
}

function isSelectableApiPreset(presetId) {
  const preset = API_PRESETS[presetId];
  return Boolean(preset && !preset.hidden);
}

function rememberCurrentApiKey() {
  const activePreset = document.querySelector(".preset-button.is-active")?.dataset.preset;
  if (!API_PRESETS[activePreset]) return;
  if (API_PRESETS[activePreset].lockedKey) return;
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
    state.pendingCropRect = null;
    state.cropMode = false;
    state.cropDrag = null;
    state.pendingPhotoSlotIndex = getSelectedSlotIndex();
    state.pendingSourceMode = "photo";
    state.lootError = "";
    state.infoMode = "item";
    renderCameraStatus();
    if (successMessage) {
      addLog(successMessage);
      showInputNotice(successMessage);
    } else {
      setBusy("");
    }
    state.tutorial.photoStarted = true;
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

  const unsupportedModelMessage = getUnsupportedVisionModelMessage(config);
  if (unsupportedModelMessage) {
    setChatResult(unsupportedModelMessage, true, "unsupported");
    addLog("图文模型测试失败。");
    render();
    return;
  }

  saveConfig(false);
  els.testChatBtn.disabled = true;
  setChatResult("正在测试图文模型...");

  try {
    const content = await callVisionText(config, makeVisionTestImage());
    const result = formatVisionTestResult(content);
    setChatResult(result.message, result.isError);
    addLog(result.isError ? "图文模型测试失败。" : "图文模型测试成功。");
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
        content: makeVisionUserContent(config, "请识别图片文字，只回复一句中文，格式为“图文模型测试成功：图片里写着……”。不要解释。", [image]),
      },
    ],
  });

  try {
    response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: buildModelHeaders(config),
      body: JSON.stringify(body),
    }, visionTestTimeoutMs, "图文模型测试");
  } catch (error) {
    if (isAbortError(error) || isTimeoutError(error)) throw error;
    throw formatBrowserRequestFailure(config, error, (message) => `浏览器直连失败：${message}。如果这是 CORS 错误，说明该 API 不允许网页直接调用。`);
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
  if (!text) return { message: "模型返回为空。", isError: true };

  const lines = text
    .split(/\r?\n+/)
    .map(cleanModelDisplayLine)
    .filter(Boolean);
  const hasImageText = (line) => /(?:VISION\s*OK|照片勇者|画图勇者)/i.test(line);
  const looksLikeReasoning = (line) => /(?:首先|用户要求|格式为|不要解释|步骤|编号|Markdown|我需要|应该|因此|最终回答)/i.test(line);
  let successIndex = -1;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index].includes("图文模型测试成功") && hasImageText(lines[index]) && !looksLikeReasoning(lines[index])) {
      successIndex = index;
      break;
    }
  }

  if (successIndex >= 0) {
    const successLine = lines[successIndex];
    if (/图片|写着|VISION OK|照片勇者|画图勇者/i.test(successLine)) {
      return { message: shortenText(successLine.replace(/\s+/g, " "), 120), isError: false };
    }

    const imageLine = lines
      .slice(Math.max(0, successIndex - 4), successIndex)
      .reverse()
      .find((line) => hasImageText(line) && !looksLikeReasoning(line));
    if (imageLine) {
      return { message: shortenText(`图文模型测试成功：${imageLine}`.replace(/\s+/g, " "), 120), isError: false };
    }

    return { message: shortenText(successLine.replace(/\s+/g, " "), 120), isError: false };
  }

  const imageLine = [...lines].reverse().find((line) => hasImageText(line) && !looksLikeReasoning(line));
  if (imageLine) {
    return { message: shortenText(`图文模型测试成功：图片里写着 ${imageLine}`.replace(/\s+/g, " "), 120), isError: false };
  }

  return {
    message: "模型有返回，但没有识别出测试图里的“照片勇者 / VISION OK”。请换成真正支持图片输入的模型。",
    isError: true,
  };
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
  if (!isExperienceConfig(config) && !config.apiKey) missing.push("API Key");
  return missing;
}

function getPhotoApiConfigHint() {
  const missing = getMissingConfigFields(getConfigFromInputs());
  if (!missing.length) return "";
  return `先点右上角鉴定，配置 API，点亮${getPendingSourceMode() === "drawing" ? "画作" : "照片"}鉴定。`;
}

function isXiaomiConfig(config) {
  const preset = String(config?.presetId || "").toLowerCase();
  const baseUrl = String(config?.baseUrl || "").toLowerCase();
  return preset === "xiaomi" || baseUrl.includes("xiaomimimo.com");
}

function getUnsupportedVisionModelMessage(config) {
  if (isXiaomiConfig(config) && !XIAOMI_VISION_MODEL_VALUES.includes(String(config?.model || ""))) {
    return `当前小米模型 ${config.model || ""} 不支持图片输入；请切换到 mimo-v2.5 或 mimo-v2-omni。`;
  }
  return "";
}

async function analyzePhoto() {
  if (isPlayerDefeated() || state.bossReward) return;
  if (!state.lastPhoto) {
    addLog(`还没有${getPendingImageLabel()}。`);
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
    const message = `${getResourceName()}不足。普通怪会留下 0.1 ${getResourceName()}，单体 Boss 会留下 0.3。`;
    showLootError(message);
    addLog(message);
    render();
    return;
  }

  const config = getConfigFromInputs();
  if (getMissingConfigFields(config).length) {
    const message = getPhotoApiConfigHint();
    showLootError(message);
    addLog(message);
    render();
    return;
  }

  const unsupportedModelMessage = getUnsupportedVisionModelMessage(config);
  if (unsupportedModelMessage) {
    showLootError(unsupportedModelMessage);
    addLog(unsupportedModelMessage);
    render();
    return;
  }

  if (!isLikelyVisionModel(config)) {
    const message =
      "当前模型看起来不支持图片输入；照片鉴定需要图文模型。";
    showLootError(message);
    addLog("图片鉴定需要视觉模型。");
    render();
    return;
  }

  saveConfig(false);
  const request = startAnalysisRequest();
  const sourceMode = getPendingSourceMode();
  let appraisalImage = state.lastPhoto;
  let inventorySourceImage = state.lastPhoto;
  let sourcePhotoKey = makePhotoDuplicateKey(state.lastPhoto);
  let appraisalPhotoKey = sourcePhotoKey;
  let cropRect = null;
  try {
    if (sourceMode === "photo" && state.pendingCropRect) {
      cropRect = normalizeCropRect(state.pendingCropRect);
      appraisalImage = await cropImageToDataUrl(state.lastPhoto, cropRect, analysisImageMaxEdge, analysisImageQuality);
      inventorySourceImage = appraisalImage;
      appraisalPhotoKey = makePhotoDuplicateKey(appraisalImage);
    }
  } catch (error) {
    showLootError(`圈定主体失败：${error.message || "请重新圈定或重拍"}`);
    finishAnalysisRequest(request.id);
    setBusy("");
    render();
    return;
  }

  const photoDuplicate = findCurrentPhotoDuplicate(appraisalPhotoKey, sourcePhotoKey, cropRect);
  if (photoDuplicate) {
    const message = `当前装备栏已经有这件影像生成的装备：${formatItemDisplayName(photoDuplicate)}。`;
    showLootError(`${message} 请换个主体或重新拍摄。`);
    addLog(`${message} ${getResourceName()}未消耗。`);
    finishAnalysisRequest(request.id);
    render();
    return;
  }

  const timing = createAppraisalTiming(appraisalImage);
  state.lastAppraisalTiming = timing;
  state.lootError = "";
  setBusy("鉴定中...");
  render();
  try {
    const item = await measureAppraisalStage(timing, "apiMs", () => analyzeDirectly(config, appraisalImage, { signal: request.controller.signal, timing, cropped: Boolean(cropRect), sourceMode }));
    if (request.id !== state.analysisRequest?.id) return;
    const inventoryImage = await measureAppraisalStage(timing, "inventoryResizeMs", () => makeInventoryImage(inventorySourceImage));
    if (request.id !== state.analysisRequest?.id) return;
    const balancedItem = measureAppraisalStageSync(timing, "balanceMs", () => balanceItem({
      ...item,
      sourceMode,
      photoKey: appraisalPhotoKey,
      sourcePhotoKey,
      cropRect,
    }, inventoryImage));
    balancedItem.image = inventoryImage;
    balancedItem.fullImage = state.lastPhoto;
    balancedItem.appraisalImage = appraisalImage;
    balancedItem.sourcePhotoKey = sourcePhotoKey;
    balancedItem.cropRect = cropRect;
    const failureReason = getAppraisalFailureReason(balancedItem);
    if (failureReason) {
      throw new Error(failureReason);
    }
    const duplicate = await measureAppraisalStage(timing, "duplicateMs", () => findDuplicateIdentifiedItem(balancedItem, config, request.controller.signal));
    if (request.id !== state.analysisRequest?.id) return;
    if (duplicate) {
      throw new Error(`这个物品已经鉴定过：${formatItemDisplayName(duplicate)}。请拍摄新的物品。`);
    }
    if (!consumeFilm()) {
      throw new Error(`${getResourceName()}不足，未生成装备。`);
    }
    receiveItem(balancedItem, "鉴定完成。");
  } catch (error) {
    if (request.id !== state.analysisRequest?.id && isAbortError(error)) return;
    const message = normalizeAnalyzeError(error);
    showRetryableAppraisalError(message);
    addLog(`鉴定失败：${message}（${getResourceName()}未消耗）`);
  } finally {
    if (request.id === state.analysisRequest?.id) {
      finishAppraisalTiming(timing);
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
    message.toLowerCase().includes("image_url") ||
    /no endpoints found that support image input/i.test(message)
  ) {
    return "当前接口没有接收图片，请换成支持图文输入的模型。";
  }
  if (message.includes("没有按 JSON 格式") || message.includes("没有按游戏要求返回 JSON")) {
    return "模型没有按鉴定台要求返回结果。";
  }
  if (message.includes("模型返回了文本")) {
    return "模型返回内容没有通过鉴定台校验。";
  }
  return shortenText(message, 96);
}

function getAppraisalFailureReason(item) {
  if (!item) return "影像没有在鉴定台上成形。";
  const name = formatItemDisplayName(item) || (item?.sourceMode === "drawing" ? "这幅画作" : "这张照片");
  if (item.virtualImage) {
    return `${name}的影像气息太虚，没能凝成装备。`;
  }
  if (item.tooLarge || item.isEquipable === false) {
    return `${name}太难装进行囊。`;
  }
  if (getItemEffectValue(item) <= 0) {
    return `${name}没有醒出力量。`;
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

function showRetryableAppraisalError(message) {
  showLootError(message);
  if (state.lastPhoto) {
    state.infoMode = "item";
  }
}

function clearPendingPhoto(options = {}) {
  state.lastPhoto = "";
  state.pendingSourceMode = state.playMode;
  state.pendingCropRect = null;
  state.cropMode = false;
  state.cropDrag = null;
  state.pendingPhotoSlotIndex = getSelectedSlotIndex();
  if (options.keepSelectedSlot && Number.isInteger(options.slotIndex)) {
    state.pendingPhotoSlotIndex = clampSlotIndex(options.slotIndex);
  }
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
  const message = `已取消鉴定，${getResourceName()}未消耗。`;
  showRetryableAppraisalError(message);
  addLog(message);
  setBusy("");
  saveGame();
  render();
}

function createAppraisalTiming(image = "") {
  const startedAt = performance.now();
  return {
    startedAt,
    imageKb: Math.round(String(image || "").length * 0.75 / 1024),
    imageLength: String(image || "").length,
    apiMs: 0,
    parseMs: 0,
    inventoryResizeMs: 0,
    balanceMs: 0,
    duplicateMs: 0,
    totalMs: 0,
  };
}

async function measureAppraisalStage(timing, key, task) {
  const start = performance.now();
  try {
    return await task();
  } finally {
    if (timing && key) timing[key] = Math.round(performance.now() - start);
  }
}

function measureAppraisalStageSync(timing, key, task) {
  const start = performance.now();
  try {
    return task();
  } finally {
    if (timing && key) timing[key] = Math.round(performance.now() - start);
  }
}

function finishAppraisalTiming(timing) {
  if (!timing) return;
  timing.totalMs = Math.round(performance.now() - timing.startedAt);
  state.lastAppraisalTiming = { ...timing };
  console.info("[photo-hero] appraisal timing", state.lastAppraisalTiming);
}

async function analyzeDirectly(config, image, options = {}) {
  let response;
  const sourceMode = normalizeHeroMode(options.sourceMode || getPendingSourceMode());
  const prompt = getIdentificationPrompt({ ...options, sourceMode });
  const body = withProviderRequestOptions(config, {
    model: config.model,
    temperature: 0.35,
    max_tokens: modelMaxTokens,
    messages: [
      {
        role: "system",
        content: getIdentificationSystemPrompt(sourceMode),
      },
      {
        role: "user",
        content: makeVisionUserContent(config, prompt, [image]),
      },
    ],
  });

  try {
    response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: buildModelHeaders(config),
      body: JSON.stringify(body),
      signal: options.signal,
    }, photoAnalyzeTimeoutMs, sourceMode === "drawing" ? "画作鉴定" : "照片鉴定");
  } catch (error) {
    if (isAbortError(error) || isTimeoutError(error)) throw error;
    throw formatBrowserRequestFailure(config, error, (message) => `浏览器直连失败：${message}。常见原因是模型服务没有允许 CORS。`);
  }

  if (!response.response.ok) {
    throw new Error(readUpstreamError(response.payload) || `模型接口返回 ${response.response.status}`);
  }

  const payload = response.payload;
  const timing = options.timing || null;
  const finalText = readModelText(payload);
  if (finalText) return measureAppraisalStageSync(timing, "parseMs", () => extractJson(finalText, payload));

  const reasoningText = readModelText(payload, { reasoningOnly: true });
  if (reasoningText) {
    return measureAppraisalStageSync(timing, "parseMs", () => extractJson(reasoningText, payload));
  }

  const anyText = readModelText(payload, { includeReasoning: true });
  if (anyText) return measureAppraisalStageSync(timing, "parseMs", () => extractJson(anyText, payload));

  return measureAppraisalStageSync(timing, "parseMs", () => extractJson("", payload));
}

async function compareIdentifiedObjects(config, currentItem, knownItem, signal = null) {
  if (!currentItem?.image || !knownItem?.image) return false;
  let response;
  const drawingCompare = currentItem.sourceMode === "drawing" || knownItem.sourceMode === "drawing";
  const prompt = [
    drawingCompare ? "请判断两张图片中的主要画作装备主体是否来自同一幅玩家手绘图。" : "请判断两张图片中的主要装备主体是否是同一个现实物体。",
    drawingCompare ? "只比较主要手绘主体，不要因为同样都是剑、盾、火焰或同颜色就判定相同。" : "只比较主要主体，不要因为同类型、同颜色、同品牌或都是白色小风扇就判定相同。",
    drawingCompare ? "如果线条轮廓、颜色分布、局部标记和构图位置基本一致，sameObject=true。" : "如果是同一个实体在不同角度、距离、光线下拍摄，sameObject=true。",
    drawingCompare ? "如果只是同题材但造型、线条、颜色、附加符号或布局不同，sameObject=false。" : "如果只是同类但款式、结构、贴纸、纹理、磨损、背景位置或可见细节不同，sameObject=false。",
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
          ...makeVisionUserContent(config, prompt, [knownItem.appraisalImage || knownItem.image, currentItem.appraisalImage || currentItem.image]),
        ],
      },
    ],
  });

  try {
    response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: buildModelHeaders(config),
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

function makeImageUrlContentPart(image) {
  return {
    type: "image_url",
    image_url: { url: image, detail: modelImageDetail },
  };
}

function makeVisionUserContent(config, text, images = []) {
  const textPart = { type: "text", text };
  const imageParts = images.filter(Boolean).map(makeImageUrlContentPart);
  return isXiaomiConfig(config)
    ? [...imageParts, textPart]
    : [textPart, ...imageParts];
}

function withProviderRequestOptions(config, body) {
  const next = { ...body };
  if (isXiaomiConfig(config)) {
    if (next.max_tokens != null && next.max_completion_tokens == null) {
      next.max_completion_tokens = next.max_tokens;
      delete next.max_tokens;
    }
    next.thinking = { type: "disabled" };
    delete next.enable_thinking;
    return next;
  }
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
  return preset === "experience" || preset === "siliconflow" || baseUrl.includes("siliconflow") || model.includes("qwen");
}

function isExperienceConfig(config) {
  return String(config?.presetId || "").toLowerCase() === "experience";
}

function isActivePresetLockedKey() {
  const preset = API_PRESETS[getActivePresetId()] || API_PRESETS.custom;
  return Boolean(preset.lockedKey);
}

function buildModelHeaders(config) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (!isExperienceConfig(config) && config.apiKey) {
    if (isXiaomiConfig(config)) {
      headers["api-key"] = config.apiKey;
    } else {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }
  }
  return headers;
}

function formatBrowserRequestFailure(config, error, fallback) {
  const message = error.message || "请求被浏览器拦截";
  if (isExperienceConfig(config)) {
    return new Error(`体验接口连接失败：${message}。如果线上体验暂不可用，请切到自定义使用自己的 API。`);
  }
  return new Error(fallback(message));
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

function getIdentificationSystemPrompt(sourceMode = state.playMode) {
  return normalizeHeroMode(sourceMode) === "drawing"
    ? drawingIdentificationSystemPrompt
    : photoIdentificationSystemPrompt;
}

function getIdentificationPrompt(options = {}) {
  if (normalizeHeroMode(options.sourceMode) === "drawing") {
    return `${drawingIdentificationUserPrompt}\n\n当前本局本地结算的装备价值范围：${getPhotoValueMin()} 到 ${getPhotoValueMax()}。你仍然不要输出最终 value 或最终 stats，只需要按 rubric 输出质量分与倾向。`;
  }
  const cropHint = options.cropped
    ? "\n\n玩家已经圈定主体区域；请优先鉴定这块区域里的现实物体，不要因为画面被裁小、背景较少就判成商品图或素材图。"
    : "";
  return `${photoIdentificationUserPrompt}${cropHint}\n\n当前本局本地结算的装备价值范围：${getPhotoValueMin()} 到 ${getPhotoValueMax()}。你仍然不要输出最终 value 或最终 stats，只需要按 rubric 输出质量分与倾向。`;
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
    clarity: clampInt(safe.clarity ?? safe.clear ?? safe.subjectClear ?? safe.subjectRecognizable ?? safe.recognizability ?? safe["清晰度"] ?? safe["主体清楚"] ?? safe["主体可识别性"] ?? safe["可识别性"], 0, 3),
    subjectArea: clampInt(safe.subjectArea ?? safe.area ?? safe.subjectSize ?? safe.subjectCompleteness ?? safe["主体占比"] ?? safe["主体完整度"], 0, 3),
    backgroundClean: clampInt(safe.backgroundClean ?? safe.cleanBackground ?? safe.background ?? safe.noiseControl ?? safe["背景干净"] ?? safe["杂线干扰"], 0, 2),
    realPhoto: clampInt(safe.realPhoto ?? safe.realism ?? safe.lifeLike ?? safe.drawingIntent ?? safe.completion ?? safe.finish ?? safe["实拍感"] ?? safe["现实感"] ?? safe["绘制意图"] ?? safe["完成度"], 0, 3),
    focusLight: clampInt(safe.focusLight ?? safe.light ?? safe.lighting ?? safe.focus ?? safe.lineColor ?? safe.lineQuality ?? safe.colorUse ?? safe["光线对焦"] ?? safe["线条配色"] ?? safe["线条质量"] ?? safe["配色"], 0, 2),
    interesting: clampInt(safe.interesting ?? safe.fun ?? safe.charm ?? safe.aesthetic ?? safe.beauty ?? safe.creativity ?? safe["有趣"] ?? safe["美观"] ?? safe["美观程度"] ?? safe["创意"], 0, 2),
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
  if (hasClearRealSmallSubjectText(text)) return false;
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

function hasClearRealSmallSubjectText(text, photoQuality = {}) {
  const source = String(text || "");
  const quality = normalizePhotoQuality(photoQuality);
  if (hasNegatedRealPhotoText(source)) return false;
  if (isClearlyOversizedSubjectText(source) || isSceneDisguisedAsPortableText(source) || isLivingCreatureMainSubjectText(source)) return false;
  if (!isPortableEquipmentText(source) && !isSmallEquipableNaturalText(source) && !isClearlySmallModelOrPatternText(source)) return false;
  if (isGameOrCardArtText(source) || isFantasyEquipmentImageText(source)) return false;
  if (isPolishedCommercialImageText(source) && !isRealObjectPhotoEvidenceText(source)) return false;
  return quality.realPhoto >= 2
    || isRealObjectPhotoEvidenceText(source)
    || /(?:普通拍摄|正常拍摄|实物照片|生活照片|桌面照片|房间照片|室内照片|现场照片|照片中是|画面里有|画面中有|photo of|real object photo|photographed real object)/i.test(source);
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
  const normalObjectPhoto = isNormalRealObjectPhotoText(source, quality);
  const clearSmallSubject = hasClearRealSmallSubjectText(source, quality);
  const screenshot = isScreenshotOnlyText(source);
  const digitalImage = isWebOrDigitalImageText(source);
  const gameArt = isGameOrCardArtText(source);
  const isolatedToyArt = isLowRealityToyOrMascotImageText(source, quality);
  const fantasyEquipment = isFantasyEquipmentImageText(source);
  const lowRealismFantasy = quality.realPhoto <= 1 && (gameArt || fantasyEquipment || isImageLikeSubjectText(source));
  const explicitDigital = digitalImage || gameArt || isScreenshotOnlyText(source);

  if ((normalObjectPhoto || clearSmallSubject) && !gameArt && !fantasyEquipment && !isPolishedCommercialImageText(source)) {
    return { level: "none", noEffect: false, cap: null, suppressSpecial: false, description: "" };
  }

  if (screenshot && !normalObjectPhoto && !clearSmallSubject) {
    return makeVirtualImagePenalty("noEffect");
  }

  if (explicitDigital && !physicalCarrier && !realToyOrProp && !normalObjectPhoto && !clearSmallSubject) {
    return makeVirtualImagePenalty("noEffect");
  }

  if ((digitalImage || gameArt || lowRealismFantasy) && !physicalCarrier && !realToyOrProp && !realObjectEvidence && !normalObjectPhoto && !clearSmallSubject) {
    if (isolatedToyArt) return makeVirtualImagePenalty("ordinaryCap");
    return makeVirtualImagePenalty("noEffect");
  }

  if (fantasyEquipment && !physicalCarrier && !realToyOrProp && !realObjectEvidence && !normalObjectPhoto && !clearSmallSubject) {
    return makeVirtualImagePenalty("noEffect");
  }

  if ((digitalImage || gameArt || fantasyEquipment || isPrintedFantasyCarrierText(source)) && physicalCarrier && !realToyOrProp) {
    return makeVirtualImagePenalty("ordinaryCap");
  }

  if (isolatedToyArt && !realObjectEvidence) {
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
      description: "影像里的气息太虚，没能凝成装备。",
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
  if (hasNegatedVirtualSourceText(text)) return false;
  return /(?:网图|网络图片|网上图片|搜索图|搜图|下载图片|线上图片|网页图片|素材图|素材|透明背景|免抠|图标|图鉴|壁纸|白底商品图|电商图|商品展示图|精修图|宣传图|PS图|AI图|AI生成|AI绘图|AI作图|生成图|渲染图|3D渲染|CG|概念图|设定图|原画|立绘|插画|二次元|虚拟道具|虚拟装备|digital image|web image|stock image|asset|icon|render|rendered|illustration|concept art|game asset)/i.test(String(text || ""));
}

function isGameOrCardArtText(text) {
  if (hasNegatedVirtualSourceText(text)) return false;
  return /(?:游戏.{0,8}(装备|道具|卡牌|物品|界面|图标|图鉴)|(?:装备|道具|卡牌|物品).{0,8}(游戏|图鉴|界面)|卡牌素材|卡面|装备图|道具图|游戏图|卡牌图|武器图|盾牌图|角色卡|技能卡|game item|game card|card art|item card|weapon card)/i.test(String(text || ""));
}

function isFantasyEquipmentImageText(text) {
  if (hasNegatedVirtualSourceText(text)) return false;
  return /(?:龙胆亮银枪|狮纹金盾|金盾配剑|恶魔之眼|恶魔.*巨刃|巨刃|亮银枪|神器|神兵|魔剑|圣剑|神剑|宝剑|战斧|法杖|魔杖|权杖|符文|龙鳞|魔法武器|奇幻武器|幻想武器|史诗武器|传说武器|暗黑武器|legendary weapon|fantasy weapon|magic weapon|artifact weapon)/i.test(String(text || ""));
}

function isImageLikeSubjectText(text) {
  return /(?:图片|图像|图案|画面|卡图|卡面|海报|插画|图标|image|picture|artwork|poster)/i.test(String(text || ""));
}

function isNormalRealObjectPhotoText(text, quality = normalizePhotoQuality({})) {
  const source = String(text || "");
  if (!isPortableEquipmentText(source) && !isSmallEquipableNaturalText(source)) return false;
  if (isGameOrCardArtText(source) || isFantasyEquipmentImageText(source)) return false;
  if (isPolishedCommercialImageText(source)) return false;
  if (quality.realPhoto >= 2) return true;
  if (isRealObjectPhotoEvidenceText(source)) return true;
  return /(?:正常拍摄|普通拍摄|实物照片|生活照片|桌面照片|近景照片|照片中是|photo of|real object photo|product photo of a real)/i.test(source);
}

function isDirectRealPhotoText(text, quality = normalizePhotoQuality({})) {
  const source = String(text || "");
  if (!isNormalRealObjectPhotoText(source, quality)) return false;
  if (isScreenshotOnlyText(source) || isWebOrDigitalImageText(source)) return false;
  return quality.realPhoto >= 2 || isRealObjectPhotoEvidenceText(source);
}

function isPolishedCommercialImageText(text) {
  if (hasNegatedVirtualSourceText(text)) return false;
  return /(?:精修|修饰过|PS|后期合成|摆拍棚拍|棚拍|宣传图|广告图|白底商品图|电商图|商品展示图|透明背景|免抠|抠图|素材图|图标|渲染图|生成图|AI生成|studio shot|commercial render|cutout|transparent background|white background product|product render)/i.test(String(text || ""));
}

function hasNegatedVirtualSourceText(text) {
  const source = String(text || "");
  return /(?:不是|并非|非|不像|没有|无).{0,8}(?:网图|网络图片|网上图片|搜索图|截图|屏幕截图|游戏截图|游戏装备|装备图|道具图|虚拟装备|虚拟道具|AI图|AI生成|渲染图|插画|原画|素材图|白底商品图|电商图|精修图|宣传图|透明背景|抠图)|(?:网图|网络图片|网上图片|搜索图|截图|屏幕截图|游戏截图|游戏装备|装备图|道具图|虚拟装备|虚拟道具|AI图|AI生成|渲染图|插画|原画|素材图|白底商品图|电商图|精修图|宣传图|透明背景|抠图).{0,8}(?:不是|并非|没有|无)|not.{0,12}(?:web image|screenshot|game item|game asset|virtual|ai generated|render|illustration|stock image|product render)/i.test(source);
}

function isLowRealityToyOrMascotImageText(text, quality = normalizePhotoQuality({})) {
  const source = String(text || "");
  if (!/(?:玩具|模型|手办|公仔|玩偶|娃娃|卡通|吉祥物|角色|拟人|长腿|寿司|青蛙|toy|model|figure|plush|doll|cartoon|mascot|character)/i.test(source)) return false;
  if (isRealObjectPhotoEvidenceText(source) && quality.realPhoto >= 2) return false;
  const isolated = /(?:黑底|白底|纯黑|纯白|透明背景|抠图|孤立|单独展示|商品图|素材图|贴图|渲染|插画|图标|没有背景|无背景|black background|white background|transparent|cutout|isolated|product image|render|illustration|icon)/i.test(source);
  const unrealStyle = /(?:卡通化|拟人|长腿|会跳|跳出|发起突袭|活过来|奔跑|cartoon|anthropomorphic|long legs|jump|attack)/i.test(source);
  return isolated || unrealStyle || quality.realPhoto <= 1;
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
  return /(?:实拍|拍摄|现实|真实|实物|实体|手持|桌面|近景|放在|拿着|材质|塑料|金属|木质|纸质|陶瓷|玻璃|橡胶|布料|磨损|纹理|阴影|投影|接触阴影|自然阴影|桌面阴影|反光|高光|色温|环境光|光线方向|real photo|photographed|physical|real object|on desk|handheld|shadow|contact shadow|reflection|highlight|lighting)/i.test(source);
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
  return /(?:锋利|尖锐|厚重|坚硬|防护|护盾|容器|外壳|工具|武器|剑|斧|弓|箭|枪|魔杖|法杖|龙鳞|尖牙|爪|火焰|雷电|闪电|星火|速度|旋转|气流|修复|补能|吸附|抽取|成长|训练|奖牌|有趣|动心|奇特|故事感|装备联想|sharp|solid|protect|shield|tool|weapon|sword|axe|bow|arrow|wand|fang|claw|fire|lightning|speed|rotate|airflow|heal|energy|grow|medal|interesting|fantasy)/i.test(source);
}

function hasDrawingEquipmentConceptText(text) {
  const source = String(text || "");
  return hasStrongEquipmentFantasyText(source)
    || /(?:装备|道具|护符|护身符|徽记|坠饰|项链|戒指|靴|披风|铠|甲|盾|剑|刃|刀|枪|矛|弓|箭|斧|锤|魔杖|法杖|宝石|水晶|符文|符号|核心|面具|齿轮|龙鳞|羽|翅|心形|爱心|药|泉|光|风|火|雷|血|牙|爪|explosion|rune|crystal|amulet|ring|boots|cloak|armor)/i.test(source);
}

function hasAirPurifierSemanticText(text) {
  return /(?:空气净化器|净化器|过滤器|滤芯|滤网|空气过滤|净化空气|清新空气|污浊空气|除尘|除味|除菌|防尘|空气清洁|air purifier|air filter|purify air|clean air)/i.test(String(text || ""));
}

function isTablewareSemanticText(text) {
  const source = String(text || "");
  return /(?:餐具|汤勺|勺子|勺|叉子|叉|筷子|筷|碗|盘子|盘|碟|刀叉|spoon|fork|chopstick|bowl|plate|dish|tableware|cutlery)/i.test(source);
}

function hasEdibleContentSemanticText(text) {
  const source = String(text || "");
  const contentPattern = "咖啡|矿泉水|饮料|药|汤(?!勺)|茶|牛奶|果汁|食物|饭|面|糖|饼|肉|菜|水果|香蕉|番茄|西红柿|能量|coffee|water|drink|medicine|soup|tea|milk|juice|food|rice|noodle|bread|candy|meat|vegetable|fruit|energy";
  return new RegExp(`(?:装着|盛着|装有|里面有|里有|杯中|碗里|盘里|勺里|装满|半杯|一杯|一碗|一盘|一勺).{0,10}(?:${contentPattern})|(?:${contentPattern}).{0,10}(?:装在|盛在|在杯|在碗|在盘|in a cup|in a bowl|in a plate|filled)`, "i").test(source);
}

function hasHpSemanticText(text) {
  const source = String(text || "");
  if (isTablewareSemanticText(source) && !hasEdibleContentSemanticText(source)) return false;
  return /(?:生命|爱心|心形|核心|咖啡|矿泉水|饮料|药|汤|茶|牛奶|果汁|食物|饭团|面包|糖果|饼干|肉|蔬菜|水果|香蕉|番茄|西红柿|能量|植物|花朵|叶片|种子|可爱|治愈|毛绒|玩偶|娃娃|贴纸|卡通|图案|青蛙|coffee|water|drink|medicine|tea|milk|juice|food|bread|candy|fruit|banana|tomato|energy|plant|flower|seed|heart|core|cute|heal|healing|plush|doll|toy|sticker|cartoon|pattern)/i.test(source);
}

function hasStrongHpSemanticText(text) {
  const source = String(text || "");
  if (isTablewareSemanticText(source) && !hasEdibleContentSemanticText(source)) return false;
  return /(?:生命|爱心|心形|咖啡|矿泉水|饮料|药|汤|茶|牛奶|果汁|食物|饭团|面包|糖果|饼干|肉|蔬菜|水果|香蕉|番茄|西红柿|能量|植物|花朵|叶片|种子|治愈|毛绒|玩偶|娃娃|coffee|water|drink|medicine|tea|milk|juice|food|bread|candy|fruit|banana|tomato|energy|plant|flower|seed|heart|heal|healing|plush|doll)/i.test(source);
}

function hasStrongSpeedSemanticText(text) {
  return /(?:风扇|小风扇|桌面小风扇|空气动力|气流|旋转|扇叶|电扇|闪电|雷电|疾风|羽翼|翅膀|飞行|fan|airflow|rotate|blade|lightning|wing|fly)/i.test(String(text || ""));
}

function hasShieldSemanticText(text) {
  return /(?:盾|护盾|防护|保护|挡|遮挡|容器|盒|箱|包|壳|套|罩|伞|镜|锅盖|杯|瓶|碗|盘|盖|帽|头盔|眼镜|锁|门|甲|外壳|金属板|木板|shield|protect|guard|block|container|box|case|bag|shell|cover|umbrella|mirror|lid|helmet|glasses|armor)/i.test(String(text || ""));
}

function hasDefenseSemanticText(text) {
  const source = String(text || "");
  return hasAirPurifierSemanticText(source) || /(?:厚|重|硬|坚|金属|石|木|壳|骨|甲|板|锁|支撑|抗压|防御|防护|保护|过滤|防尘|框|架|陶瓷|玻璃|橡胶|岩|盾|音箱|音响|喇叭|电子设备|hard|solid|metal|stone|wood|shell|armor|lock|support|ceramic|glass|rubber|filter|speaker)/i.test(source);
}

function hasAttackSemanticText(text) {
  const source = String(text || "");
  return hasMagicWandVisualEvidenceText(source)
    || /(?:工具|武器|敲|打|锤|棒|棍|剑|短剑|长剑|斧|弓|箭|枪|长枪|短枪|矛|戟|砖|石|球|键盘|鼠标|笔|刀|剪|针|钩|刺|尖|刃|爪|牙|火焰|星火|雷电|闪电|爆炸|攻击|冲击|震动|声波|音箱|音响|喇叭|运动|飞行|展翅|风车|旋转|数字|显示屏|勺|叉|筷|餐具|tool|weapon|hit|hammer|club|sword|axe|bow|arrow|spear|lance|pike|brick|stone|ball|keyboard|mouse|pen|knife|scissor|needle|hook|sharp|claw|tooth|fire|lightning|explosion|attack|impact|speaker|sport|fly|wing|windmill|rotate|screen|spoon|fork|chopstick|tableware|cutlery)/i.test(source);
}

function isSharpToolSemanticText(text) {
  return /(?:刀|剪|剪刀|针|钩|指甲刀|锥|刃|锯|尖|尖锐|夹|钳|不锈钢剪刀|knife|scissor|scissors|needle|hook|clipper|blade|sharp|pliers|saw)/i.test(String(text || ""));
}

function hasOffensiveToolSemanticText(text) {
  return isSharpToolSemanticText(text) || hasAttackSemanticText(text) || hasLifestealSemanticText(text);
}

function hasSpeedSemanticText(text) {
  return /(?:鞋|靴|轮|滑板|风|疾风|扇|羽|羽翼|翅|飞|跑|跳|旋转|气流|车模|遥控|线缆|速度|敏捷|闪电|雷电|箭头|运动|球|shoe|boot|wheel|skateboard|wind|fan|feather|wing|fly|run|jump|rotate|airflow|remote|cable|speed|lightning|arrow|sport|ball)/i.test(String(text || ""));
}

function hasLifestealSemanticText(text) {
  return /(?:吸血|吸附|抽取|红色|血|刀|剪|针|钩|刺|尖|刃|指甲刀|夹|钳|牙|爪|leech|blood|absorb|knife|scissor|needle|hook|sharp|blade|claw|tooth|plier)/i.test(String(text || ""));
}

function hasRegenSemanticText(text) {
  const source = String(text || "");
  if (isSharpToolSemanticText(source) && !hasStrongRegenSemanticText(source)) return false;
  return hasAirPurifierSemanticText(source) || /(?:回复|恢复|治愈|修复|补能|清洁|净化|清新|水|泉|泉水|咖啡|饮|药|茶|奶|充电|电池|灯|光|圣光|纸巾|毛巾|植物|草|花|叶|种子|心形|爱心|可爱|柔软|贴纸|卡通|图案|青蛙|heal|regen|repair|clean|purify|water|spring|coffee|drink|medicine|charger|battery|light|tissue|towel|plant|grass|flower|leaf|seed|heart|cute|soft|sticker|cartoon|pattern)/i.test(source);
}

function hasStrongRegenSemanticText(text) {
  const source = String(text || "");
  return hasAirPurifierSemanticText(source) || /(?:回复|恢复|治愈|回血|药|水|泉|光|咖啡|饮|茶|奶|充电|电池|清洁|净化|过滤|滤芯|纸巾|毛巾|heal|regen|medicine|water|spring|light|coffee|drink|charger|battery|clean|purify|filter|tissue|towel)/i.test(source);
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
    appraisalImage: "",
  };
  const targetSlot = Number.isInteger(state.pendingPhotoSlotIndex) ? state.pendingPhotoSlotIndex : getSelectedSlotIndex();
  state.lastPhoto = "";
  state.pendingSourceMode = state.playMode;
  state.pendingCropRect = null;
  state.cropMode = false;
  state.cropDrag = null;
  state.pendingPhotoSlotIndex = targetSlot;
  const rewardText = fullItem.tooLarge
    ? `${message} 记录 ${fullItem.itemName}，无法提供属性。`
    : `${message} 获得 ${fullItem.itemName}。`;
  if (addInventoryItem(fullItem, rewardText, targetSlot)) {
    if (!fullItem.tooLarge) {
      recordGlobalGameMetric(getEquipmentStatsMetric(fullItem), 1);
      recordGlobalAppraisalPlayer();
    }
    state.tutorial.photoStarted = true;
    state.tutorial.battleHintSeen = false;
    saveGame();
    render();
  }
}

function getEquipmentStatsMetric(item) {
  return normalizeHeroMode(item?.sourceMode || "photo") === "drawing" ? "DrawingEquipment" : "PhotoEquipment";
}

async function findDuplicateIdentifiedItem(item, config = null, signal = null) {
  const duplicate = findDuplicateByStoredIdentity(item);
  if (!duplicate) return null;
  if (duplicate.confidence !== "possible") return duplicate.item || null;
  if (!shouldVerifyPossibleDuplicateWithVision(item, duplicate.item)) return null;
  const currentImage = item?.appraisalImage || item?.image || "";
  const knownImage = duplicate.item?.appraisalImage || duplicate.item?.image || "";
  if (!knownImage || !currentImage || !config) return null;
  const same = await compareIdentifiedObjects(config, item, duplicate.item, signal);
  return same ? duplicate.item : null;
}

function shouldVerifyPossibleDuplicateWithVision(currentItem, knownItem) {
  if (!currentItem || !knownItem) return false;
  const currentIdentity = getDuplicateTokenSet(currentItem.identityDescription);
  const knownIdentity = getDuplicateTokenSet(knownItem.identityDescription);
  if (currentIdentity.length < 2 || knownIdentity.length < 2) return false;
  const overlap = countTokenOverlap(currentIdentity, knownIdentity);
  const ratio = overlap / Math.min(currentIdentity.length, knownIdentity.length);
  if (overlap >= 3 && ratio >= 0.6) return true;
  const currentSubject = normalizeDuplicateText(currentItem.subjectName || currentItem.itemName);
  const knownSubject = normalizeDuplicateText(knownItem.subjectName || knownItem.itemName);
  return Boolean(currentSubject && knownSubject && currentSubject === knownSubject && overlap >= 2 && ratio >= 0.5);
}

function getDuplicateTokenSet(text) {
  const normalized = String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\u4e00-\u9fff]+/gu, " ");
  const tokens = normalized
    .split(/\s+/)
    .map(normalizeDuplicateText)
    .filter((token) => token && token.length >= 2 && !isGenericObjectToken(token));
  return [...new Set(tokens)].slice(0, 12);
}

function countTokenOverlap(a, b) {
  const bSet = new Set(b);
  return a.reduce((count, token) => count + (bSet.has(token) ? 1 : 0), 0);
}

function findCurrentPhotoDuplicate(photoKey, sourcePhotoKey = "", cropRect = null) {
  const normalized = makePhotoDuplicateKey(photoKey);
  if (!normalized) return null;
  const normalizedSource = makePhotoDuplicateKey(sourcePhotoKey);
  const normalizedCrop = normalizeCropRect(cropRect);
  return getKnownIdentifiedItems().find((known) => {
    if (known.photoKey === normalized) return true;
    if (!normalizedCrop || !normalizedSource || known.sourcePhotoKey !== normalizedSource) return false;
    return cropRectsAlmostEqual(known.cropRect, normalizedCrop);
  })?.item || null;
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
      sourcePhotoKey: makePhotoDuplicateKey(item.sourcePhotoKey),
      cropRect: normalizeCropRect(item.cropRect),
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
  const sourceA = makePhotoDuplicateKey(a.sourcePhotoKey);
  const sourceB = makePhotoDuplicateKey(b.sourcePhotoKey);
  if (sourceA && sourceB && sourceA === sourceB && cropRectsAlmostEqual(a.cropRect, b.cropRect)) return "exact";
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
  playSoundEffect("appraisalSuccess");
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

function getTextVisualLength(text) {
  return Array.from(String(text || "")).reduce((sum, char) => sum + (char.charCodeAt(0) <= 0x7f ? 0.55 : 1), 0);
}

function formatBalancedItemDisplayName(item, maxSingleLineLength = 6.5) {
  const name = formatItemDisplayName(item).trim().replace(/\s+/g, " ");
  const chars = Array.from(name);
  if (chars.length <= 2 || getTextVisualLength(name) <= maxSingleLineLength) return name;

  let bestIndex = 0;
  let bestScore = Infinity;
  for (let index = 1; index < chars.length; index += 1) {
    const first = chars.slice(0, index).join("").trim();
    const second = chars.slice(index).join("").trim();
    const firstLength = getTextVisualLength(first);
    const secondLength = getTextVisualLength(second);
    if (!firstLength || !secondLength) continue;
    if (secondLength < 2) continue;
    const topShortPenalty = firstLength < secondLength ? 1.8 : 0;
    const score = Math.abs(firstLength - secondLength) + topShortPenalty;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }
  if (!bestIndex) return name;
  return `${chars.slice(0, bestIndex).join("").trim()}\n${chars.slice(bestIndex).join("").trim()}`;
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

function shouldShowFirstPhotoHint() {
  return !state.tutorial.photoStarted
    && !state.lastPhoto
    && !state.gameClear
    && !state.bossReward
    && !isIntroFloor()
    && !isEquipmentLocked()
    && !isPlayerDefeated()
    && state.filmRolls >= 1
    && !getInventoryItemAt(getSelectedSlotIndex());
}

function focusInitialPhotoSlotAfterTowerEntry() {
  ensureInventorySlots();
  state.infoMode = "item";
  state.selectedSlotIndex = 0;
  state.pendingPhotoSlotIndex = 0;
  state.selectedItemId = state.inventory[0]?.id || "";
  state.lootError = "";
  if (!state.lastPhoto) {
    state.pendingCropRect = null;
    state.cropMode = false;
    state.cropDrag = null;
  }
}

function findFirstEmptyInventorySlot() {
  ensureInventorySlots();
  return state.inventory.findIndex((item) => !item);
}

function toggleAutoBattle() {
  if (isBattleActionLocked()) return;
  if (state.autoBattleTimer || state.gameClear || isPlayerDefeated()) return;
  if (!canStartSelectedBattle()) {
    state.infoMode = "log";
    if (!state.tutorial.battleHintSeen) {
      state.tutorial.battleHintSeen = true;
      addBattleEvent("点一只怪，再点战斗。", "info");
    }
    saveGame();
    render();
    return;
  }
  state.infoMode = "log";
  startAutoBattle();
}

function handlePrimaryAction() {
  if (state.gameClear) {
    showCareerSummary();
    return;
  }
  if (isPlayerDefeated() && state.careerSummary) {
    showCareerSummary();
    return;
  }
  if (isIntroFloor()) {
    confirmIntroRewards();
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
  addBattleEvent(modeText(`第${state.floor}层的脚步没有停留，照片勇者绕开阴影继续向上。`), "info");
  advanceFloor();
  saveGame();
  render();
  return true;
}

function canFleeCurrentFloor() {
  if (isIntroFloor()) return false;
  return canBypassCurrentFloor() || canRetreatCurrentBattle();
}

function canBypassCurrentFloor() {
  if (state.gameClear || state.bossReward || isCareerSummaryOpen()) return false;
  if (isPlayerDefeated() || state.currentBattle || state.autoBattleTimer || state.battleStartTimer || state.pendingFloorAdvance) return false;
  if (isEquipmentLocked() || hasPendingPhoto()) return false;
  if (isIntroFloor()) return false;
  return !isBossFloor(state.floor);
}

function canRetreatCurrentBattle() {
  if (state.gameClear || state.bossReward || isCareerSummaryOpen()) return false;
  if (isPlayerDefeated() || !state.currentBattle) return false;
  if (state.battleStartTimer || state.pendingFloorAdvance || hasPendingPhoto() || isAnalyzingPhoto()) return false;
  return true;
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
  const selectedEnemyIds = state.selectedEnemyIds
    .filter((id) => state.enemies.some((enemy) => enemy.id === id && enemy.hp > 0));
  const selectedEnemies = selectedEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
  if (!selectedEnemies.length) return;
  recordGlobalGameStart();

  const selectedIds = new Set(selectedEnemyIds);
  const unselectedIds = state.enemies
    .filter((enemy) => enemy.hp > 0 && !selectedIds.has(enemy.id))
    .map((enemy) => enemy.id);
  state.enemyFlipDownIds = new Set(unselectedIds);
  render();

  state.battleStartTimer = window.setTimeout(() => {
    state.battleStartTimer = 0;
    for (const id of unselectedIds) state.enemyFaceDownIds.add(id);
    state.enemyFlipDownIds = new Set();
    const currentSelectedEnemies = selectedEnemyIds
      .map((id) => state.enemies.find((enemy) => enemy.id === id && enemy.hp > 0))
      .filter(Boolean);
    beginBattle(currentSelectedEnemies);
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
    peerlessAttack: 0,
    peerlessDefense: 0,
    defenseBreakBase: 0,
    defenseBreakSourceCount: 0,
    defenseBreakRatio: 0,
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
    peerlessAttack: clampInt(source.peerlessAttack, 0, 999),
    peerlessDefense: clampInt(source.peerlessDefense, 0, 999),
    defenseBreakBase: clampInt(source.defenseBreakBase, 0, 999),
    defenseBreakSourceCount: clampInt(source.defenseBreakSourceCount, 0, 99),
    defenseBreakRatio: clampNumber(source.defenseBreakRatio, 0, 1),
    damageImmuneUsed: clampInt(source.damageImmuneUsed, 0, 999),
    preBattleStruck: Boolean(source.preBattleStruck),
  };
}

function resetBattleSpecial() {
  state.battleSpecial = createDefaultBattleSpecial();
}

function beginBattle(enemies) {
  const snapshotIds = enemies.map((enemy) => enemy.id);
  state.battleSnapshot = makeBattleSnapshot(snapshotIds);
  const activeIds = expandEnemiesForBattle(enemies).map((enemy) => enemy.id);
  state.activeEnemyIds = activeIds;
  state.selectedEnemyIds = [...activeIds];
  resetBattleSpecial();
  ensureCurrentBattle(activeIds);
  const activeEnemies = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
  applyBattleStartEnemyAuras(activeEnemies);
  lockBattleStartDefenseBreak(activeEnemies, state.battleSpecial);
  const stats = getBattleStats(activeIds);
  state.player.shield = stats.shield;
  state.player.shieldMonsterId = state.encounterId;
  applyBattleStartHeroEffects(activeEnemies);
  applyPreBattleFormEffects();
  state.battleClock = makeBattleClock(getBattleStats(state.activeEnemyIds), getActiveBattleEnemies());
}

function lockBattleStartDefenseBreak(enemies = getActiveBattleEnemies(), battleSpecial = state.battleSpecial) {
  if (!battleSpecial) return;
  const breakCount = getAliveTraitEnemies(enemies).filter((enemy) => hasTrait(enemy, "defenseBreakAura")).length;
  battleSpecial.defenseBreakSourceCount = breakCount;
  battleSpecial.defenseBreakRatio = getEnemyDefenseBreakRatioForCount(breakCount);
  battleSpecial.defenseBreakBase = breakCount > 0
    ? Math.max(0, getPlayerBattleStats(battleSpecial).def || 0)
    : 0;
}

function expandEnemiesForBattle(enemies) {
  if (shouldSummonArchmageMages(enemies)) {
    const archmage = enemies[0];
    const leftMage = makeSummonedMage(archmage, 0);
    const battleArchmage = { ...archmage, slot: 1, summonedBattleCenter: true, summonBattleKind: "archmage" };
    const rightMage = makeSummonedMage(archmage, 2);
    state.enemies = [leftMage, battleArchmage, rightMage];
    state.enemyFaceDownIds = new Set();
    state.enemyFlipDownIds = new Set();
    return getExpandedBossTargetEnemies(state.enemies);
  }
  if (!shouldSummonKnightCaptainGuards(enemies)) return enemies;
  const captain = enemies[0];
  const leftGuard = makeSummonedGuard(captain, 0);
  const battleCaptain = { ...captain, slot: 1, summonedBattleCenter: true, summonBattleKind: "knightCaptain" };
  const rightGuard = makeSummonedGuard(captain, 2);
  state.enemies = [leftGuard, battleCaptain, rightGuard];
  state.enemyFaceDownIds = new Set();
  state.enemyFlipDownIds = new Set();
  return getExpandedBossTargetEnemies(state.enemies);
}

function shouldSummonKnightCaptainGuards(enemies) {
  return state.floor === 30
    && Array.isArray(enemies)
    && enemies.length === 1
    && enemies[0]?.typeKey === "knightCaptain"
    && hasTrait(enemies[0], "summonGuards")
    && !enemies[0].summonedBattleCenter;
}

function shouldSummonArchmageMages(enemies) {
  return state.floor === 38
    && Array.isArray(enemies)
    && enemies.length === 1
    && enemies[0]?.typeKey === "archmage"
    && hasTrait(enemies[0], "summonMageOnAttack")
    && !enemies[0].summonedBattleCenter;
}

function getExpandedBossTargetEnemies(enemies = state.enemies) {
  const list = Array.isArray(enemies) ? enemies.filter(Boolean) : [];
  const center = list.find((enemy) => enemy.summonedBattleCenter);
  if (!center) return list;
  const sideEnemies = list
    .filter((enemy) => enemy.id !== center.id)
    .sort((a, b) => getEnemyVisualSlot(a) - getEnemyVisualSlot(b));
  return [sideEnemies[0], sideEnemies[1], center].filter(Boolean);
}

function getEnemyVisualSlot(enemy) {
  if (Number.isFinite(enemy?.visualIndex)) return enemy.visualIndex;
  if (Number.isFinite(enemy?.archmageSummonSlot)) return enemy.archmageSummonSlot;
  if (Number.isFinite(enemy?.slot)) return enemy.slot;
  return 0;
}

function makeSummonedGuard(captain, slot) {
  const guard = makeEnemy("guard", captain.floor || state.floor, slot);
  return {
    ...guard,
    id: `${captain.id}-summoned-guard-${slot === 0 ? "left" : "right"}`,
    summoned: true,
    summonSourceId: captain.id,
  };
}

function makeSummonedMage(archmage, slot) {
  const mage = makeEnemy("mage", archmage.floor || state.floor, slot);
  return {
    ...mage,
    id: `${archmage.id}-summoned-mage-${slot === 0 ? "left" : "right"}`,
    summoned: true,
    summonSourceId: archmage.id,
    archmageSummonSlot: slot,
  };
}

function applyBattleStartEnemyAuras(enemies = getActiveBattleEnemies()) {
  const activeEnemies = Array.isArray(enemies) ? enemies.filter(Boolean) : [];
  const shieldBonus = sumEnemyTraitValues(activeEnemies, "teamShield");
  if (shieldBonus > 0) {
    for (const enemy of activeEnemies) {
      enemy.maxShield = Math.max(0, enemy.maxShield || 0) + shieldBonus;
      enemy.shield = Math.max(0, enemy.shield || 0) + shieldBonus;
    }
  }
}

function applyBattleStartHeroEffects(enemies = getActiveBattleEnemies()) {
  const activeEnemies = Array.isArray(enemies) ? enemies.filter((enemy) => enemy?.hp > 0) : [];
  if (activeEnemies.some((enemy) => hasTrait(enemy, "breakShield")) && state.player.shield > 0) {
    const shieldLoss = state.player.shield;
    state.player.shield = 0;
    addBattleDetail(`警卫破盾，护盾清空 ${shieldLoss}。`);
  }
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

  state.floor = getPlayableFloor(snapshot.floor);
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

function getSaveFloor(value) {
  return clampInt(value, introFloor, maxFloor);
}

function getPlayableFloor(value) {
  return clampInt(value, 1, maxFloor);
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
    if (enemy) resolveMonsterStrike(enemy, stats, round);
    enemyClock.time += getActionInterval(getEffectiveEnemySpeed(enemy, getActiveBattleEnemies()));
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
  const results = resolveHeroStrikeAgainstEnemy(getHeroTargetEnemy(), "attack");
  let defeatedAny = results.some((result) => result.defeated);

  for (const hitResult of results) {
    const rawDamage = hitResult.rawDamage;
    const shieldCrashDamage = hitResult.shieldCrashDamage;
    const shieldLoss = hitResult.shieldLoss;
    const hpDamage = hitResult.hpDamage;
    const traitChanges = hitResult.traitChanges || [];

    const parts = [];
    if (rawDamage + shieldCrashDamage <= 0) {
      parts.push("未破防");
    } else {
      parts.push(`造成 ${hpDamage}伤害`);
    }
    if (shieldLoss > 0) parts.push(`破盾 ${shieldLoss}`);
    if (shieldCrashDamage > 0) parts.push(`护盾追加 ${shieldCrashDamage}`);
    if (hitResult.healed > 0 || hitResult.lifesteal > 0) parts.push(`吸取${hitResult.healed}血量`);
    if (hitResult.strikeCount > 1) parts.push(`连击${hitResult.strikeIndex + 1}/${hitResult.strikeCount}`);
    if (hitResult.sweepResults?.length) {
      parts.push(`横扫 ${hitResult.sweepResults.map((result) => `${result.enemyName}${result.totalDamage}`).join("、")}`);
    }
    parts.push(...traitChanges);
    addBattleDetail(`第${round}回合勇者进攻${hitResult.enemyName}，${parts.join("，")}。`);
  }

  return defeatedAny;
}

function resolveHeroStrikeAgainstEnemy(initialEnemy = getHeroTargetEnemy(), source = "attack") {
  const strikeCount = getHeroStrikeCount();
  const results = [];
  let enemy = initialEnemy;

  for (let strikeIndex = 0; strikeIndex < strikeCount; strikeIndex += 1) {
    if (!enemy || enemy.hp <= 0 || !state.activeEnemyIds.includes(enemy.id)) break;

    const currentStats = getBattleStats(state.activeEnemyIds);
    const hitResult = applyHeroDamageToEnemy(enemy, currentStats, source);
    const totalDamage = hitResult.totalDamage;
    const sweepResults = triggerSweepDamage(enemy, totalDamage, source);
    let healed = 0;
    const lifesteal = currentStats.lifesteal || 0;
    if (lifesteal > 0) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStats.maxHp, state.player.hp + lifesteal);
      healed = state.player.hp - beforeHp;
    }

    triggerAttackActionSpecial();

    const defeated = enemy.hp <= 0;
    results.push({
      ...hitResult,
      enemyId: enemy.id,
      enemyName: enemy.name,
      healed,
      lifesteal,
      strikeIndex,
      strikeCount,
      sweepResults,
      defeated,
    });

    if (defeated) {
      defeatEnemy(enemy);
      enemy = source === "attack" ? getHeroTargetEnemy() : null;
    } else if (sweepResults.some((result) => result.defeated)) {
      enemy = source === "attack" ? getHeroTargetEnemy() : null;
    }
  }

  return results;
}

function applyHeroDamageToEnemy(enemy, stats, source = "attack") {
  const rawDamage = Math.max(0, stats.atk - getEffectiveEnemyDefense(enemy, stats));
  const shieldCrashDamage = getShieldCrashDamage();
  let damage = rawDamage + shieldCrashDamage;
  damage = applyEnemyIncomingDamageModifiers(enemy, damage, getActiveBattleEnemies());

  const shieldLoss = Math.min(enemy.shield || 0, damage);
  enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
  const hpDamage = Math.max(0, damage - shieldLoss);
  enemy.hp = Math.max(0, enemy.hp - hpDamage);
  const totalDamage = shieldLoss + hpDamage;
  if (source === "attack" || source === "prebattle" || totalDamage > 0) markEnemyHit(enemy.id);
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

function triggerSweepDamage(sourceEnemy, totalDamage, source = "attack") {
  const ratio = getSweepDamageRatio();
  if (ratio <= 0 || totalDamage <= 0) return [];
  const spreadDamage = Math.floor(totalDamage * ratio);
  if (spreadDamage <= 0) return [];
  const targets = getSweepNeighborEnemies(sourceEnemy);
  const results = [];
  for (const target of targets) {
    const beforeAlive = target.hp > 0;
    const hitResult = applyFixedHeroDamageToEnemy(target, spreadDamage, source);
    if (!hitResult.totalDamage) continue;
    const defeated = beforeAlive && target.hp <= 0;
    results.push({
      ...hitResult,
      enemyId: target.id,
      enemyName: target.name,
      defeated,
    });
    if (defeated) defeatEnemy(target);
  }
  return results;
}

function getSweepDamageRatio() {
  return getEquippedPhotoEffectInstances("sweep")
    .reduce((ratio, { effect }) => Math.max(ratio, effect.spreadRatio || 0), 0);
}

function getSweepNeighborEnemies(sourceEnemy) {
  if (!sourceEnemy) return [];
  const sourceIndex = getEnemyVisualIndex(sourceEnemy);
  if (sourceIndex < 0) return [];
  return state.enemies
    .map((enemy, visualIndex) => ({ enemy, visualIndex }))
    .filter((entry) => entry.enemy.id !== sourceEnemy.id && entry.enemy.hp > 0 && state.activeEnemyIds.includes(entry.enemy.id))
    .sort((a, b) => Math.abs(a.visualIndex - sourceIndex) - Math.abs(b.visualIndex - sourceIndex) || a.visualIndex - b.visualIndex)
    .slice(0, 2)
    .map((entry) => entry.enemy);
}

function getEnemyVisualIndex(enemy) {
  if (!enemy) return -1;
  return state.enemies.findIndex((item) => item.id === enemy.id);
}

function applyFixedHeroDamageToEnemy(enemy, damage, source = "sweep") {
  const fixedDamage = Math.max(0, Math.trunc(damage || 0));
  const modifiedDamage = applyEnemyIncomingDamageModifiers(enemy, fixedDamage, getActiveBattleEnemies());
  const shieldLoss = Math.min(enemy.shield || 0, modifiedDamage);
  enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
  const hpDamage = Math.max(0, modifiedDamage - shieldLoss);
  enemy.hp = Math.max(0, enemy.hp - hpDamage);
  const totalDamage = shieldLoss + hpDamage;
  if (totalDamage > 0 || fixedDamage > 0) markEnemyHit(enemy.id);
  const traitChanges = fixedDamage > 0 ? triggerEnemyDamagedTraits(enemy) : [];
  return {
    rawDamage: fixedDamage,
    shieldCrashDamage: 0,
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
    const results = resolveHeroStrikeAgainstEnemy(enemy, "prebattle");
    if (!results.length) continue;
    const totalDamage = results.reduce((sum, result) => sum + result.hpDamage, 0);
    const label = results.length > 1 ? `${enemy.name}${totalDamage}（连击${results.length}）` : `${enemy.name}${totalDamage}`;
    hitNames.push(label);
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
  let attackActionCount = 0;
  const traitChanges = [];

  for (let i = 0; i < hitCount; i += 1) {
    const summoned = trySummonArchmageMage(enemy);
    if (summoned) {
      traitChanges.push(`召唤${summoned.name}`);
      continue;
    }
    attackActionCount += 1;
    const currentStatsBeforeHit = getBattleStats(state.activeEnemyIds);
    const monsterAtk = getMonsterAttackForStrike(enemy, currentStatsBeforeHit, getActiveBattleEnemies());
    const damage = hasTrait(enemy, "magic") ? Math.max(0, monsterAtk) : Math.max(0, monsterAtk - currentStatsBeforeHit.def);
    const immunity = getHeroFormLevelConfig().damageImmunity || 0;
    const isImmune = state.battleSpecial.damageImmuneUsed < immunity && damage > 0;
    if (isImmune) {
      state.battleSpecial.damageImmuneUsed += 1;
      immuneCount += 1;
    }
    const effectiveDamage = isImmune ? 0 : damage;
    const shieldLoss = Math.min(state.player.shield, effectiveDamage);
    const hpLoss = effectiveDamage - shieldLoss;
    state.player.shield -= shieldLoss;
    state.player.hp = Math.max(0, state.player.hp - hpLoss);
    totalHpLoss += hpLoss;
    totalShieldLoss += shieldLoss;
    markHeroHit();
    if (shieldLoss > 0 && getHeroFormLevelConfig().shieldLossToHeal) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStatsBeforeHit.maxHp, state.player.hp + shieldLoss);
      totalRegen += state.player.hp - beforeHp;
    }
    triggerDefendedActionSpecial();

    const currentStats = getBattleStats(state.activeEnemyIds);
    if (state.player.hp > 0 && currentStats.regen > 0) {
      const regenResult = applyHeroRegenAfterHit(currentStats);
      totalRegen += regenResult.hp;
      totalShieldLoss -= regenResult.shield;
    }

    const monsterSteal = getTraitValue(enemy, "lifesteal", 0);
    if (monsterSteal > 0) {
      const beforeHp = enemy.hp;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterSteal);
      monsterStealTotal += enemy.hp - beforeHp;
    }

    traitChanges.push(...triggerEnemyAttackTraits(enemy));
    if (state.player.hp <= 0) break;
  }

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
  if (attackActionCount > 0 && hasTrait(enemy, "magic")) parts.push("无视防御");
  if (hasTrait(enemy, "breakShield")) parts.push("破盾");
  addBattleDetail(`第${round}回合${enemy.name}进攻，${parts.join("，")}。`);
}

function trySummonArchmageMage(enemy) {
  if (!enemy || !hasTrait(enemy, "summonMageOnAttack")) return null;
  const target = state.enemies
    .filter((item) => item?.typeKey === "mage" && item.summonSourceId === enemy.id)
    .sort((a, b) => (a.archmageSummonSlot ?? a.slot ?? 0) - (b.archmageSummonSlot ?? b.slot ?? 0))
    .find((item) => item.hp <= 0 || !state.activeEnemyIds.includes(item.id));
  if (!target) return null;

  reviveSummonedMage(target, enemy);
  return target;
}

function reviveSummonedMage(target, archmage) {
  const slot = Number.isFinite(target.archmageSummonSlot) ? target.archmageSummonSlot : Number.isFinite(target.slot) ? target.slot : 0;
  const id = target.id;
  const visualIndex = Number.isFinite(target.visualIndex) ? target.visualIndex : slot;
  const restored = makeEnemy("mage", archmage.floor || state.floor, slot);
  Object.assign(target, {
    ...restored,
    id,
    slot,
    visualIndex,
    summoned: true,
    summonSourceId: archmage.id,
    archmageSummonSlot: slot,
  });
  state.enemyFaceDownIds.delete(target.id);
  state.enemyFlipDownIds.delete(target.id);
  delete state.enemyHitEffectUntilById[target.id];
  addActiveEnemyIdInExpandedBossOrder(target.id);
  addEnemyClockForRevivedEnemy(target);
}

function addActiveEnemyIdInExpandedBossOrder(enemyId) {
  if (!state.activeEnemyIds.includes(enemyId)) state.activeEnemyIds.push(enemyId);
  const orderedIds = getExpandedBossTargetEnemies(state.enemies).map((enemy) => enemy.id);
  const orderSet = new Set(orderedIds);
  if (!orderedIds.length) return;
  const activeSet = new Set(state.activeEnemyIds);
  state.activeEnemyIds = [
    ...orderedIds.filter((id) => activeSet.has(id)),
    ...state.activeEnemyIds.filter((id) => !orderSet.has(id)),
  ];
}

function addEnemyClockForRevivedEnemy(enemy) {
  if (!state.battleClock?.enemies || !enemy) return;
  if (state.battleClock.enemies.some((clock) => clock.id === enemy.id)) return;
  const activeEnemies = getActiveBattleEnemies();
  state.battleClock.enemies.push({
    id: enemy.id,
    time: getCurrentBattleClockTime() + getActionInterval(getEffectiveEnemySpeed(enemy, activeEnemies)),
  });
}

function applyHeroRegenAfterHit(stats) {
  const amount = Math.max(0, stats?.regen || 0);
  const result = { hp: 0, shield: 0 };
  if (amount <= 0) return result;

  const beforeHp = state.player.hp;
  state.player.hp = Math.min(stats.maxHp, state.player.hp + amount);
  result.hp = state.player.hp - beforeHp;

  if (getHeroFormLevelConfig().regenAffectsShield && stats.shield > 0) {
    const beforeShield = state.player.shield;
    state.player.shield = Math.min(stats.shield, state.player.shield + amount);
    result.shield = state.player.shield - beforeShield;
  }

  return result;
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
  const config = getHeroFormLevelConfig();
  const maxHpGain = Math.max(0, config.killMaxHp || 0);
  const heal = Math.max(0, config.killHeal || 0);
  if (maxHpGain <= 0 && heal <= 0) return;
  const stats = getBattleStats(state.activeEnemyIds);
  if (maxHpGain > 0) {
    state.player.baseHp += maxHpGain;
  }
  const beforeHp = state.player.hp;
  const nextMaxHp = stats.maxHp + maxHpGain;
  state.player.hp = Math.min(nextMaxHp, state.player.hp + heal);
  const healed = state.player.hp - beforeHp;
  const parts = [];
  if (maxHpGain > 0) parts.push(`生命上限+${maxHpGain}`);
  if (healed > 0) parts.push(`回复${healed}`);
  if (parts.length) addBattleDetail(`${getHeroFormDisplayName()}击杀触发：${parts.join("，")}。`);
}

function markEnemyHit(enemyId) {
  if (!enemyId) return;
  playSoundEffect("battleHit", { force: true });
  const token = state.hitEffectToken + 1;
  state.hitEffectToken = token;
  state.enemyHitEffectUntilById[enemyId] = token;
  restartHitAnimation(getEnemyCardElement(enemyId));
  window.setTimeout(() => {
    if (state.enemyHitEffectUntilById[enemyId] !== token) return;
    delete state.enemyHitEffectUntilById[enemyId];
    render();
  }, battleHitEffectMs);
}

function markHeroHit() {
  playSoundEffect("battleHit", { force: true });
  const token = state.hitEffectToken + 1;
  state.hitEffectToken = token;
  state.heroHitEffectUntil = token;
  restartHitAnimation(els.heroAvatarImage.closest(".hero-form-card"));
  window.setTimeout(() => {
    if (state.heroHitEffectUntil !== token) return;
    state.heroHitEffectUntil = 0;
    render();
  }, battleHitEffectMs);
}

function getEnemyCardElement(enemyId) {
  if (!els.enemyField) return null;
  return Array.from(els.enemyField.querySelectorAll(".enemy-card"))
    .find((card) => card.dataset.enemyId === enemyId) || null;
}

function restartHitAnimation(element) {
  if (!element) return;
  element.classList.remove("is-hit");
  void element.offsetWidth;
  element.classList.add("is-hit");
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
    rescaleEnemyClocksForActiveAuras();
  }
}

function rescaleEnemyClocksForActiveAuras() {
  if (!state.battleClock?.enemies?.length) return;
  const activeEnemies = getActiveBattleEnemies();
  const activeEnemyMap = new Map(activeEnemies.map((enemy) => [enemy.id, enemy]));
  const currentTime = getCurrentBattleClockTime();
  for (const clock of state.battleClock.enemies) {
    const enemy = activeEnemyMap.get(clock.id);
    if (!enemy) continue;
    const interval = getActionInterval(getEffectiveEnemySpeed(enemy, activeEnemies));
    if (interval === Infinity) {
      clock.time = Infinity;
      continue;
    }
    clock.time = currentTime + interval;
  }
}

function getCurrentBattleClockTime() {
  if (!state.battleClock) return 0;
  const times = [];
  if (Number.isFinite(state.battleClock.hero)) times.push(state.battleClock.hero);
  if (Array.isArray(state.battleClock.enemies)) {
    for (const clock of state.battleClock.enemies) {
      if (Number.isFinite(clock.time)) times.push(clock.time);
    }
  }
  return times.length ? Math.max(0, Math.min(...times)) : 0;
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
  ensureBgmForGameState(true);
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
  const showPostKillHint = !state.tutorial.postKillHintShown
    && result !== "defeat"
    && Array.isArray(battle.defeatedIds)
    && battle.defeatedIds.length > 0;
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
  if (showPostKillHint) {
    state.tutorial.postKillHintShown = true;
    addBattleEvent(modeText("胶卷攒够后，可以继续拍新装备。"), "info");
  }
  if (result === "defeat") {
    createDefeatCareerSummary();
  }
  ensureBgmForGameState(true);
}

function recordBattleKillStats(result, battle) {
  if (result === "defeat") return;
  const defeatedCount = Array.isArray(battle.defeatedIds) ? battle.defeatedIds.length : 0;
  if (defeatedCount > 0) recordGlobalGameMetric("Kills", defeatedCount);
  const bossKillCount = countBossKillsInBattle(battle);
  if (bossKillCount > 0) recordGlobalGameMetric("BossKills", bossKillCount);
}

function countBossKillsInBattle(battle) {
  const defeatedIds = Array.isArray(battle?.defeatedIds) ? battle.defeatedIds : [];
  const defeatedTypes = Array.isArray(battle?.defeatedTypes) ? battle.defeatedTypes : [];
  let count = 0;
  for (let index = 0; index < Math.max(defeatedIds.length, defeatedTypes.length); index += 1) {
    const type = String(defeatedTypes[index] || "");
    const id = String(defeatedIds[index] || "");
    if (isBossMonsterType(type) || [...bossMonsterKeys].some((bossKey) => id.includes(bossKey))) {
      count += 1;
    }
  }
  return count;
}

function applyFormBattleEndEffects(result, battle) {
  if (result !== "victory") return;
  void battle;
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
  addBattleEvent(`第${floor}层的封印松开，三张奖励牌从门缝里翻了出来。`, "item");
  ensureBgmForGameState(true);
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
  const catalog = [
    { type: "filmFlat", title: "补给胶卷", effect: "+1.0 胶卷", desc: "立刻获得 1.0 胶卷。", icon: "boss-value-min.png" },
    { type: "filmDrop", title: "胶卷磁石", effect: "掉落 +0.1", desc: "之后击败怪物永久 +0.1。", icon: "boss-film-drop.png" },
    { type: "filmPercent", title: "胶卷倍增", effect: "当前 +50%", desc: "按当前数量 +50%，向上取整。", icon: "boss-film-percent.png" },
    { type: "valueMin", title: "泛用胶卷", effect: "最低 +2", desc: "之后照片最低价值永久 +2。", icon: "boss-value-min-boost.png" },
    { type: "valueMax", title: "高级胶卷", effect: "最高 +3", desc: "之后照片最高价值永久 +3。", icon: "boss-value-max.png" },
  ];
  return catalog.map((item) => ({
    ...item,
    title: modeText(item.title),
    effect: modeText(item.effect),
    desc: modeText(item.desc),
  }));
}

function getBossRewardDisplayOption(option, mode = state.playMode) {
  const fallback = getBossRewardCatalog(mode).find((item) => item.type === option?.type) || {};
  return {
    ...option,
    title: fallback.title || modeText(option?.title || "奖励", mode),
    effect: fallback.effect || modeText(option?.effect || "", mode),
    desc: fallback.desc || modeText(option?.desc || "选择后进入下一层。", mode),
    icon: fallback.icon || option?.icon || getBossRewardIcon(option?.type),
  };
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
    addBattleEvent("先翻看一张奖励牌，再点击选择确认。", "item");
    render();
    return;
  }
  chooseBossReward(index);
}

function applyBossReward(option) {
  if (option.type === "filmDrop") {
    state.globalFilmDropBonus = getGlobalFilmDropBonus() + 1;
    return `奖励：${getResourceName()}掉落 +0.1。`;
  }
  if (option.type === "filmPercent") {
    const before = getFilmCount();
    const gain = ceilFilmTenth(before * 0.5);
    addFilmShards(Math.round(gain * 10));
    return `奖励：当前${getResourceName()} +${gain.toFixed(1)}。`;
  }
  if (option.type === "filmFlat") {
    addFilmShards(10);
    return `奖励：${getResourceName()} +1.0。`;
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
  if (!state.careerSummary.outcome) state.careerSummary.outcome = getCareerSummaryOutcome(state.careerSummary);
  state.infoMode = "career";
  saveGame();
  render();
}

function isCareerSummaryOpen() {
  return state.infoMode === "career";
}

function createDefeatCareerSummary() {
  state.careerSummary = buildLocalCareerSummary("defeat");
  state.infoMode = "career";
}

function normalizeTutorialState(tutorial) {
  return {
    ...defaultTutorialState,
    ...(tutorial && typeof tutorial === "object" ? tutorial : {}),
    photoStarted: Boolean(tutorial?.photoStarted),
    battleHintSeen: Boolean(tutorial?.battleHintSeen),
    postKillHintShown: Boolean(tutorial?.postKillHintShown),
    introEnteredTower: Boolean(tutorial?.introEnteredTower),
  };
}

function isIntroFloor() {
  return state.floor === introFloor && !state.gameClear;
}

function getIntroRewards() {
  if (!isDrawingMode()) return introRewardOptions.map((option) => ({ ...option }));
  return introRewardOptions.map((option, index) => ({
    ...option,
    title: "画布",
    effect: "+1.0 画布",
    desc: [
      "点亮空装备格，打开画布，把你的简笔画带进塔中。",
      "在鉴定台填好图文 API，按钮亮起后再鉴定画作。",
      "入塔后点击怪物卡选定目标，按战斗夺回新的画布。",
    ][index] || modeText(option.desc),
  }));
}

function getIntroRewardSelection() {
  const validIds = new Set(introRewardOptions.map((option) => option.id));
  state.introRewardSelectedIds = Array.isArray(state.introRewardSelectedIds)
    ? state.introRewardSelectedIds.filter((id, index, ids) => validIds.has(id) && ids.indexOf(id) === index)
    : [];
  return state.introRewardSelectedIds;
}

function hasSelectedAllIntroRewards() {
  return getIntroRewardSelection().length === introRewardOptions.length;
}

function selectIntroReward(id) {
  if (!isIntroFloor()) return;
  const validIds = new Set(introRewardOptions.map((option) => option.id));
  if (!validIds.has(id)) return;
  const selected = getIntroRewardSelection();
  const existingIndex = selected.indexOf(id);
  if (existingIndex >= 0) {
    selected.splice(existingIndex, 1);
  } else {
    selected.push(id);
  }
  state.infoMode = "item";
  saveGame();
  render();
}

function confirmIntroRewards() {
  if (!isIntroFloor()) return;
  if (!hasSelectedAllIntroRewards()) {
    state.infoMode = "item";
    addBattleEvent(modeText("塔门纹路尚未闭合。把三卷胶卷一并放上石台，门锁才会转动。"), "item");
    saveGame();
    render();
    return;
  }
  enterTowerFromIntro();
}

function enterTowerFromIntro() {
  stopAutoBattle();
  stopBattleTimers();
  clearEnemyCardMotion();
  state.floor = 1;
  state.tutorial.introEnteredTower = true;
  state.introRewardSelectedIds = [];
  state.filmRolls = Math.max(state.filmRolls, introFilmRewardCount);
  state.filmShards = 0;
  state.selectedEnemyIds = [];
  state.activeEnemyIds = [];
  state.currentBattle = null;
  state.battleSnapshot = null;
  state.battleClock = null;
  state.bossReward = null;
  state.enemies = buildFloorEncounter(state.floor);
  state.encounterId = makeEncounterId();
  state.enemyFlipEncounterId = state.encounterId;
  applyFloorShield();
  focusInitialPhotoSlotAfterTowerEntry();
  addBattleEvent(modeText("三卷胶卷在石台上亮起，塔门缓缓向内打开。照片勇者踏上第 1 层。"), "item");
  addFloorNarrative(state.floor);
  playSoundEffect("nextFloor");
  ensureBgmForGameState(true);
  saveGame();
  render();
}

function getCareerSummaryOutcome(summary = state.careerSummary) {
  if (summary?.outcome === "defeat" || summary?.snapshot?.outcome === "defeat") return "defeat";
  if (!state.gameClear && isPlayerDefeated()) return "defeat";
  return "clear";
}

function isDefeatCareerSummary(summary = state.careerSummary) {
  return getCareerSummaryOutcome(summary) === "defeat";
}

function buildLocalCareerSummary(outcome = state.gameClear ? "clear" : isPlayerDefeated() ? "defeat" : "clear") {
  const normalizedOutcome = outcome === "defeat" ? "defeat" : "clear";
  const snapshot = buildCareerSnapshot(normalizedOutcome);
  const itemText = formatCareerTopItemNames(snapshot);
  if (normalizedOutcome === "defeat") {
    const floor = Math.max(introFloor, snapshot.defeatFloor || snapshot.floor || state.floor || introFloor);
    const defeatLine = snapshot.defeatSummary
      ? `最后一页战报写着：${snapshot.defeatSummary}`
      : `最后一页停在第${floor}层，墨迹没有再向塔顶延伸。`;
    return {
      status: "local",
      outcome: "defeat",
      title: "止步旧塔",
      text: [
        `多年以后，塔底的旧账仍夹着一张未烧尽的胶片。${snapshot.formLabel}把照片装备带到第${floor}层，生命停在${snapshot.hp}，攻击${snapshot.stats.atk}、防御${snapshot.stats.def}、速度${snapshot.stats.speed}也被一并记下。`,
        `这次登塔击退了${snapshot.killCount}只怪物，${snapshot.bossKillCount}位Boss的名字曾被划去。${itemText}留在记录里，像几件从现实落进塔缝的遗物。`,
        `${defeatLine}守塔人没有把它写成笑话，只在边角补了一句：倒下的那一刻，照片勇者仍握着下一次重开的影子。`,
      ].map((line) => modeText(line)).join("\n\n"),
      snapshot,
      createdAt: Date.now(),
    };
  }
  return {
    status: "local",
    outcome: "clear",
    title: "塔顶旧闻",
    text: [
      `多年以后，塔底的石碑仍记着一位${snapshot.formLabel}。他带着照片醒出的器物登上第${maxFloor}层，终局之力定格为生命${snapshot.stats.maxHp}、攻击${snapshot.stats.atk}、防御${snapshot.stats.def}、速度${snapshot.stats.speed}。`,
      `旧塔账册记下了${snapshot.killCount}场怪物败退，其中${snapshot.bossKillCount}位Boss被刻进封门名录。${itemText}被列为代表装备，像从现实里带入塔中的奇物。`,
      `后来的人说，照片勇者并非只靠一柄名剑通关，而是把手边万物都变成了登塔的台阶。胶卷耗尽之前，他把这段冒险留成了新的塔顶传说。`,
    ].map((line) => modeText(line)).join("\n\n"),
    snapshot,
    createdAt: Date.now(),
    outcome: "clear",
  };
}

function formatCareerTopItemNames(snapshot) {
  const names = snapshot.topItems.map((item) => item.name).filter(Boolean).slice(0, 3);
  if (!names.length) return modeText("还没有被命名的照片装备");
  if (names.length === 1) return `${names[0]}`;
  return `${names.slice(0, -1).join("、")}和${names[names.length - 1]}`;
}

function buildCareerSnapshot(outcome = state.gameClear ? "clear" : isPlayerDefeated() ? "defeat" : "clear") {
  const stats = getPlayerStats();
  const reports = state.battleReports.filter((entry) => entry && entry.type !== "event");
  const defeatReport = reports.find((entry) => entry.result === "defeat");
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
    .map((item, slotIndex) => ({
      name: formatItemDisplayName(item),
      score: scoreItem(item),
      quality: getItemQuality(scoreItem(item)).label,
      qualityKey: getItemQuality(scoreItem(item)).key,
      image: item.image || item.fullImage || "",
      slotIndex,
      stats: normalizeStats(item.stats || {}, 999),
      effects: getItemSpecialKeys(item).map((key) => photoSpecialEffectMap.get(key)?.label || key),
    }))
    .sort((a, b) => b.score - a.score);
  return {
    outcome: outcome === "defeat" ? "defeat" : "clear",
    floor: state.floor,
    reachedFloor: state.floor,
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
    defeatSummary: defeatReport?.summary || "",
    defeatMonsterName: defeatReport?.monsterName || "",
    defeatFloor: defeatReport?.floor || state.floor,
  };
}

async function requestCareerSummary(force = false) {
  if ((!state.gameClear && !isPlayerDefeated()) || state.careerSummaryRequest) return;
  if (!force && state.careerSummary?.status === "ai") return;
  const outcome = getCareerSummaryOutcome();
  const config = getConfigFromInputs();
  if (!config.baseUrl || !config.apiKey || !config.model) {
    if (!state.careerSummary) state.careerSummary = buildLocalCareerSummary(outcome);
    state.careerSummary.status = "local";
    state.careerSummary.outcome = outcome;
    state.careerSummary.note = "";
    saveGame();
    render();
    return;
  }

  const snapshot = buildCareerSnapshot(outcome);
  state.careerSummary = {
    ...(state.careerSummary || buildLocalCareerSummary(outcome)),
    status: "loading",
    outcome,
    snapshot,
    note: "塔内书记官正在誊写塔史。",
  };
  render();

  const request = { startedAt: Date.now() };
  state.careerSummaryRequest = request;
  try {
    const response = await fetchJsonWithTimeout(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: buildModelHeaders(config),
      body: JSON.stringify(withProviderRequestOptions(config, {
        model: config.model,
        temperature: 0.72,
        max_tokens: 520,
        messages: [
          { role: "system", content: modeText("你是魔塔旧史的书记官。请用第三人称写照片勇者的塔史记录，像多年后塔内石碑和旧账册留下的文字。只输出成稿，不要Markdown、星号、列表、分析过程或标题标签。") },
          { role: "user", content: buildCareerSummaryPrompt(snapshot, outcome) },
        ],
      })),
    }, 45000, "塔史总结");
    if (state.careerSummaryRequest !== request) return;
    const text = sanitizeCareerSummaryText(readModelText(response.payload));
    if (!response.response.ok || !text) throw new Error("塔史暂未写成。");
    state.careerSummary = {
      status: "ai",
      outcome,
      title: extractCareerSummaryTitle(text) || (outcome === "defeat" ? "止步旧塔" : "塔顶旧闻"),
      text,
      snapshot,
      createdAt: Date.now(),
    };
  } catch (error) {
    if (state.careerSummaryRequest !== request) return;
    const fallback = buildLocalCareerSummary(outcome);
    state.careerSummary = {
      ...fallback,
      status: "error",
      note: "塔史暂未写成，当前显示塔内旧册。",
    };
  } finally {
    if (state.careerSummaryRequest === request) state.careerSummaryRequest = null;
    saveGame();
    render();
  }
}

function buildCareerSummaryPrompt(snapshot, outcome = snapshot?.outcome || "clear") {
  const itemLines = snapshot.topItems.length
    ? snapshot.allItems.slice(0, 10).map((item, index) => `${index + 1}. ${item.quality} ${item.name}，分数${item.score}，属性${formatSnapshotStats(item.stats)}${item.effects.length ? `，词条${item.effects.join("、")}` : ""}`).join("\n")
    : modeText("无照片装备");
  if (outcome === "defeat") {
    return [
      "请基于以下战败数据，写一段更像魔塔旧账残页的中文结局。",
      "要求：",
      "1. 第一行写一个8-14字短标题，后面写3段短文，每段40-70字；不要列表编号。",
      "2. 使用第三人称，像多年后塔中石碑、旧账册、守塔人口耳相传的记录；不要写“我”。",
      "3. 风格要有历史感、魔塔感和止步后的余韵；不要嘲笑玩家，不要写成教程或失败提示。",
      "4. 不要写通关、登顶、塔顶传说等已经完成通关的表达；可以写止步、残页、遗物、重开前的影子。",
      "5. 突出照片装备，至少点名1-3件代表装备；装备少则如实写。写出它们像留在塔中的遗物，而不是普通数值道具。",
      "6. 自然提及止步层数、击杀数、Boss击杀数、最终能力、剩余胶卷和最后战斗，不要堆砌成报表。",
      "7. 不要解释规则，不要提API、模型、JSON、推理过程、开发者或截图分享。",
      "8. 禁止使用Markdown格式，禁止星号、井号、项目符号、标题：、【战败】等包装。",
      "9. 只输出最终成稿。",
      "",
      `勇者形态：${snapshot.formLabel}`,
      `止步层数：第${snapshot.floor}层`,
      `最终能力：生命${snapshot.stats.maxHp}，当前生命${snapshot.hp}，攻击${snapshot.stats.atk}，防御${snapshot.stats.def}，速度${snapshot.stats.speed}，护盾${snapshot.stats.shield}，回复${snapshot.stats.regen}，吸血${snapshot.stats.lifesteal}`,
      `击败怪物：${snapshot.killCount}只`,
      `击败Boss：${snapshot.bossKillCount}只`,
      `剩余胶卷：${snapshot.film}`,
      `装备数量：${snapshot.equipmentCount}`,
      "代表装备：",
      itemLines,
      "最后战斗：",
      snapshot.defeatSummary || snapshot.battleHighlights.join("\n") || "无",
    ].map((line) => modeText(line)).join("\n");
  }
  return [
    "请基于以下通关数据，写一段更像魔塔通关后流传多年的中文传说。",
    "要求：",
    "1. 第一行写一个8-14字短标题，后面写3段短文，每段40-70字；不要列表编号。",
    "2. 使用第三人称，像多年后塔中石碑、旧账册、守塔人口耳相传的记录；不要写“我”。",
    "3. 风格要有历史感、魔塔感和通关后的余韵；可以克制地幽默，但不要像广告文案。",
    "4. 突出照片装备，至少点名3件代表装备；装备少则如实写。写出它们像被塔赋予了意义，而不是普通数值道具。",
    "5. 自然提及Boss击杀数、怪物击杀数、最终能力和剩余胶卷，不要堆砌成报表。",
    "6. 不要解释规则，不要提API、模型、JSON、推理过程、开发者或截图分享。",
    "7. 禁止使用Markdown格式，禁止星号、井号、项目符号、标题：、【通关】等包装。",
    "8. 只输出最终成稿。",
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
  ].map((line) => modeText(line)).join("\n");
}

function formatSnapshotStats(stats) {
  const parts = [];
  for (const key of statOrder) {
    const value = stats[key] || 0;
    if (value) parts.push(`${statLabels[key]}${formatSignedNumber(value)}`);
  }
  return modeText(parts.join("、") || "无");
}

function sanitizeCareerSummaryText(text) {
  const cleaned = String(text || "")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```(?:markdown|text|json)?/gi, "").replace(/```/g, ""))
    .replace(/^(?:分析|思考|推理|reasoning|thinking)[:：][\s\S]*?(?:最终回答|最终总结|final answer)[:：]/i, "")
    .replace(/\r/g, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/__([^_\n]+)__/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/^\s*(?:[-*•·]\s*)+/gm, "")
    .replace(/^\s*\d+[.)、]\s*/gm, "")
    .replace(/^\s*(?:标题|题目|短标题)\s*[:：]\s*/gmi, "")
    .replace(/\bAI\s*/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 900);
  return cleaned
    .split(/\n+/)
    .map((line) => line.trim().replace(/^\s*[【\[]?(?:通关|战败|失败)[】\]]?\s*[:：!！-]?\s*/u, ""))
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 900);
}

function extractCareerSummaryTitle(text) {
  const first = sanitizeCareerSummaryText(text).split(/\n+/).map((line) => line.trim()).filter(Boolean)[0] || "";
  if (!first) return "";
  return cleanText(first.replace(/^《|》$/g, ""), "", 18);
}

function getCareerSummaryParagraphs(summary) {
  const lines = sanitizeCareerSummaryText(summary?.text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const fallbackTitle = isDefeatCareerSummary(summary) ? "止步旧塔" : "塔顶旧闻";
  const savedTitle = cleanText(String(summary?.title || "").replace(/\bAI\s*/gi, ""), fallbackTitle, 18);
  const extractedTitle = extractCareerSummaryTitle(summary?.text || "");
  const useExtractedTitle = Boolean(extractedTitle && (summary?.status === "ai" || !summary?.title));
  const title = useExtractedTitle ? extractedTitle : savedTitle;
  const bodyLines = lines.length > 1 && lines[0] === title ? lines.slice(1) : lines.filter((line, index) => index || line !== title);
  const paragraphs = bodyLines.length ? bodyLines : lines.filter((line) => line !== title);
  return {
    title,
    paragraphs: paragraphs.slice(0, 4),
  };
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
  if (floor <= introFloor) {
    return modeText("塔门前的石台亮着三道卷轴槽。收齐三卷胶卷，第一层才会现身。");
  }
  const safeFloor = getPlayableFloor(floor);
  if (bossFloorNarratives[safeFloor]) return bossFloorNarratives[safeFloor];
  if (rewardBossFloorNarratives[safeFloor]) return rewardBossFloorNarratives[safeFloor];
  if (floorNarratives[safeFloor]) return floorNarratives[safeFloor];
  if (safeFloor > 1 && safeFloor % 10 === 1) {
    return `第${safeFloor}层的石门带着新气味打开，旧影子还没散去，陌生脚步已经混进走廊。`;
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
  const lifeText = `生命 ${formatHpDelta(hpDelta)}`;
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
    if (isBossFloor(floor)) {
      const bossText = floor === maxFloor
        ? "塔顶封印碎裂，魔王的名字被刻进最后一页"
        : "封门石锁崩开，楼梯重新露出向上的缝隙";
      return `${bossText} · 击败${monsterName}，${lifeText}${remainText}，获得：${lootText}。`;
    }
    if (isRewardBossFloor(floor)) {
      return `贪心有了回响 · 击败${monsterName}，${lifeText}${remainText}，获得：${lootText}。`;
    }
    return `${label} · 第${floor}层击败${monsterName}，${lifeText}${remainText}，获得：${lootText}。`;
  }
  if (result === "defeat") {
    return `倒下 · 第${floor}层${monsterName}截住了照片勇者，${lifeText}，获得：${lootText}。`;
  }
  if (result === "enemy-fled") {
    const roundLimit = Number.isFinite(battle?.roundLimit) ? battle.roundLimit : getBattleRoundLimit(battle?.initialEnemyCount || 1);
    return `脱战 · 第${floor}层缠斗${roundLimit}回合后，敌人退回阴影，${lifeText}，获得：${lootText}。`;
  }
  if (result === "boss-timeout") {
    const roundLimit = Number.isFinite(battle?.roundLimit) ? battle.roundLimit : getBattleRoundLimit(battle?.initialEnemyCount || 1, floor);
    return `破局 · 第${floor}层撑过${roundLimit}回合，封门自行松开，${lifeText}，获得：无。`;
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
  if (filmTotal > 0) parts.unshift(`${getResourceName()} +${filmTotal.toFixed(1)}`);
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
  if (state.gameClear) return false;
  if (isIntroFloor()) return true;
  return isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || Boolean(state.bossReward) || isCareerSummaryOpen();
}

function canSelectEquipmentSlot(index) {
  const item = getInventoryItemAt(index);
  if (state.gameClear) return true;
  if (isIntroFloor()) return Boolean(item);
  if (isPlayerDefeated()) return Boolean(item);
  if (isCareerSummaryOpen() || hasPendingPhoto() || Boolean(state.bossReward)) return false;
  return !isEquipmentLocked();
}

function isBattleActionLocked() {
  return hasPendingPhoto() || Boolean(state.bossReward) || (isIntroFloor() && !hasSelectedAllIntroRewards());
}

function makeBattleClock(stats, enemies) {
  return {
    hero: getActionInterval(stats.speed),
    enemies: enemies.map((enemy) => ({
      id: enemy.id,
      time: getActionInterval(getEffectiveEnemySpeed(enemy, enemies)),
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
    .filter((enemy) => enemy && enemy.hp > 0);
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
  if (isIntroFloor()) {
    enterTowerFromIntro();
    return;
  }
  clearEnemyCardMotion();
  if (state.floor >= maxFloor) {
    completeGame();
    return;
  }
  playSoundEffect("nextFloor");
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
  ensureBgmForGameState(true);
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
  addBattleEvent(modeText("塔顶的门被推开，照片勇者带着一包奇怪装备通关了40层。"), "hero");
  if (!wasClear) recordGlobalGameMetric("Clears", 1);
  ensureBgmForGameState(true);
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
  if (!Number.isFinite(state.floor) || state.floor < introFloor) state.floor = introFloor;
  if (isIntroFloor()) {
    state.enemies = [];
    state.selectedEnemyIds = [];
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleSnapshot = null;
    state.battleClock = null;
    state.encounterId = "intro";
    return;
  }
  if (!Array.isArray(state.enemies) || !state.enemies.length) {
    state.enemies = buildFloorEncounter(state.floor);
  }
  state.enemies = state.currentBattle
    ? state.enemies.map(normalizeCombatEnemy).filter(Boolean)
    : state.enemies.map(normalizeEnemy).filter(Boolean);
  state.encounterId = state.encounterId || makeEncounterId();
  const validIds = new Set(state.enemies.map((enemy) => enemy.id));
  state.selectedEnemyIds = Array.isArray(state.selectedEnemyIds)
    ? state.selectedEnemyIds.filter((id, index, ids) => validIds.has(id) && ids.indexOf(id) === index)
    : [];
  if (!state.currentBattle) applyFloorShield();
}

function buildFloorEncounter(floor) {
  if (floor <= introFloor) return [];
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
  if (floor === 30) return ["knightCaptain"];
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
  const pressureEntries = entries.filter((entry) => (entry.tier || 1) >= Math.max(1, maxTier - 1));
  const midSource = maxTier <= 1 && nonSlimeEntries.length ? nonSlimeEntries : midEntries.length ? midEntries : entries;
  const strongSource = maxTier <= 1 && nonSlimeEntries.length
    ? nonSlimeEntries
    : pressureEntries.length
      ? pressureEntries
      : strongEntries.length
        ? strongEntries
        : entries;
  const weakPool = buildWeightedMonsterPool(floor, weakEntries.length ? weakEntries : entries, { weakRetention: true, pressure: 0.55 });
  const midPool = buildWeightedMonsterPool(floor, midSource, { pressure: 0.85, unlockRamp: true });
  const strongPool = buildWeightedMonsterPool(floor, strongSource, { pressure: 1.05, unlockRamp: true });
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
    const ramp = options.unlockRamp ? getMonsterUnlockRamp(entry, floor) : 1;
    const finalWeight = Math.max(options.minimumPerEntry || 1, Math.round(Math.max(baseWeight, weakRetention) * ramp));
    for (let i = 0; i < finalWeight; i += 1) weighted.push(entry.key);
  }
  return weighted.length ? weighted : ["slime"];
}

function getMonsterUnlockRamp(entry, floor) {
  const tier = entry.tier || 1;
  if (tier <= 2) return 1;
  const age = Math.max(0, floor - entry.floor);
  const rampByTier = tier >= 4
    ? [0.16, 0.24, 0.34, 0.48, 0.62, 0.74, 0.84, 0.92, 1]
    : [0.35, 0.5, 0.68, 0.84, 1];
  return rampByTier[Math.min(age, rampByTier.length - 1)] || 1;
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

function normalizeCombatEnemy(enemy) {
  if (!enemy || typeof enemy !== "object") return null;
  if (enemy.testEnemy) return normalizeEnemy(enemy);

  const floor = Number.isFinite(enemy.floor) ? enemy.floor : state.floor;
  const slot = Number.isFinite(enemy.slot) ? enemy.slot : 0;
  const base = makeEnemy(enemy.typeKey || "slime", floor, slot);
  const maxHp = base.maxHp;
  const maxShield = Math.max(
    base.maxShield,
    Number.isFinite(enemy.maxShield) ? enemy.maxShield : 0,
    Number.isFinite(enemy.shield) ? enemy.shield : 0,
  );

  return {
    ...base,
    ...enemy,
    id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
    name: base.name,
    typeName: base.typeName,
    maxHp,
    hp: Number.isFinite(enemy.hp) ? Math.max(0, Math.min(enemy.hp, maxHp)) : maxHp,
    atk: Number.isFinite(enemy.atk) ? Math.max(0, enemy.atk) : base.atk,
    def: Number.isFinite(enemy.def) ? Math.max(0, enemy.def) : base.def,
    speed: Number.isFinite(enemy.speed) ? Math.max(1, enemy.speed) : base.speed,
    maxShield,
    shield: Number.isFinite(enemy.shield) ? Math.max(0, Math.min(enemy.shield, maxShield)) : maxShield,
    traits: base.traits,
  };
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
  if (getHeroFormLevelConfig().noFilmDrop) return 0;
  const baseShards = getEnemyBaseFilmShards(enemy);
  const bonusShards = getGlobalFilmDropBonus() + getHeroFormFilmShardBonus();
  if (enemy?.summoned) return Math.max(0, bonusShards);
  return Math.max(0, baseShards + bonusShards);
}

function getEnemyPreviewFilmShardDrop(enemy) {
  return getEnemyFilmShardDrop(enemy);
}

function getEnemyBaseFilmShards(enemy) {
  if (enemy?.summoned) return 0;
  const typeKey = enemy?.typeKey || "";
  return highFilmBossMonsterKeys.has(typeKey) ? 3 : 1;
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
  return getHeroFormLevel(form) >= 2 ? `超级${form.label}` : `${form.label}形态`;
}

function adjustHeroResourcesAfterStatChange(oldStats, newStats, oldShield = state.player.shield) {
  if (!oldStats || !newStats) return;
  const maxHpDelta = (newStats.maxHp || 0) - (oldStats.maxHp || 0);
  if (maxHpDelta > 0) {
    state.player.hp += maxHpDelta;
  } else if (maxHpDelta < 0) {
    state.player.hp += maxHpDelta;
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
    recordGlobalGameMetric("SuperForms", 1);
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
  return `${getResourceName()} ${(getEnemyPreviewFilmShardDrop(enemy) / 10).toFixed(1)}`;
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
    totalBossKills: 0,
    totalAppraisals: 0,
    totalEquipment: 0,
    totalPhotoEquipment: 0,
    totalDrawingEquipment: 0,
    totalSuperForms: 0,
    totalFloors: 0,
    totalClears: 0,
    todayPv: 0,
    todayUv: 0,
    todayGames: 0,
    todayKills: 0,
    todayBossKills: 0,
    todayAppraisals: 0,
    todayEquipment: 0,
    todayPhotoEquipment: 0,
    todayDrawingEquipment: 0,
    todaySuperForms: 0,
    todayFloors: 0,
    todayClears: 0,
  };
}

function normalizeGlobalStats(input) {
  const source = input && typeof input === "object" ? input : {};
  const totalPhotoEquipment = clampInt(source.totalPhotoEquipment ?? source.totalEquipment, 0, 99999999);
  const todayPhotoEquipment = clampInt(source.todayPhotoEquipment ?? source.todayEquipment, 0, 99999999);
  return {
    totalPv: clampInt(source.totalPv, 0, 99999999),
    totalUv: clampInt(source.totalUv, 0, 99999999),
    totalGames: clampInt(source.totalGames, 0, 99999999),
    totalKills: clampInt(source.totalKills, 0, 99999999),
    totalBossKills: clampInt(source.totalBossKills, 0, 99999999),
    totalAppraisals: clampInt(source.totalAppraisals, 0, 99999999),
    totalEquipment: totalPhotoEquipment,
    totalPhotoEquipment,
    totalDrawingEquipment: clampInt(source.totalDrawingEquipment, 0, 99999999),
    totalSuperForms: clampInt(source.totalSuperForms, 0, 99999999),
    totalFloors: clampInt(source.totalFloors, 0, 99999999),
    totalClears: clampInt(source.totalClears, 0, 99999999),
    todayPv: clampInt(source.todayPv, 0, 99999999),
    todayUv: clampInt(source.todayUv, 0, 99999999),
    todayGames: clampInt(source.todayGames, 0, 99999999),
    todayKills: clampInt(source.todayKills, 0, 99999999),
    todayBossKills: clampInt(source.todayBossKills, 0, 99999999),
    todayAppraisals: clampInt(source.todayAppraisals, 0, 99999999),
    todayEquipment: todayPhotoEquipment,
    todayPhotoEquipment,
    todayDrawingEquipment: clampInt(source.todayDrawingEquipment, 0, 99999999),
    todaySuperForms: clampInt(source.todaySuperForms, 0, 99999999),
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
  void recordGlobalGameMetricForTest(metric, amount, { refresh: true });
}

function recordGlobalGameMetricForTest(metric, amount = 1, options = {}) {
  const totalKey = STATS_COUNTER_IDS[`total${metric}`];
  const dailyPrefix = STATS_COUNTER_IDS[`daily${metric}Prefix`];
  const count = clampInt(amount, 0, 999);
  if (!totalKey || !dailyPrefix || count <= 0) return Promise.resolve(false);
  const today = getLocalDateKey();
  const dailyKey = makeDailyCounterId(dailyPrefix, today);
  const updates = [];
  for (let i = 0; i < count; i += 1) {
    updates.push(incrementStatsCounter(totalKey));
    updates.push(incrementStatsCounter(dailyKey));
  }
  return Promise.all(updates).then(() => {
    if (options.refresh === false) return true;
    return refreshGlobalStats().then(() => true);
  }).catch((error) => {
    console.warn("记录全站游戏事件失败:", error);
    state.globalStatsStatus = "游戏统计同步失败。";
    renderGlobalStatsPanel();
    return false;
  });
}

function recordGlobalAppraisalPlayer() {
  if (!shouldRecordGlobalStats()) return;
  void recordGlobalAppraisalPlayerForTest({ refresh: true });
}

function recordGlobalAppraisalPlayerForTest(options = {}) {
  const today = getLocalDateKey();
  const alreadyRecorded = localStorage.getItem(STORAGE_KEYS.statsAppraisalRecorded) === "true";
  const lastRecordedDate = localStorage.getItem(STORAGE_KEYS.statsLastAppraisalDate);
  if (alreadyRecorded && lastRecordedDate === today) return Promise.resolve({ totalRecorded: false, dailyRecorded: false, skipped: true });
  if (appraisalPlayerRecordPending) return Promise.resolve({ totalRecorded: false, dailyRecorded: false, skipped: true, pending: true });
  appraisalPlayerRecordPending = true;
  ensureStatsAppraisalId();
  const updates = [];
  const totalRecorded = !alreadyRecorded;
  const dailyRecorded = lastRecordedDate !== today;
  if (!alreadyRecorded) {
    updates.push(incrementStatsCounter(STATS_COUNTER_IDS.totalAppraisals));
  }
  if (lastRecordedDate !== today) {
    updates.push(incrementStatsCounter(makeDailyCounterId(STATS_COUNTER_IDS.dailyAppraisalsPrefix, today)));
  }
  return Promise.all(updates).then(() => {
    localStorage.setItem(STORAGE_KEYS.statsAppraisalRecorded, "true");
    localStorage.setItem(STORAGE_KEYS.statsLastAppraisalDate, today);
    appraisalPlayerRecordPending = false;
    if (options.refresh === false) return { totalRecorded, dailyRecorded, skipped: false };
    return refreshGlobalStats().then(() => ({ totalRecorded, dailyRecorded, skipped: false }));
  }).catch((error) => {
    appraisalPlayerRecordPending = false;
    console.warn("Failed to record global appraisal player:", error);
    state.globalStatsStatus = "Appraisal stats sync failed.";
    renderGlobalStatsPanel();
    return { totalRecorded: false, dailyRecorded: false, skipped: false, error: true };
  });
}

function ensureStatsAppraisalId() {
  let id = localStorage.getItem(STORAGE_KEYS.statsAppraisalId);
  if (!id) {
    id = makeRunSeed();
    localStorage.setItem(STORAGE_KEYS.statsAppraisalId, id);
  }
  return id;
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
  const dailyBossKills = makeDailyCounterId(STATS_COUNTER_IDS.dailyBossKillsPrefix, today);
  const dailyAppraisals = makeDailyCounterId(STATS_COUNTER_IDS.dailyAppraisalsPrefix, today);
  const dailyPhotoEquipment = makeDailyCounterId(STATS_COUNTER_IDS.dailyPhotoEquipmentPrefix, today);
  const dailyDrawingEquipment = makeDailyCounterId(STATS_COUNTER_IDS.dailyDrawingEquipmentPrefix, today);
  const dailySuperForms = makeDailyCounterId(STATS_COUNTER_IDS.dailySuperFormsPrefix, today);
  const dailyFloors = makeDailyCounterId(STATS_COUNTER_IDS.dailyFloorsPrefix, today);
  const dailyClears = makeDailyCounterId(STATS_COUNTER_IDS.dailyClearsPrefix, today);
  const counters = await fetchStatsCounters([
    STATS_COUNTER_IDS.totalPv,
    STATS_COUNTER_IDS.totalUv,
    STATS_COUNTER_IDS.totalGames,
    STATS_COUNTER_IDS.totalKills,
    STATS_COUNTER_IDS.totalBossKills,
    STATS_COUNTER_IDS.totalAppraisals,
    STATS_COUNTER_IDS.totalPhotoEquipment,
    STATS_COUNTER_IDS.totalDrawingEquipment,
    STATS_COUNTER_IDS.totalSuperForms,
    STATS_COUNTER_IDS.totalFloors,
    STATS_COUNTER_IDS.totalClears,
    dailyPv,
    dailyUv,
    dailyGames,
    dailyKills,
    dailyBossKills,
    dailyAppraisals,
    dailyPhotoEquipment,
    dailyDrawingEquipment,
    dailySuperForms,
    dailyFloors,
    dailyClears,
  ]);
  state.globalStats = normalizeGlobalStats({
    totalPv: counters[STATS_COUNTER_IDS.totalPv],
    totalUv: counters[STATS_COUNTER_IDS.totalUv],
    totalGames: counters[STATS_COUNTER_IDS.totalGames],
    totalKills: counters[STATS_COUNTER_IDS.totalKills],
    totalBossKills: counters[STATS_COUNTER_IDS.totalBossKills],
    totalAppraisals: counters[STATS_COUNTER_IDS.totalAppraisals],
    totalEquipment: counters[STATS_COUNTER_IDS.totalPhotoEquipment],
    totalPhotoEquipment: counters[STATS_COUNTER_IDS.totalPhotoEquipment],
    totalDrawingEquipment: counters[STATS_COUNTER_IDS.totalDrawingEquipment],
    totalSuperForms: counters[STATS_COUNTER_IDS.totalSuperForms],
    totalFloors: counters[STATS_COUNTER_IDS.totalFloors],
    totalClears: counters[STATS_COUNTER_IDS.totalClears],
    todayPv: counters[dailyPv],
    todayUv: counters[dailyUv],
    todayGames: counters[dailyGames],
    todayKills: counters[dailyKills],
    todayBossKills: counters[dailyBossKills],
    todayAppraisals: counters[dailyAppraisals],
    todayEquipment: counters[dailyPhotoEquipment],
    todayPhotoEquipment: counters[dailyPhotoEquipment],
    todayDrawingEquipment: counters[dailyDrawingEquipment],
    todaySuperForms: counters[dailySuperForms],
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
        ["击杀Boss", stats.totalBossKills, stats.todayBossKills],
        ["鉴定", stats.totalAppraisals, stats.todayAppraisals],
        ["照片装备", stats.totalPhotoEquipment, stats.todayPhotoEquipment],
        ["画图装备", stats.totalDrawingEquipment, stats.todayDrawingEquipment],
        ["超级形态", stats.totalSuperForms, stats.todaySuperForms],
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
  state.tutorial.battleHintSeen = true;
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
  if (isIntroFloor()) return false;
  if (isBossFloor(state.floor)) return hasSelectedAllAliveEnemies();
  return getSelectedEnemies().length > 0;
}

function getBattleStats(activeIds = state.activeEnemyIds) {
  const stats = getPlayerBattleStats();
  const activeEnemies = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter((enemy) => enemy && enemy.hp > 0);
  return applyEnemyBattleModifiers(stats, activeEnemies, state.battleSpecial);
}

function getBattleStatsForEnemies(enemies) {
  const stats = getPlayerBattleStats(createDefaultBattleSpecial());
  return applyEnemyBattleModifiers(stats, enemies, createDefaultBattleSpecial());
}

function getBattleStatsForEnemiesWithSpecial(enemies, battleSpecial) {
  const stats = getPlayerBattleStats(battleSpecial);
  return applyEnemyBattleModifiers(stats, enemies, battleSpecial);
}

function applyEnemyBattleModifiers(stats, enemies, battleSpecial = createDefaultBattleSpecial()) {
  const aliveEnemies = getAliveTraitEnemies(enemies);
  Object.defineProperty(stats, "activeEnemies", {
    value: aliveEnemies,
    configurable: true,
  });
  const defenseBreakPenalty = getEnemyDefenseBreakPenalty(aliveEnemies, battleSpecial, stats.def);
  if (defenseBreakPenalty > 0) stats.def -= defenseBreakPenalty;
  if (aliveEnemies.some((enemy) => hasTrait(enemy, "noRegen")) && stats.regen > 0) stats.regen = 0;
  if (aliveEnemies.some((enemy) => hasTrait(enemy, "noLifesteal")) && stats.lifesteal > 0) stats.lifesteal = 0;
  return stats;
}

function getEquippedPhotoEffectInstances(key) {
  const activeByKey = getActiveEquippedPhotoSpecialInstancesByKey();
  if (key) return activeByKey.has(key) ? [activeByKey.get(key)] : [];
  return [...activeByKey.values()];
}

function getActiveEquippedPhotoSpecialInstancesByKey() {
  const candidates = [];
  ensureInventorySlots();
  const equippedItems = getEquippedItems();
  for (const item of equippedItems) {
    const slotIndex = state.inventory.findIndex((slotItem) => slotItem?.id && slotItem.id === item.id);
    for (const instance of getItemSpecialInstances(item)) {
      candidates.push({ ...instance, item, slotIndex: slotIndex < 0 ? 999 : slotIndex });
    }
  }
  if (!candidates.length) return new Map();
  candidates.sort((a, b) => {
    const keyDiff = photoSpecialEffects.findIndex((effect) => effect.key === a.key)
      - photoSpecialEffects.findIndex((effect) => effect.key === b.key);
    if (keyDiff) return keyDiff;
    const valueDiff = (b.effect?.value || 0) - (a.effect?.value || 0);
    if (valueDiff) return valueDiff;
    const slotDiff = a.slotIndex - b.slotIndex;
    if (slotDiff) return slotDiff;
    return photoSpecialEffects.findIndex((effect) => effect.key === a.key)
      - photoSpecialEffects.findIndex((effect) => effect.key === b.key);
  });
  const activeByKey = new Map();
  for (const candidate of candidates) {
    if (!activeByKey.has(candidate.key)) activeByKey.set(candidate.key, candidate);
  }
  return activeByKey;
}

function getActiveEquippedPhotoSpecialInstance() {
  const active = getEquippedPhotoEffectInstances();
  if (!active.length) return null;
  return [...active].sort((a, b) => {
    const valueDiff = (b.effect?.value || 0) - (a.effect?.value || 0);
    if (valueDiff) return valueDiff;
    const slotDiff = a.slotIndex - b.slotIndex;
    if (slotDiff) return slotDiff;
    return photoSpecialEffects.findIndex((effect) => effect.key === a.key)
      - photoSpecialEffects.findIndex((effect) => effect.key === b.key);
  })[0];
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
    enemyTimes: new Map(enemies.map((enemy) => [enemy.id, getActionInterval(getEffectiveEnemySpeed(enemy, enemies))])),
    round: 1,
    rounds: 0,
    defeatedCount: 0,
    formMaxHpGain: 0,
  };
  applySimBattleStartEnemyAuras(sim, enemies);
  lockBattleStartDefenseBreak(enemies, sim.battleSpecial);
  const stats = getBattleStatsForEnemiesWithSpecial(enemies, sim.battleSpecial);
  sim.shield = stats.shield;
  applySimBattleStartHeroEffects(sim, enemies);
  sim.heroTime = getActionInterval(stats.speed);
  return sim;
}

function applySimBattleStartEnemyAuras(sim, enemies = []) {
  const shieldBonus = sumEnemyTraitValues(enemies, "teamShield");
  if (shieldBonus > 0) {
    for (const enemy of enemies) {
      enemy.maxShield = Math.max(0, enemy.maxShield || 0) + shieldBonus;
      enemy.shield = Math.max(0, enemy.shield || 0) + shieldBonus;
    }
  }
}

function applySimBattleStartHeroEffects(sim, enemies = []) {
  if (getAliveTraitEnemies(enemies).some((enemy) => hasTrait(enemy, "breakShield"))) sim.shield = 0;
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

function regenSimHeroAfterHit(sim, stats) {
  const regen = Math.max(0, stats?.regen || 0);
  if (regen <= 0) return;
  healSimHero(sim, stats, regen);
  if (getHeroFormLevelConfig().regenAffectsShield) {
    sim.shield = Math.min(stats.shield || 0, sim.shield + regen);
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
    visualIndex: Number.isFinite(enemy.visualIndex) ? enemy.visualIndex : getEnemyVisualIndex(enemy),
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

function getSimBattleStats(sim, enemies) {
  const stats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
  stats.realMaxHp = stats.maxHp;
  stats.maxHp += getSimMaxHpBonus(sim);
  return stats;
}

function getAliveTraitEnemies(enemies = []) {
  return (Array.isArray(enemies) ? enemies : []).filter((enemy) => enemy && enemy.hp > 0);
}

function getEffectiveEnemyStats(enemy, enemies = getActiveBattleEnemies()) {
  const activeEnemies = getAliveTraitEnemies(enemies);
  const warcry = getEnemyWarcryBonus(activeEnemies);
  return {
    atk: Math.max(0, (enemy?.atk || 0) + warcry.atk),
    def: Math.max(0, (enemy?.def || 0) + warcry.def),
    speed: Math.max(1, (enemy?.speed || 1) + warcry.speed),
  };
}

function getEffectiveEnemySpeed(enemy, enemies = getActiveBattleEnemies()) {
  return getEffectiveEnemyStats(enemy, enemies).speed;
}

function simulateHeroStrike(sim, enemies, stats) {
  void stats;
  if (sim.actualDead) return [];
  return simulateHeroStrikeTarget(sim, enemies);
}

function simulateHeroStrikeTarget(sim, enemies, initialEnemy = null) {
  if (sim.actualDead) return [];
  const strikeCount = getHeroStrikeCount();
  const defeatedIds = [];
  let enemy = initialEnemy;

  for (let strikeIndex = 0; strikeIndex < strikeCount; strikeIndex += 1) {
    if (!enemy) enemy = sim.activeIds.map((id) => enemies.find((item) => item.id === id)).find(Boolean);
    if (!enemy || enemy.hp <= 0 || !sim.activeIds.includes(enemy.id)) break;

    const currentStats = getSimBattleStats(sim, enemies);
    const hitResult = applySimHeroDamageToEnemy(sim, enemy, currentStats, enemies);
    const shieldLoss = hitResult.shieldLoss;
    const hpDamage = hitResult.hpDamage;
    const sweepResults = triggerSimSweepDamage(sim, enemies, enemy, shieldLoss + hpDamage);

    const dealDamageGain = getTempSpecialGain("dealDamageAttack");
    if (dealDamageGain > 0) {
      const cap = getTempSpecialCap("dealDamageAttack");
      sim.battleSpecial.attack = Math.min(cap, (sim.battleSpecial.attack || 0) + dealDamageGain);
    }

    if (currentStats.lifesteal > 0) {
      healSimHero(sim, currentStats, currentStats.lifesteal);
    }

    const defeatedThisStrike = [];
    if (enemy.hp <= 0) {
      defeatedThisStrike.push(enemy.id);
      settleSimEnemyDefeat(sim, enemies, enemy);
    }
    for (const result of sweepResults) {
      if (!result.defeated || defeatedThisStrike.includes(result.enemyId)) continue;
      defeatedThisStrike.push(result.enemyId);
    }
    if (defeatedThisStrike.length) {
      defeatedIds.push(...defeatedThisStrike);
      if (initialEnemy) break;
      enemy = null;
    }
  }

  return defeatedIds;
}

function simulateMonsterStrike(sim, enemy, enemies, stats) {
  void stats;
  const hitCount = getTraitValue(enemy, "multiHit", 1);
  for (let i = 0; i < hitCount; i += 1) {
    if (sim.actualDead) break;
    if (trySimSummonArchmageMage(sim, enemy, enemies)) continue;
    const currentStatsBeforeHit = getSimBattleStats(sim, enemies);
    const monsterAtk = getMonsterAttackForStrike(enemy, currentStatsBeforeHit, getSimActiveEnemies(sim, enemies));
    const damage = hasTrait(enemy, "magic") ? Math.max(0, monsterAtk) : Math.max(0, monsterAtk - currentStatsBeforeHit.def);
    const immunity = getHeroFormLevelConfig().damageImmunity || 0;
    const isImmune = sim.battleSpecial.damageImmuneUsed < immunity && damage > 0;
    if (isImmune) sim.battleSpecial.damageImmuneUsed += 1;
    const effectiveDamage = isImmune ? 0 : damage;
    const shieldLoss = Math.min(sim.shield, effectiveDamage);
    const hpLoss = effectiveDamage - shieldLoss;
    sim.shield -= shieldLoss;
    damageSimHero(sim, hpLoss);
    if (shieldLoss > 0 && getHeroFormLevelConfig().shieldLossToHeal) {
      healSimHero(sim, currentStatsBeforeHit, shieldLoss);
    }
    const takeDamageGain = getTempSpecialGain("takeDamageDefense");
    if (takeDamageGain > 0) {
      const cap = getTempSpecialCap("takeDamageDefense");
      sim.battleSpecial.defense = Math.min(cap, (sim.battleSpecial.defense || 0) + takeDamageGain);
    }

    const currentStats = getSimBattleStats(sim, enemies);
    if (sim.actualHp > 0 && currentStats.regen > 0) {
      regenSimHeroAfterHit(sim, currentStats);
    }

    const monsterSteal = getTraitValue(enemy, "lifesteal", 0);
    if (monsterSteal > 0) enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterSteal);
    triggerSimEnemyAttackTraits(sim, enemy);
    if (sim.actualHp <= 0) {
      sim.actualDead = true;
      break;
    }
  }

  const monsterRegen = getTraitValue(enemy, "regen", 0);
  if (monsterRegen > 0 && enemy.hp > 0) {
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterRegen);
  }
}

function trySimSummonArchmageMage(sim, enemy, enemies) {
  if (!enemy || !hasTrait(enemy, "summonMageOnAttack")) return null;
  const target = enemies
    .filter((item) => item?.typeKey === "mage" && item.summonSourceId === enemy.id)
    .sort((a, b) => (a.archmageSummonSlot ?? a.slot ?? 0) - (b.archmageSummonSlot ?? b.slot ?? 0))
    .find((item) => item.hp <= 0 || !sim.activeIds.includes(item.id));
  if (!target) return null;

  reviveSimSummonedMage(sim, enemies, target, enemy);
  return target;
}

function reviveSimSummonedMage(sim, enemies, target, archmage) {
  const slot = Number.isFinite(target.archmageSummonSlot) ? target.archmageSummonSlot : Number.isFinite(target.slot) ? target.slot : 0;
  const id = target.id;
  const visualIndex = Number.isFinite(target.visualIndex) ? target.visualIndex : slot;
  const restored = makeEnemy("mage", archmage.floor || state.floor, slot);
  Object.assign(target, {
    ...restored,
    id,
    slot,
    visualIndex,
    summoned: true,
    summonSourceId: archmage.id,
    archmageSummonSlot: slot,
  });
  addSimActiveIdInExpandedBossOrder(sim, enemies, target.id);
  addSimEnemyClock(sim, enemies, target);
}

function addSimActiveIdInExpandedBossOrder(sim, enemies, enemyId) {
  if (!sim.activeIds.includes(enemyId)) sim.activeIds.push(enemyId);
  const orderedIds = getExpandedBossEstimateTargetEnemies(enemies).map((enemy) => enemy.id);
  const orderSet = new Set(orderedIds);
  if (!orderedIds.length) return;
  const activeSet = new Set(sim.activeIds);
  sim.activeIds = [
    ...orderedIds.filter((id) => activeSet.has(id)),
    ...sim.activeIds.filter((id) => !orderSet.has(id)),
  ];
}

function addSimEnemyClock(sim, enemies, enemy) {
  if (!enemy || sim.enemyTimes.has(enemy.id)) return;
  const activeEnemies = getSimActiveEnemies(sim, enemies);
  sim.enemyTimes.set(enemy.id, getCurrentSimClockTime(sim) + getActionInterval(getEffectiveEnemySpeed(enemy, activeEnemies)));
}

function applySimHeroDamageToEnemy(sim, enemy, stats, enemies = []) {
  const rawDamage = Math.max(0, stats.atk - getEffectiveEnemyDefense(enemy, stats));
  const shieldCrashDamage = getShieldCrashDamage(sim.shield);
  let damage = rawDamage + shieldCrashDamage;
  damage = applyEnemyIncomingDamageModifiers(enemy, damage, getSimActiveEnemies(sim, enemies));
  const shieldLoss = Math.min(enemy.shield || 0, damage);
  enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
  const hpDamage = Math.max(0, damage - shieldLoss);
  enemy.hp = Math.max(0, enemy.hp - hpDamage);
  triggerSimEnemyDamagedTraits(enemy);
  return { rawDamage, shieldCrashDamage, shieldLoss, hpDamage };
}

function triggerSimSweepDamage(sim, enemies, sourceEnemy, totalDamage) {
  const ratio = getSweepDamageRatio();
  if (ratio <= 0 || totalDamage <= 0) return [];
  const spreadDamage = Math.floor(totalDamage * ratio);
  if (spreadDamage <= 0) return [];
  const targets = getSimSweepNeighborEnemies(sim, enemies, sourceEnemy);
  const results = [];
  for (const target of targets) {
    const beforeAlive = target.hp > 0 && sim.activeIds.includes(target.id);
    const hitResult = applySimFixedHeroDamageToEnemy(sim, target, spreadDamage, enemies);
    if (!hitResult.totalDamage) continue;
    const defeated = beforeAlive && target.hp <= 0;
    results.push({ ...hitResult, enemyId: target.id, defeated });
    if (defeated) {
      settleSimEnemyDefeat(sim, enemies, target);
    }
  }
  return results;
}

function settleSimEnemyDefeat(sim, enemies, enemy) {
  if (!enemy || !sim.activeIds.includes(enemy.id)) return;
  const stats = getSimBattleStats(sim, enemies);
  simulateFormKillEffects(sim, stats);
  simulateKillSpecial(sim, stats);
  sim.activeIds = sim.activeIds.filter((id) => id !== enemy.id);
  sim.enemyTimes.delete(enemy.id);
  rescaleSimEnemyTimesForActiveAuras(sim, enemies);
  sim.defeatedCount += 1;
}

function rescaleSimEnemyTimesForActiveAuras(sim, enemies) {
  const activeEnemies = getSimActiveEnemies(sim, enemies);
  const activeEnemyMap = new Map(activeEnemies.map((enemy) => [enemy.id, enemy]));
  const currentTime = getCurrentSimClockTime(sim);
  for (const id of sim.activeIds) {
    const enemy = activeEnemyMap.get(id);
    if (!enemy) continue;
    sim.enemyTimes.set(id, currentTime + getActionInterval(getEffectiveEnemySpeed(enemy, activeEnemies)));
  }
}

function getCurrentSimClockTime(sim) {
  const times = [];
  if (Number.isFinite(sim.heroTime)) times.push(sim.heroTime);
  for (const time of sim.enemyTimes.values()) {
    if (Number.isFinite(time)) times.push(time);
  }
  return times.length ? Math.max(0, Math.min(...times)) : 0;
}

function getSimSweepNeighborEnemies(sim, enemies, sourceEnemy) {
  if (!sourceEnemy) return [];
  const sourceIndex = getSimEnemyVisualIndex(sourceEnemy, enemies);
  if (sourceIndex < 0) return [];
  return enemies
    .map((enemy, fallbackIndex) => ({ enemy, visualIndex: getSimEnemyVisualIndex(enemy, enemies, fallbackIndex) }))
    .filter((entry) => entry.enemy.id !== sourceEnemy.id && entry.enemy.hp > 0 && sim.activeIds.includes(entry.enemy.id))
    .sort((a, b) => Math.abs(a.visualIndex - sourceIndex) - Math.abs(b.visualIndex - sourceIndex) || a.visualIndex - b.visualIndex)
    .slice(0, 2)
    .map((entry) => entry.enemy);
}

function getSimEnemyVisualIndex(enemy, enemies, fallbackIndex = -1) {
  if (!enemy) return -1;
  if (Number.isFinite(enemy.visualIndex) && enemy.visualIndex >= 0) return enemy.visualIndex;
  const stateIndex = state.enemies.findIndex((item) => item.id === enemy.id);
  if (stateIndex >= 0) return stateIndex;
  if (Number.isFinite(enemy.slot) && enemy.slot >= 0) return enemy.slot;
  return fallbackIndex;
}

function applySimFixedHeroDamageToEnemy(sim, enemy, damage, enemies = []) {
  void sim;
  const fixedDamage = Math.max(0, Math.trunc(damage || 0));
  const modifiedDamage = applyEnemyIncomingDamageModifiers(enemy, fixedDamage, getSimActiveEnemies(sim, enemies));
  const shieldLoss = Math.min(enemy.shield || 0, modifiedDamage);
  enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
  const hpDamage = Math.max(0, modifiedDamage - shieldLoss);
  enemy.hp = Math.max(0, enemy.hp - hpDamage);
  const totalDamage = shieldLoss + hpDamage;
  if (fixedDamage > 0) triggerSimEnemyDamagedTraits(enemy);
  return { rawDamage: fixedDamage, shieldLoss, hpDamage, totalDamage };
}

function applySimPreBattleFormEffects(sim, enemies) {
  if (!getHeroFormLevelConfig().preBattleStrike || sim.battleSpecial.preBattleStruck) return;
  sim.battleSpecial.preBattleStruck = true;
  for (const enemy of enemies.filter((item) => sim.activeIds.includes(item.id))) {
    if (enemy.hp <= 0) continue;
    simulateHeroStrikeTarget(sim, enemies, enemy, "prebattle");
  }
}

function simulateFormKillEffects(sim, stats) {
  const config = getHeroFormLevelConfig();
  const maxHpGain = Math.max(0, config.killMaxHp || 0);
  const heal = Math.max(0, config.killHeal || 0);
  if (maxHpGain > 0) sim.formMaxHpGain = (sim.formMaxHpGain || 0) + maxHpGain;
  const nextStats = { ...stats, maxHp: (stats.maxHp || 0) + maxHpGain };
  healSimHero(sim, nextStats, heal);
}

function simulateKillSpecial(sim, stats) {
  let maxHpGain = 0;
  let healGain = 0;
  for (const { effect } of getEquippedPhotoEffectInstances()) {
    if (effect?.stat === "hp" && effect.kind === "killPermanent") maxHpGain += effect.amount;
    if (effect?.kind === "killHeal") healGain += effect.amount;
    if (effect?.kind === "killBattleTemp") {
      sim.battleSpecial.peerlessAttack = (sim.battleSpecial.peerlessAttack || 0) + effect.amount;
      sim.battleSpecial.peerlessDefense = (sim.battleSpecial.peerlessDefense || 0) + effect.amount;
    }
  }
  void maxHpGain;
  healSimHero(sim, stats, healGain);
}

function hasAnyActiveTrait(type) {
  return getActiveBattleEnemies().some((enemy) => hasTrait(enemy, type));
}

function hasAnyActiveTraitInEnemies(enemies, type) {
  return getAliveTraitEnemies(enemies).some((enemy) => hasTrait(enemy, type));
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

function sumEnemyTraitValues(enemies = [], type, fallback = 0) {
  return enemies.reduce((total, enemy) => total + getTraitValue(enemy, type, fallback), 0);
}

function getEnemyWarcryBonus(enemies = []) {
  return getAliveTraitEnemies(enemies).reduce((bonus, enemy) => {
    const trait = Array.isArray(enemy?.traits) ? enemy.traits.find((item) => item.type === "teamWarcry") : null;
    if (!trait) return bonus;
    bonus.atk += Number.isFinite(trait.atk) ? trait.atk : 0;
    bonus.def += Number.isFinite(trait.def) ? trait.def : 0;
    bonus.speed += Number.isFinite(trait.speed) ? trait.speed : 0;
    return bonus;
  }, { atk: 0, def: 0, speed: 0 });
}

function getEnemyDefenseBreakSourceCount(enemies = []) {
  return getAliveTraitEnemies(enemies).filter((enemy) => hasTrait(enemy, "defenseBreakAura")).length;
}

function getEnemyDefenseBreakRatioForCount(breakCount) {
  if (breakCount <= 0) return 0;
  return Math.min(1, breakCount * 0.5);
}

function getEnemyDefenseBreakRatio(enemies = []) {
  return getEnemyDefenseBreakRatioForCount(getEnemyDefenseBreakSourceCount(enemies));
}

function getEnemyDefenseBreakPenalty(enemies = [], battleSpecial = createDefaultBattleSpecial(), fallbackBase = 0) {
  const liveCount = getEnemyDefenseBreakSourceCount(enemies);
  const lockedCount = clampInt(battleSpecial?.defenseBreakSourceCount, 0, 99);
  const breakCount = lockedCount > 0 ? lockedCount : liveCount;
  const ratio = getEnemyDefenseBreakRatioForCount(breakCount);
  if (ratio <= 0) return 0;
  const lockedBase = Number.isFinite(battleSpecial?.defenseBreakBase) && battleSpecial.defenseBreakBase > 0;
  const base = Math.max(0, lockedBase
    ? battleSpecial.defenseBreakBase
    : fallbackBase);
  return Math.max(0, base - Math.floor(base * Math.max(0, 1 - ratio)));
}

function cloneTraits(traits = []) {
  return traits.map((trait) => ({ ...trait }));
}

function applyEnemyIncomingDamageModifiers(enemy, damage, enemies = getActiveBattleEnemies()) {
  void enemy;
  void enemies;
  return Math.max(0, Math.floor(Number(damage) || 0));
}

function getMonsterAttackForStrike(enemy, heroStats, enemies = getActiveBattleEnemies()) {
  let atk = getEffectiveEnemyStats(enemy, enemies).atk;
  if (hasTrait(enemy, "giant")) {
    const baseHp = getTraitValue(enemy, "giant", enemy.maxHp || 0);
    const heroMaxHp = Number.isFinite(heroStats?.realMaxHp) ? heroStats.realMaxHp : heroStats?.maxHp;
    atk += Math.max(0, baseHp - Math.max(0, heroMaxHp || 0));
  }
  return atk;
}

function getMonsterDisplayAttack(enemy, activeIds = state.activeEnemyIds) {
  const activeEnemies = activeIds?.length
    ? activeIds.map((id) => state.enemies.find((item) => item.id === id)).filter(Boolean)
    : getActiveBattleEnemies();
  if (!enemy || !hasTrait(enemy, "giant")) return getEffectiveEnemyStats(enemy, activeEnemies.length ? activeEnemies : [enemy]).atk;
  const stats = activeIds?.length
    ? getBattleStats(activeIds)
    : getPlayerStats();
  return getMonsterAttackForStrike(enemy, stats, activeEnemies.length ? activeEnemies : [enemy]);
}

function getMonsterDisplayStats(enemy, activeIds = state.activeEnemyIds) {
  const activeEnemies = activeIds?.length
    ? activeIds.map((id) => state.enemies.find((item) => item.id === id)).filter(Boolean)
    : getActiveBattleEnemies();
  const enemies = activeEnemies.length ? activeEnemies : [enemy].filter(Boolean);
  const effectiveStats = getEffectiveEnemyStats(enemy, enemies);
  return {
    atk: getMonsterDisplayAttack(enemy, activeIds),
    def: effectiveStats.def,
    speed: effectiveStats.speed,
  };
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
  if (hasTrait(enemy, "speedUpOnAttack")) {
    const value = Math.max(1, getTraitValue(enemy, "speedUpOnAttack", 1));
    enemy.speed = Math.max(1, (enemy.speed || 1) + value);
    changes.push(`龙威速度+${value}`);
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
  if (hasTrait(enemy, "speedUpOnAttack")) {
    enemy.speed = Math.max(1, (enemy.speed || 1) + Math.max(1, getTraitValue(enemy, "speedUpOnAttack", 1)));
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
  if (isIntroFloor()) return "intro";
  return `${state.floor}:${state.enemies.map((enemy) => enemy.id).join("|")}`;
}

function makeRunSeed() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function applyFloorShield() {
  if (isIntroFloor()) return;
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
  state.floor = introFloor;
  state.gameClear = false;
  state.enemies = [];
  state.encounterId = makeEncounterId();
  state.selectedEnemyIds = [];
  state.introRewardSelectedIds = [];
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
  state.tutorial = { ...defaultTutorialState };
  resetBattleSpecial();
  clearEnemyCardMotion();
  ensureInitialFloorNarrative();
  ensureBgmForGameState(true);
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
  return getPlayerBaseStats();
}

function getPlayerStatsWithBattleSpecial(battleSpecial = createDefaultBattleSpecial()) {
  return getPlayerBattleStats(battleSpecial);
}

function getPlayerBaseStats(form = getHeroForm()) {
  const bonus = { ...getHeroFormStatsFor(form) };
  const inventoryBonus = getInventoryStatBonus();
  for (const key of statOrder) {
    bonus[key] = (bonus[key] || 0) + (inventoryBonus[key] || 0);
  }
  const formFilmStats = getHeroFormFilmStatBonus(form);
  for (const key of statOrder) {
    bonus[key] = (bonus[key] || 0) + (formFilmStats[key] || 0);
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
    atk: state.player.baseAtk + (bonus.attack || 0) - passiveAttackPenalty,
    def: state.player.baseDef + (bonus.defense || 0),
    speed: state.player.baseSpeed + (bonus.speed || 0) - passiveSpeedPenalty,
    regen: regen * regenMultiplier,
    shield: state.player.baseShield + (bonus.shield || 0),
    lifesteal: lifesteal * lifestealMultiplier,
  };
}

function getPlayerStatsForForm(form = getHeroForm()) {
  return getPlayerBaseStats(form);
}

function getPlayerBattleStatDelta(battleSpecial = state.battleSpecial) {
  return {
    atk: (battleSpecial?.attack || 0) + (battleSpecial?.peerlessAttack || 0),
    def: (battleSpecial?.defense || 0) + (battleSpecial?.peerlessDefense || 0),
    speed: 0,
    regen: 0,
    lifesteal: 0,
  };
}

function getPlayerBattleStats(battleSpecial = state.battleSpecial) {
  const stats = getPlayerBaseStats();
  const delta = getPlayerBattleStatDelta(battleSpecial);
  stats.atk += delta.atk;
  stats.def += delta.def;
  stats.speed += delta.speed;
  stats.regen += delta.regen;
  stats.lifesteal += delta.lifesteal;
  return stats;
}

function getEffectiveEnemyDefense(enemy, stats = getBattleStats(state.activeEnemyIds)) {
  const activeEnemies = Array.isArray(stats?.activeEnemies) ? stats.activeEnemies : getActiveBattleEnemies();
  const effectiveDef = getEffectiveEnemyStats(enemy, activeEnemies).def;
  if (hasTrait(enemy, "sturdy")) {
    return Math.max(effectiveDef, (stats?.atk || 0) - 1);
  }
  const ratio = getHeroFormLevelConfig().ignoreDefenseRatio || 0;
  const ignored = Math.floor(Math.max(0, effectiveDef) * ratio);
  return effectiveDef - ignored;
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

function getHeroFormFilmStatBonus(form = getHeroForm()) {
  const config = getHeroFormLevelConfig(form);
  if (!config.filmStatCycle) return normalizeStats({}, 999);
  const points = clampInt(Math.floor(getFilmCount()), 0, 999);
  return {
    hp: 0,
    attack: Math.ceil(points / 3),
    defense: Math.floor((points + 1) / 3),
    speed: Math.floor(points / 3),
    shield: 0,
    lifesteal: 0,
    regen: 0,
  };
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
  const nextStatsPreview = getPlayerStatsForForm(targetForm);
  const maxHpLoss = Math.max(0, oldStats.maxHp - nextStatsPreview.maxHp);
  if (maxHpLoss > 0 && state.player.hp <= maxHpLoss) {
    addBattleEvent("当前生命不足，无法切换会降低生命上限的形态。", "info");
    render();
    return;
  }
  state.player.formId = formId;
  const newStats = getPlayerStats();
  adjustHeroResourcesAfterStatChange(oldStats, newStats, oldShield);
  syncShieldAfterEquipmentChange(oldStats.shield, newStats.shield, oldShield);
  saveGame();
  render();
}

function getItemSpecialStats(item) {
  const result = normalizeStats({}, 999);
  if (!item?.id) return result;
  for (const { effect, state: stateData, item: activeItem } of getEquippedPhotoEffectInstances()) {
    if (activeItem?.id !== item.id) continue;
    if (effect.kind === "killThreshold" && effect.stat) {
      result[effect.stat] += clampInt(stateData.bonus, 0, 999) * effect.amount;
    } else if (effect.kind === "killPermanent" && effect.stat) {
      result[effect.stat] += clampInt(stateData.bonus, 0, 999);
    }
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

function triggerAttackActionSpecial() {
  const gain = getTempSpecialGain("dealDamageAttack");
  if (gain <= 0) return;
  state.battleSpecial.attack = Math.min(getTempSpecialCap("dealDamageAttack"), (state.battleSpecial.attack || 0) + gain);
}

function triggerDefendedActionSpecial() {
  const gain = getTempSpecialGain("takeDamageDefense");
  if (gain <= 0) return;
  state.battleSpecial.defense = Math.min(getTempSpecialCap("takeDamageDefense"), (state.battleSpecial.defense || 0) + gain);
}

function triggerKillSpecial(enemy) {
  void enemy;
  const changes = [];
  const activeInstances = getEquippedPhotoEffectInstances();
  if (!activeInstances.length) return;

  for (const { key, effect, state: data, item } of activeInstances) {
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
    } else if (effect.kind === "killBattleTemp") {
      data.kills += 1;
      state.battleSpecial.peerlessAttack = (state.battleSpecial.peerlessAttack || 0) + effect.amount;
      state.battleSpecial.peerlessDefense = (state.battleSpecial.peerlessDefense || 0) + effect.amount;
      changes.push(`${formatItemDisplayName(item)} 攻防+${effect.amount}`);
    }
    ensureItemSpecialState(item, key);
  }

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
  return isIntroFloor()
    || Boolean(state.autoBattleTimer)
    || Boolean(state.currentBattle)
    || Boolean(state.battleStartTimer)
    || state.pendingFloorAdvance
    || isPlayerDefeated()
    || Boolean(state.bossReward)
    || isAnalyzingPhoto();
}

function handleDiscardAction() {
  if (hasPendingPhoto() && !isAnalyzingPhoto()) {
    if (state.cropMode || state.pendingCropRect) {
      resetPendingCrop();
    } else {
      abandonPendingPhoto();
    }
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
  addBattleEvent(`分解 ${formatItemDisplayName(removed)}，返还${getResourceName()} +${formatFilmAmount(returnedFilm)}。`, "item");
  playSoundEffect("dismantle");
  saveGame();
  render();
  return true;
}

function makePhotoStatEvidenceText({ itemName, subjectName, objectType, sizeClass, identityDescription }) {
  const primaryText = [itemName, subjectName, objectType, sizeClass].filter(Boolean).join(" ");
  if (primaryText && hasPhotoStatSemanticText(primaryText)) return primaryText;
  return [primaryText, identityDescription].filter(Boolean).join(" ");
}

function isGenericDrawingObjectType(text = "") {
  return /^(?:幻想武器|神秘武器|武器|幻想装备|神秘装备|魔法装备|装备概念|符号|图案|主体类型)$/.test(stripDrawingMediumWords(text));
}

function makeDrawingStatEvidenceText({ itemName, subjectName, objectType, sizeClass, identityDescription }) {
  const visualEvidence = stripDrawingMediumWords(identityDescription || "");
  const safeObjectType = isGenericDrawingObjectType(objectType) && !hasDrawingWeaponVisualEvidenceText(visualEvidence)
    ? ""
    : objectType;
  const primaryText = [itemName, subjectName, safeObjectType, sizeClass].filter(Boolean).join(" ");
  if (primaryText && hasPhotoStatSemanticText(primaryText)) return primaryText;
  return [primaryText, visualEvidence].filter(Boolean).join(" ");
}

function stripDrawingMediumWords(text = "") {
  return String(text || "")
    .replace(/这[幅张](?:画作|画|图画|图)/g, "这件装备")
    .replace(/(?:画布|纸面|纸上)上?的?/g, "")
    .replace(/玩家/g, "")
    .replace(/手绘|涂鸦|画作|画布|纸面|纸上|简笔画|线稿|草图/g, "")
    .replace(/画出来的|画出的|画成的|画下的/g, "")
    .replace(/图中|画面中|画面里/g, "")
    .replace(/这件装备里(?:的)?/g, "")
    .replace(/带着上?的/g, "带着")
    .replace(/\s+/g, " ")
    .replace(/[“”"'`]/g, "")
    .replace(/^[的、，。；：\s]+|[的、，。；：\s]+$/g, "")
    .trim();
}

function isGenericDrawingName(text = "") {
  return /^(?:神秘|未知|装备|物品|主体|道具|小道具|幻想|概念|符号|图案|装备概念|幻想装备|幻想武器|神秘装备|神秘武器|魔法装备|神器)?$/.test(String(text || "").trim());
}

function cleanDrawingName(value, fallback, maxLength = 18) {
  const cleaned = stripDrawingMediumWords(cleanText(value, "", maxLength + 12))
    .replace(/^(?:一把|一个|一枚|一件|一只|一条)/, "")
    .replace(/(?:装备|道具)$/g, "")
    .trim();
  const fallbackClean = stripDrawingMediumWords(cleanText(fallback, "", maxLength + 12));
  const picked = !isGenericDrawingName(cleaned) ? cleaned : (!isGenericDrawingName(fallbackClean) ? fallbackClean : "幻想装备");
  return cleanText(picked, "幻想装备", maxLength);
}

function cleanDrawingDescription(value, fallback, itemName) {
  let text = stripDrawingMediumWords(cleanText(value, "", 96))
    .replace(/媒介|载体/g, "")
    .replace(/^\s*这件装备?装备/, "这件装备")
    .replace(/^\s*这件$/, "")
    .trim();
  const name = cleanDrawingName(itemName, fallback, 18);
  const hasUnsupportedWeaponDescription = /(?:魔杖|法杖|魔法棒|武器|短剑|长剑|剑|刀|弓|箭|枪|矛|锤)/.test(text)
    && !/(?:魔杖|法杖|魔法棒|武器|短剑|长剑|剑|刀|弓|箭|枪|矛|锤)/.test(name);
  if (hasUnsupportedWeaponDescription) {
    text = `${name}带着清晰的主体轮廓，可以被带进魔塔。`;
  }
  if (!text || /^由.*鉴定/.test(text)) {
    text = `${name}带着清晰的装备轮廓，可以被带进魔塔。`;
  }
  if (text && !/[。！？.!?]$/.test(text)) text += "。";
  return cleanText(text, "由想象凝成的装备。", 72);
}

function hasMagicWandNameText(text = "") {
  return /(?:魔杖|法杖|魔法棒|星杖|wand|staff)/i.test(String(text || ""));
}

function hasDrawingWeaponNameText(text = "") {
  return /(?:剑|短剑|长剑|刀|斧|弓|箭|枪|矛|锤|魔杖|法杖|魔法棒|sword|blade|axe|bow|arrow|spear|hammer|wand|staff)/i.test(String(text || ""));
}

function hasMagicWandVisualEvidenceText(text = "") {
  const source = String(text || "");
  return /(?:长柄|长杆|杖身|手柄|握柄|棒状|杆状|棍状|顶端.*(?:星|宝石|水晶|圆球)|(?:星形|宝石|水晶|圆球).*(?:顶端|尖端)|rod|handle|orb|staff|wand)/i.test(source);
}

function hasDrawingWeaponVisualEvidenceText(text = "") {
  const source = String(text || "");
  return hasMagicWandVisualEvidenceText(source)
    || /(?:剑身|剑尖|刀身|刀刃|刃口|锋刃|握柄|手柄|弓弦|箭头|箭羽|斧刃|枪尖|矛尖|锤头|尖刺|爪|牙|sword|blade|edge|handle|bowstring|arrowhead|axe blade|spear tip|spike|claw|fang)/i.test(source);
}

function inferDrawingNameFromVisualEvidence(text = "") {
  const source = stripDrawingMediumWords(text);
  if (/盾|护盾|屏障|保护罩|十字|shield|barrier/i.test(source)) return /圆|环|circle|round/i.test(source) ? "守护圆盾" : "守护盾牌";
  if (hasMagicWandVisualEvidenceText(source)) return /星|star/i.test(source) ? "星纹魔杖" : "符石法杖";
  if (/剑身|剑尖|短剑|长剑|握柄|sword/i.test(source)) return "短剑";
  if (/刀身|刀刃|刃口|blade|knife/i.test(source)) return "锋刃短刀";
  if (/弓弦|弓|箭头|箭羽|bow|arrow/i.test(source)) return "风箭徽记";
  if (/斧刃|斧|axe/i.test(source)) return "战斧徽记";
  if (/枪尖|矛尖|spear/i.test(source)) return "长枪徽记";
  if (/爪|牙|尖牙|claw|fang/i.test(source)) return "尖牙坠饰";
  if (/翅|羽|翼|wing|feather/i.test(source)) return "风羽徽记";
  if (/闪电|雷|电|lightning/i.test(source)) return "雷纹徽记";
  if (/火|火焰|flame|fire/i.test(source)) return "火焰徽记";
  if (/水|水滴|泉|蓝色液滴|spring|water/i.test(source)) return "泉水护符";
  if (/草|叶|花|新芽|plant|leaf|flower/i.test(source)) return "新芽护符";
  if (/爱心|心形|红心|heart/i.test(source)) return "爱心护符";
  if (/眼|眼睛|瞳|eye/i.test(source)) return "凝视徽记";
  if (/齿轮|机械|机器人|robot|gear/i.test(source)) return "齿轮徽记";
  if (/笑脸|脸|表情|smile|face/i.test(source)) return "笑脸徽记";
  if (/星|星形|star/i.test(source)) return "星纹护符";
  if (/圆|圈|环|circle|round|ring/i.test(source)) return "圆环护符";
  if (/方|矩形|方块|square|block/i.test(source)) return "石板护符";
  return "符纹护符";
}

function refineDrawingNameWithVisualEvidence(name, subjectName, objectType, identityDescription) {
  const cleanName = cleanDrawingName(name, subjectName, 18);
  const visualEvidence = stripDrawingMediumWords(identityDescription || "");
  if (!visualEvidence) return cleanName;
  const nameText = [cleanName, subjectName, objectType].filter(Boolean).join(" ");
  const unsupportedMagicWand = hasMagicWandNameText(nameText) && !hasMagicWandVisualEvidenceText(visualEvidence);
  const unsupportedWeapon = hasDrawingWeaponNameText(nameText) && !hasDrawingWeaponVisualEvidenceText(visualEvidence);
  if (unsupportedMagicWand || unsupportedWeapon || isGenericDrawingName(cleanName)) {
    return cleanText(inferDrawingNameFromVisualEvidence(visualEvidence), "符纹护符", 18);
  }
  return cleanName;
}

function balanceItem(item, image = "") {
  const safe = item && typeof item === "object" ? item : {};
  const sourceMode = normalizeHeroMode(safe.sourceMode || safe.source_mode || "photo");
  const rarity = ["common", "uncommon", "rare"].includes(safe.rarity) ? safe.rarity : "common";
  const rawItemName = cleanText(safe.itemName, sourceMode === "drawing" ? "幻想装备" : "照片装备", 30);
  const rawSubjectName = cleanText(safe.subjectName, rawItemName, 30);
  let itemName = sourceMode === "drawing" ? cleanDrawingName(rawItemName, rawSubjectName, 18) : cleanText(rawItemName, "照片装备", 18);
  let subjectName = sourceMode === "drawing" ? cleanDrawingName(rawSubjectName, itemName, 18) : cleanText(rawSubjectName, itemName, 18);
  const tags = normalizeStringList(safe.tags);
  const rawObjectType = cleanText(safe.objectType, "", 30);
  const objectType = sourceMode === "drawing"
    ? rawObjectType ? cleanDrawingName(rawObjectType, "", 18) : ""
    : cleanText(rawObjectType, "", 18);
  const sizeClass = cleanText(safe.sizeClass, "", 18);
  const reason = cleanText(safe.reason, "", 72);
  const semanticSchema = getRawSemanticFlag(safe);
  const photoQuality = normalizePhotoQuality(safe.photoQuality || {});
  const statAffinity = normalizeStatAffinity(safe.statAffinity || []);
  const specialAffinity = normalizeSpecialEffects(safe.specialAffinity || []);
  const preserveSettledOutput = Boolean(safe.skipSpecialRoll);
  const identityDescription = cleanText(safe.identityDescription || safe.identity_description || safe.appearance || safe.objectIdentity || "", "", 160);
  if (sourceMode === "drawing") {
    itemName = refineDrawingNameWithVisualEvidence(itemName, subjectName, objectType, identityDescription);
    subjectName = refineDrawingNameWithVisualEvidence(subjectName, itemName, objectType, identityDescription);
  }
  const displayDescription = sourceMode === "drawing"
    ? cleanDrawingDescription(safe.description || reason, reason, itemName)
    : cleanText(safe.description || reason, "由照片鉴定出的装备。", 72);
  const semanticText = [itemName, subjectName, objectType, sizeClass, identityDescription, displayDescription, reason, tags.join(" ")].filter(Boolean).join(" ");
  const safeTooLarge = parseBooleanMaybe(safe.tooLarge) === true;
  const safeIsScene = parseBooleanMaybe(safe.isScene) === true;
  const safeIsEquipable = parseBooleanMaybe(safe.isEquipable);
  const modelRejected = sourceMode === "drawing"
    ? safeIsScene || safeIsEquipable === false
    : safeTooLarge || safeIsScene || safeIsEquipable === false || isOversizedSizeClass(sizeClass);
  const tooLarge = sourceMode === "drawing"
    ? Boolean(safeTooLarge || safeIsScene || safeIsEquipable === false)
    : shouldTreatAsTooLarge(itemName, semanticText, modelRejected);
  const virtualPenalty = sourceMode === "drawing"
    ? { level: "none", noEffect: false, cap: null, suppressSpecial: false, description: "" }
    : getVirtualImagePenalty(semanticText, photoQuality);
  const noEffect = tooLarge || virtualPenalty.noEffect;
  let requestedValue = noEffect
    ? 0
    : preserveSettledOutput && Number.isFinite(safe.value)
      ? Math.max(0, safe.value)
      : calculatePhotoItemValue(safe, semanticText);
  const objectStatEvidenceText = sourceMode === "drawing"
    ? makeDrawingStatEvidenceText({ itemName, subjectName, objectType, sizeClass, identityDescription }) || itemName
    : makePhotoStatEvidenceText({ itemName, subjectName, objectType, sizeClass, identityDescription }) || itemName;
  if (!noEffect) {
    requestedValue = preserveSettledOutput
      ? requestedValue
      : sourceMode === "drawing"
        ? adjustDrawingItemValueForSemanticMinimum(requestedValue, objectStatEvidenceText, statAffinity)
        : adjustPhotoItemValueForSemanticMinimum(requestedValue, objectStatEvidenceText, statAffinity);
    if (!preserveSettledOutput && Number.isFinite(virtualPenalty.cap)) {
      requestedValue = Math.min(requestedValue, mapLegacyPhotoValueCapToCurrentRange(virtualPenalty.cap));
    }
  }
  const specialEffects = noEffect || virtualPenalty.suppressSpecial
    ? []
    : choosePhotoSpecialEffects({ ...safe, itemName, objectType, reason, tags, description: sourceMode === "drawing" ? objectStatEvidenceText : semanticText, ignoreDirectSpecialEffects: semanticSchema && !preserveSettledOutput }, image, requestedValue)
      .filter((key) => (photoSpecialEffectMap.get(key)?.value || Infinity) <= requestedValue);
  const specialValue = calculateSpecialEffectsValue(specialEffects);
  const statBudget = Math.max(0, requestedValue - specialValue);
  const targetValue = noEffect ? 0 : requestedValue;
  const usePhysicalCarrierStats = virtualPenalty.level === "ordinaryCap"
    && isPhysicalImageCarrierText(semanticText)
    && !isPolishedCommercialImageText(semanticText);
  const statSemanticText = usePhysicalCarrierStats
    ? makePhysicalCarrierStatText(semanticText)
    : objectStatEvidenceText;
  const statAffinityForAllocation = virtualPenalty.level === "ordinaryCap"
    ? []
    : sanitizeStatAffinityForSemantics(safe.statAffinity, statSemanticText);
  const stats = noEffect
      ? normalizeStats({}, 20)
      : clampStatsToValue(allocateStatsForItem(semanticSchema || virtualPenalty.level === "ordinaryCap" ? {} : safe.stats || {}, statSemanticText, statBudget, statAffinityForAllocation), statBudget);

  const actualScore = calculateItemScore(stats, specialEffects);
  const balanced = {
    itemName,
    subjectName,
    objectType,
    sizeClass,
    isScene: safeIsScene || (sourceMode !== "drawing" && isOversizedSizeClass(sizeClass)),
    isEquipable: safeIsEquipable !== false && !noEffect,
    rarity,
    value: targetValue,
    quality: getItemQuality(actualScore),
    stats,
    specialEffects,
    specialState: normalizeSpecialState(safe.specialState, specialEffects),
    description: noEffect
      ? sourceMode === "drawing"
        ? "没有形成可鉴定的装备主体。"
        : virtualPenalty.description || "主体过大或主要是场景，无法提供属性。"
      : displayDescription,
    identityDescription,
    reason,
    tags,
    photoQuality,
    photoQualityScore: semanticSchema ? (sourceMode === "drawing" ? calculateDrawingQualityScore(photoQuality, semanticText) : calculatePhotoQualityScore(photoQuality, semanticText)) : null,
    statAffinity,
    specialAffinity,
    semanticAppraisal: semanticSchema,
    confidence: clampNumber(safe.confidence, 0, 1),
    photoKey: cleanText(safe.photoKey, "", 48),
    sourcePhotoKey: cleanText(safe.sourcePhotoKey, "", 48),
    cropRect: normalizeCropRect(safe.cropRect),
    sourceMode,
    objectKey: cleanText(safe.objectKey, "", 80),
    film: Boolean(safe.film),
    skipSpecialRoll: Boolean(safe.skipSpecialRoll),
    tooLarge: noEffect,
    virtualImage: virtualPenalty.level !== "none",
    image,
    appraisalImage: typeof safe.appraisalImage === "string" && safe.appraisalImage ? safe.appraisalImage : "",
    fullImage: typeof safe.fullImage === "string" && safe.fullImage ? safe.fullImage : "",
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
  normalized.fullImage = typeof item?.fullImage === "string" && item.fullImage ? item.fullImage : "";
  normalized.specialState = normalizeSpecialState(item?.specialState || balanced.specialState, normalized.specialEffects);
  normalized.photoQuality = normalizePhotoQuality(item?.photoQuality || balanced.photoQuality || {});
  normalized.photoQualityScore = Number.isFinite(item?.photoQualityScore)
    ? clampInt(item.photoQualityScore, 0, 15)
    : balanced.photoQualityScore;
  normalized.statAffinity = normalizeStatAffinity(item?.statAffinity || balanced.statAffinity || []);
  normalized.specialAffinity = normalizeSpecialEffects(item?.specialAffinity || balanced.specialAffinity || []);
  normalized.semanticAppraisal = getRawSemanticFlag(item || {});
  normalized.photoKey = cleanText(item?.photoKey || balanced.photoKey, "", 48);
  normalized.sourcePhotoKey = cleanText(item?.sourcePhotoKey || balanced.sourcePhotoKey, "", 48);
  normalized.cropRect = normalizeCropRect(item?.cropRect || balanced.cropRect);
  normalized.objectKey = cleanText(item?.objectKey || balanced.objectKey || makeObjectDuplicateKey(normalized), "", 80);
  normalized.identityDescription = cleanText(item?.identityDescription || balanced.identityDescription, "", 160);
  normalized.appraisalImage = typeof item?.appraisalImage === "string" && item.appraisalImage ? item.appraisalImage : balanced.appraisalImage || "";
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
  return getItemEffectValue(item);
}

function getItemEffectValue(item) {
  if (!item || item.tooLarge) return 0;
  return calculateItemScore(item.stats || {}, getItemSpecialKeys(item));
}

function calculateItemScore(stats, effectKeys = []) {
  return calculateStatsValue(stats || {}) + calculateSpecialEffectsValue(effectKeys);
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
  const sourceMode = normalizeHeroMode(item.sourceMode || item.source_mode || "photo");
  const hasQuality = calculatePhotoQualityTotal(quality) > 0;
  if (!hasQuality && Number.isFinite(item.value) && item.value > 0) {
    return clampInt(item.value, getPhotoValueMin(), getPhotoValueMax());
  }
  const qualityScore = hasQuality
    ? sourceMode === "drawing"
      ? calculateDrawingQualityScore(quality, semanticText)
      : calculateAdjustedPhotoQualityScore(quality, semanticText)
    : inferFallbackQualityScore(semanticText);
  const min = getPhotoValueMin();
  const max = getPhotoValueMax();
  if (max <= min) return min;
  let value = mapPhotoQualityScoreToValue(qualityScore);
  const cap = sourceMode === "drawing" ? max : getPhotoValueCapFromQuality(quality, semanticText);
  value = Math.min(value, cap);
  return Math.max(min, Math.min(max, value));
}

function mapPhotoQualityScoreToBaseValue(qualityScore) {
  const normalized = clampNumber(qualityScore, 0, 15) / 15;
  return basePhotoScoreMin + (normalized * (basePhotoScoreMax - basePhotoScoreMin));
}

function mapBasePhotoValueToCurrentRange(baseValue) {
  const min = getPhotoValueMin();
  const max = getPhotoValueMax();
  if (max <= min) return min;
  const normalized = (clampNumber(baseValue, basePhotoScoreMin, basePhotoScoreMax) - basePhotoScoreMin) / (basePhotoScoreMax - basePhotoScoreMin);
  return min + Math.round(normalized * (max - min));
}

function mapPhotoQualityScoreToValue(qualityScore) {
  return mapBasePhotoValueToCurrentRange(mapPhotoQualityScoreToBaseValue(qualityScore));
}

function mapLegacyPhotoValueCapToCurrentRange(legacyCap) {
  if (legacyCap <= 0) return 0;
  const legacyMin = defaultPhotoValueMin;
  const legacyMax = defaultPhotoValueMax;
  const normalized = (clampNumber(legacyCap, legacyMin, legacyMax) - legacyMin) / (legacyMax - legacyMin);
  const baseCap = basePhotoScoreMin + (normalized * (basePhotoScoreMax - basePhotoScoreMin));
  return mapBasePhotoValueToCurrentRange(baseCap);
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

function adjustDrawingItemValueForSemanticMinimum(value, semanticText = "", statAffinity = []) {
  const current = clampInt(value, getPhotoValueMin(), getPhotoValueMax());
  if (current <= 0) return current;
  const minimums = [
    getMinimumPreferredStatCost(semanticText, statAffinity),
    getMinimumSemanticStatCost(semanticText, statAffinity),
  ].filter((cost) => Number.isFinite(cost) && cost > 0 && cost <= getPhotoValueMax());
  if (!minimums.length) return current;
  return Math.max(current, Math.min(...minimums));
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
  if (Number.isFinite(virtualPenalty.cap)) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(virtualPenalty.cap));
  if (isLowRealityToyOrMascotImageText(text, quality)) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(10));
  const realObjectPhoto = isDirectRealPhotoText(text, quality) && !isPolishedCommercialImageText(text);
  const mildlyClutteredRealPhoto = realObjectPhoto && hasMildRealPhotoBackgroundText(text) && !hasSeverelyClutteredOrTinySubjectText(text);
  if (quality.realPhoto <= 1) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(12));
  if (quality.clarity <= 1 || quality.subjectArea <= 1) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 14 : 12));
  if (quality.backgroundClean <= 0 || quality.focusLight <= 0) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 16 : 14));
  if (hasSeverelyClutteredOrTinySubjectText(text)) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 15 : 13));
  if (hasCrowdedOrSmallSubjectText(text)) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(mildlyClutteredRealPhoto ? 17 : realObjectPhoto ? 16 : 14));
  if (/抽象|光斑|远景|纹理|风景|海岸|山|天空|道路|街道|森林|荒原|人物|人像|动物|猫|狗|abstract|bokeh|landscape|sky|road|street|forest|portrait|animal|cat|dog/i.test(text) && !isSmallEquipableNaturalText(text) && !isPortableEquipmentText(text)) {
    return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(14));
  }
  if (quality.interesting <= 0) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto && isPortableEquipmentText(text) ? 16 : 15));
  if (quality.clarity < 3 || quality.subjectArea < 2) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 17 : 16));
  if (quality.backgroundClean < 1) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 17 : 15));
  if (quality.subjectArea < 3 || quality.backgroundClean < 2) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 18 : 16));
  if (quality.clarity < 3) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto ? 17 : 16));
  if (quality.interesting < 2) return Math.min(getPhotoValueMax(), mapLegacyPhotoValueCapToCurrentRange(realObjectPhoto && isPortableEquipmentText(text) ? 18 : hasStrongEquipmentFantasyText(text) ? 17 : 16));
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

function calculateDrawingQualityScore(photoQuality, semanticText = "") {
  const quality = normalizePhotoQuality(photoQuality);
  const text = String(semanticText || "");
  const blankLike = /空白|无主体|随机涂鸦|随机线条|无法辨认|不能辨认|看不出|乱线|没有明确|blank|scribble|unrecognizable/i.test(text);
  const hasConcept = hasDrawingEquipmentConceptText(text) || hasPhotoStatSemanticText(text);
  const recognizable = quality.clarity >= 2 && quality.subjectArea >= 1;
  if (blankLike && quality.clarity <= 1) return Math.max(0, Math.min(3, calculatePhotoQualityTotal(quality)));

  let score = Math.round(
    (quality.clarity * 2.0)
    + (quality.subjectArea * 1.15)
    + (quality.backgroundClean * 0.55)
    + (quality.realPhoto * 1.25)
    + (quality.focusLight * 1.25)
    + (quality.interesting * 1.35),
  );

  if (hasConcept && recognizable) score += 1;
  if (hasConcept && quality.clarity >= 3 && quality.subjectArea >= 2 && quality.realPhoto >= 2) score += 1;
  if (hasConcept && quality.focusLight >= 2 && quality.interesting >= 1) score += 1;
  if (quality.interesting >= 2 && quality.realPhoto >= 2 && recognizable) score += 1;

  if (quality.clarity <= 1) score -= 3;
  if (quality.subjectArea <= 1) score -= 2;
  if (quality.realPhoto <= 1) score -= 1;
  if (quality.focusLight <= 0) score -= 1;
  if (!hasConcept) score = Math.min(score, quality.interesting >= 2 ? 10 : 8);
  if (blankLike) score -= 5;

  if (quality.clarity <= 0 || quality.subjectArea <= 0) score = Math.min(score, 3);
  else if (quality.clarity <= 1) score = Math.min(score, 7);
  else if (quality.subjectArea <= 1) score = Math.min(score, 10);
  if (quality.realPhoto <= 1 && quality.focusLight <= 0) score = Math.min(score, 9);
  if (quality.interesting <= 0 && quality.realPhoto <= 2) score = Math.min(score, 12);
  if (quality.clarity >= 3 && quality.subjectArea >= 2 && quality.realPhoto >= 2 && quality.focusLight >= 1 && hasConcept) score = Math.max(score, 11);
  if (quality.clarity >= 3 && quality.subjectArea >= 3 && quality.realPhoto >= 3 && quality.focusLight >= 2 && quality.interesting >= 2 && hasConcept) score = Math.max(score, 14);
  return Math.max(0, Math.min(15, score));
}

function calculateAdjustedPhotoQualityScore(photoQuality, semanticText = "") {
  const quality = normalizePhotoQuality(photoQuality);
  let score = calculatePhotoQualityTotal(quality);
  const text = String(semanticText || "");
  const virtualPenalty = getVirtualImagePenalty(text, quality);
  if (virtualPenalty.noEffect) return 0;

  const realObjectPhoto = isDirectRealPhotoText(text, quality) && !isPolishedCommercialImageText(text);
  const mildBackground = hasMildRealPhotoBackgroundText(text);
  const severeClutter = hasSeverelyClutteredOrTinySubjectText(text);
  const realLightShadow = hasRealLightShadowEvidenceText(text);
  const fakeStudioLight = hasPolishedLightOnlyText(text);
  if (realObjectPhoto && quality.realPhoto >= 3 && quality.clarity >= 2) score += 2;
  if (realObjectPhoto && quality.clarity >= 3 && quality.subjectArea >= 2 && quality.realPhoto >= 3) score += 2;
  if (realObjectPhoto && isPortableEquipmentText(text) && quality.focusLight >= 2) score += 1;
  if (realObjectPhoto && realLightShadow && quality.focusLight >= 2) score += 1;
  if (realObjectPhoto && realLightShadow && quality.realPhoto >= 3 && quality.clarity >= 2 && !severeClutter) score += 1;
  if (realObjectPhoto && quality.backgroundClean >= 1 && !severeClutter) score += 1;
  if (quality.clarity >= 3 && quality.subjectArea >= 2 && quality.realPhoto >= 3 && quality.focusLight >= 2 && quality.interesting >= 1) score += 1;
  if (quality.clarity >= 3 && quality.subjectArea >= 3 && quality.backgroundClean >= 2 && realObjectPhoto) score += 1;
  if (quality.interesting >= 2 && isPortableEquipmentText(text) && virtualPenalty.level === "none" && realObjectPhoto) score += 1;

  if (quality.clarity <= 1) score -= 2;
  if (quality.subjectArea <= 1) score -= realObjectPhoto ? 1 : 2;
  if (quality.subjectArea < 3 && !realObjectPhoto) score -= 1;
  if (quality.backgroundClean <= 0) score -= realObjectPhoto ? 0 : 1;
  if (quality.backgroundClean < 2 && !realObjectPhoto) score -= 1;
  if (quality.realPhoto <= 1) score -= 3;
  if (isLowRealityToyOrMascotImageText(text, quality)) score -= 4;
  if (quality.interesting <= 0) score -= realObjectPhoto ? 1 : 2;
  if (quality.interesting <= 1 && !hasStrongEquipmentFantasyText(text) && !realObjectPhoto) score -= 1;
  if (severeClutter) score -= realObjectPhoto ? 1 : 3;
  else if (hasCrowdedOrSmallSubjectText(text)) score -= realObjectPhoto ? (mildBackground ? 0 : 1) : 2;
  if (virtualPenalty.level === "ordinaryCap") score -= 3;
  if (fakeStudioLight && !realObjectPhoto) score -= 2;
  if (/抽象|光斑|远景|纹理|风景|海岸|山|天空|道路|街道|森林|荒原|人物|人像|动物|猫|狗|abstract|bokeh|landscape|sky|road|street|forest|portrait|animal|cat|dog/i.test(text) && !isSmallEquipableNaturalText(text) && !isPortableEquipmentText(text)) score -= 3;

  return Math.max(0, Math.min(15, score));
}

function hasRealLightShadowEvidenceText(text) {
  return /接触阴影|自然阴影|真实阴影|桌面阴影|投影方向|光线方向一致|环境光|桌面反光|真实反光|边缘高光|自然高光|色温一致|噪点一致|轻微模糊|背景融合|物体贴在桌面|shadow on desk|contact shadow|real shadow|real reflection|natural reflection|consistent lighting|ambient light|highlight/i.test(String(text || ""));
}

function hasPolishedLightOnlyText(text) {
  return /棚拍|影棚|布光|精修|商品展示|白底商品|抠图|透明背景|渲染光影|AI光影|过于完美|studio lighting|studio shot|product lighting|rendered lighting|perfect lighting/i.test(String(text || ""));
}

function hasMildRealPhotoBackgroundText(text) {
  return /背景较多|背景多|生活背景|桌面|房间|室内|手边|周围能看到|旁边有|周围有|墙面|桌面杂物|其他杂物|真实阴影|自然阴影|接触阴影|桌面阴影|真实反光|桌面反光|环境光|real shadow|contact shadow|real reflection|desk|room|indoor/i.test(String(text || ""));
}

function hasSeverelyClutteredOrTinySubjectText(text) {
  return /主体(?:很|太|极|非常|过于)?小|主体不明显|主体不清|主体难以辨认|角落小物|远处小物|占比很小|占画面很小|物品很多|很多物品|许多物品|一堆|堆满|杂乱|凌乱|背景乱|背景复杂|背景抢主体|主体被遮挡|many objects|very small subject|tiny subject|messy|cluttered|hard to identify|busy background/i.test(String(text || ""));
}

function hasCrowdedOrSmallSubjectText(text) {
  return hasSeverelyClutteredOrTinySubjectText(text)
    || /多个物品|很多东西|背景杂|主体(?:较|偏)?小|主体不大|占比(?:较|偏)?小|占画面(?:较|偏)?小|其中一|角落|边缘|远处|clutter|small subject|busy background/i.test(String(text || ""));
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
  const keys = getPreferredStatKeys(itemName, statAffinity);
  if (calculateStatsValue(normalized) > 0 && areProvidedStatsSemanticallyConsistent(normalized, itemName, keys, valueBudget)) {
    return normalized;
  }
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

function areProvidedStatsSemanticallyConsistent(stats, text, preferredKeys = [], valueBudget = 0) {
  const normalized = normalizeStats(stats, 20);
  const activeKeys = statOrder.filter((key) => (normalized[key] || 0) > 0);
  if (!activeKeys.length) return false;
  if (!activeKeys.every((key) => hasSemanticForPhotoStat(key, text))) return false;
  if (hasStrongSpeedSemanticText(text) && !activeKeys.includes("speed")) return false;
  const uniquePreferred = [...new Set(preferredKeys)].filter((key) => statOrder.includes(key));
  if (uniquePreferred.length && !activeKeys.some((key) => uniquePreferred.includes(key))) return false;
  const usedValue = calculateStatsValue(normalized);
  if (valueBudget >= 13 && usedValue < Math.min(valueBudget * 0.5, valueBudget - 2)) return false;
  return true;
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

function hasPhotoStatSemanticText(text) {
  return statOrder.some((key) => hasSemanticForPhotoStat(key, text));
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
  if (key === "hp") {
    if (isTablewareSemanticText(text) && !hasEdibleContentSemanticText(text)) return 0;
    return /食|饭|面|糖|饼|肉|菜|果|香蕉|番茄|西红柿|药|茶|奶|水|饮|咖啡|汤(?!勺)|补给|能量|植物|花|叶|种子|food|fruit|banana|tomato|coffee|water|drink|plant|flower|seed/i.test(text) ? 99 : 6;
  }
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
  if (item.skipSpecialRoll && provided.length) return provided;
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
  if (/扫|横扫|刷|扫帚|拖把|拍|扇面|扇子|宽|长条|横向|展开|范围|群|面|扫开|brush|broom|mop|racket|fan|wide|sweep|area/i.test(source)) add("sweep");
  if (/无双|冠军|奖杯|奖牌|徽章|英雄|胜利|战神|王者|霸气|勇猛|一骑当千|trophy|medal|champion|hero|victory|peerless/i.test(source)) add("peerless");
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
  if ((!isTablewareSemanticText(source) || hasEdibleContentSemanticText(source)) && /食|饭|面|糖|饼|肉|菜|果|西红柿|番茄|香蕉|药|茶|奶|水|饮|咖啡|汤(?!勺)|补给|能量|food|rice|bread|candy|meat|fruit|tomato|banana|medicine|tea|milk|water|drink|coffee|soup|energy/i.test(source)) {
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
    if (/进攻.*攻|造成伤害.*攻|攻击.*最多(?:4|6|10)/.test(text)) return "dealDamageAttack";
    if (/受击.*防|受到攻击.*防|受到伤害.*防|防御.*最多(?:4|5|8)/.test(text)) return "takeDamageDefense";
    if (/击杀.*生命上限/.test(text)) return "killMaxHp";
    if (/击杀.*生命|击杀.*回复|击杀.*回血/.test(text)) return "killHpBoost";
    if (/二连击|连击2|连击翻倍/.test(text)) return "doubleStrikeSpeedDown";
    if (/当前护盾|护盾.*0\.?5|护盾.*一半/.test(text)) return "shieldCrashAttackDown";
    if (/横扫|扩散|溅射|范围伤害|周围.*伤害|伤害.*50/.test(text)) return "sweep";
    if (/无双|击杀.*攻防|击杀.*攻击.*防御|攻防.*3/.test(text)) return "peerless";
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
  if (/爱心|心形|生命核心|能量核心|heart|life core/i.test(text)) return ["hp", "regen", "shield"];
  if (hasMagicWandVisualEvidenceText(text) || /火焰|星火|雷电|闪电|爆炸|剑|短剑|长剑|斧|弓|箭|爪|牙|fire|lightning|explosion|sword|axe|bow|arrow|claw|fang/i.test(text)) return ["attack", "speed", "lifesteal"];
  if (/盾|护盾|铠|甲|堡垒|屏障|结界|龟壳|龙鳞|shield|armor|barrier|shell|scale/i.test(text)) return ["shield", "defense", "hp"];
  if (/风|疾风|羽|羽翼|翅|靴|轮|飞|箭头|wind|feather|wing|boot|wheel|fly|arrow/i.test(text)) return ["speed", "attack", "regen"];
  if (/泉|水|草|药|光|治愈|净化|spring|water|grass|medicine|light|heal/i.test(text)) return ["regen", "hp", "defense"];
  if (/刺|尖刺|荆棘|倒刺|玻璃片|碎玻璃|铁丝网|cactus|thorn|spike|barb|broken glass|wire fence/i.test(text)) return ["attack", "defense", "lifesteal"];
  if (hasAirPurifierSemanticText(text)) return ["regen", "defense", "shield"];
  if (isTablewareSemanticText(text) && !hasEdibleContentSemanticText(text)) return ["attack", "defense", "shield"];
  if (/咖啡|水|饮|药|汤(?!勺)|茶|奶|果汁|杯|瓶|喷雾|清洁|纸巾|毛巾|湿巾|coffee|water|drink|medicine|tea|milk|juice|cup|bottle|clean|tissue|towel/i.test(text)) return ["regen", "shield", "hp"];
  if (/番茄|西红柿|香蕉|饭|面|糖|饼|肉|菜|水果|食|能量|糖果|零食|植物|花|叶|种子|tomato|banana|rice|bread|candy|meat|vegetable|fruit|food|energy|snack|plant|flower|leaf|seed/i.test(text)) return ["hp", "regen", "shield"];
  if (/刀|剪|针|钉|锥|刃|指甲刀|钩|夹|钳|锯|尖锐|knife|scissor|needle|nail|blade|clipper|hook|pliers|saw|sharp/i.test(text)) return ["lifesteal", "attack", "speed"];
  if (/键盘|鼠标|锤|棍|棒|笔|扳手|螺丝刀|砖|石|球拍|拍子|遥控器|手机|相机|keyboard|mouse|hammer|club|pen|tool|wrench|screwdriver|brick|stone|racket|remote|phone|camera/i.test(text)) return ["attack", "defense", "shield"];
  if (/锅盖|镜|盾|伞|盔|盒|箱|包|壳|套|口罩|眼镜|锁|钥匙|防护|保护|容器|lid|mirror|shield|umbrella|helmet|box|case|bag|shell|mask|glasses|lock|key|protect|container/i.test(text)) return ["shield", "defense", "hp"];
  if (/音箱|音响|喇叭|speaker/i.test(text)) return ["attack", "defense", "regen"];
  if (/鞋|拖鞋|滑板|风扇|轮|轻|羽|飞|跑|车模|陀螺|旋转|气流|线缆|shoe|slipper|skateboard|fan|wheel|lightweight|feather|fly|run|toy car|spinning|airflow|cable/i.test(text)) return ["speed", "attack", "regen"];
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

async function cropImageToDataUrl(src, cropRect, maxEdge = analysisImageMaxEdge, quality = analysisImageQuality) {
  const normalized = normalizeCropRect(cropRect);
  if (!normalized) return src;
  const image = await loadImage(src);
  return cropLoadedImageToDataUrl(image, normalized, maxEdge, quality);
}

function cropLoadedImageToDataUrl(image, cropRect, maxEdge, quality) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) {
    throw new Error("图片尺寸读取失败，请重新拍摄或换一张图片。");
  }
  const rect = normalizeCropRect(cropRect);
  if (!rect) return resizeImageToDataUrl(image, maxEdge, quality);
  const sx = Math.max(0, Math.floor(rect.x * sourceWidth));
  const sy = Math.max(0, Math.floor(rect.y * sourceHeight));
  const sw = Math.max(1, Math.min(sourceWidth - sx, Math.round(rect.width * sourceWidth)));
  const sh = Math.max(1, Math.min(sourceHeight - sy, Math.round(rect.height * sourceHeight)));
  const scale = Math.min(1, maxEdge / Math.max(sw, sh));
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
  try {
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    throw new Error("主体裁切失败，请重新圈定。");
  }
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
  ctx.fillText(getGameTitle(), 78, 92);
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

function formatSignedDelta(value) {
  const amount = Math.trunc(Number(value) || 0);
  if (amount === 0) return "";
  return amount > 0 ? `+${amount}` : String(amount);
}

function setStatReadout(element, baseValue, delta = 0) {
  if (!element) return;
  element.textContent = "";
  const base = document.createElement("span");
  base.className = "stat-base";
  base.textContent = String(Math.trunc(Number(baseValue) || 0));
  element.append(base);
  const deltaText = formatSignedDelta(delta);
  if (!deltaText) return;
  const deltaEl = document.createElement("span");
  deltaEl.className = "stat-delta";
  deltaEl.dataset.delta = delta > 0 ? "positive" : "negative";
  deltaEl.textContent = deltaText;
  element.append(deltaEl);
}

function render(options = {}) {
  ensureEncounter();
  ensureInventorySlots();
  if (!options.skipBgmEnsure) ensureBgmForGameState();
  else renderAudioSettings();
  renderGameMode();
  const stats = getPlayerStats();
  const battleStats = getBattleStats(state.activeEnemyIds);
  const battleDelta = {
    atk: battleStats.atk - stats.atk,
    def: battleStats.def - stats.def,
    speed: battleStats.speed - stats.speed,
    regen: battleStats.regen - stats.regen,
    lifesteal: battleStats.lifesteal - stats.lifesteal,
  };
  const defeated = isPlayerDefeated();
  const bossRewardPending = Boolean(state.bossReward);
  const selectedBossReward = getSelectedBossRewardOption();

  state.player.hp = Math.max(0, Math.min(state.player.hp, stats.maxHp));
  const form = getHeroForm();
  els.heroAvatarImage.src = getHeroFormImageUrl(form);
  els.heroAvatarImage.alt = `${getGameTitle()}${form.label}形态`;
  const heroFormCard = els.heroAvatarImage.closest(".hero-form-card");
  if (heroFormCard) {
    heroFormCard.dataset.formKey = form.id;
    heroFormCard.classList.toggle("is-hit", Boolean(state.heroHitEffectUntil));
  }
  renderHeroForms();

  els.playerHpText.textContent = `${state.player.hp}/${stats.maxHp}`;
  els.playerHpBar.style.width = `${percent(state.player.hp, stats.maxHp)}%`;
  els.playerHpBar.parentElement.classList.toggle("is-low", percent(state.player.hp, stats.maxHp) <= 30);
  setStatReadout(els.playerAtk, stats.atk, battleDelta.atk);
  setStatReadout(els.playerDef, stats.def, battleDelta.def);
  setStatReadout(els.playerSpeed, stats.speed, battleDelta.speed);
  setStatReadout(els.playerRegen, stats.regen, battleDelta.regen);
  setStatReadout(els.playerLifesteal, stats.lifesteal, battleDelta.lifesteal);
  els.playerShield.textContent = `${state.player.shield}/${stats.shield}`;

  els.floorText.textContent = getFloorActionLabel(bossRewardPending);
  renderEnemyField();
  const actionRow = els.attackBtn.closest(".floor-action-row");
  actionRow?.classList.toggle("is-reward-choice", bossRewardPending);
  actionRow?.classList.toggle("is-clear", state.gameClear);
  actionRow?.classList.toggle("can-flee", canFleeCurrentFloor());
  els.equipmentGrid.classList.remove("is-collapsed");
  const canStartBattle = canStartSelectedBattle();
  els.attackBtn.hidden = false;
  els.attackBtn.textContent = state.gameClear
    ? "塔史结局"
    : defeated && state.careerSummary
      ? "战败结局"
    : bossRewardPending
      ? "选择"
      : canStartBattle
        ? "战斗"
        : "选择怪物";
  els.attackBtn.disabled = bossRewardPending
    ? defeated || !selectedBossReward
    : state.gameClear
      ? false
      : defeated && state.careerSummary
        ? false
      : defeated || isBattleActionLocked() || Boolean(state.autoBattleTimer) || state.pendingFloorAdvance || Boolean(state.battleStartTimer);
  if (isIntroFloor()) {
    els.attackBtn.textContent = "进入魔塔";
    els.attackBtn.disabled = !hasSelectedAllIntroRewards();
  }
  els.attackBtn.setAttribute("aria-pressed", String(Boolean(state.autoBattleTimer)));
  els.attackBtn.setAttribute("aria-label", state.gameClear ? "查看塔史结局" : defeated && state.careerSummary ? "查看战败结局" : bossRewardPending ? "确认奖励牌" : "开始战斗");
  if (isIntroFloor()) els.attackBtn.setAttribute("aria-label", "进入魔塔第一层");
  els.battleSpeedBtn.hidden = bossRewardPending || state.gameClear || defeated || isIntroFloor();
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
  if (isIntroFloor()) return `第 ${introFloor} / ${maxFloor} 层 · 塔门前`;
  const floor = bossRewardPending && state.bossReward?.floor ? state.bossReward.floor : state.floor;
  if (isPlayerDefeated()) return `第 ${floor} / ${maxFloor} 层 · 战败`;
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
  els.filmCountBadge.textContent = `${getResourceName()} ${formatFilmCount()}`;
}

function renderEnemyField() {
  els.enemyField.innerHTML = "";
  els.enemyField.classList.toggle("is-intro-field", isIntroFloor());
  const enemyDamageEstimates = getEnemyDamageEstimates();
  const shouldFlipIn = state.enemyFlipEncounterId === state.encounterId && !state.currentBattle && !state.autoBattleTimer;

  if (state.bossReward) {
    renderBossRewardCards();
    return;
  }

  if (isIntroFloor()) {
    renderIntroRewardCards();
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
    button.dataset.enemyId = enemy.id;
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
    const animationUrl = getMonsterAnimationUrl(enemy.typeKey);
    const animationDelay = `-${((index % 4) * 0.18).toFixed(2)}s`;
    const dropText = formatEnemyFilmDrop(enemy);
    const displayStats = getMonsterDisplayStats(enemy, state.activeEnemyIds.includes(enemy.id) ? state.activeEnemyIds : [enemy.id]);
    const isBossEnemyCard = isBossRewardFloor(state.floor) && !enemy.summoned && bossMonsterKeys.has(enemy.typeKey);
    if (isBossEnemyCard) {
      button.classList.add(isRewardBossFloor(state.floor) ? "is-reward-boss" : "is-gate-boss");
    }
    button.innerHTML = `
      ${selectionOrder ? `<span class="selection-badge">${selectionOrder}</span>` : ""}
      <div class="enemy-card-head">
        <div class="monster-portrait">
          <span class="monster-sprite" style="--monster-sprite:url('${animationUrl}'); --sprite-delay:${animationDelay};">
            <img src="${imageUrl}" alt="${escapeHtml(enemy.typeName)}">
          </span>
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(enemy.name)}</strong>
          <span>${escapeHtml(traitText)}</span>
        </div>
      </div>
      <dl class="enemy-card-stats">
        <div><dt>攻</dt><dd>${displayStats.atk}</dd></div>
        <div><dt>防</dt><dd>${displayStats.def}</dd></div>
        <div><dt>速</dt><dd>${displayStats.speed}</dd></div>
      </dl>
      <div class="enemy-card-result">
        <span>${dropText}</span>
        <strong class="estimate-${estimate.state}">${escapeHtml(estimate.text)}</strong>
      </div>
      <div class="enemy-hp-line">
        <span>${formatEnemyHpDisplay(enemy)}</span>
        <div class="hp-track danger"><span style="width:${getEnemyHpDisplayPercent(enemy)}%"></span></div>
      </div>
      <div class="enemy-card-back" aria-hidden="true">
        <span>${isDefeated ? "已击破" : "未参战"}</span>
      </div>
    `;
    els.enemyField.append(button);
  });
  if (shouldFlipIn) state.enemyFlipEncounterId = "";
}

function renderIntroRewardCards() {
  const selected = getIntroRewardSelection();
  const title = document.createElement("div");
  title.className = "boss-reward-prompt";
  title.textContent = hasSelectedAllIntroRewards() ? "三道槽纹已经亮起，塔门可以推开了" : modeText("塔门前的三卷胶卷");
  els.enemyField.append(title);
  for (const option of getIntroRewards()) {
    const selectionOrder = selected.indexOf(option.id) + 1;
    const isSelected = selectionOrder > 0;
    const button = document.createElement("button");
    button.className = `enemy-card reward-card intro-reward-card${isSelected ? " is-selected" : ""}`;
    button.type = "button";
    button.setAttribute("aria-pressed", String(isSelected));
    button.addEventListener("click", () => selectIntroReward(option.id));
    button.innerHTML = `
      ${selectionOrder ? `<span class="selection-badge">${selectionOrder}</span>` : ""}
      <div class="reward-card-main">
        <div class="monster-portrait reward-portrait">
          <img src="${rewardIconBase}${escapeHtml(option.icon)}" alt="" aria-hidden="true">
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(option.title)}</strong>
          <em>${escapeHtml(option.effect)}</em>
        </div>
      </div>
      <p class="reward-card-desc">${escapeHtml(option.desc)}</p>
    `;
    els.enemyField.append(button);
  }
}

function renderBossRewardCards() {
  const options = Array.isArray(state.bossReward?.options) ? state.bossReward.options : [];
  const selectedIndex = getSelectedBossRewardIndex();
  const title = document.createElement("div");
  title.className = "boss-reward-prompt";
  title.textContent = selectedIndex >= 0 ? "已选中奖励牌，点击选择确认" : "三张奖励牌，只能带走一张";
  els.enemyField.append(title);
  options.forEach((option, index) => {
    const displayOption = getBossRewardDisplayOption(option);
    const button = document.createElement("button");
    const selected = index === selectedIndex;
    button.className = `enemy-card reward-card${selected ? " is-selected" : ""}`;
    button.type = "button";
    button.setAttribute("aria-pressed", String(selected));
    button.addEventListener("click", () => selectBossReward(index));
    const icon = displayOption.icon || getBossRewardIcon(option.type);
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
          <strong>${escapeHtml(displayOption.title || "奖励")}</strong>
          <em>${escapeHtml(displayOption.effect || "")}</em>
        </div>
      </div>
      <p class="reward-card-desc">${escapeHtml(displayOption.desc || "选择后进入下一层。")}</p>
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
  const sourceEnemies = enemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean)
  const enemies = expandEnemiesForEstimate(sourceEnemies).map(cloneEnemyForSimulation);
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
    const currentStats = getSimBattleStats(sim, enemies);
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
      if (enemy) simulateMonsterStrike(sim, enemy, enemies, currentStats);
      if (sim.actualDead) {
        for (const id of sim.activeIds) {
          estimates.set(id, makeUnresolvedEstimate("death", enemies.find((item) => item.id === id), enemies));
        }
        break;
      }
      sim.enemyTimes.set(nextEnemyId, enemyTime + getActionInterval(getEffectiveEnemySpeed(enemy, getSimActiveEnemies(sim, enemies))));
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

function expandEnemiesForEstimate(enemies) {
  if (shouldSummonArchmageMages(enemies)) {
    const archmage = enemies[0];
    return getExpandedBossEstimateTargetEnemies([
      { ...makeSummonedMage(archmage, 0), visualIndex: 0 },
      { ...archmage, slot: 1, summonedBattleCenter: true, summonBattleKind: "archmage", visualIndex: 1 },
      { ...makeSummonedMage(archmage, 2), visualIndex: 2 },
    ]);
  }
  if (!shouldSummonKnightCaptainGuards(enemies)) return enemies;
  const captain = enemies[0];
  return getExpandedBossEstimateTargetEnemies([
    { ...makeSummonedGuard(captain, 0), visualIndex: 0 },
    { ...captain, slot: 1, summonedBattleCenter: true, summonBattleKind: "knightCaptain", visualIndex: 1 },
    { ...makeSummonedGuard(captain, 2), visualIndex: 2 },
  ]);
}

function getExpandedBossEstimateTargetEnemies(enemies = []) {
  return getExpandedBossTargetEnemies(enemies);
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
  const rawDamage = Math.max(0, stats.atk - getEffectiveEnemyDefense(enemy, stats));
  const shieldCrashDamage = getShieldCrashDamage();
  let damage = rawDamage + shieldCrashDamage;
  damage = applyEnemyIncomingDamageModifiers(enemy, damage, state.enemies);
  return Math.max(0, damage);
}

function getMonsterImageUrl(typeKey) {
  return `${monsterImageBase}${monsterImages[typeKey] || monsterImages.slime}`;
}

function getMonsterAnimationUrl(typeKey) {
  return `${monsterAnimationBase}${monsterAnimations[typeKey] || monsterAnimations.slime}`;
}

function getEnemyMaxShield(enemy) {
  return Math.max(enemy?.shield || 0, getTraitValue(enemy, "shield", 0));
}

function getEnemyDisplayHp(enemy) {
  return Math.max(0, Math.ceil((enemy?.hp || 0) + (enemy?.shield || 0)));
}

function formatEnemyHpDisplay(enemy) {
  return `${getEnemyDisplayHp(enemy)}/${Math.max(0, enemy?.maxHp || 0)}`;
}

function getEnemyHpDisplayPercent(enemy) {
  return percent(getEnemyDisplayHp(enemy), Math.max(1, enemy?.maxHp || 1));
}

function renderEquipmentGrid() {
  ensureInventorySlots();
  const selectedSlotIndex = getSelectedSlotIndex();

  els.equipmentGrid.innerHTML = "";
  for (let i = 0; i < equipmentVisibleSlots; i += 1) {
    const item = state.inventory[i];
    const button = document.createElement("button");
    const isSelected = i === selectedSlotIndex;
    const qualityKey = item ? getItemQualityKey(item) : "empty";
    const slotLocked = !canSelectEquipmentSlot(i);
    button.className = `equipment-slot quality-${qualityKey}${item ? " has-item" : ""}${isSelected ? " is-selected" : ""}${slotLocked ? " is-locked" : ""}`;
    button.type = "button";
    button.disabled = slotLocked;
    button.setAttribute("aria-label", item ? `选择${item.itemName}` : `选择空装备格${i + 1}`);
    button.addEventListener("click", () => {
      if (!canSelectEquipmentSlot(i)) return;
      const wasSelected = i === getSelectedSlotIndex();
      const wasItemMode = state.infoMode === "item";
      const isRepeatClick = wasSelected && wasItemMode;
      state.selectedSlotIndex = i;
      state.selectedItemId = item?.id || "";
      state.lootError = "";
      state.infoMode = "item";
      if (!item) {
        clearPendingPhoto({ keepSelectedSlot: true, slotIndex: i });
        state.pendingPhotoSlotIndex = i;
      } else if (isRepeatClick && (item.fullImage || item.image)) {
        openImageViewer(item.fullImage || item.image, formatItemDisplayName(item), getItemQuality(scoreItem(item)));
      }
      saveGame();
      render();
    });

    if (item) {
      const quality = getItemQuality(scoreItem(item));
      button.innerHTML = `
        <span class="slot-image"><img src="${item.image || makePlaceholderImage()}" alt=""></span>
        <span class="slot-name" data-quality="${quality.key}">${escapeHtml(formatBalancedItemDisplayName(item))}</span>
      `;
    } else {
      button.innerHTML = state.gameClear
        ? `<span class="empty-slot empty-slot-clear">空</span>`
        : `<span class="empty-slot">${getEmptySlotIconMarkup()}</span>`;
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
  els.photoActionBtn.classList.remove("is-photo-callout");
  els.photoActionBtn.textContent = getInputActionName();
  els.photoActionBtn.setAttribute("aria-label", getInputActionName());
  els.analyzePhotoBtn.hidden = true;
  els.analyzePhotoBtn.disabled = true;
  els.analyzePhotoBtn.textContent = "鉴定";
  els.analyzePhotoBtn.classList.remove("is-cancel");
  els.analyzePhotoBtn.onclick = null;
  els.savePhotoBtn.hidden = true;
  els.savePhotoBtn.disabled = true;
  els.savePhotoBtn.textContent = "保存";
  els.savePhotoBtn.setAttribute("aria-label", `保存${getPendingImageLabel()}`);
  els.discardItemBtn.disabled = true;
  els.discardItemBtn.hidden = true;
  els.battleLog.hidden = true;
  els.equipmentDetailDesc.hidden = false;
  els.filmCountBadge.hidden = true;
  els.pendingPhotoPreview.hidden = true;
  els.pendingPhotoPreview.classList.remove("is-crop-mode", "has-crop");
  els.pendingPhotoImage.removeAttribute("src");
  els.equipmentDetailImageBtn.hidden = true;
  els.equipmentDetailImage.removeAttribute("src");
  renderPendingCropOverlay();
  els.loadingState.hidden = false;
  els.equipmentDetail.classList.remove("is-error", "is-actionable", "is-log", "career-summary-panel");
  delete els.equipmentDetail.dataset.outcome;
  clearEquipmentDetailQuality();
  els.equipmentDetailStats.hidden = false;

  if (isCareerSummaryOpen()) {
    renderCareerSummaryPanel();
    return;
  }

  if (isIntroFloor()) {
    els.equipmentDetailName.textContent = "塔门前";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = hasSelectedAllIntroRewards()
      ? modeText("三卷胶卷已经嵌进石台。推开塔门后，第一层的怪物会立刻现身。")
      : modeText("石台上放着三卷胶卷：一卷教你点亮装备格拍照，一卷教你启用鉴定台，一卷教你入塔选怪战斗。");
    els.filmCountBadge.hidden = false;
    return;
  }

  if (state.lootError && !state.lastPhoto) {
    const canRetake = showingItem && !selected && !locked && state.filmRolls >= 1;
    els.equipmentDetail.classList.add("is-error");
    els.equipmentDetailName.textContent = "鉴定失败";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = `${formatLootErrorMessage(state.lootError)}\n${getResourceName()}还在。可以重${getInputActionName()}，也可以先继续爬塔。`;
    if (canRetake) {
      els.equipmentActions.hidden = false;
      els.photoActionBtn.hidden = false;
      els.photoActionBtn.disabled = false;
      els.photoActionBtn.textContent = getInputActionName();
      els.photoActionBtn.setAttribute("aria-label", `重新${getInputActionName()}`);
    }
    return;
  }

  if (state.lastPhoto && showingItem) {
    if (state.lootError) els.equipmentDetail.classList.add("is-error");
    const apiHint = getPhotoApiConfigHint();
    const pendingSourceMode = getPendingSourceMode();
    const pendingLabel = getPendingImageLabel(pendingSourceMode);
    const isPendingDrawing = pendingSourceMode === "drawing";
    const pendingPhotoCopy = analyzing
      ? `正在鉴定${pendingLabel}。若接口长时间无响应，可以取消后重${getHeroMode(pendingSourceMode).action}一张主体更清楚的${pendingLabel}。`
      : state.cropMode && !isPendingDrawing
      ? "在照片上拖出物品范围，确认后再鉴定。"
      : state.pendingCropRect && !isPendingDrawing
      ? apiHint || "鉴定台会看向圈定的主体。"
      : state.lootError
      ? `${formatLootErrorMessage(state.lootError)}\n${pendingLabel}还在，可以重新鉴定。`
      : apiHint
      ? apiHint
      : state.filmRolls >= 1
        ? isPendingDrawing
          ? "画作主体清楚就可以鉴定；想换造型可以先重画。"
          : "照片里有多个物品时，可以先圈定主体。"
        : `${getResourceName()}不足，先击败怪物攒到新的${getInputActionName()}机会。`;
    els.equipmentDetailName.textContent = state.pendingCropRect && !isPendingDrawing ? "已圈定主体" : `待鉴定${pendingLabel}`;
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = pendingPhotoCopy;
    els.equipmentActions.hidden = false;
    if (!analyzing) {
      els.photoActionBtn.hidden = false;
      els.photoActionBtn.disabled = false;
      els.photoActionBtn.textContent = isPendingDrawing ? "重画" : state.cropMode ? "确认" : "圈定主体";
      els.photoActionBtn.setAttribute("aria-label", isPendingDrawing ? "重新打开画布" : state.cropMode ? "确认主体范围" : "圈定照片主体");
    }
    els.analyzePhotoBtn.hidden = false;
    els.analyzePhotoBtn.textContent = analyzing ? "取消鉴定" : "鉴定";
    els.analyzePhotoBtn.setAttribute("aria-label", analyzing ? "取消鉴定" : `鉴定${pendingLabel}`);
    els.analyzePhotoBtn.classList.toggle("is-cancel", analyzing);
    els.analyzePhotoBtn.disabled = analyzing ? false : state.cropMode || locked || Boolean(els.loadingState.textContent) || state.filmRolls < 1;
    if (!analyzing && !isPendingDrawing && (state.cropMode || state.pendingCropRect)) {
      els.savePhotoBtn.hidden = false;
      els.savePhotoBtn.disabled = false;
      els.savePhotoBtn.textContent = "重置";
      els.savePhotoBtn.setAttribute("aria-label", "重置主体范围");
    }
    if (!analyzing) {
      els.discardItemBtn.hidden = false;
      els.discardItemBtn.disabled = false;
      els.discardItemBtn.classList.remove("danger-button");
      els.discardItemBtn.textContent = !isPendingDrawing && (state.cropMode || state.pendingCropRect) ? "取消" : `放弃${pendingLabel}`;
      els.discardItemBtn.setAttribute("aria-label", !isPendingDrawing && (state.cropMode || state.pendingCropRect) ? "取消主体范围" : `放弃待鉴定${pendingLabel}`);
    }
    els.pendingPhotoPreview.hidden = false;
    els.pendingPhotoImage.src = state.lastPhoto;
    els.pendingPhotoImage.alt = `待鉴定${pendingLabel}`;
    els.pendingPhotoPreview.setAttribute("aria-label", `查看待鉴定${pendingLabel}`);
    els.pendingPhotoPreview.classList.toggle("is-crop-mode", state.cropMode);
    els.pendingPhotoPreview.classList.toggle("has-crop", Boolean(state.pendingCropRect));
    renderPendingCropOverlay();
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
    const firstPhotoHint = shouldShowFirstPhotoHint();
    els.equipmentDetailName.textContent = "空装备格";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = state.gameClear
      ? modeText("通关装备会留在本局。选择已有装备可以查看和保存原图；重开后这些照片会清空。")
      : locked
      ? isPlayerDefeated()
        ? `${getGameTitle()}已经倒下，只能重开。`
        : state.bossReward
          ? "先确认一张 Boss 奖励牌。"
          : "战斗中不能拍照鉴定。"
      : firstPhotoHint
        ? isDrawingMode()
          ? "先画一件能变成装备的简笔画。"
          : "先拍一件身边的小物品。"
      : state.filmRolls >= 1
        ? isDrawingMode()
          ? "打开画布，画一件能被鉴定成装备的简笔画。"
          : "拍下身边物品，鉴定成照片装备。"
        : `${getResourceName()}不足，先击败怪物攒到新的${getInputActionName()}机会。`;
    els.filmCountBadge.hidden = state.gameClear;
    els.equipmentActions.hidden = state.gameClear;
    els.photoActionBtn.hidden = state.gameClear;
    els.photoActionBtn.disabled = state.gameClear || locked || state.filmRolls < 1;
    els.photoActionBtn.textContent = getInputActionName();
    els.photoActionBtn.setAttribute("aria-label", getInputActionName());
    els.photoActionBtn.classList.toggle("is-photo-callout", firstPhotoHint && !els.photoActionBtn.disabled);
    return;
  }

  const quality = getItemQuality(scoreItem(selected));
  setEquipmentDetailQuality(quality);
  els.equipmentDetailName.textContent = formatBalancedItemDisplayName(selected, 8);
  els.equipmentDetailName.dataset.quality = quality.label;
  els.equipmentDetailStats.innerHTML = renderItemDetailPills(selected);
  els.equipmentDetailStats.hidden = false;
  els.equipmentDetailDesc.textContent = renderItemDescription(selected);
  const selectedImage = selected.fullImage || selected.image || "";
  if (selectedImage) {
    els.equipmentDetailImage.src = selectedImage;
    els.equipmentDetailImage.alt = `${formatItemDisplayName(selected)}大图`;
    els.equipmentDetailImageBtn.hidden = false;
  }
  els.equipmentActions.hidden = false;
  els.savePhotoBtn.hidden = false;
  els.savePhotoBtn.disabled = locked || !(selected.fullImage || selected.image);
  els.savePhotoBtn.textContent = "保存";
  els.savePhotoBtn.setAttribute("aria-label", `保存${selected.sourceMode === "drawing" ? "画作" : "照片"}`);
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

function renderPendingCropOverlay() {
  if (!els.pendingCropOverlay || !els.pendingCropBox) return;
  const rect = normalizeCropRect(state.pendingCropRect);
  const visible = Boolean(state.lastPhoto && rect);
  els.pendingCropOverlay.hidden = !visible;
  els.pendingCropBox.hidden = !visible;
  if (!visible) return;
  const imageBox = getPendingImageBoxStyle() || { left: 0, top: 0, width: 100, height: 100 };
  els.pendingCropBox.style.left = `${imageBox.left + rect.x * imageBox.width}%`;
  els.pendingCropBox.style.top = `${imageBox.top + rect.y * imageBox.height}%`;
  els.pendingCropBox.style.width = `${rect.width * imageBox.width}%`;
  els.pendingCropBox.style.height = `${rect.height * imageBox.height}%`;
}

function renderViewerCropOverlay() {
  if (!els.viewerCropOverlay || !els.viewerCropBox) return;
  const rect = normalizeCropRect(state.pendingCropRect);
  const visible = Boolean(state.viewerCropActive && state.cropMode && state.lastPhoto && rect && !els.imageViewer.hidden);
  els.viewerCropOverlay.hidden = !visible;
  els.viewerCropBox.hidden = !visible;
  if (!visible) return;
  const viewerRect = els.imageViewer.getBoundingClientRect();
  const imageRect = getViewerImageRenderedRect();
  const left = imageRect.left - viewerRect.left + rect.x * imageRect.width;
  const top = imageRect.top - viewerRect.top + rect.y * imageRect.height;
  els.viewerCropBox.style.left = `${left}px`;
  els.viewerCropBox.style.top = `${top}px`;
  els.viewerCropBox.style.width = `${rect.width * imageRect.width}px`;
  els.viewerCropBox.style.height = `${rect.height * imageRect.height}px`;
}

function renderCareerSummaryPanel() {
  const summary = state.careerSummary || buildLocalCareerSummary();
  const outcome = getCareerSummaryOutcome(summary);
  const snapshot = summary.snapshot || buildCareerSnapshot(outcome);
  els.equipmentDetail.dataset.outcome = outcome;
  els.equipmentDetail.classList.add("is-actionable", "career-summary-panel");
  els.equipmentDetailName.textContent = summary.status === "loading"
    ? "正在誊写塔史"
    : outcome === "defeat"
      ? "战败塔史"
      : "塔顶塔史";
  els.equipmentDetailStats.innerHTML = "";
  els.equipmentDetailStats.hidden = true;
  els.equipmentDetailDesc.innerHTML = renderCareerSummaryCard(summary, snapshot);
  els.equipmentActions.hidden = false;
  els.photoActionBtn.hidden = true;
  els.photoActionBtn.disabled = true;
  els.photoActionBtn.textContent = "";
  els.photoActionBtn.removeAttribute("aria-label");
  els.analyzePhotoBtn.hidden = false;
  els.analyzePhotoBtn.disabled = Boolean(state.careerSummaryRequest);
  els.analyzePhotoBtn.textContent = "保存图片";
  els.analyzePhotoBtn.setAttribute("aria-label", "保存塔史分享图片");
  els.discardItemBtn.hidden = true;
  els.battleLog.hidden = true;
  els.filmCountBadge.hidden = true;
}

function renderCareerSummaryCard(summary, snapshot) {
  const outcome = getCareerSummaryOutcome(summary);
  const isDefeat = outcome === "defeat";
  const statusText = getCareerSummaryStatusText(summary);
  const parsedSummary = getCareerSummaryParagraphs(summary);
  const floor = snapshot.defeatFloor || snapshot.floor || state.floor;
  const topItems = renderCareerEquipmentGallery(snapshot);
  const paragraphs = parsedSummary.paragraphs
    .slice(0, 4)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  const note = summary.note ? `<small>${escapeHtml(summary.note)}</small>` : "";
  const eyebrow = isDefeat
    ? `${statusText} · 止步第${floor}层`
    : `${statusText} · 第${maxFloor}层通关`;
  const subline = isDefeat
    ? `${snapshot.formLabel} · 倒在第${floor}层`
    : `${snapshot.formLabel} · 剩余${getResourceName()} ${snapshot.film}`;
  const stats = isDefeat
    ? [
        ["层数", floor],
        ["击败", snapshot.killCount],
        ["装备", snapshot.equipmentCount],
      ]
    : [
        ["怪物", snapshot.killCount],
        ["Boss", snapshot.bossKillCount],
        ["装备", snapshot.equipmentCount],
      ];
  return `
    <section class="career-card is-${escapeHtml(outcome)}" aria-label="${isDefeat ? "战败结局卡" : "通关结局卡"}">
      <div class="career-card-head">
        <span>${escapeHtml(eyebrow)}</span>
        <strong>${escapeHtml(parsedSummary.title)}</strong>
        <em>${escapeHtml(subline)}</em>
      </div>
      <div class="career-card-stats">
        ${stats.map(([label, value]) => `<span>${escapeHtml(label)} ${escapeHtml(value)}</span>`).join("")}
      </div>
      <div class="career-card-ability">${escapeHtml(formatCareerAbilityLine(snapshot))}</div>
      <div class="career-card-body">${paragraphs || (isDefeat ? `<p>${escapeHtml(modeText("旧账停在这一页，塔里仍记得照片勇者倒下前留下的影子。"))}</p>` : `<p>${escapeHtml(modeText("多年以后，塔中仍流传着照片勇者登顶的旧闻。"))}</p>`)}</div>
      <h4>${isDefeat ? "遗落在塔中的装备" : "塔史记名装备"}</h4>
      <ul class="career-card-items">${topItems}</ul>
      ${note}
    </section>
  `;
}

function renderCareerEquipmentGallery(snapshot) {
  const items = (snapshot.allItems || snapshot.topItems || []).slice(0, equipmentVisibleSlots);
  if (!items.length) {
    const emptyText = snapshot?.outcome === "defeat" ? modeText("没有留下照片装备") : modeText("没有照片装备记录");
    return `<li class="career-item-empty">${escapeHtml(emptyText)}</li>`;
  }
  return items.map((item) => {
    const qualityKey = item.qualityKey || getItemQuality(item.score || 0).key;
    const image = item.image || makePlaceholderImage();
    return `
      <li class="career-item-card quality-${escapeHtml(qualityKey)}">
        <span class="career-item-image"><img src="${escapeHtml(image)}" alt=""></span>
        <span class="career-item-name">${escapeHtml(formatBalancedItemDisplayName({ itemName: item.name }))}</span>
        <b>${escapeHtml(item.quality)} ${item.score || 0}</b>
      </li>
    `;
  }).join("");
}

function getCareerSummaryStatusText(summary) {
  const isDefeat = isDefeatCareerSummary(summary);
  if (summary?.status === "ai") return isDefeat ? "旧塔残页" : "塔顶旧史";
  if (summary?.status === "loading") return "正在誊写塔史";
  if (summary?.status === "error") return isDefeat ? "旧塔残页 · 抄录未成" : "塔内旧史 · 抄录未成";
  return isDefeat ? "旧塔残页" : "塔内旧史";
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

function getDrawingIconMarkup() {
  return `
    <svg class="drawing-empty-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 4.5h14v14H5z"></path>
      <path d="M8 16.5l2.6-.6 7-7a1.8 1.8 0 0 0-2.5-2.5l-7 7L7.5 16z"></path>
      <path d="M13.8 7.7l2.5 2.5"></path>
      <path d="M8 19.5h8"></path>
    </svg>
  `;
}

function getEmptySlotIconMarkup() {
  return isDrawingMode() ? getDrawingIconMarkup() : getCameraIconMarkup();
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
    const currentStats = getPlayerStats();
    const previewStats = getPlayerStatsForForm(form);
    const button = document.createElement("button");
    button.className = "form-card";
    button.type = "button";
    button.dataset.formId = form.id;
    button.dataset.formKey = form.id;
    const hpLoss = Math.max(0, (currentStats.maxHp || 0) - (previewStats.maxHp || 0));
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
    copy.innerHTML = effectLines.map((line) => `<i>${escapeHtml(modeText(line))}</i>`).join("");

    button.append(img, meta, copy);
    button.addEventListener("click", () => setHeroForm(form.id));
    els.formGrid.append(button);
  }
}

function getLootErrorHint(message) {
  const text = String(message || "");
  if (text.includes("image_url") || text.includes("图片输入") || text.includes("没有识别图片内容")) {
    return "鉴定台没有看清这张影像。";
  }
  if (text.includes("浏览器直连") || text.toLowerCase().includes("cors")) {
    return "鉴定台暂时连不上工坊。";
  }
  if (text.includes("响应结构")) {
    return "工坊回声有点乱。";
  }
  if (text.includes("JSON") || text.includes("游戏约束") || text.includes("格式")) {
    return "鉴定卷轴没有写完整。";
  }
  if (text.includes("已取消鉴定")) {
    return "这次影像已经收回。";
  }
  if (text.includes("超时") || text.includes("没有响应")) {
    return "鉴定火光灭得太久。";
  }
  return "这次影像没有稳定成形。";
}

function formatLootErrorMessage(message) {
  const text = String(message || "").trim();
  if (!text) return modeText("影像没有在鉴定台上成形。");
  const cleaned = text
    .replace(/^鉴定失败[:：]\s*/, "")
    .replace(/（?胶卷未消耗）?/g, "")
    .trim();
  if (/网图|截图|虚拟装备|没有转化|气息太虚/.test(cleaned)) {
    return "这道影像太虚，没能凝成装备。";
  }
  if (/无法作为装备|太难装进行囊|主体过大|主要是场景/.test(cleaned)) {
    return "这件东西太难装进行囊。";
  }
  if (/没有形成可用属性|没有醒出力量|可用属性/.test(cleaned)) {
    return modeText("这张照片没有醒出力量。");
  }
  if (/已取消鉴定/.test(cleaned)) {
    return "鉴定已经收回。";
  }
  if (/超时|没有响应/.test(cleaned)) {
    return "鉴定火光灭得太久。";
  }
  if (/image_url|图片输入|没有接收图片|没有识别图片内容/.test(cleaned)) {
    return "鉴定台没有看清这张影像。";
  }
  if (/浏览器直连|CORS|请求被浏览器拦截/.test(cleaned)) {
    return "鉴定台暂时连不上工坊。";
  }
  if (cleaned.includes("没有按 JSON 格式") || cleaned.includes("没有按游戏要求返回 JSON")) {
    return "鉴定卷轴没有写完整。";
  }
  if (cleaned.includes("模型返回了文本")) {
    return "工坊回声有点乱。";
  }
  return shortenText(cleaned, 34);
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
  return modeText(improveItemDescription(item), item.sourceMode || state.playMode);
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
  const identityText = `${item?.itemName || ""} ${item?.subjectName || ""} ${item?.objectType || ""} ${item?.identityDescription || ""} ${normalizeStringList(item?.tags).join(" ")}`;
  if (isLowRealityToyOrMascotImageText(identityText, item?.photoQuality || {}) || isToyMascotSemanticText(identityText)) {
    if (stats.defense > 0 || stats.shield > 0) return `塔把${name}记成一枚守门小印，外表轻巧，却能替勇者稳住最先落下的攻势。`;
    if (stats.hp > 0 || stats.regen > 0) return `${name}被塔灯照出柔和余温，像一只随身护符，把疲惫慢慢收回掌心。`;
    if (stats.attack > 0) return `${name}的轮廓被塔影磨亮，原本玩笑般的棱角也能在战斗里划开空隙。`;
    return `${name}被塔收作一件小小纪念，力量不张扬，却仍愿意跟着勇者上楼。`;
  }
  if (effects.includes("doubleStrikeSpeedDown")) return `塔把${name}压得沉重，却也把每一次进攻折成连续回声，慢一步，换来更密的出手。`;
  if (effects.includes("shieldCrashAttackDown")) return `${name}把护盾推到锋线前端，勇者出手时，盾面的旧光也会一起撞向敌人。`;
  if (effects.includes("sweep")) return `${name}被塔赋予横扫的名义，主目标被击中时，余劲会沿着阵列甩向左右。`;
  if (effects.includes("peerless")) return `${name}像一枚胜利刻痕，敌人倒下时，它会把本场战斗的攻防再往上推。`;
  if (effects.includes("dealDamageAttack")) return `${name}越用越顺，塔纹会在每次进攻后加深，让下一次出手更狠。`;
  if (effects.includes("takeDamageDefense")) return `${name}挨过撞击后会变得更硬，像把每次受击都铆进了临时甲片。`;
  if (effects.includes("killMaxHp")) return `${name}会收起倒下怪物留下的热气，把它们一点点写进生命上限。`;
  if (effects.includes("killHpBoost")) return `${name}懂得在胜利后回收余温，敌人倒下时，会替勇者补上一口气。`;
  if (stats.attack > 0 && stats.lifesteal > 0) return `塔把${name}认作一件贪利兵器，既能撕开敌人的影子，也能从进攻里追回生命。`;
  if (stats.attack > 0 && stats.speed > 0) return `${name}在掌心里变得顺手，塔风绕着它走，让勇者更快把力量送出去。`;
  if (stats.defense > 0 && stats.shield > 0) return `${name}被塔影镀成临时护板，先挡住冲击，再替勇者稳住防线。`;
  if (stats.hp > 0 && stats.regen > 0) return `${name}像从现实带进塔里的补给符，能扩宽生命，也能把挨打后的余痛慢慢压下。`;
  if (stats.speed > 0) return `${name}沾上了楼梯间的风声，带着勇者抢在怪物节拍之前行动。`;
  if (stats.attack > 0) return `塔把${name}的棱角磨成可用的锋面，原本普通的物件也能在出手时留下伤口。`;
  if (stats.defense > 0) return `${name}被塔墙承认了硬度，贴身带着时，落下来的伤害会先被它挡去一截。`;
  if (stats.shield > 0) return `${name}像被塔临时封成一面小盾，每场战斗开始时都会先亮起一层护光。`;
  if (stats.lifesteal > 0) return `${name}带着一点不讲理的夺回感，勇者进攻后，会从攻势里抽回生命。`;
  if (stats.regen > 0) return `${name}藏着修补的意味，被攻击后，塔会借它把生命缓缓拉回。`;
  if (stats.hp > 0) return `${name}被塔写成一枚耐久符，把勇者能承受的极限往上垫高。`;
  if (item?.tooLarge) return "主体太大，照片只能留下回忆，不能塞进装备格。";
  return `${name}被塔收进装备格，像一件刚醒来的奇物，等待下一场战斗给它命名。`;
}

function isGenericItemDescription(text) {
  return /^(由照片鉴定出的装备|测试用拍照特殊装备|按模型文字保守鉴定|主体过大或主要是场景|装备|物品)/.test(String(text || "").trim());
}

function isToyMascotSemanticText(text) {
  return /(?:玩具|模型|手办|公仔|玩偶|娃娃|卡通|吉祥物|角色|拟人|寿司|青蛙|toy|model|figure|plush|doll|cartoon|mascot|character)/i.test(String(text || ""));
}

function isItemDescriptionConsistent(item, description) {
  if (!item || item.tooLarge) return true;
  const text = String(description || "");
  const stats = item.stats || {};
  const effects = getItemSpecialKeys(item);
  const identityText = `${item.itemName || ""} ${item.subjectName || ""} ${item.objectType || ""} ${item.identityDescription || ""} ${normalizeStringList(item.tags).join(" ")}`;
  if (isToyMascotSemanticText(identityText) && /跳出|突袭|发起|奔跑|活过来|自己|随时准备|jump|attack|run|alive/i.test(text)) {
    return false;
  }
  if (isSharpToolSemanticText(`${item.itemName || ""} ${item.subjectName || ""} ${item.objectType || ""}`)) {
    const onlyRecoveryClaim = /回复|恢复|回血|修复|补能|再生|regen/i.test(text)
      && !/攻击|伤害|打击|破防|锋利|进攻|输出|攻势|吸血|吸取|夺取|追回生命|attack|lifesteal/i.test(text);
    if (onlyRecoveryClaim) return false;
  }
  const claims = [
    { key: "attack", hit: /攻击|伤害|打击|破防|锋利|进攻|输出|攻势|attack/i.test(text) },
    { key: "defense", hit: /防御|防线|抗打|硬接|坚固|稳住|减伤|defen[cs]e/i.test(text) },
    { key: "speed", hit: /速度|更快|抢先|迅捷|敏捷|行动|加速|节奏|微风|气流|旋转|speed|airflow|rotate/i.test(text) },
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
  if (item?.id) {
    const activeKeys = new Set(getEquippedPhotoEffectInstances()
      .filter((instance) => instance.item?.id === item.id)
      .map((instance) => instance.key));
    return instances.filter((instance) => activeKeys.has(instance.key));
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
    button.textContent = modeText(entry.summary);
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
  textEl.textContent = modeText(text);
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
  const selectedEquipmentImage = selectedEquipment?.fullImage || selectedEquipment?.image || "";
  const enemyDamageEstimates = getEnemyDamageEstimates();
  const inventoryItems = state.inventory.filter(Boolean);
  const apiConfig = getConfigFromInputs();
  window.__photoHeroState = {
    playMode: state.playMode,
    gameTitle: getGameTitle(),
    resourceName: getResourceName(),
    runSeed: state.runSeed,
    player: {
      hp: state.player.hp,
      shield: state.player.shield,
      form: {
        id: getHeroForm().id,
        label: getHeroForm().label,
        level: getHeroFormLevel(),
        progress: getHeroFormProgressText(),
      effects: getHeroFormEffectLines().map((line) => modeText(line)),
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
    battleStats: state.activeEnemyIds.length ? getBattleStats(state.activeEnemyIds) : null,
    statReadouts: readHeroStatReadouts(),
      selectedEquipment: selectedEquipment ? formatItemDisplayName(selectedEquipment) : null,
      selectedSlotIndex: getSelectedSlotIndex(),
      selectedHasOriginalImage: Boolean(selectedEquipment?.fullImage),
      selectedHasSaveImage: Boolean(selectedEquipmentImage),
      equippedItems: equippedItems.map((item) => formatItemDisplayName(item)),
      equippedEffects: equippedItems.flatMap((item) => getItemSpecialKeys(item)),
    },
    floor: state.floor,
    maxFloor,
    infoMode: state.infoMode,
    selectedSlotIndex: getSelectedSlotIndex(),
    pendingPhotoSlotIndex: state.pendingPhotoSlotIndex,
    api: {
      presetId: apiConfig.presetId,
      baseUrl: apiConfig.baseUrl,
      model: apiConfig.model,
      hasApiKey: Boolean(apiConfig.apiKey) || isExperienceConfig(apiConfig),
      keyLocked: isExperienceConfig(apiConfig),
    },
    gameClear: Boolean(state.gameClear),
    tutorial: { ...state.tutorial },
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
      displayStats: getMonsterDisplayStats(enemy, state.activeEnemyIds.includes(enemy.id) ? state.activeEnemyIds : [enemy.id]),
      displayAtk: getMonsterDisplayAttack(enemy, state.activeEnemyIds.includes(enemy.id) ? state.activeEnemyIds : [enemy.id]),
      def: enemy.def,
      speed: enemy.speed,
      traits: enemy.traits?.map((trait) => trait.text || trait.type) || [],
      drop: formatEnemyFilmDrop(enemy),
      summoned: Boolean(enemy.summoned),
      damageEstimate: enemyDamageEstimates.get(enemy.id)?.text || "",
      damageEstimateState: enemyDamageEstimates.get(enemy.id)?.state || "",
      selected: state.selectedEnemyIds.includes(enemy.id),
      selectionOrder: getEnemySelectionOrder(enemy.id),
      active: state.activeEnemyIds.includes(enemy.id),
    })),
    selectedEnemyIds: [...state.selectedEnemyIds],
    introRewardSelectedIds: [...getIntroRewardSelection()],
    introRewardsReady: hasSelectedAllIntroRewards(),
    selectedEnemyCount: state.selectedEnemyIds.length,
    activeEnemyIds: [...state.activeEnemyIds],
    bossReward: state.bossReward ? {
      floor: state.bossReward.floor,
      options: state.bossReward.options,
      selectedIndex: getSelectedBossRewardIndex(),
    } : null,
    audio: {
      bgmKey: state.bgmKey,
      bgmTitle: bgmTracks[state.bgmKey]?.title || "",
      settings: { ...state.audioSettings },
      unlocked: state.audioUnlocked,
      recoveryCount: state.audioRecoveryCount,
      recoveryReason: state.audioLastRecoveryReason,
      contextState: state.audioLastContextState,
      lastBgmPlayError: state.lastBgmPlayError,
      lastSfxPlayError: state.lastSfxPlayError,
    },
    careerSummary: state.careerSummary ? {
      status: state.careerSummary.status,
      outcome: getCareerSummaryOutcome(state.careerSummary),
      title: state.careerSummary.title,
      text: state.careerSummary.text,
      note: state.careerSummary.note || "",
    } : null,
    hasPhoto: Boolean(state.lastPhoto),
    pendingSourceMode: getPendingSourceMode(),
    pendingCropRect: normalizeCropRect(state.pendingCropRect),
    cropMode: Boolean(state.cropMode),
    latestItem: state.latestItem,
    inventory: state.inventory.map((item, slotIndex) => item ? ({
      slotIndex,
      name: formatItemDisplayName(item),
      score: scoreItem(item),
      quality: getItemQuality(scoreItem(item)).label,
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
      sourceMode: item.sourceMode || "photo",
      fullImage: item.fullImage || "",
      photoKey: item.photoKey || "",
      sourcePhotoKey: item.sourcePhotoKey || "",
      cropRect: item.cropRect || null,
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

function readHeroStatReadouts() {
  const entries = [
    ["atk", els.playerAtk],
    ["def", els.playerDef],
    ["speed", els.playerSpeed],
    ["regen", els.playerRegen],
    ["lifesteal", els.playerLifesteal],
  ];
  return Object.fromEntries(entries.map(([key, node]) => [key, {
    text: node?.textContent?.trim() || "",
    base: node?.querySelector?.(".stat-base")?.textContent?.trim() || "",
    delta: node?.querySelector?.(".stat-delta")?.textContent?.trim() || "",
    deltaKind: node?.querySelector?.(".stat-delta")?.dataset.delta || "",
  }]));
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
  if (showLog) addLog("鉴定台配置已保存到当前浏览器。");
  render();
}

function loadConfig() {
  const config = readJson(STORAGE_KEYS.config, {});
  state.playMode = normalizeHeroMode(config.playMode);
  state.pendingSourceMode = state.playMode;
  state.audioSettings = normalizeAudioSettings(config.audioSettings);
  renderAudioSettings();
  const presetId = isSelectableApiPreset(config.presetId) ? config.presetId : defaultApiPresetId;
  customDraft.baseUrl = presetId === "custom" ? config.baseUrl || "" : config.customBaseUrl || "";
  customDraft.model = presetId === "custom" ? config.model || "" : config.customModel || "";
  Object.assign(providerApiKeys, config.apiKeys || {});
  if (config.apiKey && !API_PRESETS[presetId]?.lockedKey && !providerApiKeys[presetId]) {
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
  const apiKey = activePresetConfig.lockedKey ? "" : els.apiKeyInput.value.trim();
  const apiKeys = activePresetConfig.lockedKey
    ? { ...providerApiKeys }
    : { ...providerApiKeys, [activePreset]: apiKey };

  return {
    presetId: activePreset,
    baseUrl,
    apiKey,
    apiKeys,
    model,
    playMode: state.playMode,
    customBaseUrl: activePreset === "custom" ? baseUrl : customDraft.baseUrl.trim(),
    customModel: activePreset === "custom" ? model : customDraft.model.trim(),
    audioSettings: { ...state.audioSettings },
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
    introRewardSelectedIds: state.introRewardSelectedIds,
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
    tutorial: state.tutorial,
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

  state.floor = getSaveFloor(save.floor);
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

  const hasSavedActiveBattle = Boolean(save.currentBattle)
    && Array.isArray(save.activeEnemyIds)
    && save.activeEnemyIds.length > 0;
  state.enemies = Array.isArray(save.enemies)
    ? save.enemies.map(hasSavedActiveBattle ? normalizeCombatEnemy : normalizeEnemy).filter(Boolean)
    : [];
  state.encounterId = typeof save.encounterId === "string" ? save.encounterId : "";
  if (!state.enemies.length && !state.gameClear) {
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
  }
  state.selectedEnemyIds = Array.isArray(save.selectedEnemyIds)
    ? save.selectedEnemyIds.filter((id) => typeof id === "string" && state.enemies.some((enemy) => enemy.id === id))
    : [];
  state.introRewardSelectedIds = Array.isArray(save.introRewardSelectedIds)
    ? save.introRewardSelectedIds.filter((id) => typeof id === "string")
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
  state.tutorial = normalizeTutorialState(save.tutorial);
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
  const floor = getPlayableFloor(reward.floor);
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
    effect: fallback.effect || cleanText(option.effect, "", 32),
    desc: fallback.desc || cleanText(option.desc, "选择后进入下一层。", 64),
    icon: fallback.icon || option.icon || getBossRewardIcon(option.type),
  };
}

function normalizeCareerSummary(summary) {
  if (!summary || typeof summary !== "object") return null;
  const status = ["local", "loading", "ai", "error"].includes(summary.status) ? summary.status : "local";
  return {
    status: status === "loading" ? "local" : status,
    outcome: summary.outcome === "defeat" || summary.snapshot?.outcome === "defeat" ? "defeat" : "clear",
    title: cleanText(summary.title, `${getGameTitle()}生涯总结`, 32),
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
    floor: getPlayableFloor(snapshot.floor),
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
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
    const item = balanceItem(input || {}, input?.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-item"), fullImage: input?.fullImage || item.fullImage || "" }, "测试装备已加入。");
  },
  addSpecialItem(effectKey, input = {}) {
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
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
    addInventoryItem({ ...item, id: makeId("test-special"), fullImage: input.fullImage || item.fullImage || "" }, "测试特殊装备已加入。");
  },
  addSpecialComboItem(effectKeys, input = {}) {
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
    const keys = Array.isArray(effectKeys) ? effectKeys.filter((key) => photoSpecialEffectMap.has(key)) : [];
    const value = Math.max(
      input.value || 16,
      ...keys.map((key) => photoSpecialEffectMap.get(key)?.value || 0),
    );
    const item = balanceItem({
      itemName: input.itemName || "测试组合特装",
      rarity: input.rarity || "legendary",
      value,
      stats: input.stats || {},
      specialEffects: keys,
      skipSpecialRoll: true,
      description: input.description || "测试用组合特殊装备。",
      identityDescription: input.identityDescription || "",
      photoKey: input.photoKey || makeId("test-photo"),
      confidence: 1,
    }, input.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-combo-special"), fullImage: input.fullImage || item.fullImage || "" }, "测试组合特装已加入。");
  },
  setCareerSummaryForTest(summary = {}) {
    const outcome = summary.outcome === "defeat" ? "defeat" : "clear";
    state.gameClear = outcome === "clear";
    if (outcome === "defeat") {
      state.player.hp = 0;
    }
    state.careerSummary = {
      ...buildLocalCareerSummary(outcome),
      ...summary,
      outcome,
      snapshot: summary.snapshot || buildCareerSnapshot(outcome),
      createdAt: Date.now(),
    };
    state.infoMode = "career";
    saveGame();
    render();
  },
  setDefeatSummaryForTest(summary = {}) {
    this.setCareerSummaryForTest({ ...summary, outcome: "defeat" });
  },
  makeCareerSummaryImageForTest() {
    const summary = state.careerSummary || buildLocalCareerSummary();
    const snapshot = summary.snapshot || buildCareerSnapshot();
    return makeCareerSummaryImage(summary, snapshot);
  },
  makeBattleSummary,
  addRawItem(input) {
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
    const item = {
      ...balanceItem({ ...(input || {}), photoKey: input?.photoKey || pendingDuplicatePhotoKey, skipSpecialRoll: input?.skipSpecialRoll ?? true }, input?.image || makePlaceholderImage()),
      stats: normalizeStats(input?.stats || {}, 999),
      id: makeId("test-item"),
      fullImage: input?.fullImage || "",
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
  getAudioEvents() {
    return state.audioEvents.slice();
  },
  getBgmEvents() {
    return state.bgmEvents.slice();
  },
  getBgmPreloadStateForTest() {
    return {
      started: bgmPreloadStarted,
      keys: Object.keys(bgmAudioCache),
      order: [...bgmPreloadOrder],
      loadedCount: Object.keys(bgmAudioCache).length,
    };
  },
  getBgmPlaybackStateForTest() {
    return {
      key: state.bgmKey,
      hasAudio: Boolean(state.bgmAudio),
      paused: state.bgmAudio ? state.bgmAudio.paused : null,
      ended: state.bgmAudio ? state.bgmAudio.ended : null,
      loop: state.bgmAudio ? state.bgmAudio.loop : null,
      currentTime: state.bgmAudio ? state.bgmAudio.currentTime : null,
      readyState: state.bgmAudio ? state.bgmAudio.readyState : null,
      volume: state.bgmAudio ? state.bgmAudio.volume : null,
      fading: isBgmFading(state.bgmAudio),
      playAttemptToken: bgmPlayAttemptToken,
      loopDelayMs: bgmLoopDelayMs,
      loopRestartScheduled: Boolean(bgmLoopRestartTimer),
      loopHoldRemaining: getBgmLoopHoldRemaining(state.bgmAudio),
      src: state.bgmAudio ? state.bgmAudio.currentSrc || state.bgmAudio.src : "",
    };
  },
  playBgmKeyForTest(key) {
    playBgm(key, { restart: true });
    return this.getBgmPlaybackStateForTest();
  },
  getCachedBgmPlaybackStateForTest(key) {
    const audio = bgmAudioCache[key];
    return audio ? {
      key,
      paused: audio.paused,
      ended: audio.ended,
      currentTime: audio.currentTime,
      readyState: audio.readyState,
      volume: audio.volume,
      fading: isBgmFading(audio),
      playAttemptToken: bgmPlayAttemptToken,
    } : null;
  },
  getStatsCounterIdsForTest() {
    return { ...STATS_COUNTER_IDS };
  },
  async recordStatsMetricForTest(metric, amount = 1) {
    return recordGlobalGameMetricForTest(metric, amount, { refresh: false });
  },
  async recordAppraisalPlayerForTest() {
    return recordGlobalAppraisalPlayerForTest({ refresh: false });
  },
  resetAppraisalPlayerStatsForTest() {
    appraisalPlayerRecordPending = false;
    localStorage.removeItem(STORAGE_KEYS.statsAppraisalId);
    localStorage.removeItem(STORAGE_KEYS.statsAppraisalRecorded);
    localStorage.removeItem(STORAGE_KEYS.statsLastAppraisalDate);
  },
  markCurrentBgmEndedForTest() {
    const audio = state.bgmAudio;
    if (!audio) return false;
    scheduleBgmLoopRestart(state.bgmKey, audio);
    return true;
  },
  selectIntroRewardForTest(id) {
    selectIntroReward(id);
  },
  confirmIntroRewardsForTest() {
    confirmIntroRewards();
  },
  getIntroRewardsForTest() {
    return getIntroRewards();
  },
  forceBgmPausedForTest() {
    if (!state.bgmAudio) return false;
    intentionalBgmPauseUntil.set(state.bgmAudio, 0);
    state.bgmAudio.pause();
    window.setTimeout(() => pauseOrResumeBgm(), 0);
    return true;
  },
  forceBgmStalledForTest() {
    if (!state.bgmAudio) return false;
    state.bgmWatchKey = state.bgmKey;
    state.bgmWatchCurrentTime = state.bgmAudio.currentTime;
    state.bgmWatchProgressAt = Date.now() - 4000;
    return true;
  },
  checkBgmWatchdogForTest() {
    checkBgmWatchdog();
    return this.getAudioRecoveryStateForTest();
  },
  ensureBgmForTest(force = false) {
    ensureBgmForGameState(force);
    return this.getBgmPlaybackStateForTest();
  },
  recoverGameAudioForTest(reason = "test") {
    recoverGameAudio(reason, { force: true });
    return this.getAudioRecoveryStateForTest();
  },
  suspendAudioContextForTest() {
    const context = ensureGameAudioContext();
    if (!context?.suspend) return Promise.resolve(this.getAudioRecoveryStateForTest());
    return context.suspend().then(() => this.getAudioRecoveryStateForTest());
  },
  getAudioRecoveryStateForTest() {
    return {
      count: state.audioRecoveryCount,
      reason: state.audioLastRecoveryReason,
      contextState: gameAudioContext?.state || "",
      lastAudioResumeError: state.lastAudioResumeError,
      lastBgmPlayError: state.lastBgmPlayError,
      lastSfxPlayError: state.lastSfxPlayError,
      activeSfxCount: activeSfxAudios.size,
      bgmWatchKey: state.bgmWatchKey,
      bgmWatchProgressAt: state.bgmWatchProgressAt,
    };
  },
  clearAudioEvents() {
    state.audioEvents = [];
    state.bgmEvents = [];
    state.audioLastPlayedAt = {};
    state.lastSfxPlayError = "";
    state.lastBgmPlayError = "";
    state.lastAudioResumeError = "";
  },
  setAudioSettings(next = {}) {
    state.audioSettings = normalizeAudioSettings({ ...state.audioSettings, ...next });
    renderAudioSettings();
    pauseOrResumeBgm();
    saveConfig(false);
  },
  getEffectiveAudioGainForTest(key = "", kind = "sfx") {
    if (kind === "bgm") return getEffectiveBgmGain();
    const effect = soundEffects[key] || { volume: 1 };
    return getEffectiveSfxGain(effect.volume);
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
  getPhotoValueMappingForTest(score) {
    return {
      score,
      baseValue: mapPhotoQualityScoreToBaseValue(score),
      mappedValue: mapPhotoQualityScoreToValue(score),
      min: getPhotoValueMin(),
      max: getPhotoValueMax(),
    };
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
  getPlayerBattleStatsForTest(ids = state.activeEnemyIds) {
    return getBattleStats(ids);
  },
  getActiveSpecialForTest() {
    const active = getActiveEquippedPhotoSpecialInstance();
    return active ? { key: active.key, itemName: active.item?.itemName || "", value: active.effect?.value || 0 } : null;
  },
  getActiveSpecialsForTest() {
    return getEquippedPhotoEffectInstances().map((active) => ({
      key: active.key,
      itemName: active.item?.itemName || "",
      value: active.effect?.value || 0,
    }));
  },
  getBattleStatsForTest(ids = state.activeEnemyIds) {
    return getBattleStats(ids);
  },
  getHeroStateForTest() {
    return { hp: state.player.hp, maxHp: getPlayerStats().maxHp, shield: state.player.shield };
  },
  getInventoryForTest() {
    return state.inventory.map((item) => (item ? {
      id: item.id,
      itemName: item.itemName,
      value: item.value,
      stats: item.stats,
      specialEffects: item.specialEffects,
      score: scoreItem(item),
      quality: getItemQuality(scoreItem(item)).label,
      qualityKey: getItemQuality(scoreItem(item)).key,
      photoKey: item.photoKey || "",
      sourcePhotoKey: item.sourcePhotoKey || "",
      cropRect: item.cropRect || null,
    } : null));
  },
  resetGameForTest(options = {}) {
    resetGame();
    if (!options.keepIntro) {
      this.enterTowerForTest({ silent: true });
    }
  },
  enterTowerForTest(options = {}) {
    if (isIntroFloor()) {
      if (options.silent) {
        stopAutoBattle();
        stopBattleTimers();
        clearEnemyCardMotion();
        state.floor = 1;
        state.tutorial.introEnteredTower = true;
        state.introRewardSelectedIds = [];
        state.filmRolls = Math.max(state.filmRolls, introFilmRewardCount);
        state.filmShards = 0;
        state.selectedEnemyIds = [];
        state.activeEnemyIds = [];
        state.currentBattle = null;
        state.battleSnapshot = null;
        state.battleClock = null;
        state.bossReward = null;
        state.enemies = buildFloorEncounter(state.floor);
        state.encounterId = makeEncounterId();
        state.enemyFlipEncounterId = state.encounterId;
        applyFloorShield();
        ensureBgmForGameState(true);
      } else {
        state.introRewardSelectedIds = introRewardOptions.map((option) => option.id);
        enterTowerFromIntro();
      }
    }
    focusInitialPhotoSlotAfterTowerEntry();
    saveGame();
    render();
  },
  startBossRewardChoice(floor) {
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
    state.floor = getPlayableFloor(floor);
    startBossRewardChoice(floor);
  },
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
  scoreItemForTest(item) {
    return scoreItem(item);
  },
  getItemQualityForTest(value) {
    return getItemQuality(value);
  },
  formatBalancedItemDisplayNameForTest(item, maxSingleLineLength) {
    return formatBalancedItemDisplayName(item, maxSingleLineLength);
  },
  getAppraisalFailureReasonForTest(item) {
    return getAppraisalFailureReason(item);
  },
  getDismantleFilmReturnForTest(item) {
    return getDismantleFilmReturn(item);
  },
  cropImageToDataUrl,
  normalizeCropRect,
  findCurrentPhotoDuplicateForTest(photoKey, sourcePhotoKey = "", cropRect = null) {
    const duplicate = findCurrentPhotoDuplicate(photoKey, sourcePhotoKey, cropRect);
    return duplicate ? { id: duplicate.id, itemName: duplicate.itemName } : null;
  },
  saveSelectedPhotoImageForTest: saveSelectedPhotoImage,
  dismantleSelectedItemForTest() {
    return dismantleSelectedItem();
  },
  showLootErrorForTest(message) {
    showLootError(message);
    state.lastPhoto = "";
    state.infoMode = "item";
    render();
  },
  showRetryableAppraisalErrorForTest(message) {
    showRetryableAppraisalError(message || "模型没有按鉴定台要求返回结果。");
    render();
  },
  setPendingPhotoForTest(image, options = {}) {
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
    state.lastPhoto = image || "";
    state.pendingSourceMode = normalizeHeroMode(options.sourceMode || state.playMode);
    state.pendingCropRect = null;
    state.cropMode = false;
    state.cropDrag = null;
    state.viewerCropActive = false;
    state.viewerCropDrag = null;
    state.pendingPhotoSlotIndex = getSelectedSlotIndex();
    state.lootError = "";
    state.infoMode = "item";
    render();
  },
  getPhotoValueRange() {
    return { min: getPhotoValueMin(), max: getPhotoValueMax() };
  },
  setHeroForm(formId) {
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
    setHeroForm(formId);
  },
  getMonsterAttackForStrike,
  getMonsterDisplayStats,
  applyHeroDamageToEnemy,
  defeatEnemy,
  finishEnemyFlipDownForTest: finishEnemyFlipDown,
  resolveHeroStrikeAgainstEnemy,
  resolveMonsterStrike,
  beginBattle,
  monsterTypes,
  state,
  render,
  selectEnemies(ids) {
    state.selectedEnemyIds = Array.isArray(ids) ? ids : [];
    saveGame();
    render();
  },
  setFloor(floor) {
    stopAutoBattle();
    stopBattleTimers();
    state.floor = getSaveFloor(floor);
    state.gameClear = false;
    state.bossReward = null;
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = [];
    state.introRewardSelectedIds = [];
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
    if (isIntroFloor()) this.enterTowerForTest({ silent: true });
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

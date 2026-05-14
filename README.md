# 照片勇者

一个极简 H5 图文打怪原型：玩家打开网页后，拍照或从相册选择现实物品，调用自己填写的 OpenAI-compatible 视觉模型，把照片鉴定成装备。

## 当前玩法

- 点击“取物照片”，手机可使用相机或相册，电脑可选择本地图片。
- 页面显示照片预览。
- 填写 API Base URL、API Key、Model。
- 点击“鉴定”，浏览器直接调用玩家填写的大模型接口。
- 模型返回装备 JSON，前端再次限制数值并加入背包。
- 装备会提升勇者属性，然后继续打怪。

## 公开网页目标

最终目标是像研究生模拟器一样：上传 GitHub 后，通过 GitHub Pages 得到一个网址，玩家打开即可玩。

目标仓库名：

```text
photo-hero
```

目标游玩网址：

```text
https://kw66.github.io/photo-hero/
```

因此玩家路径必须是纯静态网页：

```text
GitHub Pages -> index.html -> app.js -> 浏览器直连玩家自己的大模型 API
```

没有云后端，没有数据库，也不要求玩家本地运行 Node。

## 本地预览

Node 只用于本地静态预览，不参与玩家的 API 调用：

```powershell
npm start
```

电脑本机打开：

```text
http://localhost:3000
```

## API 要求

第一版只支持 OpenAI-compatible 的聊天接口。当前页面提供模型预设按钮，也可以切到自定义手动填写。可先用“测试对话”验证浏览器能否直连 API；确认文本对话可用后，再测试图片鉴定。

注意：DeepSeek V4 Flash 当前适合测试文本对话；照片鉴定需要换成支持图片输入的视觉模型。

图片鉴定至少需要：

```text
支持图片输入 / 多模态 / vision
支持 OpenAI-compatible /chat/completions
允许 GitHub Pages 这类网页做浏览器 CORS 直连
```

配置示例：

```text
API Base URL: https://api.deepseek.com
Model: deepseek-v4-flash
API Key: sk-...
```

浏览器会请求：

```text
POST {API Base URL}/chat/completions
```

如果填写的地址已经以 `/chat/completions` 结尾，页面会直接使用它。

## 隐私和限制

- API Base URL、Model、API Key 只保存在玩家自己的浏览器 localStorage 中。
- 本项目没有服务器接收或保存玩家的 API Key。
- 浏览器直连模型接口要求服务商允许 CORS；如果某个 API 不允许浏览器跨域请求，对话和鉴定都会失败，需要换支持浏览器直连的接口。
- 照片会在浏览器本地压缩到最长边 1024px 以内，再发送给玩家填写的模型接口。

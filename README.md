# ha-inkwavemap

本项目为 Home Assistant 的定制化中国地图面板。

制作者：[Mr.Yin](https://github.com/YinHangCode)，墨澜（cxlwill）

## 简介
本地化 Home Assistant 的地图面板，实现：

- 高德地图图层
- 国内地理位置纠偏
- 显示/隐藏交通态势
- 显示/隐藏区域（zone）范围及标签
- 同步 Home Assistant 的 `device_tracker` 设备信息
- 替代原有图层替换方法，不受 HA 更新影响，一步到位

## 配置方法
1. 拷贝 `www` 和 `panels` 文件夹至 Home Assistant 配置文件夹；
2. 打开 Home Assistant 配置文件 `configuration.yaml`，添加 `sample.yaml` 中的内容；
3. 前往 [高德开放平台](http://lbs.amap.com/) 申请开发者身份并获取 token；
4. 打开 `www/custom_ui/inkwavemap` 中 `config.js` 文件，填入你的 HA 密码以及高德 token。
5. 清除浏览器缓存，重启 HA。

## 使用 TIP

- 默认经纬度请使用 Google 地球坐标，防止误纠偏
- 如果有多人在同一地点，将聚合为数字标签，点触即可展开详情
- 点触 Dock 栏最后图标可选择追踪设备（对象）
 
## 补充说明
初版试水作品，欢迎试用。若有建议或 bug 欢迎提交 issue，一定积极修正 ：）

**欢迎各位加入开发者 QQ 群：[107927710](https://shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d) & [515348788](https://jq.qq.com/?_wv=1027&k=5ZGk07E) 。**

## 适配性
适配各平台最新版 Chrome 及 Safari 浏览器，适配 iOS Home Assistant 客户端。

## TODO
- 添加百度地图图层及卫星图层
- 同步 `zone` 信息，生成多个地理围栏




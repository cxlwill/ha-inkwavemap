# ha-inkwavemap
[![ha-inkwavemap version](https://img.shields.io/badge/ha--inkwavemap-0.0.2-blue.svg)](https://github.com/cxlwill/ha-inkwavemap)
   
![墨澜地图](https://raw.githubusercontent.com/cxlwill/ha-inkwavemap/master/media/screenshot.jpg)

![iOS](https://raw.githubusercontent.com/cxlwill/ha-inkwavemap/master/media/ios.jpg)

本项目为 Home Assistant 的定制化中国地图面板。

制作者：[墨澜](https://github.com/cxlwill)， [Mr.Yin](https://github.com/YinHangCode)，[poerts](https://github.com/poerts)

**感谢 poerts 的 PR，本项目已支持最新版 0.76.2 Home Assistant 授权机制。**

## 简介
本地化 Home Assistant 的地图面板，实现：

- 高德地图、百度地图(coming soon)
- 自带坐标系转换(即地理位置纠偏)
- 显示/隐藏 交通态势
- 显示/隐藏 区域（zone）范围及家标签
- 显示/隐藏 Home Assistant 中 `zone` 及 `device_tracker` 信息
- 显示/隐藏 预算到家时间及路线轨迹 
- 替代原有图层替换方法，不受 HA 更新影响，一步到位

## 配置方法
1. 拷贝 `www` 和 `panels` 文件夹至 Home Assistant 配置文件夹；
2. 打开 Home Assistant 配置文件 `configuration.yaml`，添加 `sample.yaml` 中的内容；
3. 修改 `configuration.yaml` 中的默认经纬度为谷歌地球坐标，**注意非地图，是地球**！坐标可至该 [网站](http://www.gpsspg.com/maps.htm) 获取；
3. 前往 [高德开放平台](http://lbs.amap.com/) 申请开发者身份，创建新应用，**服务类型选择 web 端，注意是 web 端，不是 web 服务！！！** 之后获取 key；
![Gaode](https://raw.githubusercontent.com/cxlwill/ha-inkwavemap/master/media/gaode.jpg)
4. 打开 `www/custom_ui/inkwavemap` 中 `config.js` 文件，填入你的 HA 密码以及高德 token。
5. **清除浏览器缓存，重启 HA。**

## 使用 TIP

- **默认经纬度请使用 Google 地球坐标，注意是地球，不是地图！防止误纠偏。**
- 如果有多人在同一地点，将聚合为数字标签，点触即可展开详情
- 点触 Dock 栏最后图标可选择追踪设备（对象）
 
## 补充说明
初版试水作品，欢迎试用。若有建议或 bug 欢迎提交 issue，一定积极修正 ：）

**欢迎各位加入QQ讨论群：[515348788](https://jq.qq.com/?_wv=1027&k=5ZGk07E) & [107927710](https://shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d) 。**

## 适配性
适配各平台最新版 Chrome 及 Safari 浏览器，适配 iOS Home Assistant 客户端。

## TODO
- 添加百度地图图层及卫星图层
- 同步 `zone` 信息，生成多个地理围栏

## 常见问题
**1. 打开地图空白或报错Failed to load resource: net::ERR_CONNECTION_REFUSED**   
请检查config.js配置中HA的路径(即HomeAssistantWebAPIUrl项)是否正确，建议使用相对路径"./../../.."。   
   
**2. 地图中不显示设备**   
请检查config.js配置中HA的访问密码(即HomeAssistantWebAPIPassword项)是否正确。   
可通过访问HA提供的API地址`https://HA的地址:8123/api/states/device_tracker.设备的ID?api_password=HA的访问密码`，来查看是否可以通过HA获取到设备信息。

**3. 地图和设备可以加载，但无设备状态和交通轨迹**
出现此问题一般是由于高德 API 申请时选错『服务平台』导致，注意请选择『web 端』，而不是 『web 服务』。

## 版本更新日志
### 0.0.3
1. 增加路径图示；
2. 支持新版授权机制。

### 0.0.2
1.修复设备列表中未勾选的成员依旧在"在家成员列表框"中显示的bug。   
2.优化代码逻辑，减少设备回家线路轨迹在地图上的刷新次数。   
### 0.0.1
1.增加对高德地图的支持：家标签及区域范围，交通态势，设备坐标，设备回家线路及预算时间，设备点聚合，在家成员列表框。   



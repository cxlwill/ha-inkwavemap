// HomeAssistant访问地址
// 支持相对路径(如:"./../../..")和绝对路径(如:"http://www.xxx.com:8123")
// !!! 注：非高级玩家请使用默认的相对路径，即"./../../.."，全部照搬，保留..，无需任何改动 !!!
HomeAssistantWebAPIUrl="./../../.."


// 高德API key
// 请至高德开放平台http://lbs.amap.com/获取
// (必填)
GaodeMapKey=""


// 永久Token(HomeAssistant 0.77.2版本以上时可用)
// HomeAssistant 0.77.2版本以后，HomeAssistant登录后如果未启用记住密码，墨澜地图将无法自行获取Token（配置了正确的LongTimeToken后可以正常使用）
// 获取方式见：https://bbs.hassbian.com/thread-4695-1-1.html
// (选填)
LongTimeToken=""



// 指定追踪设备ID（多个设备时用半角逗号做分隔“,”，如"xiaomi8_Self,iphoneX_Mother,iphone8"）
// 不指定时默认显示全部可追踪的设备
// (选填)
DeviceTrackerIDList=""



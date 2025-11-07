/**
 * GooglePlayMonitor.js
 * 功能：打开 Google Play，搜索应用并提取版本号
 * 使用方式：
 *    在 AutoJs6 中运行脚本
 *    修改变量 pkgName 为你要查询的包名（例如 com.whatsapp）
 */

// ========== 可配置参数 ==========
// 任务id
var globalTaskId = null;
// 想查询的包名
var pkgName = null;
// Google Play 包名
var googlePlayPkg = "com.android.vending"; 

// ========== 主逻辑 ==========
function main() {
    // 加载配置
    loadConfig();
    
    console.show();
    console.log("启动 Google Play 应用商店...");

    // 启动 Google Play
    app.launch(googlePlayPkg);
    sleep(5000);

    // 查找搜索按钮
    let searchIcon = text("搜索").findOne(5000);
    
    // 查找可点击区域
    let clickableRegion = searchIcon.parent();
    console.log("点击搜索按钮的可点击区域...");
    clickableRegion.click();
    sleep(2000);

    let searchBox = text("搜索应用和游戏").findOne(5000);
    let searchBoxParent = searchBox.parent();
    searchBoxParent.click();
    sleep(2000);
    
    // 输入包名
    console.log("输入包名: " + pkgName);
    let searchContent = className("android.widget.EditText").findOne(5000);
    searchContent.setText(pkgName);
    sleep(2000);

    console.log("执行输入法回车 imeEnter()");
    imeEnter();
    sleep(2000);

    let firstApp = className("android.view.View").clickable(true).findOne(5000);
    if (firstApp) {
        console.log("找到第一个应用卡片，准备点击...");
        firstApp.click();
    } else {
        console.error("未找到第一个搜索结果应用");
        reportResult(false, "未找到第一个搜索结果应用");
    }
    sleep(2000); 

    // 找到可滚动区域
    let scrollableArea = scrollable().findOne(5000);
    if (!scrollableArea) {
        console.error("未找到可滚动区域");
        reportResult(false, "未找到可滚动区域/游戏");
        return;
    }

    // 循环滚动查找文本
    let appDetail = null;
    // 最多滚动10次
    let maxScrollTimes = 10; 
    for (let i = 0; i < maxScrollTimes; i++) {
        appDetail = text("关于此应用").findOne(1000);
        if (!appDetail) {
            appDetail = textContains("关于此游戏").findOne(5000);
        }
        if (appDetail) {
            console.log("找到元素关于此应用/游戏");
            break;
        }
        // 向下滚动
        scrollableArea.scrollForward(); 
        sleep(500);
    }

    if (!appDetail) {
        console.error("未找到关于此应用/游戏");
        reportResult(false, "未找到关于此应用/游戏");
    } else {
        let appDetailParent = appDetail.parent();
        appDetailParent.click();
    }

    sleep(2000);

    // 查找 "版本"
    let versionLabel = id("0_resource_name_obfuscated").className("android.widget.TextView").text("版本").depth(21).findOne(5000);
    let versionLabelParent = versionLabel.parent();
    let versionText = versionLabelParent.child(1).text();
    console.log("应用版本号: " + versionText);
    reportResult(true, versionText);
}

function loadConfig() {
    try {
      if (typeof engines !== "undefined" && engines.myEngine && engines.myEngine().execArgv) {
        var execArgv = engines.myEngine().execArgv;
  
        if (execArgv && execArgv.task_id) {
          globalTaskId = execArgv.task_id;
        }
  
        if (execArgv && execArgv.template_params) {
          var config = execArgv.template_params;
          pkgName = config.getString("pkg_name");
          console.log("配置加载成功: pkgName = " + pkgName);
          return true;
        }
      }
      console.warn("获取pkgName配置失败");
      return false;
    } catch (error) {
      console.error("加载配置失败:", error);
      return false;
    }
  }

  function reportResult(isSuccess, message) {
    try {
        if (globalTaskId && typeof scriptUtils !== 'undefined' && scriptUtils.sendTaskResult) {
            var resultMap = {
                "status": isSuccess ? "success" : "failed",
                "result": message,
                "task_id": globalTaskId
            };
            
            console.log("上报结果:", resultMap);
            scriptUtils.reportLog(globalTaskId, JSON.stringify(resultMap));
        }
    } catch (e) {
        console.error("上报结果时出错:", e.message);
    }
}

// ========== 启动 ==========
main();

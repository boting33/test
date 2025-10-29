/**
 * GooglePlayMonitor.js
 * 功能：打开 Google Play，搜索应用并提取版本号
 * 使用方式：
 *    在 AutoJs6 中运行脚本
 *    修改变量 pkgName 为你要查询的包名（例如 com.whatsapp）
 */

// ========== 可配置参数 ==========
const pkgName = "com.roblox.client";  // 想查询的包名
const googlePlayPkg = "com.android.vending"; // Google Play 包名

// ========== 主逻辑 ==========
function main() {
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
    sleep(1000);

    console.log("执行输入法回车 imeEnter()");
    imeEnter();
    sleep(5000);

    let firstApp = className("android.view.View").clickable(true).findOne(8000);
    if (firstApp) {
        console.log("找到第一个应用卡片，准备点击...");
        firstApp.click();
    } else {
        console.error("未找到第一个搜索结果应用");
    }
    sleep(8000); 
    let appDetail = text("关于此应用").findOne(5000);
    if (!appDetail) {
        appDetail = text("关于此游戏").findOne(5000);
        console.log("appDetail: ");
        console.log(appDetail.toString());
    }
    appDetailParent = appDetail.parent();
    console.log("appDetailParent: ");
    console.log(appDetailParent.toString());
    appDetailParent.click();
    sleep(4000);

    // 查找 "版本"
    let versionLabel = id("0_resource_name_obfuscated").className("android.widget.TextView").text("版本").depth(21).findOne(5000);
    let versionLabelParent = versionLabel.parent();
    let versionText = versionLabelParent.child(1).text();
    console.log("应用版本号: " + versionText);
}

// ========== 启动 ==========
main();

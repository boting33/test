/**
 * GooglePlayMonitor.js
 * 功能：打开 Google Play，搜索应用并提取版本号
 * 使用方式：
 *    在 AutoJs6 中运行脚本
 *    修改变量 pkgName 为你要查询的包名（例如 com.whatsapp）
 */

// ========== 可配置参数 ==========
const pkgName = "com.whatsapp";  // 想查询的包名
const googlePlayPkg = "com.android.vending"; // Google Play 包名

// ========== 主逻辑 ==========
function main() {
    console.show();
    console.log("启动 Google Play 应用商店...");

    // 启动 Google Play
    app.launch(googlePlayPkg);
    sleep(5000);
    console.log("启动 Google Play 应用商店...");

    // 查找可点击区域（indexInParent(2)）
    let clickableRegion = text("搜索").indexInParent(2).findOne(5000);
    if (clickableRegion) {
        console.log("点击搜索按钮的可点击区域...");
        clickableRegion.click();
        sleep(2000);
    } else {
        console.error("未找到搜索按钮的可点击区域");
        return;
    }

    console.log("已找到搜索按钮");

    // 输入包名
    console.log("输入包名: " + pkgName);
    setText(pkgName);
    sleep(1000);
    press("enter");
    sleep(5000);

    // 查找“安装”或“更新”等按钮
    let appPage = textMatches(/Install|Open|Update/).findOne(10000);
    if (!appPage) {
        console.error("未找到应用页面，请检查包名是否正确。");
        return;
    }

    // 等待页面加载完成
    sleep(4000);

    // 查找“版本”或“Version”字段（部分设备显示为“App info”或“About this app”）
    let versionNode = textMatches(/Version|版本/).findOne(10000);
    if (versionNode) {
        let parent = versionNode.parent();
        if (parent && parent.childCount() > 1) {
            let versionText = parent.child(1).text();
            console.info("应用版本号: " + versionText);
            return;
        }
    }

    // 如果没找到“版本”字段，尝试直接匹配数字格式
    let versionCandidate = textMatches(/\d+\.\d+(\.\d+)?/).findOne(8000);
    if (versionCandidate) {
        console.info("推测的版本号: " + versionCandidate.text());
    } else {
        console.error("未能识别版本号，请确认页面结构。");
    }
}

// ========== 启动 ==========
main();

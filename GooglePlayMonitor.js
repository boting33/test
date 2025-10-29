// ==================== 配置部分 ====================

var globalConfig = {
    appPackageName: "com.whatsapp", // 要搜索的应用包名
    googlePlayPkg: "com.android.vending" // Google Play 包名
};

// ==================== 动态配置加载 ====================

/**
 * 向客户端上报执行结果
 * @param {boolean} isSuccess - 是否成功
 * @param {string} message - 结果信息
 */
function reportConfigResult(isSuccess, message) {
    try {
        console.log("上报配置结果:", isSuccess ? "成功" : "失败", message);
    } catch (e) {
        console.error("上报配置结果时出错:", e.message);
    }
}

// ==================== 启动 Google Play 并搜索应用 ====================

/**
 * 启动 Google Play 并搜索应用
 */
function startGooglePlaySearch() {
    console.log("=== 启动 Google Play 并搜索应用 ===");

    // 启动 Google Play
    if (!launchGooglePlay()) {
        console.error("启动 Google Play 失败");
        return false;
    }

    // 等待 Google Play 加载
    randomSleep(3000, 5000);

    // 搜索应用
    return searchAppInGooglePlay(globalConfig.appPackageName);
}

/**
 * 启动 Google Play 应用
 */
function launchGooglePlay() {
    var googlePlayPkg = globalConfig.googlePlayPkg;
    console.log("准备启动 Google Play...");

    try {
        app.launch(googlePlayPkg);
        sleep(3000);

        if (isGooglePlayInForeground()) {
            console.log("✓ Google Play 启动成功");
            sleep(3000); // 等待应用完全加载
            return true;
        } else {
            console.log("✗ Google Play 启动失败");
            return false;
        }
    } catch (error) {
        console.error("启动 Google Play 时发生错误:", error);
        return false;
    }
}

/**
 * 检查 Google Play 是否在前台
 */
function isGooglePlayInForeground() {
    try {
        return currentPackage() === globalConfig.googlePlayPkg;
    } catch (error) {
        console.error("检查 Google Play 是否在前台时出错:", error);
        return false;
    }
}

/**
 * 搜索 Google Play 中的应用
 * @param {string} appPackageName - 要搜索的应用包名
 * @returns {boolean} - 搜索是否成功
 */
function searchAppInGooglePlay(appPackageName) {
    try {
        console.log("开始搜索应用包名: " + appPackageName);

        // 查找搜索按钮
        var searchButton = findSearchButton();
        if (!searchButton) {
            console.log("✗ 搜索按钮未找到");
            return false;
        }

        if (!safeClick(searchButton, "搜索按钮")) {
            console.log("✗ 搜索按钮点击失败");
            return false;
        }

        // 等待搜索界面加载
        console.log("等待搜索界面加载...");
        sleep(2000);

        // 查找搜索输入框
        var searchInput = findSearchInput();
        if (!searchInput) {
            console.log("✗ 搜索输入框未找到");
            return false;
        }

        // 输入应用包名
        console.log("输入应用包名: " + appPackageName);
        if (!safeInput(searchInput, appPackageName, "搜索输入框")) {
            console.log("✗ 输入应用包名失败");
            return false;
        }

        // 执行搜索
        sleep(1000);
        key(66); // 按回车键执行搜索

        // 等待搜索结果加载
        randomSleep(2000, 4000);
        console.log("✓ 搜索完成");
        return true;

    } catch (error) {
        console.error("搜索操作失败:", error);
        return false;
    }
}

/**
 * 查找搜索按钮
 */
function findSearchButton() {
    var keyword = "搜索"; // Google Play 使用中文的搜索按钮
    console.log("查找搜索按钮，使用关键词: " + keyword);

    var element = descContains(keyword).findOne(3000);
    if (element) {
        console.log("✓ 找到搜索按钮");
        return element;
    } else {
        console.log("✗ 未找到搜索按钮");
        return null;
    }
}

/**
 * 查找搜索输入框
 */
function findSearchInput() {
    console.log("查找搜索输入框，使用 ID: fpa");

    try {
        var element = id("fpa").findOne(1000);
        if (element) {
            console.log("✓ 通过 ID 找到搜索输入框");
            return element;
        } else {
            // 备用方案：通过类名查找
            element = className("android.widget.EditText").findOne(1000);
            if (element) {
                console.log("✓ 通过 EditText 类名找到搜索输入框");
                return element;
            }
        }
    } catch (error) {
        console.log("✗ 搜索输入框查找失败: " + error.message);
    }

    console.warn("未找到搜索输入框");
    return null;
}

/**
 * 安全点击元素
 */
function safeClick(element, description) {
    description = description || "元素";
    try {
        if (element) {
            console.log("正在点击: " + description);
            element.click();
            randomSleep(500, 1500);
            return true;
        } else {
            console.warn(description + " 元素不存在");
            return false;
        }
    } catch (error) {
        console.error("点击 " + description + " 时发生错误:", error);
        return false;
    }
}

/**
 * 安全输入文本
 */
function safeInput(element, text, description) {
    description = description || "输入框";
    try {
        if (element && element.editable()) {
            console.log("正在输入到 " + description + ": " + text);
            element.setText(text);
            randomSleep(1000, 2000);
            return true;
        } else {
            console.warn(description + " 不可编辑或不存在");
            return false;
        }
    } catch (error) {
        console.error("输入到 " + description + " 时发生错误:", error);
        return false;
    }
}

/**
 * 随机等待指定时间范围
 */
function randomSleep(minMs, maxMs) {
    var sleepTime = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    console.log("随机等待 " + sleepTime + "ms");
    sleep(sleepTime);
}

// ==================== 主执行入口 ====================

/**
 * 执行主函数
 */
function main() {
    console.show();
    console.log("=== 启动 Google Play 搜索脚本 ===");

    if (startGooglePlaySearch()) {
        console.log("应用搜索完成");
    } else {
        console.log("应用搜索失败");
    }
}

// 执行主函数
main();

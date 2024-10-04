let experience = 0;
let money = 0;
let stamina = 100;
let jobLevel = 1;

let waterCount = 0;
let colaCount = 0;
let energyDrinkCount = 0;
let clickMultiplier = 1;

let autoIncomeInterval = null;

const experienceDisplay = document.getElementById("experience");
const moneyDisplay = document.getElementById("money");
const staminaDisplay = document.getElementById("stamina");
const jobLevelDisplay = document.getElementById("job-level");

const experienceMeter = document.getElementById("experience-meter");
const moneyMeter = document.getElementById("money-meter");
const staminaMeter = document.getElementById("stamina-meter");

const experienceIncrement = document.getElementById("experience-increment");
const moneyIncrement = document.getElementById("money-increment");
const staminaIncrement = document.getElementById("stamina-increment");

const workplaceImage = document.getElementById("workplace-image");
const jobImage = document.getElementById("job-image");
const logList = document.getElementById("log-list");

// 職場画像クリックイベント
workplaceImage.addEventListener("click", () => {
    if (stamina <= 0) {
        addLog("体力が0なので働けません。リセットするか体力を回復してください。", "red");
        showResetButton();
        return;
    }

    let expGain = 2 + (energyDrinkCount * 2);  // エナジードリンクの効果を反映
    let staminaLoss = 1;

    experience += expGain;
    stamina -= staminaLoss;

    checkMaxValues();

    // レベルアップのチェック
    checkLevelUp();

    // メーターの更新
    updateMeters();
    updateDisplay();

    // 増加の視覚的フィードバック
    showIncrement(experienceIncrement, `+${expGain}ex`);
    showIncrement(staminaIncrement, `-${staminaLoss}p`);

    // クエスト達成のチェック
    updateQuest();
});

// レベルアップのチェック関数
function checkLevelUp() {
    if (experience >= jobLevel * 10) {
        jobLevel++;
        addLog(`職業がレベル${jobLevel}に上がりました！`, "blue");
        updateDisplay();
    }
}

// デバッグ用：nojobのイラストをクリックで経験値、お金MAX、体力全回復
jobImage.addEventListener("click", () => {
    experience = 1000;
    money = 1000;
    stamina = getMaxStamina();  // 最大体力を反映
    addLog("デバッグモード: 経験値とお金が最大、体力が全回復しました。", "green");
    updateDisplay();
});

// リセットボタン表示
function showResetButton() {
    let resetButton = document.getElementById("reset-button");
    if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.id = "reset-button";
        resetButton.textContent = "リセット";
        resetButton.onclick = () => {
            if (confirm("経験値、お金がリセットされますがよろしいですか？\n※職業レベル、アイテム所持数、アイテムの効果、職業カードの所持状況などはリセットされません。")) {
                experience = 0;
                money = 0;
                stamina = 100; // リセット後、体力を100に戻す
                addLog("経験値とお金がリセットされました。体力が100pに回復しました。", "red");
                updateDisplay();
                resetButton.remove();
            }
        };
        logList.appendChild(resetButton);
    }
}

// アイテム購入イベント
document.getElementById("water-buy").addEventListener("click", () => {
    if (confirm("水を100円で1個買いますがよろしいですか？")) {
        if (money >= 100) {
            money -= 100;
            waterCount += 1;
            addLog("水を購入しました。お金が100円減りました");
            updateDisplay();
        } else {
            alert("お金が足りません！");
        }
    }
});

document.getElementById("cola-buy").addEventListener("click", () => {
    if (confirm("コーラを200円で1個買いますがよろしいですか？")) {
        if (money >= 200) {
            money -= 200;
            colaCount += 1;
            addLog("コーラを購入しました。お金が200円減りました");
            updateDisplay();
        } else {
            alert("お金が足りません！");
        }
    }
});

document.getElementById("energy-drink-buy").addEventListener("click", () => {
    if (confirm("栄養ドリンクを300円で1個買いますがよろしいですか？")) {
        if (money >= 300) {
            money -= 300;
            energyDrinkCount += 1;
            addLog("栄養ドリンクを購入しました。お金が300円減りました");
            updateDisplay();
        } else {
            alert("お金が足りません！");
        }
    }
});

// 自動アイテム使用
function autoUseItems() {
    if (stamina <= 0 && waterCount > 0) {
        stamina += 100;
        if (stamina > getMaxStamina()) stamina = getMaxStamina();
        waterCount -= 1;
        addLog("水を使用して体力が100p回復しました");
    }

    // コーラの効果: 体力最大値を上げる
    staminaMeter.max = getMaxStamina();

    // 栄養ドリンクの効果: クリック効果を2倍に
    clickMultiplier = 1 + energyDrinkCount * 2;
}

// ハローワークの転職ボタンイベント
document.getElementById("job-change").addEventListener("click", () => {
    if (experience >= 1000 && confirm("1000exを使ってフリーターに転職しますか？")) {
        experience -= 1000;
        jobImage.src = "images/jobs/free.png";
        jobLevelDisplay.textContent = "新米フリーター (レベル1)";
        document.getElementById("special-ability").textContent = "1秒ごとに自動で1クリック分の効果が発動";
        addLog("転職しました。フリーターに就きました", "blue");
        updateDisplay();
        startAutoIncome();

        // ハローワークに「無職」のオプションを追加
        const helloWork = document.getElementById("hello-work");
        if (!document.getElementById("job-change-nojob")) {
            const noJobItem = document.createElement("div");
            noJobItem.className = "job-item";
            noJobItem.innerHTML = `
                <img src="images/jobs/nojob.png" alt="無職" width="50" height="50">
                <p>職業名: 無職</p>
                <button id="job-change-nojob">無職に転職 (無料)</button>
            `;
            helloWork.appendChild(noJobItem);

            // 無職への転職ボタンイベント
            document.getElementById("job-change-nojob").addEventListener("click", () => {
                if (confirm("無職に転職しますか？")) {
                    jobImage.src = "images/jobs/nojob.png";
                    jobLevelDisplay.textContent = `新米無職 (レベル${jobLevel})`;
                    document.getElementById("special-ability").textContent = "他の職業がない場合、経験値2倍";
                    addLog("無職に転職しました", "blue");
                    clearInterval(autoIncomeInterval);
                    autoIncomeInterval = null;
                    updateDisplay();
                }
            });
        }
    } else if (experience < 1000) {
        alert("経験値が足りません！");
    }
});

// 自動収入機能（フリーター用）
function startAutoIncome() {
    if (autoIncomeInterval) clearInterval(autoIncomeInterval);
    autoIncomeInterval = setInterval(() => {
        experience += 1;
        money += 1;
        checkMaxValues();
        updateDisplay();
    }, 1000);
}

// 最大値をチェックする関数
function checkMaxValues() {
    if (experience > 1000) {
        experience = 1000;
        addLog("経験値が最大値を超えています", "red");
    }
    if (money > 1000) {
        money = 1000;
        addLog("お金が最大値を超えています", "red");
    }
    if (stamina > getMaxStamina()) {
        stamina = getMaxStamina();
        addLog("体力が最大値を超えています", "red");
    }
}

// 最大体力を計算する関数
function getMaxStamina() {
    return 100 + colaCount * 100;
}

// メーターの更新
function updateMeters() {
    experienceMeter.value = experience;
    moneyMeter.value = money;
    staminaMeter.value = stamina;

    // 体力メーターの色の変更
    staminaMeter.style.setProperty('background', 'none');
    staminaMeter.style.setProperty('color', stamina <= 10 ? 'red' : '#4caf50'); // 体力が10以下で赤色に
}

// 表示を更新する関数
function updateDisplay() {
    experienceDisplay.textContent = experience;
    moneyDisplay.textContent = money;
    staminaDisplay.textContent = stamina;

    document.getElementById("water-count").textContent = waterCount;
    document.getElementById("cola-count").textContent = colaCount;
    document.getElementById("energy-drink-count").textContent = energyDrinkCount;

    updateMeters();
}

// ログ追加関数
function addLog(text, color = "black") {
    const logItem = document.createElement("li");
    logItem.textContent = text;
    logItem.style.color = color;
    logList.appendChild(logItem);
    setTimeout(() => {
        logItem.style.opacity = 0;
        setTimeout(() => {
            logItem.remove();
        }, 1000);
    }, 5000);
}

// 増加の視覚的フィードバックを表示する関数
function showIncrement(element, text) {
    element.textContent = text;
    setTimeout(() => {
        element.textContent = '';
    }, 1000);
}

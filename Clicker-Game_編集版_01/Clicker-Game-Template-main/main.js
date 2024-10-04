let experience = 0;
let money = 0;
let stamina = 10;
let level = 1;
let job = "新米無職";
let clicks = 0;

const workplaceImage = document.getElementById("workplace-image");
const experienceDisplay = document.getElementById("experience");
const moneyDisplay = document.getElementById("money");
const staminaDisplay = document.getElementById("stamina");
const jobLevelDisplay = document.getElementById("job-level");
const questDisplay = document.getElementById("current-quest");
const rewardDisplay = document.getElementById("current-reward");

// 職場画像クリックイベント
workplaceImage.addEventListener("click", () => {
    if (stamina > 0) {
        let expGain = 1;

        // 他の職業がない場合、経験値が2倍
        if (job === "新米無職") {
            expGain *= 2;
        }

        experience += expGain;
        clicks += 1;

        // 20クリックごとに体力が減少
        if (clicks % 20 === 0) {
            stamina -= 1;
        }

        // 10クリックごとにレベルアップ
        if (experience >= level * 10) {
            level++;
            if (level > 100) {
                level = 1;
                if (job === "新米無職") {
                    job = "中堅無職";
                } else if (job === "中堅無職") {
                    job = "ベテラン無職";
                }
            }
        }

        updateQuest();
        updateDisplay();
    } else {
        alert("体力が足りません！アイテムショップで体力を回復しましょう。");
    }
});

// アイテム購入イベント
document.getElementById("water-drink").addEventListener("click", () => {
    if (money >= 100) {
        money -= 100;
        stamina += 10;
        updateDisplay();
    } else {
        alert("お金が足りません！");
    }
});

document.getElementById("cola-drink").addEventListener("click", () => {
    if (money >= 200) {
        money -= 200;
        stamina += 30;
        updateDisplay();
    } else {
        alert("お金が足りません！");
    }
});

document.getElementById("energy-drink").addEventListener("click", () => {
    if (money >= 300) {
        money -= 300;
        stamina += 60;
        updateDisplay();
    } else {
        alert("お金が足りません！");
    }
});

// クエストの更新
function updateQuest() {
    if (experience >= 100 && questDisplay.textContent === "経験値を100溜めよう！") {
        money += 100;
        alert("おめでとうございます！クエスト報酬を獲得しました！\n報酬: 100円");
        questDisplay.textContent = "次のクエスト: 続けて経験値を200溜めてみよう！";
        rewardDisplay.textContent = "200円";
    }
}

// 表示を更新する関数
function updateDisplay() {
    experienceDisplay.textContent = experience;
    moneyDisplay.textContent = money;
    staminaDisplay.textContent = stamina;
    jobLevelDisplay.textContent = `${job} (レベル${level})`;
}

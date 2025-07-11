const startButton = document.getElementById('startButton');
const dot = document.getElementById('dot');

// この数値を調整すると、頭の動きに対する点の動きの感度が変わります。
const SENSITIVITY = 4;

// 基準となるデバイスの向きを保存する変数
let baseOrientation = {
    alpha: null,
    beta: null,
    gamma: null
};

// iOS 13以降でセンサーの許可をリクエストする関数
function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    // ★★★ 許可が下りた後にリスナーを設定 ★★★
                    setupListeners();
                } else {
                    alert('センサーへのアクセスが許可されませんでした。');
                }
            })
            .catch(console.error);
    } else {
        // Androidなど、許可が不要なブラウザの場合
        setupListeners();
    }
}

// センサーのリスナーを設定し、UIを更新する関数
function setupListeners() {
    // 最初の向きを基準点として一度だけ取得するリスナー
    const setBaseOrientation = (event) => {
        // 最初の有効な値が来たら、それを基準として保存
        if (baseOrientation.alpha === null) {
            baseOrientation.alpha = event.alpha;
            baseOrientation.beta = event.beta;
            baseOrientation.gamma = event.gamma;
        }
        // 基準点が決まったら、常に動きをハンドルするリスナーに切り替える
        window.removeEventListener('deviceorientation', setBaseOrientation);
        window.addEventListener('deviceorientation', handleOrientation);
    };
    
    // まずは基準点を設定するためにリスナーを追加
    window.addEventListener('deviceorientation', setBaseOrientation);

    // 開始ボタンを非表示にし、点を表示
    startButton.style.display = 'none';
    dot.style.display = 'block';
}

// デバイスの向きが変化し続けるときに呼ばれる関数
function handleOrientation(event) {
    if (baseOrientation.alpha === null) return; // 基準点がまだなら何もしない

    // 動きの差分を計算
    const deltaBeta = event.beta - baseOrientation.beta;
    const deltaGamma = event.gamma - baseOrientation.gamma;

    // CSSのtransformを使って、傾きと反対方向に点を移動させる
    const moveX = -deltaGamma * SENSITIVITY;
    const moveY = -deltaBeta * SENSITIVITY;
    
    dot.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
}

// 開始ボタンがクリックされたときの処理
startButton.addEventListener('click', requestOrientationPermission);

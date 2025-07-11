const startButton = document.getElementById('startButton');
const dot = document.getElementById('dot');

// この数値を調整すると、頭の動きに対する点の動きの感度が変わります。
const SENSITIVITY = 4;

// 基準となるデバイスの向きを保存する変数
let baseOrientation = {
    alpha: 0,
    beta: 0,
    gamma: 0
};

// iOS 13以降でセンサーの許可をリクエストする関数
function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    // 許可されたら、向きのイベントリスナーを追加
                    window.addEventListener('deviceorientation', handleOrientation);
                    // 開始ボタンを非表示にし、点を表示
                    startButton.style.display = 'none';
                    dot.style.display = 'block';
                } else {
                    alert('センサーへのアクセスが許可されませんでした。');
                }
            })
            .catch(console.error);
    } else {
        // Androidなど、許可が不要なブラウザの場合
        window.addEventListener('deviceorientation', handleOrientation);
        startButton.style.display = 'none';
        dot.style.display = 'block';
    }
}

// デバイスの向きが変化したときに呼ばれる関数
function handleOrientation(event) {
    // 現在の傾きを取得 (alpha: Z軸, beta: X軸, gamma: Y軸)
    const { alpha, beta, gamma } = event;

    // 動きの差分を計算
    // beta: 前後の傾き, gamma: 左右の傾き
    const deltaBeta = beta - baseOrientation.beta;
    const deltaGamma = gamma - baseOrientation.gamma;

    // CSSのtransformを使って、傾きと反対方向に点を移動させる
    // translate(-50%, -50%) は、点の中心を座標の基点にするための初期設定
    const moveX = -deltaGamma * SENSITIVITY;
    const moveY = -deltaBeta * SENSITIVITY;
    
    dot.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
}

// 開始ボタンがクリックされたときの処理
startButton.addEventListener('click', () => {
    // センサーの許可を求める
    requestOrientationPermission();
    
    // 現在の向きを基準点として一度だけ取得する
    // これにより、どの向きで開始してもそこが「正面」になる
    const setBaseOrientation = (event) => {
        baseOrientation.alpha = event.alpha;
        baseOrientation.beta = event.beta;
        baseOrientation.gamma = event.gamma;
        // 一度取得したら、このイベントリスナーは不要なので削除する
        window.removeEventListener('deviceorientation', setBaseOrientation);
    };
    window.addEventListener('deviceorientation', setBaseOrientation);
});

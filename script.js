const startButton = document.getElementById('startButton');
const dataContainer = document.getElementById('data-container');

startButton.addEventListener('click', () => {
    // AbsoluteOrientationSensorが利用可能かチェック
    if (!('AbsoluteOrientationSensor' in window)) {
        dataContainer.textContent = 'エラー: このブラウザはAbsoluteOrientationSensorをサポートしていません。';
        return;
    }

    // --- センサーの権限を要求し、起動する ---
    // try-catchでユーザーが権限を拒否した場合やエラーに対応
    try {
        // センサーを60Hzで初期化
        const sensor = new AbsoluteOrientationSensor({ frequency: 60 });

        // センサーが読み取り値を返すたびに発火
        sensor.addEventListener('reading', () => {
            // クォータニオン（w, x, y, z）を取得
            const quaternion = sensor.quaternion;
            
            // クォータニオンをオイラー角（Pitch, Yaw, Roll）に変換
            const euler = toEulerAngles(quaternion);

            // データを画面に表示
            dataContainer.innerHTML = `
<b>クォータニオン:</b>
  W: ${quaternion[3].toFixed(3)}
  X: ${quaternion[0].toFixed(3)}
  Y: ${quaternion[1].toFixed(3)}
  Z: ${quaternion[2].toFixed(3)}

<b>オイラー角 (度):</b>
  Pitch (頭の上下): ${euler.pitch.toFixed(1)}°
  Yaw   (頭の左右): ${euler.yaw.toFixed(1)}°
  Roll  (頭の傾き): ${euler.roll.toFixed(1)}°
            `;
        });

        // センサーでエラーが発生した場合
        sensor.addEventListener('error', (event) => {
            if (event.error.name === 'NotAllowedError') {
                 dataContainer.textContent = 'エラー: センサーへのアクセスが許可されませんでした。';
            } else {
                 dataContainer.textContent = `エラー: ${event.error.name} - ${event.error.message}`;
            }
        });

        // センサーを開始
        sensor.start();
        startButton.disabled = true;
        startButton.textContent = 'トラッキング中...';

    } catch (error) {
        if (error.name === 'SecurityError') {
             dataContainer.textContent = 'エラー: センサーはHTTPS接続でのみ利用可能です。';
        } else {
             dataContainer.textContent = `エラー: ${error.name} - ${error.message}`;
        }
    }
});

/**
 * クォータニオンをオイラー角（ピッチ、ヨー、ロール）に変換する関数
 * @param {Array<number>} q クォータニオン [x, y, z, w]
 * @returns {object} {pitch, yaw, roll} 度数法のオブジェクト
 */
function toEulerAngles(q) {
    const [x, y, z, w] = q;

    // Roll (x-axis rotation)
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    // Pitch (y-axis rotation)
    const sinp = 2 * (w * y - z * x);
    let pitch;
    if (Math.abs(sinp) >= 1) {
        pitch = Math.copySign(Math.PI / 2, sinp); // use 90 degrees if out of range
    } else {
        pitch = Math.asin(sinp);
    }

    // Yaw (z-axis rotation)
    const siny_cosp = 2 * (w * z + x * y);
    const cosy_cosp = 1 - 2 * (y * y + z * z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    // ラジアンから度数法に変換して返す
    return {
        pitch: pitch * (180 / Math.PI),
        yaw: yaw * (180 / Math.PI),
        roll: roll * (180 / Math.PI)
    };
}

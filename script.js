const startButton = document.getElementById('startButton');
const dataContainer = document.getElementById('data-container');

// iOS 13以降のSafariでは、センサーイベントの許可を明確に要求する必要がある
function requestDeviceMotionEventPermission() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+ の Safari
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotionEvent);
                } else {
                    dataContainer.textContent = 'センサーへのアクセスが許可されませんでした。';
                }
            })
            .catch(console.error);
    } else {
        // iOS 13未満、またはAndroidなど他のブラウザ
        window.addEventListener('devicemotion', handleMotionEvent);
    }
}

function handleMotionEvent(event) {
    const rotation = event.rotationRate;
    const acceleration = event.accelerationIncludingGravity;

    // データを画面に表示
    dataContainer.innerHTML = `
<b>回転率 (ジャイロ):</b>
  alpha (Z軸周り): ${rotation.alpha ? rotation.alpha.toFixed(2) : 'n/a'}
  beta  (X軸周り): ${rotation.beta ? rotation.beta.toFixed(2) : 'n/a'}
  gamma (Y軸周り): ${rotation.gamma ? rotation.gamma.toFixed(2) : 'n/a'}

<b>重力込みの加速度:</b>
  X軸: ${acceleration.x ? acceleration.x.toFixed(2) : 'n/a'}
  Y軸: ${acceleration.y ? acceleration.y.toFixed(2) : 'n/a'}
  Z軸: ${acceleration.z ? acceleration.z.toFixed(2) : 'n/a'}
    `;
}

startButton.addEventListener('click', () => {
    dataContainer.textContent = 'トラッキングを開始します...';
    requestDeviceMotionEventPermission();
    startButton.disabled = true;
    startButton.textContent = 'トラッキング中...';
});

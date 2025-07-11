/**
 * 多層パーセプトロン（MLP）のコアロジック
 */
const MLP = {
    // 活性化関数: シグモイド関数
    sigmoid: (x) => 1 / (1 + Math.exp(-x)),

    // 2入力XORゲート用に学習済みの重みとバイアス
    // 隠れ層はNANDゲートとORゲートの役割を果たす
    weights: {
        // 入力層 -> 隠れ層 の重み
        hidden: [[-20, 20], [-20, 20]],
        // 隠れ層のバイアス
        hiddenBias: [30, -10],
        // 隠れ層 -> 出力層 の重み
        output: [20, 20],
        // 出力層のバイアス
        outputBias: -30,
    },

    /**
     * 順伝播計算を行い、2つの入力から出力を予測する
     * @param {number} input1 - 入力1 (0 or 1)
     * @param {number} input2 - 入力2 (0 or 1)
     * @returns {number} - 0または1に近い出力値
     */
    predict: function(input1, input2) {
        // 隠れ層の計算
        const hiddenLayerInput1 = input1 * this.weights.hidden[0][0] + input2 * this.weights.hidden[1][0] + this.weights.hiddenBias[0];
        const hiddenLayerOutput1 = this.sigmoid(hiddenLayerInput1); // NANDのような働き

        const hiddenLayerInput2 = input1 * this.weights.hidden[0][1] + input2 * this.weights.hidden[1][1] + this.weights.hiddenBias[1];
        const hiddenLayerOutput2 = this.sigmoid(hiddenLayerInput2); // ORのような働き

        // 出力層の計算
        const outputLayerInput = hiddenLayerOutput1 * this.weights.output[0] + hiddenLayerOutput2 * this.weights.output[1] + this.weights.outputBias;
        const output = this.sigmoid(outputLayerInput);

        return output;
    }
};

// DOM要素の取得
const inputs = [
    document.getElementById('bit1'),
    document.getElementById('bit2'),
    document.getElementById('bit3'),
    document.getElementById('bit4'),
];
const resultDiv = document.getElementById('result');

/**
 * 計算を実行し、結果を画面に表示する
 */
function calculateAndDisplay() {
    // チェックボックスの状態を 0 か 1 の数値に変換
    const inputValues = inputs.map(input => input.checked ? 1 : 0);

    // 4入力XORを計算 (2入力XORをカスケードで適用)
    // result1 = A XOR B
    let xorResult = MLP.predict(inputValues[0], inputValues[1]);
    // result2 = result1 XOR C
    xorResult = MLP.predict(xorResult, inputValues[2]);
    // finalResult = result2 XOR D
    xorResult = MLP.predict(xorResult, inputValues[3]);

    // 結果を 0 か 1 に丸める
    const finalXOR = Math.round(xorResult);
    // XNORはXORの否定
    const finalXNOR = 1 - finalXOR;

    // 結果をHTMLに表示
    resultDiv.innerHTML = `
        <div class="result-item">XOR : <span class="xor-val">${finalXOR}</span></div>
        <div class="result-item">XNOR: <span class="xnor-val">${finalXNOR}</span></div>
    `;
}

// 各入力チェックボックスに変更があった場合に計算を実行
inputs.forEach(input => {
    input.addEventListener('change', calculateAndDisplay);
});

// 初期表示のために一度計算を実行
window.addEventListener('load', calculateAndDisplay);
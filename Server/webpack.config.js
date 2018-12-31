var path = require('path');

module.exports = {
    entry: "../Client/src/index.jsx", // ������� ����� - �������� ����
    output: {
        path: path.resolve(__dirname, 'wwwroot/bundle/'),     // ���� � �������� �������� ������ - ����� public
        publicPath: '/',
        filename: "bundle.js"       // �������� ������������ �����
    },
    module: {
        rules: [   //��������� ��� js
            {
                test: /\.jsx?$/, // ���������� ��� ������
                exclude: /(node_modules)/,  // ��������� �� ��������� ����� node_modules
                loader: "babel-loader",   // ���������� ���������
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]    // ������������ �������
                }
            },
            {
                test: /\.png$/,
                loader: "url-loader?mimetype=image/png"
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
}
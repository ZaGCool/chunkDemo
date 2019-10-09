let path = require('path')
    // 引入一个插件 实现 html模版打包
let HtmlWebpackPlugin = require('html-webpack-plugin')
    // 引入一个清除插件
let { CleanWebpackPlugin } = require('clean-webpack-plugin')
    // 引入webpack下的一个插件
let Webpack = require('webpack')
    // 引入一个抽离css的插件
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
    // 引入css静态资源的压缩插件
let OptimzeCssPlugin = require('optimize-css-assets-webpack-plugin')
    // 为了处理优化项设置之后的js压缩问题 我们需要引入一个插件
let TerserWebpackPlugin = require('terser-webpack-plugin')

let VueLoaderPlugin = require('vue-loader/lib/plugin')


// 实现抽离公用代码和第三方模块
let PackageJson = require('./package.json')

module.exports = {
    // 设置打包的模式 开发模式 生产模式（打包代码会压缩）
    mode: 'production',
    // 指定一个入口文件
    entry: {
        bundle: './src/index.js',
        common: Object.keys(PackageJson.dependencies)
    },
    // 配置出口文件  路径规定必须是一个绝对路径
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    // 设置一个优化选项 实现 抽离的css在生产模式下的 压缩
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common'
        },
        minimizer: [
            new OptimzeCssPlugin({}),
            new TerserWebpackPlugin({})
        ]
    },
    // watch: true, // 实时变化 打包文件
    // watchOptions: {
    //     poll: 1000, // 每1000ms监控文件一次 看是否有变动
    //     aggregateTimeout: 500, // 500ms 第一次文件变化到下一次文件重建之间添加一个延迟
    //     ignored: /node_modules/
    // },
    // 增加这个选项 会增大打包体积 （产生很多映射文件）
    // devtool: 'eval-source-map', // 源码映射文件 不会单独产生文件 方便查看和调试错误
    // 配置loader 使用module
    module: {
        noParse: /jquery/, // 可以不去解析jquery包的依赖库
        // 配置规则
        rules: [
            // 配置处理css的loader
            // 引入css文件 除了js文件之外 的其他类型文件 webpack默认不支持打包
            // 则需要引入对应的loader加载器去实现 打包
            // css文件的打包 则需要使用css-loader(解析css语法的处理 css中的@import 以及url 识别之后通过import/require引入其他相关资源)) 
            // style-loader 负责将css语法 通过style标签引入页面中
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
            },
            // 处理less
            // 需要安装 less 解析less语法  需要less-loader 实现webpack的打包
            {
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            // 处理sass
            // sass-loader  node-sass
            {
                test: /\.scss$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            // 处理图片
            // file-loader 默认会生成打包好的图片到 dist目录下
            // 生成的图片的名称 是图片的hash值
            // 避免了多个名字重复导致冲突
            // 实现了 相同的图片 名字的同一映射管理

            // css样式中的 url() 会通过css-loader 转换为 require('./images/1.gif')
            // 然后通过file-loader进行处理
            // 一般我们会使用另一个url-loader来处理图片资源
            // url-loader会处理

            // 如果是网页页面中的图片 如何进行处理呢？
            // <img src="" />  html-withimg-loader
            {
                test: /\.(png|gif|jpe?g)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 限制 如果文件超出了这个大小 则 会有单独的资源打包 否则 会将图片资源转换为base64
                        // 格式 嵌入到 页面中
                        limit: 1024 * 20,
                        outputPath: '/img/'
                    }
                }]
            },
            // 处理图标字体和 处理图片资源一样 需要 url-loader
            {
                test: /\.(eot|svg|ttf|woff2?|otf)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 1024 * 20,
                        outputPath: '/fonts/'
                    }
                }]
            },
            // 处理html文件中的图片
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            // 配置处理es6+高级语法
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            "@babel/preset-env"
                        ],
                        plugins: [
                            // 装饰器语法  以及 类属性语法的编译
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }]
                        ]
                    }
                }]
            },
            //  处理vue单文件组件
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }

        ]
    },
    // 配置webpack的本地服务器
    devServer: {
        // 启动目录
        contentBase: path.join(__dirname, 'dist'),
        progress: true, // 显示打包过程
        // 端口
        port: 9999,
        // 自动打开浏览器
        // open: true,
        hot: true // 开启热更新  同时需要加载一个插件
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true, // 删除属性的双引号
                collapseWhitespace: true // 合并多余空格
            }
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.[hash:8].css'
        }),
        new Webpack.BannerPlugin("make 2019 by zag"),
        new VueLoaderPlugin(),
        new Webpack.IgnorePlugin(/\.\/locale/, /moment/)
    ],
    externals: {
        jquery: "$"
    },
    resolve: {
        extensions: [".js", ".css", ".json", ".vue"], // 设置扩展名的查找规则
        // 设置别名 比如bootstarp 简写
        alias: {
            "bootstrap": "bootstrap/dist/css/bootstrap.css",

        }
    }


}
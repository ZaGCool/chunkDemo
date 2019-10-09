import moment from "moment"
// 定义好一个全局的过滤器 时间日期的过滤器
export function dataFilter(input, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(input).format(format);
}
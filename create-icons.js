// 创建插件图标的脚本
const fs = require('fs');
const path = require('path');

// 创建16x16图标
const icon16 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" fill="#FF6600"/>
<path d="M4 2H2V4H8V6H10V4H14V6H12V8H10V10H8V12H6V10H4V8H2V6H4V2Z" fill="white"/>
<path d="M6 6H8V8H6V6Z" fill="white"/>
<path d="M10 6H12V8H10V6Z" fill="white"/>
<path d="M6 10H8V12H6V10Z" fill="white"/>
<path d="M10 10H12V12H10V10Z" fill="white"/>
</svg>`;

// 创建48x48图标
const icon48 = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" fill="#FF6600"/>
<path d="M12 6H6V12H24V18H30V12H42V18H36V24H30V30H24V36H18V30H12V24H6V18H12V6Z" fill="white"/>
<path d="M18 18H24V24H18V18Z" fill="white"/>
<path d="M30 18H36V24H30V18Z" fill="white"/>
<path d="M18 30H24V36H18V30Z" fill="white"/>
<path d="M30 30H36V36H30V30Z" fill="white"/>
</svg>`;

// 创建128x128图标
const icon128 = `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="128" height="128" fill="#FF6600"/>
<path d="M32 16H16V32H64V48H80V32H112V48H96V64H80V80H64V96H48V80H32V64H16V48H32V16Z" fill="white"/>
<path d="M48 48H64V64H48V48Z" fill="white"/>
<path d="M80 48H96V64H80V48Z" fill="white"/>
<path d="M48 80H64V96H48V80Z" fill="white"/>
<path d="M80 80H96V96H80V80Z" fill="white"/>
</svg>`;

// 保存图标文件
fs.writeFileSync('icon16.png', icon16);
fs.writeFileSync('icon48.png', icon48);
fs.writeFileSync('icon128.png', icon128);

console.log('图标文件创建完成！');
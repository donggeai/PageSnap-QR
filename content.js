// 码上看Chrome插件 - 内容脚本
(function() {
    'use strict';

    // 等待QRCode库加载
    function waitForQRCode() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50; // 5秒超时
            
            const checkQRCode = () => {
                attempts++;
                if (typeof QRCode !== 'undefined') {
                    resolve(true);
                } else if (attempts < maxAttempts) {
                    setTimeout(checkQRCode, 100);
                } else {
                    console.error('QRCode库加载超时');
                    resolve(false);
                }
            };
            
            checkQRCode();
        });
    }

    // 获取网站图标
    function getFavicon() {
        const favicon = document.querySelector('link[rel*="icon"]');
        if (favicon && favicon.href) {
            return favicon.href;
        }
        
        // 默认二维码图标
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRkY2NjAwIi8+CjxwYXRoIGQ9Ik0xMCA4SDhWMTBIMTZWMTJIMThWMTRIMjJWMTJIMjBWMTBIMThWOEgxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxMkgyMFYxNEgxMlYxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiAxNkgyMFYxOEgxNlYxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
    }

    // 获取网站名称
    function getSiteName() {
        const ogSiteName = document.querySelector('meta[property="og:site_name"]');
        if (ogSiteName && ogSiteName.content) {
            return ogSiteName.content;
        }
        
        return window.location.hostname.replace('www.', '');
    }

    // 获取页面标题（限制10个字）
    function getPageTitle() {
        let title = document.title || '无标题';
        if (title.length > 10) {
            title = title.substring(0, 10) + '...';
        }
        return title;
    }

    // 创建右下角LOGO图标
    function createTriggerButton() {
        const trigger = document.createElement('div');
        trigger.className = 'qrcode-trigger';
        trigger.id = 'qrcode-trigger';
        trigger.innerHTML = '<img src="' + getFavicon() + '" alt="二维码" style="width:30px;height:30px;border-radius:50%;">';
        
        document.body.appendChild(trigger);
        return trigger;
    }

    // 创建二维码弹窗
    function createQRCodePopup() {
        const popup = document.createElement('div');
        popup.className = 'qrcode-popup';
        popup.id = 'qrcode-popup';
        
        popup.innerHTML = `
            <button class="qrcode-close" id="qrcode-close" style="position:absolute;top:10px;right:10px;width:20px;height:20px;background:#f0f0f0;border:none;border-radius:50%;cursor:pointer;">×</button>
            <div class="qrcode-container" style="position:relative;width:256px;height:256px;margin-bottom:15px;">
                <div id="qrcode-canvas"></div>
                <div class="qrcode-logo" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;background:white;border-radius:50%;padding:5px;box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                    <img src="${getFavicon()}" alt="网站图标" style="width:100%;height:100%;border-radius:50%;" />
                </div>
            </div>
            <div class="site-info" style="text-align:center;">
                <div class="site-name" style="font-size:14px;font-weight:bold;color:#333;margin-bottom:5px;">${getSiteName()}</div>
                <div class="page-title" style="font-size:12px;color:#666;margin-bottom:10px;">${getPageTitle()}</div>
                <div class="developer-info" style="font-size:10px;color:#999;border-top:1px solid #eee;padding-top:8px;margin-top:8px;">
                    <div>开发者公众号：东哥说AI</div>
                    <div>开发者微信：donggeai02</div>
                    <div>咨询交流：关注公众号获取更多AI工具和插件</div>
                    <div>技术支持：添加微信交流使用心得和技术问题</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        return popup;
    }

    // 生成二维码
    async function generateQRCode() {
        const qrcodeContainer = document.getElementById('qrcode-canvas');
        if (!qrcodeContainer) return;
        
        // 清除之前的二维码
        qrcodeContainer.innerHTML = '';
        
        // 等待QRCode库加载
        const qrCodeLoaded = await waitForQRCode();
        if (!qrCodeLoaded) {
            qrcodeContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">二维码库加载失败</div>';
            return;
        }
        
        // 创建二维码
        try {
            new QRCode(qrcodeContainer, {
                text: window.location.href,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('生成二维码失败:', error);
            qrcodeContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">二维码生成失败</div>';
        }
    }

    // 显示/隐藏二维码弹窗
    function toggleQRCodePopup() {
        const popup = document.getElementById('qrcode-popup');
        if (!popup) return;
        
        if (popup.classList.contains('show')) {
            popup.classList.remove('show');
            popup.style.display = 'none';
        } else {
            popup.classList.add('show');
            popup.style.display = 'flex';
            generateQRCode();
        }
    }

    // 初始化插件
    async function init() {
        // 避免重复初始化
        if (document.getElementById('qrcode-trigger')) {
            return;
        }
        
        console.log('码上看插件初始化...');
        
        // 创建触发按钮和弹窗
        const trigger = createTriggerButton();
        const popup = createQRCodePopup();
        
        // 设置样式
        trigger.style.cssText = 'position:fixed;bottom:20px;right:20px;width:50px;height:50px;background:#fff;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.2);cursor:pointer;z-index:999999;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;';
        popup.style.cssText = 'position:fixed;bottom:80px;right:20px;width:306px;background:white;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.15);padding:25px;z-index:999998;display:none;flex-direction:column;align-items:center;';
        
        // 绑定事件
        trigger.addEventListener('click', toggleQRCodePopup);
        
        const closeBtn = document.getElementById('qrcode-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleQRCodePopup);
        }
        
        // 点击弹窗外部关闭弹窗
        document.addEventListener('click', function(event) {
            const popup = document.getElementById('qrcode-popup');
            const trigger = document.getElementById('qrcode-trigger');
            
            if (popup && popup.classList.contains('show') && 
                !popup.contains(event.target) && 
                !trigger.contains(event.target)) {
                popup.classList.remove('show');
                popup.style.display = 'none';
            }
        });
        
        // ESC键关闭弹窗
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const popup = document.getElementById('qrcode-popup');
                if (popup && popup.classList.contains('show')) {
                    popup.classList.remove('show');
                    popup.style.display = 'none';
                }
            }
        });
        
        console.log('码上看插件初始化完成');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
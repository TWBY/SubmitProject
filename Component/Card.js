// Card.js
// 優化版本的 Gallery Card Web Component

class GalleryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isRendered = false;
    this._isIntersecting = false;
    
    // 綁定方法以確保正確的 this 上下文
    this._handleIntersection = this._handleIntersection.bind(this);
    this._handleIframeLoad = this._handleIframeLoad.bind(this);
    this._handleIframeError = this._handleIframeError.bind(this);
  }

  static get observedAttributes() {
    return ['name', 'brief', 'link', 'loading', 'index'];
  }

  connectedCallback() {
    this._setupIntersectionObserver();
    this._setupClickHandler();
    this.render();
  }

  disconnectedCallback() {
    // 清理資源
    if (this._observer) {
      this._observer.disconnect();
    }
    if (this._clickHandler) {
      this.removeEventListener('click', this._clickHandler);
    }
    if (this._keyHandler) {
      this.removeEventListener('keydown', this._keyHandler);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._isRendered) {
      this.render();
    }
  }

  // 設置 Intersection Observer 進行懶加載
  _setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this._observer = new IntersectionObserver(
        this._handleIntersection,
        { rootMargin: '50px' }
      );
      this._observer.observe(this);
    } else {
      // 舊瀏覽器降級處理
      this._isIntersecting = true;
    }
  }

  // 設置點擊處理器
  _setupClickHandler() {
    this._clickHandler = (event) => {
      const link = this.getAttribute('link');
      if (link && this._isValidUrl(link)) {
        // 如果點擊的是 iframe 或其他互動元素，不處理點擊
        if (event.target.tagName === 'IFRAME' ||
            event.target.closest('iframe') ||
            event.target.closest('.card-preview')) {
          return;
        }
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    };

    // 處理鍵盤導航
    this._keyHandler = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this._clickHandler(event);
      }
    };

    this.addEventListener('click', this._clickHandler);
    this.addEventListener('keydown', this._keyHandler);
  }

  _handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this._isIntersecting) {
        this._isIntersecting = true;
        this._loadIframe();
        this._observer.unobserve(this);
      }
    });
  }

  _loadIframe() {
    const iframe = this.shadowRoot.querySelector('iframe');
    const link = this.getAttribute('link');
    
    if (iframe && link && !iframe.src) {
      iframe.src = link;
    }
  }

  _handleIframeLoad() {
    const loadingDiv = this.shadowRoot.querySelector('.iframe-loading');
    const iframe = this.shadowRoot.querySelector('iframe');
    
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
    if (iframe) {
      iframe.style.opacity = '1';
    }
  }

  _handleIframeError() {
    const loadingDiv = this.shadowRoot.querySelector('.iframe-loading');
    const errorDiv = this.shadowRoot.querySelector('.iframe-error');
    
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
    if (errorDiv) {
      errorDiv.style.display = 'flex';
    }
  }

  _sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  _isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  render() {
    const name = this._sanitizeInput(this.getAttribute('name') || '未命名作品');
    const brief = this._sanitizeInput(this.getAttribute('brief') || '暫無簡介');
    const link = this.getAttribute('link') || '';
    const loading = this.getAttribute('loading') || 'lazy';
    const index = this.getAttribute('index') || '1';
    const isValidLink = this._isValidUrl(link);
    
    // 格式化標題，包含序號
    const formattedTitle = `${index}. ${name}`;

        this.shadowRoot.innerHTML = `
      <style>
        /* 直接定義顏色值，避免 CSS 變數問題 */

        :host {
          display: block;
          margin-bottom: 24px;
        }

        .card {
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          width: 100%;
          border: 1px solid #E0E0E0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          container-type: inline-size;
          ${isValidLink ? 'cursor: pointer;' : 'cursor: default;'}
        }


                ${isValidLink ? `
        .card:hover {
          box-shadow: 0 4px 16px rgba(1, 132, 255, 0.2);
        }
        ` : ''}

        .card-header {
          /* 移除固定高度，讓標題高度自適應 */
          padding: 32px 24px 0px 24px; /* 上方 32px，下方 0px */
          /* border-bottom: 1px solid #40444b; */
        }

        .card-title {
          font-size: clamp(20px, 4.2cqi, 28px);
          font-weight: 700;
          color: #000000;
          margin: 0;
          line-height: 1.2; /* 稍微減少行高 */
          overflow: hidden;
          white-space: nowrap; /* 確保只有一行 */
          text-overflow: ellipsis; /* 長文字顯示省略號 */
        }

        .card-brief {
          font-size: 14px;
          color: #666666;
          margin: 0;
          line-height: 1.5;
          padding: 16px 24px 8px 24px; /* 減少下方 padding 從 16px 到 8px */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          height: calc(1.5em * 3); /* 三行高度 */
          max-height: calc(1.5em * 3);
        }

        .card-preview {
          position: relative;
          height: clamp(200px, 35vw, 300px);
          background: #F1F3F4;
          overflow: hidden;
          border-radius: 0 0 16px 16px;
        }

        /* 作品預覽區域的 hover 覆蓋層 */
        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
          pointer-events: none; /* 不阻擋點擊事件 */
        }

        .preview-text {
          background: #FFD700;
          color: #000000;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        ${isValidLink ? `
        .card-preview:hover .preview-overlay {
          opacity: 1;
        }
        ` : ''}

        .card-preview iframe {
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none; /* 禁止 iframe 互動與滾動 */
        }

        .iframe-loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F1F3F4;
          color: #666666;
          font-size: 14px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #E0E0E0;
          border-top: 3px solid #0184ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .iframe-error {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F1F3F4;
          color: #999999;
          font-size: 14px;
          text-align: center;
          padding: 20px;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.6;
        }



        /* 響應式設計 */
        @media (max-width: 480px) {
          .card {
            margin: 0;
            width: 100%;
            box-sizing: border-box;
          }

          .card-header {
            padding: 24px 20px 0px;
            flex-direction: column; /* 手機版改為垂直排列 */
            align-items: flex-start;
            gap: 2px;
            height: auto; /* 手機版高度自適應 */
            /* 移除最小高度，讓標題高度完全自適應 */
          }

          .card-title {
            font-size: clamp(18px, 6vw, 22px);
            width: 100%;
            overflow: hidden;
            white-space: nowrap; /* 手機版也只有一行 */
            text-overflow: ellipsis; /* 長文字顯示省略號 */
          }

          .card-preview {
            height: clamp(180px, 42vw, 240px);
          }

          .preview-text {
            font-size: 13px;
            padding: 10px 16px;
          }

          .card-brief {
            padding: 12px 16px 6px 16px; /* 減少下方 padding 從 12px 到 6px */
          }
        }

        /* 無障礙設計 */
        @media (prefers-reduced-motion: reduce) {
          .card,
          .card-preview iframe {
            transition: none;
          }

          .loading-spinner {
            animation: none;
          }
        }

        /* 高對比模式 */
        @media (prefers-contrast: high) {
          .card {
            border: 2px solid #ffffff;
          }

          .card-header {
            border-bottom-color: #ffffff;
          }

          .card-title {
            color: #ffffff;
          }

          .card-link {
            background: #0066cc;
            border: 2px solid #ffffff;
          }
        }

        /* 暗色主題優化 - 移除，因為現在使用藍色主題 */
      </style>

      <article class="card" role="button" tabindex="0" aria-label="點擊前往作品 ${name}">
        <header class="card-header">
          <h2 class="card-title">${formattedTitle}</h2>
        </header>
        <p class="card-brief">${brief}</p>
        
        <div class="card-preview">
          ${isValidLink ? `
            <iframe
              ${loading === 'eager' || this._isIntersecting ? `src="${link}"` : ''}
              title="作品預覽 - ${name}"
              loading="${loading}"
              allowfullscreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
            <div class="iframe-loading">
              <div class="loading-spinner"></div>
              <div>載入預覽中...</div>
            </div>
            <div class="iframe-error">
              <div class="error-icon">⚠️</div>
              <div>
                <div>無法載入預覽</div>
                <div style="font-size: 12px; margin-top: 4px; opacity: 0.7;">
                  請點擊下方按鈕直接訪問
                </div>
              </div>
            </div>
            <div class="preview-overlay">
              <div class="preview-text">前往作品</div>
            </div>
          ` : `
            <div class="iframe-error" style="display: flex;">
              <div class="error-icon">🔗</div>
              <div>
                <div>無效的連結地址</div>
                <div style="font-size: 12px; margin-top: 4px; opacity: 0.7;">
                  請檢查連結是否正確
                </div>
              </div>
            </div>
          `}
        </div>
      </article>
    `;

    // 設置事件監聽器
    if (isValidLink) {
      const iframe = this.shadowRoot.querySelector('iframe');
      if (iframe) {
        iframe.addEventListener('load', this._handleIframeLoad);
        iframe.addEventListener('error', this._handleIframeError);
        
        // 如果是即時載入或已經在視窗中，直接載入
        if (loading === 'eager' || this._isIntersecting) {
          this._loadIframe();
        }
      }
    }

    this._isRendered = true;
  }

  // 公開方法供外部調用
  refresh() {
    this.render();
  }

  loadContent() {
    this._isIntersecting = true;
    this._loadIframe();
  }
}

// 定義自定義元素
customElements.define('gallery-card', GalleryCard);

// 導出類別以供其他模組使用
export default GalleryCard;
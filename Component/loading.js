class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        /* Brickverse 品牌顏色系統 */
        :host {
          --primary-blue: #0184ff;
          --primary-blue-light: #33a1ff;
          --primary-blue-dark: #0066cc;
          --accent-yellow: #FAD75A;
          --accent-yellow-light: #fbe485;
          --accent-yellow-dark: #f8ca2b;
          --text-primary: #000000;
          --text-secondary: #666666;
          --text-tertiary: #999999;
          --background-primary: #FFFFFF;
          --background-secondary: #F8F9FA;
          --background-tertiary: #F1F3F4;
          --border-color: #E0E0E0;
          --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.08);
          --shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.12);
          --shadow-heavy: 0 8px 24px rgba(0, 0, 0, 0.16);
          --shadow-blue: 0 4px 16px rgba(1, 132, 255, 0.2);
          --shadow-yellow: 0 4px 16px rgba(250, 215, 90, 0.3);
          --radius-small: 8px;
          --radius-medium: 12px;
          --radius-large: 16px;
          --radius-xl: 20px;
        }
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          background: rgba(248, 249, 250, 0.95);
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .spinner {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, var(--primary-blue-light) 0%, var(--primary-blue) 55%, var(--primary-blue-dark) 100%);
          box-shadow:
            0 0 0 0 rgba(1, 132, 255, 0.45),
            0 0 22px rgba(1, 132, 255, 0.35) inset;
          animation: breathe 1.6s ease-in-out infinite;
          margin-bottom: 16px;
        }
        @keyframes breathe {
          0% {
            transform: scale(0.9);
            box-shadow:
              0 0 0 0 rgba(1, 132, 255, 0.45),
              0 0 22px rgba(1, 132, 255, 0.35) inset;
            filter: blur(0px);
          }
          50% {
            transform: scale(1.15);
            box-shadow:
              0 0 28px 8px rgba(1, 132, 255, 0.28),
              0 0 32px rgba(1, 132, 255, 0.5) inset;
            filter: blur(0.2px);
          }
          100% {
            transform: scale(0.9);
            box-shadow:
              0 0 0 0 rgba(1, 132, 255, 0.45),
              0 0 22px rgba(1, 132, 255, 0.35) inset;
            filter: blur(0px);
          }
        }
        .loading-text {
          text-align: center;
          font-size: 1.1em;
          color: var(--text-primary);
          letter-spacing: 0.1em;
          font-family: inherit;
        }
      </style>
      <div class="loading-container">
        <div class="spinner"></div>
        <div class="loading-text">作品載入中</div>
      </div>
    `;
  }
}

customElements.define('loading-spinner', LoadingSpinner); 
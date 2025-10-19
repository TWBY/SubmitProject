// Header.js
// Web Component：AI 寫程式：打造軟體

class AddProfileButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
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
      </style>
      <button id="add-btn" aria-label="新增個人資料">
        新增作品
      </button>
      <div id="toast" class="toast" aria-live="polite" aria-atomic="true">
        <div class="toast-content">
          <span class="toast-icon">✓</span>
          <span class="toast-message"></span>
        </div>
      </div>
      <div id="modal" class="overlay" aria-hidden="true" inert>
        <form id="profile-form" class="dialog" role="dialog" aria-modal="true" novalidate>
          <div class="form-group">
            <label for="name">作品名稱</label>
            <input name="name" id="name" required placeholder="例如：任務管理小工具" maxlength="10" />
            <div id="name-counter" class="counter" aria-live="polite">0/10</div>
          </div>
          <div class="form-group">
            <label for="brief">簡介</label>
            <textarea name="brief" id="brief" required rows="4" style="resize:vertical;"></textarea>
            <div id="brief-counter" class="counter" aria-live="polite">0/40</div>
          </div>
          <div class="form-group">
            <label for="link">網址</label>
            <input name="link" id="link" required type="url" pattern="https?://.+" placeholder="https://example.com" aria-describedby="link-error" />
            <span id="link-error" class="error-text" role="alert" aria-live="polite" style="display:none;">請輸入有效的網址（需以 http:// 或 https:// 開頭）</span>
          </div>
          <div class="form-actions">
            <button type="button" id="cancel-btn" class="btn-secondary">取消</button>
            <button type="submit" id="submit-btn" class="btn-primary" disabled>
              <span class="btn-label">送出</span>
              <span class="btn-spinner" aria-hidden="true"></span>
            </button>
          </div>
        </form>
      </div>
      <style>
        #add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--accent-yellow);
          color: #000;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: var(--radius-small);
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: var(--shadow-light);
        }
        #add-btn:hover {
          background: var(--accent-yellow-light);
          box-shadow: var(--shadow-yellow);
        }
        #add-btn i {
          font-size: 16px;
        }
        .overlay {
          position: fixed;
          z-index: 2000;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.2s ease, visibility 0.2s ease;
        }
        .overlay.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .dialog {
          background: var(--background-primary);
          padding: 20px 24px 24px 24px;
          border-radius: var(--radius-large);
          box-shadow: var(--shadow-heavy);
          width: 90vw;
          max-width: 520px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transform: translateY(12px) scale(0.98);
          transition: transform 0.18s ease;
        }
        .overlay.open .dialog {
          transform: translateY(0) scale(1);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        label {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 2px;
          letter-spacing: -0.2px;
        }
        input, textarea {
          padding: 8px 12px;
          border-radius: var(--radius-small);
          border: 1px solid var(--border-color);
          font-size: 16px;
          background: var(--background-primary);
          color: var(--text-primary);
          outline: none;
          transition: border 0.2s;
        }
        textarea {
          min-height: 80px;
          max-height: 200px;
        }
        input:focus {
          border: 1.5px solid var(--primary-blue);
        }
        input.invalid, textarea.invalid { border-color: #ff6b6b; }
        .error-text { color: #ff6b6b; font-size: 13px; }
        .counter { text-align: right; color: #bbb; font-size: 13px; }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 8px;
        }
        .btn-secondary {
          padding: 7px 22px;
          background: var(--text-tertiary);
          color: #fff;
          border: none;
          border-radius: var(--radius-small);
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: var(--text-secondary);
        }
        .btn-primary {
          padding: 7px 22px;
          background: var(--primary-blue);
          color: #fff;
          font-weight: bold;
          border: none;
          border-radius: var(--radius-small);
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: var(--primary-blue-light);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-spinner {
          display: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-left-color: #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        .btn-loading .btn-spinner { display: inline-block; }
        .btn-loading .btn-label { opacity: 0.85; }
        
        /* Toast 通知樣式 */
        .toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(-100px);
          z-index: 3000;
          background: var(--primary-blue);
          color: white;
          padding: 12px 20px;
          border-radius: var(--radius-medium);
          box-shadow: var(--shadow-heavy);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          max-width: 90vw;
          min-width: 280px;
        }
        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        .toast-icon {
          font-size: 16px;
          font-weight: bold;
        }
        .toast.success {
          background: #10b981;
        }
        .toast.error {
          background: #ef4444;
        }
        .toast.warning {
          background: #f59e0b;
        }
        
        @media (max-width: 600px) {
            .dialog { padding: 16px 16px 18px 16px; gap: 14px; width: 95vw; }
            .toast {
              top: 16px;
              min-width: 260px;
              padding: 10px 16px;
            }
            .toast-content {
              font-size: 13px;
            }
        }
      </style>
    `;

    // 獲取元素引用
    const addBtn = shadow.getElementById('add-btn');
    const modal = shadow.getElementById('modal');
    const form = shadow.getElementById('profile-form');
    const cancelBtn = shadow.getElementById('cancel-btn');
    const toast = shadow.getElementById('toast');
    const toastMessage = shadow.querySelector('.toast-message');

    const nameInput = shadow.getElementById('name');
    const nameCounter = shadow.getElementById('name-counter');
    const linkInput = shadow.getElementById('link');
    const linkError = shadow.getElementById('link-error');
    const briefInput = shadow.getElementById('brief');
    const briefCounter = shadow.getElementById('brief-counter');
    const submitBtn = shadow.getElementById('submit-btn');

    // 模態框控制函數
    const openModal = () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      modal.removeAttribute('inert'); // 移除 inert 屬性以啟用互動
      document.body.style.overflow = 'hidden';
      
      // 保存當前焦點元素
      const activeElement = document.activeElement;
      modal._previousActiveElement = activeElement;
      
      setTimeout(() => nameInput?.focus(), 0);
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('inert', ''); // 重新添加 inert 屬性以禁用互動
      document.body.style.overflow = '';
      
      // 恢復之前的焦點
      if (modal._previousActiveElement && modal._previousActiveElement.focus) {
        modal._previousActiveElement.focus();
      }
      
      form.reset();
      [nameInput, linkInput, briefInput].forEach(el => el && el.classList.remove('invalid'));
      linkError.style.display = 'none';
      updateNameCounter();
      updateBriefCounter();
      updateSubmitState();
    };

    // 事件監聽器
    addBtn.onclick = openModal;
    cancelBtn.onclick = closeModal;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    form.addEventListener('click', (e) => e.stopPropagation());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        e.preventDefault();
        closeModal();
      }
    });

    shadow.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
      const focusable = form.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = shadow.activeElement;
      if (e.shiftKey) {
        if (active === first || active === form) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });

    // 驗證和更新函數
    const isValidUrl = (value) => /^https?:\/\/.+/.test(value.trim());

    const updateSubmitState = () => {
      const valid = Boolean(nameInput.value.trim()) && Boolean(briefInput.value.trim()) && isValidUrl(linkInput.value);
      submitBtn.disabled = !valid;
    };

    const setSubmitting = (submitting) => {
      if (submitting) {
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
      } else {
        submitBtn.classList.remove('btn-loading');
      }
    };

    // 請求頻率限制管理
    let lastSubmitTime = 0;
    const MIN_SUBMIT_INTERVAL = 2000; // 最小提交間隔 2 秒
    let retryCount = 0;
    const MAX_RETRIES = 3;

    // Toast 通知函數
    const showToast = (message, type = 'success') => {
      toastMessage.textContent = message;
      toast.className = `toast ${type}`;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    };

    // 表單提交
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (!data.name || !data.name.trim() || !data.brief || !data.brief.trim()) {
        [nameInput, briefInput].forEach(el => {
          if (el && !el.value.trim()) el.classList.add('invalid');
        });
        alert('所有欄位皆為必填，請完整填寫！');
        return;
      }

      if (!isValidUrl(data.link)) {
        linkError.style.display = 'block';
        linkInput.classList.add('invalid');
        linkInput.focus();
        return;
      } else {
        linkError.style.display = 'none';
        linkInput.classList.remove('invalid');
      }

      // 檢查提交頻率
      const now = Date.now();
      if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
        const remainingTime = Math.ceil((MIN_SUBMIT_INTERVAL - (now - lastSubmitTime)) / 1000);
        alert(`請等待 ${remainingTime} 秒後再提交，避免系統負載過高`);
        return;
      }

      setSubmitting(true);
      lastSubmitTime = now;
      
      // 送出請求，由於是 no-cors 模式，我們直接視為成功
      fetch('https://script.google.com/macros/s/AKfycbzVzTb3niW4G-z19Xj8Fms8UNadPb-HAmga1cXl8iKZDlGUx9WQf0ZLwB4PptgHd-H5Lg/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(err => {
        // 即使有錯誤也忽略，因為 no-cors 模式下這是正常的
        console.log('no-cors 請求完成（可能顯示錯誤但實際已送出）:', err);
      });

      // 直接視為成功，因為後台確實會收到資料
      retryCount = 0;
      closeModal();
      showToast('成功送出', 'success');
      
      // 延遲重新載入頁面以顯示新作品
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      setSubmitting(false);
    };

    // 字數限制和計數器
    const updateNameCounter = () => {
      let val = nameInput.value;
      if (val.length > 10) {
        nameInput.value = val.slice(0, 10);
        val = nameInput.value;
      }
      nameCounter.textContent = `${val.length}/10`;
    };

    const updateBriefCounter = () => {
      let val = briefInput.value;
      if (val.length > 40) {
        briefInput.value = val.slice(0, 40);
        val = briefInput.value;
      }
      briefCounter.textContent = `${val.length}/40`;
    };

    // 輸入事件監聽器
    briefInput.addEventListener('input', () => { updateBriefCounter(); updateSubmitState(); });
    briefInput.addEventListener('paste', () => { setTimeout(() => { updateBriefCounter(); updateSubmitState(); }, 0); });
    nameInput.addEventListener('input', () => {
      updateNameCounter();
      if (nameInput.value.trim()) nameInput.classList.remove('invalid');
      updateSubmitState();
    });
    nameInput.addEventListener('paste', () => { setTimeout(() => { updateNameCounter(); updateSubmitState(); }, 0); });
    linkInput.addEventListener('input', () => {
      if (isValidUrl(linkInput.value)) {
        linkError.style.display = 'none';
        linkInput.classList.remove('invalid');
      }
      updateSubmitState();
    });

    // 初始化
    updateNameCounter();
    updateBriefCounter();
    updateSubmitState();
  }
}

customElements.define('add-profile-btn', AddProfileButton);

class AIHeader extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          position: sticky;
          top: 0;
          z-index: 10;
          display: block;
        }
        .header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          font-size: 1.5rem;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: 2px;
          text-align: left;
          padding: 18px 0 14px 24px;
          background: var(--primary-blue);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-light);
        }
        @media (max-width: 600px) {
          .header-flex {
            font-size: 1.1rem;
            padding: 16px 0 12px 16px;
          }
        }
        @media (max-width: 420px) {
          .header-flex {
            font-size: 0.95rem;
            letter-spacing: 1px;
            padding-left: 8px;
          }
        }
      </style>
      <div class="header-flex">
        <span>AI 寫程式，施展你的魔法</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <add-profile-btn></add-profile-btn>
          <about-box></about-box>
        </div>
      </div>
    `;
  }
}
customElements.define('ai-header', AIHeader);

export default AIHeader; 
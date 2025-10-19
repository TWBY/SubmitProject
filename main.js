import './Component/Header.js';
import './Component/Card.js';
import './Component/loading.js';

console.log('Google Sheet 來源：https://docs.google.com/spreadsheets/d/1tFw_QNUGReF6K9GSObNH9IH9rQpvpz9GEQdMEWbd3l4/edit?gid=0#gid=0');

fetch('https://script.google.com/macros/s/AKfycbzVzTb3niW4G-z19Xj8Fms8UNadPb-HAmga1cXl8iKZDlGUx9WQf0ZLwB4PptgHd-H5Lg/exec')
  .then(response => {
    if (!response.ok) throw new Error('網路錯誤');
    return response.text();
  })
  .then(data => {
    let items;
    try {
      items = JSON.parse(data);
    } catch (e) {
      document.getElementById('api-data').textContent = '資料格式錯誤';
      return;
    }
    if (!Array.isArray(items)) {
      document.getElementById('api-data').textContent = '資料格式錯誤';
      return;
    }
    const container = document.getElementById('api-data');
    container.innerHTML = '';
    items.forEach((item, index) => {
      const card = document.createElement('gallery-card');
      card.setAttribute('index', (index + 1).toString());
      card.setAttribute('name', item.name);
      card.setAttribute('brief', item.brief);
      card.setAttribute('link', item.link);
      container.appendChild(card);
    });
  })
  .catch(error => {
    document.getElementById('api-data').textContent = '載入失敗: ' + error.message;
  });


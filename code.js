function doGet(e) {
    // Open the active spreadsheet and select the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get all data from the sheet
    var data = sheet.getDataRange().getValues();
    
    // Prepare an array to hold the result
    var result = [];
  
    // Loop through the data and extract values from each row
    for (var i = 1; i < data.length; i++) { // Skip the header row
      var name = data[i][0];   // Column A: 名稱
      var brief = data[i][1];  // Column B: 簡介
      var link = data[i][2];   // Column C: 連結
      var surname = data[i][3]; // Column D: 姓名
      
      // Push the extracted data into the result array
      result.push({
        'name': name,
        'brief': brief,
        'link': link,
        'surname': surname
      });
    }
    
    // Convert the result to JSON and return it as a response
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
  
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    // 順序：名稱、簡介、連結、姓名
    sheet.appendRow([
      data.name || '',
      data.brief || '',
      data.link || '',
      data.surname || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
  
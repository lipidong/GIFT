// if_data.js 引入全部journal impact factor

(function () {
  'use strict';
  

  function proc_journal_name(journal_name){
    var journal_name2 = journal_name.replace(/(\.|\-|\s|\_|\(|\)|,|;|amp)/ig, '').toUpperCase();
    return journal_name2
  }


  function get_if() {
    // url_str = "http://127.0.0.1:8000/biomedx/get_if?name=" + journal_name ;
    var journal_name = $('#journal').val();
    var journal_name2 = proc_journal_name(journal_name);
    console.log(journal_name2);
    $('#if').text('Impact Factor: ' + if_data[journal_name2]);

  }

  function contains(string, substr, isIgnoreCase)
{
    if (isIgnoreCase)
    {
         string = string.toLowerCase();
         substr = substr.toLowerCase();
    }

    var startChar = substr.substring(0, 1);
    var strLen = substr.length;

    for (var j = 0; j<string.length - strLen + 1; j++)
    {
         if (string.charAt(j) == startChar)  //如果匹配起始字符,开始查找
         {
             if (string.substring(j, j+strLen) == substr)  //如果从j开始的字符与str匹配，那ok
             {
                 return true;
             }
         }
    }
    return false;
}

  $('#get_if').click(function () {
    get_if();

  })

  

  function show_google_scholar_if() {
    //展示影响因子
    $('#gs_res_ccl_mid .gs_or').each(function () {
      var self = $(this);
      
      var pattern = /(?<=-\s).+(?=,)/i ;
      var journal_str = pattern.exec(self.children("div.gs_ri").first().children('div.gs_a').first().text())[0];

      if(contains(journal_str, '…', true)){
          var data_id = $(this).attr('data-cid');
          var url = "https://scholar.google.com/scholar?q=info:" + data_id + ":scholar.google.com/&output=cite&scirp=2&hl=en";
          $.ajax({
            url: url,
            // dataType: "json",
            type: "GET",
            async: true,
            success: function (xhr) {
              // r_text=data;
              var journal_name = $(xhr).find('tr').first().find('div.gs_citr').find('i').html();
              if (journal_name) {

                var journal_name2 = proc_journal_name(journal_name);
                if (if_data[journal_name2]){
                  var impact_factor = if_data[journal_name2];
                  self.append('<div class="gs_fl"><span>' + journal_name + ' - ' + impact_factor + '</span></div>');
                }else{
                  self.append('<div class="gs_fl"><span>' + journal_name + ' - na </span></div>');

                }
              }
              // console.log(journal_name);
              // console.log(if_data[journal_name]);

            },
            error: function (xhr, exception) {

              console.log(exception);

            }
          });
        }else{
          var journal_name = journal_str;
          var journal_name2 = proc_journal_name(journal_name);
          if (if_data[journal_name2]) {
            var impact_factor = if_data[journal_name2];
            self.append('<div class="gs_fl"><span>' + journal_name + ' - ' + impact_factor + '</span></div>');
          }else{
            self.append('<div class="gs_fl"><span>' + journal_name + ' - na </span></div>');

          }
          // var impact_factor = if_data[journal_name2];
          // self.append('<div class="gs_fl"><span>xx:' + journal_name + '</span></div>');
        }
      })
      
  }

  function show_pubmed_if() {
    //展示影响因子
    // #search-results > section > div.search-results-chunks > div > article:nth-child(6) > div.docsum-wrap > div.docsum-content > div.docsum-citation.full-citation > span.docsum-journal-citation.full-journal-citation
    $('span.docsum-journal-citation.full-journal-citation').each(function(){
      var self = $(this);
      var journal_name = $(this).text().split('.')[0];
      if(journal_name){
        var journal_name2 = proc_journal_name(journal_name);
            if (if_data[journal_name2]) {
              var impact_factor = if_data[journal_name2];
              self.append('<div><span>[Impact Factor] ' + impact_factor + '</span></div>');
            }
      }
    })
  
  }

  // google scholar
  var show_if_flag = true;
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.sync.get({ showif: true }, function (items) {
    if (items.showif) {
      show_google_scholar_if();
    }
  });

  // 显示badge
  $('#show_if').click(() => {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    // 保存数据
    chrome.storage.sync.set({ showif: true }, function () {
      console.log('保存成功！');
    });

    // popup主动发消息给content-script
    $('#send_message_to_content_script').click(() => {
      sendMessageToContentScript('你好，我是popup！', (response) => {
        if (response) alert('收到来自content-script的回复：' + response);
      });
    });

  });

  // 隐藏badge
  $('#hide_if').click(() => {
    chrome.browserAction.setBadgeText({ text: 'OFF' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    chrome.storage.sync.set({ showif: false }, function () {
      console.log('保存成功！');
    });
  });

// pubmed
show_pubmed_if();




  // $('#google_scholar').click(function(){
  //       $('#gs_res_ccl_mid .gs_or').each(function(){
  //     var data_id = $(this).attr('data-cid');
  //     var url = "https://scholar.google.com/scholar?q=info:" + data_id + ":scholar.google.com/&output=cite&scirp=2&hl=en";
  //       $.ajax({
  //               url: url,
  //               // dataType: "json",
  //               type: "GET",
  //               async: false,
  //               success: function (xhr) {
  //                  // r_text=data;
  //                  var journal_name = $(xhr).find('tr').first().find('div.gs_citr').find('i').html();
  //                  console.log(journal_name);
  //                  console.log(if_data[journal_name]);
  //               },
  //               error: function (xhr, exception) {

  //                   console.log(exception);

  //               }
  //       });

  //   })

  // })




})();




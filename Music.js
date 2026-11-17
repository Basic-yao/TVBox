/**
 * 哔哩哔哩「音乐·演唱会」TVBox 专用 JS 蜘蛛（纯同步 req 版）
 *
 * 订阅配置：
 * {"key":"js_bili_concert","name":"演唱会·哔哩哔哩","type":3,
 *  "api":"https://raw.githubusercontent.com/Basic-yao/TVBox/main/music.js",
 *  "searchable":1,"quickSearch":1,"filterable":1,"ext":"{\"sessdata\":\"\"}"}
 *
 * 说明：原版 TVBox 的 JS 引擎只注入同步 req()，不支持 fetch / async / await。
 * 本文件全程同步，所有生命周期函数直接返回 JSON 字符串。
 */

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var BUVID = "buvid3=84B0395D-C9F2-C490-E92E-A09AB48FE26E71636infoc";
var SESSDATA = "";

var MIXIN_KEY_ENC_TAB = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52];

var CLASSES = [
  { type_name: "演唱会筛选", type_id: "演唱会超清" },
  { type_name: "粤语", type_id: "粤语歌曲超清" },
  { type_name: "KTV热门", type_id: "KTV热门歌曲" },
  { type_name: "民谣歌曲", type_id: "民谣歌曲超清" },
  { type_name: "经典老歌", type_id: "经典老歌超清" },
  { type_name: "网红翻唱", type_id: "网红翻唱歌曲超清" },
  { type_name: "DJ", type_id: "DJ歌曲超清" },
  { type_name: "网易云经典", type_id: "网易云经典歌曲" },
  { type_name: "滚石经典", type_id: "滚石歌曲" },
  { type_name: "古风歌曲", type_id: "古风歌曲" },
  { type_name: "闽南语歌曲", type_id: "闽南语歌曲" },
  { type_name: "电子琴纯音乐", type_id: "电子琴纯音乐" },
  { type_name: "抖音DJ", type_id: "抖音DJ" },
  { type_name: "无损音乐", type_id: "无损音乐" },
  { type_name: "时光音乐会", type_id: "时光音乐会MV" },
  { type_name: "2026年热榜", type_id: "2026年热门歌曲" },
  { type_name: "2025年热榜", type_id: "2025年热门歌曲" },
  { type_name: "2024年热榜", type_id: "2024年热门歌曲" },
  { type_name: "00年代经典", type_id: "00年代经典歌曲" },
  { type_name: "90年代经典", type_id: "90年代经典歌曲" },
  { type_name: "80年代经典", type_id: "80年代经典歌曲" },
  { type_name: "70年代经典", type_id: "70年代经典歌曲" },
  { type_name: "60年代经典", type_id: "60年代经典歌曲" }
];

var ORDER_FILTER = {
  key: "order", name: "排序",
  value: [
    { n: "综合排序", v: "0" },
    { n: "最多点击", v: "click" },
    { n: "最新发布", v: "pubdate" },
    { n: "最多弹幕", v: "dm" },
    { n: "最多收藏", v: "stow" }
  ]
};

var DURATION_FILTER = {
  key: "duration", name: "时长",
  value: [
    { n: "全部", v: "0" },
    { n: "60分钟以上", v: "4" },
    { n: "30~60分钟", v: "3" },
    { n: "10~30分钟", v: "2" },
    { n: "10分钟以下", v: "1" }
  ]
};

var ARTIST_FILTER = {
  key: "tid", name: "分类",
  value: [
    { n: "全部", v: "演唱会超清" },
    { n: "周杰伦", v: "周杰伦演唱会超清" },
    { n: "林俊杰", v: "林俊杰演唱会超清" },
    { n: "陈奕迅", v: "陈奕迅演唱会超清" },
    { n: "邓紫棋", v: "邓紫棋演唱会超清" },
    { n: "五月天", v: "五月天演唱会超清" },
    { n: "张学友", v: "张学友演唱会超清" },
    { n: "刘德华", v: "刘德华演唱会超清" },
    { n: "王菲", v: "王菲演唱会超清" },
    { n: "薛之谦", v: "薛之谦演唱会超清" },
    { n: "毛不易", v: "毛不易演唱会超清" },
    { n: "李荣浩", v: "李荣浩演唱会超清" },
    { n: "Beyond", v: "Beyond演唱会超清" },
    { n: "张国荣", v: "张国荣演唱会超清" },
    { n: "邓丽君", v: "邓丽君演唱会超清" },
    { n: "周深", v: "周深演唱会超清" },
    { n: "刀郎", v: "刀郎演唱会超清" },
    { n: "凤凰传奇", v: "凤凰传奇演唱会超清" },
    { n: "蔡依林", v: "蔡依林演唱会超清" },
    { n: "王力宏", v: "王力宏演唱会超清" }
  ]
};

var FILTERS = {
  演唱会超清: [ORDER_FILTER, ARTIST_FILTER, DURATION_FILTER],
  粤语歌曲超清: [DURATION_FILTER],
  KTV热门歌曲: [DURATION_FILTER],
  民谣歌曲超清: [ORDER_FILTER, DURATION_FILTER],
  经典老歌超清: [DURATION_FILTER],
  网红翻唱歌曲超清: [DURATION_FILTER],
  DJ歌曲超清: [ORDER_FILTER, DURATION_FILTER],
  网易云经典歌曲: [ORDER_FILTER, DURATION_FILTER],
  滚石歌曲: [DURATION_FILTER],
  古风歌曲: [DURATION_FILTER],
  闽南语歌曲: [DURATION_FILTER],
  电子琴纯音乐: [ORDER_FILTER, DURATION_FILTER],
  抖音DJ: [ORDER_ORDER_PLACEHOLDER, DURATION_FILTER],
  无损音乐: [DURATION_FILTER],
  时光音乐会MV: [DURATION_FILTER],
  "2026年热门歌曲": [ORDER_FILTER, DURATION_FILTER],
  "2025年热门歌曲": [ORDER_FILTER, DURATION_FILTER],
  "2024年热门歌曲": [ORDER_FILTER, DURATION_FILTER],
  "00年代经典歌曲": [ORDER_FILTER, DURATION_FILTER],
  "90年代经典歌曲": [ORDER_FILTER, DURATION_FILTER],
  "80年代经典歌曲": [ORDER_FILTER, DURATION_FILTER],
  "70年代经典歌曲": [ORDER_FILTER, DURATION_FILTER],
  "60年代经典歌曲": [ORDER_FILTER, DURATION_FILTER]
};
// 修正占位
FILTERS["抖音DJ"] = [ORDER_FILTER, DURATION_FILTER];

var _wbiKeys = null;

function headers() {
  var h = {
    "User-Agent": UA,
    "Referer": "https://www.bilibili.com/",
    "Origin": "https://www.bilibili.com",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9"
  };
  var ck = BUVID;
  if (SESSDATA) ck += "; SESSDATA=" + SESSDATA;
  h.Cookie = ck;
  return h;
}

function buildUrl(url, params) {
  var full = url;
  if (params) {
    var qs = [];
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) {
        qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
      }
    }
    if (qs.length) full += (full.indexOf("?") >= 0 ? "&" : "?") + qs.join("&");
  }
  return full;
}

// 同步取文本：TVBox 注入 req(url, opts) -> 字符串 / {content} / {body}
function httpText(url, params) {
  var full = buildUrl(url, params);
  try {
    if (typeof req === "function") {
      var res = req(full, { headers: headers(), method: "get" });
      if (res === null || res === undefined) return null;
      if (typeof res === "string") return res;
      if (typeof res === "object") {
        if (typeof res.content === "string") return res.content;
        if (typeof res.body === "string") return res.body;
        if (typeof res.text === "string") return res.text;
      }
      return String(res);
    }
  } catch (e) {}
  return null;
}

function httpJson(url, params) {
  var t = httpText(url, params);
  if (!t) return null;
  if (typeof t !== "string") t = String(t);
  t = t.trim();
  if (!t || (t.charAt(0) !== "{" && t.charAt(0) !== "[")) return null;
  try {
    return JSON.parse(t);
  } catch (e) {}
  return null;
}

function getWbiKeys() {
  if (_wbiKeys) return _wbiKeys;
  try {
    var r = httpJson("https://api.bilibili.com/x/web-interface/nav");
    if (!r || !r.data || !r.data.wbi_img) { _wbiKeys = ""; return _wbiKeys; }
    var img = (r.data.wbi_img.img_url || "").split("/").pop().split(".")[0];
    var sub = (r.data.wbi_img.sub_url || "").split("/").pop().split(".")[0];
    var raw = img + sub;
    var mixin = "";
    for (var i = 0; i < MIXIN_KEY_ENC_TAB.length; i++) mixin += raw.charAt(MIXIN_KEY_ENC_TAB[i]) || "";
    _wbiKeys = mixin.slice(0, 32);
  } catch (e) {
    _wbiKeys = "";
  }
  return _wbiKeys;
}

function md5(input){
  function AddUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4)return(lResult^0x80000000^lX8^lY8);if(lX4|lY4){if(lResult&0x40000000)return(lResult^0xC0000000^lX8^lY8);else return(lResult^0x40000000^lX8^lY8);}else return(lResult^lX8^lY8);}
  function F(x,y,z){return(x&y)|((~x)&z);}
  function G(x,y,z){return(x&z)|(y&(~z));}
  function H(x,y,z){return(x^y^z);}
  function I(x,y,z){return(y^(x|(~z)));}
  function RotateLeft(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));}
  function FF(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(F(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function GG(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(G(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function HH(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(H(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function II(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(I(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
  function ConvertToWordArray(s){
    var lWordCount,lMessageLengthInBits,lMessageLengthInIndex,lMessageLength,s;
    var lNumberOfWords_temp1,lNumberOfWords_temp2,lNumberOfWords;
    var lWordArray=new Array(),lBytePosition=0,lByteCount=0,lWordPosition=0;
    s=utf8Encode(s);
    lMessageLength=s.length;
    lNumberOfWords_temp1=lMessageLength+8;
    lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;
    lNumberOfWords=(lNumberOfWords_temp2+1)*16;
    var pad=Math.pow(2,8);
    while(lByteCount<lMessageLength){lBytePosition=(lByteCount%4)*8;lWordPosition=(lByteCount-(lByteCount%4))/4;lWordArray[lWordPosition]=(lWordArray[lWordPosition]|(s.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
    lBytePosition=(lByteCount%4)*8;lWordPosition=(lByteCount-(lByteCount%4))/4;lWordArray[lWordPosition]=(lWordArray[lWordPosition]|(0x80<<lBytePosition));
    lByteCount++;
    while(lByteCount<(lNumberOfWords-2)){lBytePosition=(lByteCount%4)*8;lWordPosition=(lByteCount-(lByteCount%4))/4;lWordArray[lWordPosition]=(lWordArray[lWordPosition]|(0<<lBytePosition));lByteCount++;}
    lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;
    return lWordArray;
  }
  function WordToHex(lValue){var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValue_temp="0"+lByte.toString(16);WordToHexValue=WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);}return WordToHexValue;}
  function utf8Encode(s){s=s.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<s.length;n++){var c=s.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}else{utftext+=String.fromCharCode(((c>>12)&15)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;}
  var x=ConvertToWordArray(input);
  var a=0x67452301,b=0xEFCDAB89,c=0x98BADCFE,d=0x10325476;
  var S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;
  for(var k=0;k<x.length;k+=16){
    var AA=a,BB=b,CC=c,DD=d;
    a=FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=FF(c,d,a,b,x[k+2],S13,0x242070DB);b=FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=FF(c,d,a,b,x[k+6],S13,0xA8304613);b=FF(b,c,d,a,x[k+7],S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8],S11,0x698098D8);d=FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);d=FF(d,a,b,c,x[k+13],S12,0xFD987193);c=FF(c,d,a,b,x[k+14],S13,0xA679438E);b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=GG(d,a,b,c,x[k+6],S22,0xC040B340);c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=GG(d,a,b,c,x[k+10],S22,0x02441453);c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=GG(b,c,d,a,x[k+8],S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=HH(d,a,b,c,x[k+8],S32,0x8771F681);c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=HH(b,c,d,a,x[k+6],S34,0x04881D05);
    a=HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=HH(b,c,d,a,x[k+2],S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0],S41,0xF4292244);d=II(d,a,b,c,x[k+7],S42,0x432AFF97);c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=II(b,c,d,a,x[k+5],S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);d=II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=II(b,c,d,a,x[k+1],S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=II(c,d,a,b,x[k+6],S43,0xA3014314);b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4],S41,0xF7537E82);d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=II(b,c,d,a,x[k+9],S44,0xEB86D391);
    a=AddUnsigned(a,AA);b=AddUnsigned(b,BB);c=AddUnsigned(c,CC);d=AddUnsigned(d,DD);
  }
  return (WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d)).toLowerCase();
}

function wbiSign(params) {
  var mixin = getWbiKeys();
  if (!mixin) return params;
  var p = {};
  for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) p[k] = params[k];
  p.wts = Math.floor(Date.now() / 1000);
  var keys = [];
  for (var kk in p) if (Object.prototype.hasOwnProperty.call(p, kk)) keys.push(kk);
  keys.sort();
  var q = keys.map(function (k2) { return k2 + "=" + encodeURIComponent(p[k2]); }).join("&");
  p.w_rid = md5(q + mixin);
  return p;
}

function cleanTitle(s) {
  if (!s) return "";
  return String(s)
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .trim();
}

function pic(url) {
  if (!url) return "";
  if (url.indexOf("//") === 0) return "https:" + url;
  return url;
}

function norm(items) {
  var out = [];
  (items || []).forEach(function (it) {
    if (!it || !it.bvid) return;
    out.push({
      vod_id: it.bvid,
      vod_name: cleanTitle(it.title || ""),
      vod_pic: pic(it.pic || ""),
      vod_remarks: it.duration || "",
      vod_actor: it.author || "",
      vod_content: it.description || ""
    });
  });
  return out;
}

function searchOnce(endpoint, keyword, pg, order, duration, signed) {
  try {
    if (endpoint.indexOf("search/all/v2") >= 0) {
      var r = httpJson(endpoint, { keyword: keyword, page: pg });
      if (!r || r.code !== 0) return { list: [], pages: 1 };
      var blocks = (r.data && r.data.result) || [];
      var vids = [];
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i] && blocks[i].result_type === "video") {
          vids = blocks[i].data || [];
          break;
        }
      }
      return { list: norm(vids), pages: parseInt((r.data && r.data.numPages) || 1, 10) };
    }
    var params = { search_type: "video", keyword: keyword, page: pg, page_size: 20 };
    if (order && order !== "0") {
      var map = { "0": "totalrank", click: "click", pubdate: "pubdate", dm: "dm", stow: "stow" };
      params.order = map[order] || "totalrank";
    }
    if (duration && duration !== "0") params.duration = duration;
    var p = signed ? wbiSign(params) : params;
      var r2 = httpJson(endpoint, p);
    if (!r2 || r2.code !== 0) return { list: [], pages: 1 };
    return {
      list: norm((r2.data && r2.data.result) || []),
      pages: parseInt((r2.data && r2.data.numPages) || 1, 10)
    };
  } catch (e) {
    return { list: [], pages: 1 };
  }
}

function biliSearch(keyword, pg, order, duration) {
  var eps = [
    ["https://api.bilibili.com/x/web-interface/search/type", true],
    ["https://api.bilibili.com/x/web-interface/search/all/v2", false],
    ["https://api.bilibili.com/x/web-interface/search/type", false]
  ];
  for (var rnd = 0; rnd < 2; rnd++) {
    for (var i = 0; i < eps.length; i++) {
      var res = searchOnce(eps[i][0], keyword, pg, order, duration, eps[i][1]);
      if (res.list && res.list.length) return res;
    }
  }
  return { list: [], pages: 1 };
}

function ranking() {
  var rids = ["3", "1", "4"];
  for (var i = 0; i < rids.length; i++) {
    var r = httpJson("https://api.bilibili.com/x/web-interface/ranking/v2", { rid: rids[i], type: "all" });
    if (r && r.code === 0) {
      var lst = (r.data && r.data.list) || [];
      if (lst.length) {
        return lst.filter(function (it) { return it.bvid; }).map(function (it) {
          return {
            vod_id: it.bvid,
            vod_name: cleanTitle(it.title || ""),
            vod_pic: pic(it.pic || ""),
            vod_remarks: "热门",
            vod_actor: (it.owner && it.owner.name) || "",
            vod_content: it.desc || ""
          };
        });
      }
    }
  }
  return [];
}

function view(bvid, p) {
  var params = { bvid: bvid };
  if (p && p > 1) params.p = p;
  var r = httpJson("https://api.bilibili.com/x/web-interface/view", params);
  if (r && r.code === 0 && r.data) return r.data;
  r = httpJson("https://api.bilibili.com/x/player/pagelist", { bvid: bvid });
  if (r && r.code === 0 && r.data) {
    var pages = r.data;
    var idx = Math.min(Math.max((p || 1) - 1, 0), pages.length - 1);
    return { bvid: bvid, cid: pages[idx].cid || 0, pages: pages, title: pages[idx].part || "", pic: "" };
  }
  return {};
}

function playurl(bvid, cid) {
  var qns = SESSDATA ? [80, 64, 32, 16] : [64, 32, 16];
  var endpoints = [
    ["https://api.bilibili.com/x/player/wbi/playurl", true],
    ["https://api.bilibili.com/x/player/playurl", false]
  ];
  for (var qi = 0; qi < qns.length; qi++) {
    var qn = qns[qi];
    for (var ei = 0; ei < endpoints.length; ei++) {
      for (var fi = 0; fi < 2; fi++) {
        var fnval = fi === 0 ? 1 : 0;
        var params = { bvid: bvid, cid: cid, qn: qn, fnval: fnval, fnver: 0, fourk: 1, platform: "pc" };
        if (endpoints[ei][1]) params = wbiSign(params);
        var r = httpJson(endpoints[ei][0], params);
        if (!r || r.code !== 0) continue;
        var data = r.data || {};
        var durl = data.durl || [];
        if (durl.length && durl[0].url) return { url: durl[0].url, qn: qn };
        var dash = data.dash || {};
        var videos = dash.video || [];
        if (videos.length) {
          videos.sort(function (a, b) { return (b.id || 0) - (a.id || 0); });
          var base = videos[0].baseUrl || videos[0].base_url || "";
          if (base) return { url: base, qn: qn };
        }
      }
    }
  }
  return { url: "", qn: 0 };
}

function asObj(v) {
  if (v && typeof v === "object") return v;
  if (typeof v === "string") {
    var s = v.trim();
    if (!s) return null;
    try { return JSON.parse(s); } catch (e) { return null; }
  }
  return null;
}

function init(ext) {
  try {
    var obj = asObj(ext) || {};
    var ck = obj.cookies || obj.cookie || "";
    var m = String(ck).match(/SESSDATA=([^;]+)/);
    if (m) SESSDATA = m[1].trim();
    if (obj.sessdata) SESSDATA = String(obj.sessdata).trim();
  } catch (e) {}
}

function home(filter) {
  var result = { class: CLASSES, list: [] };
  if (filter) result.filters = FILTERS;
  return JSON.stringify(result);
}

function homeVod() {
  try {
    return JSON.stringify({ list: ranking() });
  } catch (e) {
    return JSON.stringify({ list: [] });
  }
}

function category(tid, pg, filter, extend) {
  try {
    pg = String(pg || "1");
    var ext = asObj(extend) || {};
    var keyword = String(ext.tid || tid || "").trim();
    var order = String(ext.order || "0");
    var duration = String(ext.duration || "0");
    var res = biliSearch(keyword, pg, order, duration);
    if ((!res.list || !res.list.length) && (pg === "1" || pg === 1)) {
      var alts = [keyword + "超清", keyword.replace("超清", "").trim(), keyword + " MV"];
      for (var i = 0; i < alts.length; i++) {
        if (!alts[i] || alts[i] === keyword) continue;
        res = biliSearch(alts[i], pg, order, duration);
        if (res.list && res.list.length) break;
      }
    }
    if ((!res.list || !res.list.length) && (pg === "1" || pg === 1)) {
      res = { list: ranking(), pages: 1 };
    }
    return JSON.stringify({
      list: res.list || [],
      page: pg,
      pagecount: Math.max(res.pages || 1, 1),
      limit: 20,
      total: (res.list || []).length
    });
  } catch (e) {
    return JSON.stringify({ list: [], page: "1", pagecount: 1 });
  }
}

function detail(ids) {
  try {
    var vid = "";
    if (Array.isArray(ids)) vid = String(ids[0] || "");
    else if (typeof ids === "object" && ids) vid = String(ids.id || ids.vod_id || "");
    else vid = String(ids || "");
    vid = vid.replace(/^["']|["']$/g, "").trim();
    var bvid = vid.split("?")[0].split("$")[0].trim();
    if (!bvid) return JSON.stringify({ list: [] });
    var info = view(bvid, 1);
    var pages = info.pages || [];
    var play = "";
    if (pages.length <= 1) {
      play = "正片$" + bvid;
    } else {
      var eps = [];
      for (var i = 0; i < pages.length; i++) {
        var name = (pages[i].part || "").trim() || "第" + (i + 1) + "集";
        eps.push(name + "$" + bvid + "?p=" + (i + 1));
      }
      play = eps.join("#");
    }
    var stat = info.stat || {};
    var remark = "";
    if (stat.view != null) {
      var v = parseInt(stat.view, 10) || 0;
      var d = parseInt(stat.danmaku, 10) || 0;
      var fv = v >= 100000000 ? (v / 100000000).toFixed(1) + "亿" : v >= 10000 ? (v / 10000).toFixed(1) + "万" : String(v);
      var fd = d >= 10000 ? (d / 10000).toFixed(1) + "万" : String(d);
      remark = "播放:" + fv + " 弹幕:" + fd;
    }
    var year = "";
    try { if (info.pubdate) year = String(new Date(info.pubdate * 1000).getFullYear()); } catch (e) {}
    var vod = {
      vod_id: bvid,
      vod_name: info.title || bvid,
      vod_pic: pic(info.pic || ""),
      type_name: "音乐/演唱会",
      vod_year: year,
      vod_area: "哔哩哔哩",
      vod_remarks: remark,
      vod_actor: (info.owner && info.owner.name) || "",
      vod_director: "",
      vod_content: info.desc || "",
      vod_play_from: "哔哩哔哩$$$演唱会",
      vod_play_url: play
    };
    return JSON.stringify({ list: [vod] });
  } catch (e) {
    return JSON.stringify({ list: [] });
  }
}

function search(key, quick, pg) {
  try {
    pg = String(pg || "1");
    var res = biliSearch(String(key || "").trim(), pg, "totalrank", "0");
    return JSON.stringify({
      list: res.list || [],
      page: pg,
      pagecount: Math.max(res.pages || 1, 1)
    });
  } catch (e) {
    return JSON.stringify({ list: [], page: "1", pagecount: 1 });
  }
}

function play(flag, id, vipFlags) {
  var header = {
    "User-Agent": UA,
    "Referer": "https://www.bilibili.com",
    "Origin": "https://www.bilibili.com",
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };
  if (SESSDATA) header.Cookie = "SESSDATA=" + SESSDATA;

  var bvid = "";
  var p = 1;
  var cand = String(id || "");
  var m = cand.match(/(BV[0-9A-Za-z]{8,})/);
  if (m) {
    bvid = m[1];
    var mp = cand.match(/[?&]p=(\d+)/);
    if (mp) p = parseInt(mp[1], 10);
  }
  if (!bvid) return JSON.stringify({ parse: 0, url: "", header: header });

  try {
    var info = view(bvid, p);
    var cid = info.cid || 0;
    var pages = info.pages || [];
    if (!cid && pages.length) {
      var idx = Math.min(Math.max(p - 1, 0), pages.length - 1);
      cid = pages[idx].cid || 0;
    }
    if (cid) {
      var pu = playurl(bvid, cid);
      if (pu.url) {
        return JSON.stringify({ parse: 0, url: pu.url, header: header, format: "mp4" });
      }
    }
  } catch (e) {}
  return JSON.stringify({ parse: 0, url: "", header: header });
}

// 兼容别名
function homeContent(filter) { return home(filter); }
function homeVideoContent() { return homeVod(); }
function categoryContent(tid, pg, filter, extend) { return category(tid, pg, filter, extend); }
function detailContent(ids) { return detail(ids); }
function searchContent(key, quick, pg) { return search(key, quick, pg); }
function playerContent(flag, id, vipFlags) { return play(flag, id, vipFlags); }

function __jsEvalReturn() {
  return {
    init: init,
    home: home,
    homeVod: homeVod,
    category: category,
    detail: detail,
    play: play,
    search: search,
    homeContent: homeContent,
    homeVideoContent: homeVideoContent,
    categoryContent: categoryContent,
    detailContent: detailContent,
    searchContent: searchContent,
    playerContent: playerContent
  };
}

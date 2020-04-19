let originalFreq = {
	'О':0.10983,
	'Е':0.08483,
	'А':0.07998,
  'И':0.07367,
  'Н':0.067,
  'Т':0.06318,
  'С':0.05473,
  'Р':0.04746,
  'В':0.04533,
  'Л':0.04343,
  'К':0.03486,

  'М':0.03203,
  'Д':0.02977,
  'П':0.02804,
  'У':0.02615,
  'Я':0.02001,
  'Ы':0.01898,
  'Ь':0.01735,
  'Г':0.01687,
  'З':0.01641,
  'Б':0.01592,

  'Ч':0.0145,
  'Й':0.01208,
  'Х':0.00966,
  'Ж':0.0094,
  'Ш':0.00718,
  'Ю':0.00639,
  'Ц':0.00486,
  'Щ':0.00361,
  'Э':0.00331,
  'Ф':0.00267,
  'Ъ':0.00037,
  'Ё':0.00013
}

// switch menu item
$('.nav-link').each(function(){
  if (window.location.href.includes(this.href)) {
    $(this).addClass('active')
  }
});

// init app router
router(window.location.href.substring(window.location.href.lastIndexOf('?') + 1, window.location.href.length));

function router(path) {
  if (path === "analysis") {
    openFrequencyAnalysis();
  }
  if (path === "cesar") {
    openCesarCrypt();
  }
  if (path === "atbash") {
    openAtbashCrypt();
  }
  if (path === "replace") {
    openReplaceCrypt();
  }
  if (path === "flasner") {
    openFlasnerCrypt();
  }
  if (path === "viet") {
    openVietCrypt();
  }
}

// UI
function hideAll() {
	$('#frequency-analysis').hide();
	$('#cesar').hide();
	$('#atbash').hide();
	$('#replace').hide();
	$('#flasner').hide();
	$('#viet').hide();
}

function openVietCrypt() {
  hideAll();
  $('#viet').show();
  $('#btnVietEncrypt').click(function() {
    $('#vietAnswerLabel').html("Зашифрованный текст");
    $('#vietAnswer').val(viet($('#vietText').val(), $('#vietKey').val(), true));
    $('#vietAnsWrap').show();
  });
  $('#btnVietDecrypt').click(function() {
    $('#vietAnswerLabel').html("Расшифрованный текст");
    $('#vietAnswer').val(viet($('#vietText').val(), $('#vietKey').val(), false));
    $('#vietAnsWrap').show();
  });
}

function openFlasnerCrypt() {
  hideAll();
  $('#flasner').show();
  let fkey = $('#flasnerKey');
  $('#btnFlasnerMatrix').click(function() {
    let key = fkey.val();
    if (key.length % 2 === 1 || key.length === 0) {
      alert("Введите ключ, длина которого кратна 2");
      return;
    }
    let k = key.length / 2;
    window.flasnerTable = getFlasnerMatrix(k);
    window.flasnerList = [];
    for (let i = 1; i <= k * k; i++) {
      window.flasnerList.push(i);
    }
    $('#flasnerTable > tbody').empty();
    for (let i = 0; i < 2 * k; i++) {
      let row = "<tr>";
      for (let j = 0; j < 2 * k; j++) {
        row += "<td ii="+ i +" jj="+ j +" onclick='flasnerTableClick(this);'>" + window.flasnerTable[i][j]+ "</td>"
      }
      row += "</tr>";
      $('#flasnerTable > tbody:last-child').append(row);
    }
    $('#btnFlasnerEncrypt').show();
    $('#btnFlasnerDecrypt').show();
  });
  $('#btnFlasnerEncrypt').click(function() {
    $('#flasnerAnswerLabel').html("Зашифрованный текст");
    $('#flasnerAnswer').val(flasner($('#flasnerText').val(), fkey.val(), true, window.flasnerTable));
    $('#flasnerAnsWrap').show();
  });
  $('#btnFlasnerDecrypt').click(function() {
    $('#flasnerAnswerLabel').html("Расшифрованный текст");
    $('#flasnerAnswer').val(flasner($('#flasnerText').val(), fkey.val(), false, window.flasnerTable));
    $('#flasnerAnsWrap').show();
  });
}

function openCesarCrypt() {
  hideAll();
  $('#cesar').show();
  $('#btnCesarEncrypt').click(function() {
    $('#cesarAnswerLabel').html("Зашифрованный текст");
    $('#cesarAnswer').val(cesar($('#cesarText').val(), $('#cesarKey').val(), true));
    $('#cesarAnsWrap').show();
  });
  $('#btnCesarDecrypt').click(function() {
    $('#cesarAnswerLabel').html("Расшифрованный текст");
    $('#cesarAnswer').val(cesar($('#cesarText').val(), $('#cesarKey').val(), false));
    $('#cesarAnsWrap').show();
  });
}

function openAtbashCrypt() {
  hideAll();
  $('#atbash').show();
  $('#btnAtbash').click(function() {
    $('#atbashAnswer').val(atbash($('#atbashText').val()));
    $('#atbashAnsWrap').show();
  });
}

function openReplaceCrypt() {
  hideAll();
  $('#replace').show();
  let alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  $('#btnGenPermutation').click(function() {
    $('#replacePermutation').val(alph.shuffle());
  });

  $('#btnReplaceEncrypt').click(function() {
    $('#replaceAnswerLabel').html("Зашифрованный текст");
    $('#replaceAnswer').val(commonReplace($('#replaceText').val(), $('#replacePermutation').val(), true));
    $('#replaceAnsWrap').show();
  });
  $('#btnReplaceDecrypt').click(function() {
    $('#replaceAnswerLabel').html("Расшифрованный текст");
    $('#replaceAnswer').val(commonReplace($('#replaceText').val(), $('#replacePermutation').val(), false));
    $('#replaceAnsWrap').show();
  });
}

function openFrequencyAnalysis() {
	hideAll();
  $('#frequency-analysis').show();
  $('#btnAnalysis').click(function(){
    // get frequency from text
    let text = $('#textToFreq').val().toUpperCase();
	console.log(text);
	if (text != "") {
    let isBiagram = $('#isBiagram').prop("checked");
    let freq = {};
    if (isBiagram) {
      freq = freq2Analysis(text);
    } else {
      freq = freqAnalysis(text);
    }
		let freqs = sortObject(freq);
		// set frequency in table
		$('#tableFreqAnswer > tbody').empty();
		for (let i in freqs) {
      if (freqs[i].value > 0.000001) {
        $('#tableFreqAnswer > tbody:last-child').append('<tr><td>'+ freqs[i].key +'</td><td>'+ freqs[i].value.toFixed(5) +'</td></tr>');
      }
		}
		console.log(freqs);
		$('#tableFreqAnswer').show();
    if (!isBiagram) {
      $('#wrapFreqAnswer').show();
      $('#btnHackFreq').click(function() {
        // try to decode with original frequency
        $('#textFreqAnswer').val(decodeByFrequency(text, freq));
        $('#freqDecodedWrap').show();
      })
    } else {
      $('#wrapFreqAnswer').hide();
      $('#freqDecodedWrap').hide();
    }
	} else {
		alert("Введите текст");
	}
  })
}

// Algorithm
function viet(text, k, isEncrypt) {
  let blocks = getBlocks(text, k * k);
  let result = "";
  blocks.forEach(function (str) {
    if (isEncrypt) {
      let i = 1;
      let j = 1;
      for (let it = 1; it <= k * k; it++) {
        result += str[(i - 1) * k + j - 1];
        if ((i + j) % 2 === 0) {
          if (j < k) j++;
          else i += 2;
          if (i > 1) i--;
        } else {
          if (i < k) i++;
          else j += 2;
          if (j > 1) j--;
        }
      }
    } else {
      let i = 1;
      let j = 1;
      let cBlock = Array(k * k);
      for (let it = 1; it <= k * k; it++) {
        cBlock[(i - 1) * k + j - 1] = str[it - 1];
        if ((i + j) % 2 === 0) {
          if (j < k) j++;
          else i += 2;
          if (i > 1) i--;
        } else {
          if (i < k) i++;
          else j += 2;
          if (j > 1) j--;
        }
      }
      result += cBlock.join("");
    }
  });
  return result;
}

function flasner(text, key, isEncrypt, matrix) {
  if (key.length % 2 === 1) {
    alert("Введите ключ, длина которого кратна 2");
    return;
  }
  let k = key.length / 2;
  let side = k * k;
  let blocks = getBlocks(text, side * side);
  let result = "";

  blocks.forEach(function (block, i) {
    result += flasnerBlock(block, key, isEncrypt, matrix);
  });
  return result;
}

function flasnerTableClick(el) {
  let i = el.getAttribute('ii');
  let j = el.getAttribute('jj');
  let pos = window.flasnerList.indexOf(parseInt($(el).html()));
  if (pos === -1) {
    alert("Выберите возможную ячейку. Оставшиеся числа: " + window.flasnerList.join(", "))
  } else {
    window.flasnerList.splice(pos, 1);
    window.flasnerTable[i][j] = -1;
    $(el).prop('style', 'background: lightgray;')
  }
}

function getFlasnerMatrix(k) {
  let matrix = [];
  for (let i = 0; i < 2 * k; i++) {
    matrix.push(Array(2*k).fill(0));
  }
  let m1 = [];
  for (let i = 0; i < k; i++) {
    m1.push(Array(k).fill(0));
  }
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      m1[i][j] = i * k + j + 1;
      matrix[i][j] = m1[i][j];
    }
  }
  let m2 = rotateRight90(m1);
  let m3 = rotateRight90(m2);
  let m4 = rotateRight90(m3);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      matrix[i][j+k] = m2[i][j];
      matrix[i+k][j] = m4[i][j];
      matrix[i+k][j+k] = m3[i][j];
    }
  }
  return matrix;
}

// only for square matrix
function rotateRight90(matrix) {
  let k = matrix.length;
  let rotated = [];
  for (let i = 0; i < k; i++) {
    rotated.push(Array(k).fill(0));
  }
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      rotated[i][j] = matrix[k - j - 1][i];
    }
  }
  return rotated;
}

function flasnerBlock(block, key, isEncrypt, matrix) {
  let alph = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,!? ";
  let k = key.length / 2;
  let keyOrder = {};
  for (let i = 0; i < key.length; i++) {
    let c = key[i];
    if (!(c in keyOrder)) {
      keyOrder[c] = i;
    }
  }
  let orderArray = Array(keyOrder.length).fill(0);
  let t = 0;
  for (let i = 0; i < alph.length; i++) {
    let c = alph[i];
    if (c in keyOrder) {
      orderArray[t++] = keyOrder[c];
    }
  }
  let result = "";
  let charTable = [];
  for(let i = 0; i < 2 * k; i++) {
    charTable.push(Array(2*k).fill("ф"));
  }
  if (isEncrypt) {
    let it = 0;
    for (let kk = 0; kk < 4; kk++) {
      for (let i = 0; i < 2 * k; i++) {
        for (let j = 0; j < 2 * k; j++) {
          if (matrix[i][j] === -1) {
            charTable[i][j] = block[it++];
          }
        }
      }
      matrix = rotateRight90(matrix);
    }
    orderArray.forEach(function (j) {
      for (let i = 0; i < 2 * k; i++) {
        result += charTable[i][j];
      }
    });
  } else {
    let it = 0;
    orderArray.forEach(function (j) {
      for (let i = 0; i < 2 * k; i++) {
        charTable[i][j] = block[it++];
      }
    });
    for (let kk = 0; kk < 4; kk++) {
      for (let i = 0; i < 2 * k; i++) {
        for (let j = 0; j < 2 * k; j++) {
          if (matrix[i][j] === -1) {
            result += charTable[i][j];
          }
        }
      }
      matrix = rotateRight90(matrix);
    }
  }
  return result;
}

function getBlocks(text, size) {
  let blocks = [];
  for (let i = 0; i < text.length; i += size) {
    blocks.push(text.substring(i, Math.min(i + size, text.length)))
  }
  if (blocks[blocks.length - 1].length < size) {
    while (blocks[blocks.length - 1].length < size) {
      blocks[blocks.length - 1] += 'ф';
    }
  }
  return blocks;
}

function commonReplace(text, permutation, isEncrypt) {
  let alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (alph.indexOf(text[i].toLowerCase()) != -1) {
      let isUpper = text[i] == text[i].toUpperCase();
      let c = text[i].toLowerCase();
      if (isEncrypt) {
        let newC = '';
        if (isUpper) {
          newC = permutation[alph.indexOf(c)].toUpperCase();
        } else {
          newC = permutation[alph.indexOf(c)];
        }
        result += newC;
      } else {
        let newC = '';
        if (isUpper) {
          newC = alph[permutation.indexOf(c)].toUpperCase();
        } else {
          newC = alph[permutation.indexOf(c)];
        }
        result += alph[permutation.indexOf(c)];
      }
    } else {
      result += text[i];
    }
  }
  return result;
}

function atbash(text) {
  let alph = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,!?- ';
  let result = "";
  for (let ii = 0; ii < text.length; ii++) {
    let c = text[ii];
    result += alph[alph.length - alph.indexOf(c)];
  }
  return result;
}

function cesar(text, keyword, isEncrypt) {
  let alph = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,!?- ';
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (isEncrypt) {
      result += alph[(alph.indexOf(c) + alph.indexOf(keyword[i % keyword.length])) % alph.length];
    } else {
      result += alph[(alph.indexOf(c) - alph.indexOf(keyword[i % keyword.length]) + alph.length) % alph.length];
    }
  }
  return result;
}

function freq2Analysis(text) {
  let alph = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
  freq = {};
  for (let i = 0; i < alph.length; i++) {
    freq[alph[i]] = {};
    for (let j = 0; j < alph.length; j++) {
      freq[alph[i]][alph[j]] = 0
    }
  }
  let length = 0;
  for (let i = 0; i < text.length - 1; i++) {
    if (alph.includes(text[i]) && alph.includes(text[i + 1])) {
      freq[text[i]][text[i+1]]++;
      length++;
    }
  }
  for (let i = 0; i < alph.length; i++) {
    for (let j = 0; j < alph.length; j++) {
      freq[alph[i]][alph[j]] /= length;
    }
  }
  let freqLin = {};
  for (let i = 0; i < alph.length; i++) {
    for (let j = 0; j < alph.length; j++) {
      freqLin[""+alph[i]+alph[j]] = freq[alph[i]][alph[j]];
    }
  }
  return freqLin;
}

function freqAnalysis(text) {
  let alph = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
  freq = {};
  for (let i = 0; i < alph.length; i++) {
    freq[alph[i]] = 0;
  }
  let length = 0;
  for (let i = 0; i < text.length; i++) {
    if (alph.includes(text[i])) {
      freq[text[i]]++;
      length++;
    }
  }
  for (let i = 0; i < alph.length; i++) {
    freq[alph[i]] /= length;
  }

  return freq;
}

function decodeByFrequency(text, freq) {
  let alph = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
  let freqs = sortObject(freq);
  let origFreqs = sortObject(originalFreq);
  let permutation = {};
  for (let i = 0; i < freqs.length; i++) {
    permutation[freqs[i].key] = origFreqs[i].key;
  }
  let ans = "";
  for (let i = 0; i < text.length; i++) {
    if (alph.includes(text[i])) {
      ans += permutation[text[i]];
    } else {
      ans += text[i];
    }
  }
  return ans;
}

// Utils
function sortObject(obj) {
    let arr = [];
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}

String.prototype.shuffle = function () {
    let a = this.split(""),
        n = a.length;

    for(let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
};
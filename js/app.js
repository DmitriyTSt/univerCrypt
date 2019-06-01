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
  }
}

// UI
function hideAll() {
	$('#frequency-analysis').hide();
	$('#cesar').hide();
	$('#atbash').hide();
	$('#replace').hide();
	$('#flasner').hide();
}

function openFlasnerCrypt() {
  hideAll();
  $('#flasner').show();
  $('#btnFlasnerEncrypt').click(function() {
    $('#flasnerAnswerLabel').html("Зашифрованный текст");
    $('#flasnerAnswer').val(flasner($('#flasnerText').val(), $('#flasnerKey').val(), true));
    $('#flasnerAnsWrap').show();
  });
  $('#btnFlasnerDecrypt').click(function() {
    $('#flasnerAnswerLabel').html("Расшифрованный текст");
    $('#flasnerAnswer').val(flasner($('#flasnerText').val(), $('#flasnerKey').val(), false));
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
  let alph = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,!?- ';
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
function flasner(text, key, isEncrypt) {
  if (key.length % 2 === 1) {
    alert("Введите ключ, длина которого кратна 2");
    return;
  }
  let k = ley.length / 2;
  let side = k * k;

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
  let alph = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,!?- ';
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (isEncrypt) {
      result += permutation[alph.indexOf(c)];
    } else {
      result += alph[permutation.indexOf(c)];
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
  freqLin = {};
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
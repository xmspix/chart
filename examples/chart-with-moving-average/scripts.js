/**
 * Functions
 */

function setLegendText(value, text) {
    let val = 'n/a';
    if (value !== undefined) {
        val = (Math.round(value * 100) / 100).toFixed(2);
    }
    legend.innerHTML = 'SMA50 <span style="color:rgba(4, 111, 232, 1)">' + val + '</span>';
}

function setPriceLegend(text) {
    legend.innerHTML = text;
}

function priceFormater(price) {
    return price.toFixed(2);
}

function volumeFormater(price) {
    if (price >= 1000000000) {
        return (price / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
    }
    if (price >= 1000000) {
        return (price / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
    }
    if (price >= 1000) {
        return (price / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    }
    return price;
}

function calculateSMA(data, count) {
    var avg = function (data) {
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum += data[i].c;
        }
        return sum / data.length;
    };
    var result = [];
    for (var i = count - 1, len = data.length; i < len; i++) {
        var val = avg(data.slice(i - count + 1, i));
        result.push({ timestamp: data[i].timestamp, c: val });
    }
    return result;
}
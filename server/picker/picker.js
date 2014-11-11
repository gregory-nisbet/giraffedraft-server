// Stats library with no external dependencies
// only exports playerStore
// playerStore has two public methods
// reset and top
// top gives you the op n players not taken so far
// reset resets the


var mean = function (arr) {
	return sum(arr)/arr.length
};

var sum = function (arr) {
	var out = 0;
	for (var ii = 0; ii < arr.length; ii++) {
		out += +arr[ii];
	}
	return out;
};

var variance = function (arr) {
	var sqsum = sum(arr.map(function (x){return x*x}));
	var sumsq = Math.pow(sum(arr),2);
	return sqsum - sumsq;
};

var colMeans = function (header, aoh) {
	// means by a given header
	var out = {};
	header.map(function (colName) {
		out[colName] = 
			mean(aoh.map(function (obj){
				return obj[colName];
			}));
	});
	return out;
};

var dot = function (x,y) {
	// dot product
	return x.map(function (el, i) {
		return el * y[i];
	});
}



var PlayerStore = function (header, aoh, weights) {
	// produce queryable data structure with custom weights
	if (!weights) {
		weights = [];
		for (var ii = 0; ii < header.length; ii++) {
			weights[ii] = 1;
		}
	}
	var means = colMeans(header, aoh);

	var coefficients = weights.map(function (item, i) {return item/means[i]});

	var scoreNth = function (nth) {
		var traits = header.map(function (item){return aoh[nth][item]});
		return dot(traits, coefficients);
	};

	var dataScorePairs = aoh.map( function (item, index) {
		return [item, scoreNth(index)];
	});

	// sort by first element
	dataScorePairs.sort( function (a,b) {
		return (a[1] > b[1]) - (a[1] < b[1]);
	}).reverse();
	
	this._header = header;
	this._data = aoh;
	this._weights = weights;
	this._means = means;
	this._coefficients = coefficients;

	this._dataScorePairs = dataScorePairs;

	this._taken = {};

	this.top = function (n) {
		var out = [];
		var ii = 0;
		while (out.length <= n && ii < this.dataScorePairs.length) {
			var pair = this._dataScorePairs[ii];
			if (ii in this._taken) {
				// do nothing
			} else {
				out.push(this._dataScorePairs[ii]);
			}
			ii++;
		}
		return out;
	}

	this.reset = function (n) {
		this._taken = {};
	}
};



module.exports.PlayerStore = PlayerStore;

module.exports.getPicks =  function(data){
	var out = [];
	console.log(data);
	for(var i = 0; i < 3; i++){
		out.push(data[i]);
	}
	return out;
}

module.exports.getPicks =  function(data){
	var out = [];
	console.log(data);
	for(var i = 0; i < 3; i++){
		out.push(data[i]);
	}
	return out;
}
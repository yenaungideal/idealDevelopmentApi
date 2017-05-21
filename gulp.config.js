module.exports = function() {
 
var config = { 
	nodeServer:'server/app.js',
	nodemonIgnore:['./node_modules/**','www/*.*']
};
 
 return config; 
 };
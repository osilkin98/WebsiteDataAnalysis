var keywords = "";
for(var i = 1; i < 51; i++) {
	keywords = keywords + document.getElementsByClassName("col-keywords")[i].outerText + ", ";
}

console.log(keywords);

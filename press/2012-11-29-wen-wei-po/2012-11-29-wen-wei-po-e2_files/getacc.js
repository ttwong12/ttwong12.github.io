var wrDefaultAcc = "";
var wrUrl="http://c.wrating.com/";
var wrPattern = {	
		0 : { "id": "860755-2013010100", "pattern": /^http:\/\/www.wenweipo.com\//i},
		1 : { "id": "860755-2013020100", "pattern": /^http:\/\/paper.wenweipo.com\//i},
		2 : { "id": "860755-2013030100", "pattern": /^http:\/\/news.wenweipo.com\//i},
		3 : { "id": "860755-2013040100", "pattern": /^http:\/\/blog.wenweipo.com\//i},
		4 : { "id": "860755-2013050100", "pattern": /^http:\/\/bbs.wenweipo.com\//i},
		5 : { "id": "860755-2013060100", "pattern": /^http:\/\/v.wenweipo.com\//i},
		6 : { "id": "860755-2013070100", "pattern": /^http:\/\/info.wenweipo.com\//i},
		7 : { "id": "860755-2013080100", "pattern": /^http:\/\/survey.wenweipo.com\//i},
		8 : { "id": "860755-2013090100", "pattern": /^http:\/\/sp.wenweipo.com\/racing\//i},
		9 : { "id": "860755-2013100100", "pattern": /^http:\/\/hot.wenweipo.com\//i},
		10 : { "id": "860755-2013110100", "pattern": /^http:\/\/photo.wenweipo.com\//i},
		11 : { "id": "860755-2013120100", "pattern": /^http:\/\/xf.wenweipo.com\//i},
		12 : { "id": "860755-2013130100", "pattern": /^http:\/\/pdf.wenweipo.com\//i},
		13 : { "id": "860755-2013140100", "pattern": /^http:\/\/trans.wenweipo.com\/gb\//i},
		14 : { "id": "860755-2013150100", "pattern": /^http:\/\/bj.wenweipo.com\//i},
		15 : { "id": "860755-2013160100", "pattern": /^http:\/\/gd.wenweipo.com\//i},
		16 : { "id": "860755-2013170100", "pattern": /^http:\/\/yn.wenweipo.com\//i},
		17 : { "id": "860755-2013180100", "pattern": /^http:\/\/hn.wenweipo.com\//i},
		18 : { "id": "860755-2013190100", "pattern": /^http:\/\/sc.wenweipo.com\//i},
		19 : { "id": "860755-2013200100", "pattern": /^http:\/\/sx.wenweipo.com\//i},
		20 : { "id": "860755-2013210100", "pattern": /^http:\/\/sd.wenweipo.com\//i},
		21 : { "id": "860755-2013220100", "pattern": /^http:\/\/cq.wenweipo.com\//i},
		22 : { "id": "860755-2013230100", "pattern": /^http:\/\/gx.wenweipo.com\//i},
		23 : { "id": "860755-2013240100", "pattern": /^http:\/\/nx.wenweipo.com\//i},
		24 : { "id": "860755-2013250100", "pattern": /^http:\/\/ln.wenweipo.com\//i},
		25 : { "id": "860755-2013260100", "pattern": /^http:\/\/hun.wenweipo.com\//i}


};
function get_acc() 
{
	var current_url = window.location.toString();
	for (var x in wrPattern)
	{		
		
		try
		{
			if (wrPattern[x]['pattern'].test(current_url))
			{			
				return wrPattern[x]['id'];
			}
		}
		catch (e)
		{
		}	
	}	
	return wrDefaultAcc;
}
var vjAcc = get_acc();
if (vjAcc != "")
{
	vjTrack("");
}
function gotoBrowser_cn(input) {
	if (navigator.browserLanguage.substr(0,2) == "zh") {
		if (navigator.browserLanguage.substr(3,2) == "cn") {
			self.location = input;
		} else if ((navigator.browserLanguage.substr(3,2) == "hk") || (navigator.browserLanguage.substr(3,2) == "tw")) {
//			self.location = input
		} else if (navigator.browserLanguage.substr(3,2) == "sg") { // goto eng version
//			self.location = input
		} else { // goto cn version
			self.location = input;
		}
	} else { // goto eng version
//			self.location = input
	}
}

function gotoBrowser_hk(input) {
	if (navigator.browserLanguage.substr(0,2) == "zh") {
		if (navigator.browserLanguage.substr(3,2) == "cn") {
//			self.location = input;
		} else if ((navigator.browserLanguage.substr(3,2) == "hk") || (navigator.browserLanguage.substr(3,2) == "tw")) {
			self.location = input
		} else if (navigator.browserLanguage.substr(3,2) == "sg") { // goto eng version
			self.location = input
		} else { // goto cn version
//			self.location = input;
		}
	} else { // goto eng version
//			self.location = input
	}
}

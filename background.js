chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	let data = request.msg.data;
	const dataLines = data.split("\n");
	for (const dataline of dataLines) {
		
		if (dataline === "" || dataline ===" ") {
			continue;
		}
		const datePattern = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/;
		const dateInput = dataline.match(datePattern);

		let date=false;
		let outlet=false;
		let headline=false;
		let duration=false;
		
		if(dateInput){
			let fieldValues = dateInput.input.split("\t");
			date=fieldValues[0];
			outlet=fieldValues[1];
			headline=fieldValues[2];
			duration=fieldValues[3];
		}
		
		await chrome.tabs.create(
			{
				url: "https://bodhi.carma.com/articles/new",
				active: false,
			},
			(tab) => {
				chrome.tabs.executeScript(
					tab.id,
					{
						file: "./content.js",
					},
					() => {
						chrome.tabs.sendMessage(tab.id, {
							outlet,
							date,
							headline,
							duration,
							provider:request.provider,
							project:request.project,
							keyword:request.keyword
					 	});
					}
				);
			}
		);
	}
});

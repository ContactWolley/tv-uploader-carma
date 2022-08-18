chrome.runtime.onMessage.addListener(async function (
	request,
	sender,
	sendResponse
) {
	console.log(request)
	const provider = request.provider;
	const project = request.project;
	const keyword = request.keyword;
	const headline = request.headline;
	const duration = request.duration;
	const date = request.date;
	let outletId;
	let outletLang;
	let outletCountry;
	const outletMain = request.outlet;

	if(!duration || !date){
		alert("check data")
		return;
	}

	try {
		await fetch(`https://bodhi.carma.com/outlets?q=${outletMain}&media_types=tv`)
		.then((response) => response.json())
		.then((data) => {
			if (data.outlets.length === 0){
				alert(`${outletMain} is not available, please add to proceed`) 
			}else{
				for (const outlet of data.outlets) {
					if (outlet.name === outletMain) {
						outletId = outlet.id;		
						outletLang = outlet.languages[0];
						outletCountry = outlet.location.country_code;
						return execute(outletId,outletLang,outletCountry,headline,provider,project,keyword,date,duration);					
					}
				}
			} 
		})
	} catch (err) {
		console.log(err);
		alert("error 403");
	}
});


const execute=(outletId,outletLang,outletCountry,headline,provider,project,keyword,date,duration)=>{
	document.getElementById("metadata").innerHTML=
	`
	<label for="article_clip_length">Duration</label>
	<input type="text" value=${duration} name="article[clip_length]" id="article_clip_length" placeholder="hh:mm:ss" />
	</div>
	`
	const currentTimeMs=new Date().getTime()
	const countryField = document.getElementById("article_country").innerHTML=`<option value=${outletCountry} selected="selected"></option`;
	const outletField = document.getElementById("article_outlet_id").innerHTML=`<option value=${outletId} selected="selected"></option`; ;	
	const providerField = document.getElementById("article_provider_name").value=provider;
	const dateField = document.getElementById("article_published_at").value=date;
	const languageSelect = document.createElement("select")
	languageSelect.name = "article[language]";
	languageSelect.id = "article_language";
	languageSelect.innerHTML=`<option value=${outletLang} selected="selected"></option>`;
	const languageFields = document.getElementById("section-fields").appendChild(languageSelect);
	const articleHeadline = document.getElementById("article_headline").value = headline;
	const keywordSelect = document.getElementById("article_keywords").innerHTML=`<option value="${keyword}" selected="selected"></option>`;
	const file = document.getElementsByClassName("item-container large")[0].innerHTML=""
	// Useless form requests
	const Project = document.getElementsByClassName("codings")[0].innerHTML=
	`
		<input class="coding_project_id" type="hidden" name="article[codings_attributes][${currentTimeMs}][project_id]" id="article_codings_attributes_${currentTimeMs}_project_id" value=${project}>
		<input name="article[codings_attributes][${currentTimeMs}][sentiment]" value="neutral" id="article_codings_attributes_${currentTimeMs}_neutral" class="sentiment_input" type="radio" data-label="Neutral">
		<textarea class="text optional" name="article[codings_attributes][${currentTimeMs}][summary]" id="article_codings_attributes_${currentTimeMs}_summary"></textarea>
		<input type="hidden" value="false" name="article[codings_attributes][${currentTimeMs}][_destroy]" id="article_codings_attributes_${currentTimeMs}__destroy">
	`
	const sentimentButton = document.querySelector(`#article_codings_attributes_${currentTimeMs}_neutral`)
	sentimentButton.checked = true;
	document.getElementById("submit-article").click();
	
}

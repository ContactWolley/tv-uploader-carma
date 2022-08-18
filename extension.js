
document.getElementById("provider").addEventListener("focus",()=>{
	document.getElementById("projectOptions").innerHTML=""
	document.getElementById("project-input").value=""
})

let timer = null;

const getProjects =()=>{
	clearTimeout(timer); 
	timer = setTimeout(async()=>{
		const provider = document.getElementById("provider").value;
		await fetch(`https://bodhi.carma.com/projects/available?article=undefined&q=${projectValue.value}&provider=${provider}`)
		.then(res=>res.json())
		.then(res=>{
			document.getElementById("projectOptions").innerHTML=""
			let projects=res.projects
			projects.forEach(element => {
				const option =document.createElement("option")
				option.value=element.id	
				option.innerHTML=`${element.name} <span >(${element.code})</span>`
				document.getElementById("projectOptions").appendChild(option)
			});	
		})
	},500)
}

const getKeywords = ()=>{
	clearTimeout(timer); 
	timer = setTimeout(async()=>{
		await fetch(`https://bodhi.carma.com/articles/keywords`)
		.then(res=>res.json())
		.then(res=>{
			document.getElementById("keywordOptions").innerHTML=""
			let keywords = res;
			keywords.forEach(element=>{
				const option =document.createElement("option")
				option.value=element
				option.innerHTML=element;
				document.getElementById("keywordOptions").appendChild(option)
			})
		})
	}, 500)
	
}

const projectValue=document.getElementById("project-input")
projectValue.addEventListener("keyup",getProjects)

const keywordValue=document.getElementById("keyword-input")
keywordValue.addEventListener("keyup",getKeywords)

const sendInfo = (e) => {
	if(!projectValue.value){
		return alert("Please enter a valid project")
	}else{
		e.preventDefault();
		const data = document.getElementById("outlets-textarea").value;
		const provider = document.getElementById("provider").value;
		chrome.runtime.sendMessage({
			msg: {data},
			provider:provider,
			project:projectValue.value,
			keyword:keywordValue.value
		});
	}
};

document.getElementById("btn").addEventListener("click", sendInfo);

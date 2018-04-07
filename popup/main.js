let listEnvironments = document.querySelector(".list-environments")
let btnAddEnv = document.getElementById("btn-add-env");

let addEnvironment = function(url, color){
	let environmentNode =  document.createElement("section");
	environmentNode.classList.add("environment");

	let envColor = document.createElement("input");
	envColor.type = "color";
	envColor.value = color || randomDefaultColor();
	envColor.addEventListener("change", updateEnvironments, false);
	environmentNode.appendChild(envColor);
	
	let envDomain = document.createElement("input");
	envDomain.placeholder = "*.dev.example.com";
	envDomain.value = url || "";
	envDomain.addEventListener("input", updateEnvironments, false);
	environmentNode.appendChild(envDomain);

	let envRemove = document.createElement("button");
	envRemove.className = "btn-remove";
	envRemove.textContent = "Remove";
	envRemove.addEventListener("click", () => removeEnvironment(environmentNode), false);
	environmentNode.appendChild(envRemove);

	listEnvironments.appendChild(environmentNode);
}

let randomDefaultColor = function(){
	let flatColors = [ "#0a84ff", "#00feff", "#ff1ad9", "#30e60b", "#ffe900", "#ff0039", "#9400ff", "#ff9400", "#363959", "#737373"];
	return flatColors[ Math.floor(Math.random() * flatColors.length)];
}

let removeEnvironment = function(section){
	section.remove();
	updateEnvironments();
}

let updateEnvironments = function(){
	let environments = {};
	for (let el of listEnvironments.children){
		let url = el.querySelector("input[type=text]").value;
		if(!url){
			continue;
		}
		environments[url] = el.querySelector("input[type=color]").value;
	}
	browser.storage.local.set({"environments": environments}).catch(function(err){
		btnAddEnv.setCustomValidity("Could not save your environments");
		btnAddEnv.reportValidity();
	});
}

btnAddEnv.addEventListener("click", function(){ addEnvironment(); updateEnvironments()}, false)

document.addEventListener("DOMContentLoaded", function(){
	browser.storage.local.get("environments")
	.then(function(results){
		let { environments } = results;
		Object.keys(environments).map(function(value){
			addEnvironment(value, environments[value]);
		});
	})
	.catch(function(err){
		btnAddEnv.setCustomValidity("Could not load your environments");
		btnAddEnv.reportValidity();
	})
}, false)

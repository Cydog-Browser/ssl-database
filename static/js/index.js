const fileString = document.getElementById("file-string");
const topBar = document.getElementById('top-bar');
const domain = document.getElementById("domain");
const readable = document.getElementById("readable");
const certificate = document.getElementById("certificate");
const publicHash = document.getElementById("public-hash");
const download = document.getElementById("download");
const searcher = document.getElementById("searcher");
searcher.addEventListener("submit", (e) => {
    e.preventDefault();
    let query = document.getElementById("query");
    let queryString = query.value;
    console.log(queryString);
    window.location.href = `index.html?q=${queryString}.txt` 
});
let url = window.location.href;
if(url.includes("?q=")){
    let urlArray = url.split("?q=");
    let newArray = urlArray[1].split(".txt");
    catchQuery(urlArray[1]);
    readable.addEventListener('click', () => {
        catchQuery(urlArray[1]);
    });
    certificate.addEventListener('click', () => {
        getCert(`${newArray[0]}.crt`);
    });
    publicHash.addEventListener('click', () => {
        getPublicHash(urlArray[1]);
    });
    download.href = `certs/crt/${newArray[0]}.crt`;
    domain.innerText = newArray[0];
    domain.addEventListener('click', () => {
        //window.location.href = `https://${domain.innerText}`;
        window.open(`https://${domain.innerText}`);
    });
} else {
    startPage();
    readable.addEventListener('click', () => {
        startPage();
    });
    certificate.addEventListener('click', () => {
        getCert("cydogbrowser.com.crt");
    });
    publicHash.addEventListener('click', () => {
        getPublicHash("cydogbrowser.com.txt");
    });
    download.href = "certs/crt/cydogbrowser.com.crt";
    domain.innerText = "cydogbrowser.com";
    domain.addEventListener('click', () => {
        //window.location.href = `https://${domain.innerText}`;
        window.open(`https://${domain.innerText}`);
    });
}
setThemeViewerOptions();
async function startPage(){
    try {
        await fetch("certs/readable/cydogbrowser.com.txt").then(
            async(response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    return `There was a ${response.status} with this query`;
                }
            }
        ).then(data => showInfo(data));
    } catch (error) {
        fileString.innerText = `Looks like there was an issue with this query\n\n${error}`;
    }
    function showInfo(data) {
        fileString.innerText = data;
    }
}
async function catchQuery(requestedDomain){
    try {
        await fetch(`certs/readable/${requestedDomain}`).then(
            async(response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    return `There was a ${response.status} with this query`;
                }
            }
        ).then(data => showInfo(data));
    } catch (error) {
        fileString.innerText = `Looks like there was an issue with this query\n\n${error}`;
    }
    function showInfo(data) {
        fileString.innerHTML = splitReadableCertificate(data);
        fileString.style.wordBreak = "break-word";
        highlightDate();
    }
}
function splitReadableCertificate(text) {
    //const sanitizedText = text.replaceAll(" ", "");
    // Split the string while preserving delimiters
    const parts = text.split(/(:)/g);
            
    // Process segments with conditions
    const processed = [];
    let currentSegment = '';
    
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === ':') {
            if (currentSegment.length >= 2 && !currentSegment.includes(':')) {
                processed.push(`${currentSegment}`);
                processed.push(':');
                currentSegment = '';
            } else {
                currentSegment += ':';
            }
        } else {
            currentSegment += parts[i];
        }
    }
    
    // Add remaining segment
    if (currentSegment.length > 0) {
        processed.push(currentSegment);
    }
    let newArray = processed.filter(element => element !== ":");
    let newArray2 = newArray.filter(element => element.length > 4);
    return `${newArray2.map(newArray2 => `&nbsp;${newArray2.trim()}`).join('')}&nbsp;`;
}
function highlightDate(){
    const regex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}&nbsp;\d{2}\s+\d{4}\s+GMT\b/g;
    var text = fileString.innerHTML;
    const classNumber = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    text = text.replace(regex, `<mark class="time-${classNumber}">$&</mark>`);
    const regex2 = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}&nbsp;\d{2}\.\d{3}\s+\d{4}\s+GMT\b/gi;
    text = text.replace(regex2, `<mark class="time-${classNumber}">$&</mark>`);
    const classNumberElements = document.querySelectorAll(`.time-${classNumber}`);
    classNumberElements.forEach(element => {
        var elementText = element.innerHTML;
        elementText = elementText.replace("&nbsp;", ":");
        element.innerHTML = elementText;
    });
    fileString.innerHTML = text;
}
async function getCert(requestedDomain){
    try {
        await fetch(`certs/crt/${requestedDomain}`).then(
            async(response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    return `There was a ${response.status} with this query`;
                }
            }
        ).then(data => showInfo(data));
    } catch (error) {
        fileString.innerText = `Looks like there was an issue with this query\n\n${error}`;
    }
    function showInfo(data) {
        fileString.innerText = data;
    }
}
async function getPublicHash(requestedDomain){
    try {
        await fetch(`publickeys/${requestedDomain}`).then(
            async(response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    return `There was a ${response.status} with this query`;
                }
            }
        ).then(data => showInfo(data));
    } catch (error) {
        fileString.innerText = `Looks like there was an issue with this query\n\n${error}`;
    }
    function showInfo(data) {
        fileString.innerText = data;
        //let newArray = requestedDomain.split(".txt");
        //getHeaders(newArray[0]);
    }
}
function setThemeViewerOptions(){
    const themeMode = document.getElementById("theme-mode");
    var savedTheme = localStorage.getItem('theme');
    if(savedTheme != undefined && savedTheme != null){
        setTheme(savedTheme);
        themeMode.value = savedTheme;
    }
    themeMode.addEventListener("change", function() {
        const themeValue = themeMode.value;
        setTheme(themeValue);
    });
}
function setTheme(themeValue){
    if(themeValue.includes("dark-mode")){
        fileString.style.backgroundColor = "#090300";
        fileString.style.color = "#A5A2A2";
        topBar.style.backgroundColor = "#090300";
        localStorage.setItem('theme', themeValue);
    } else if(themeValue.includes("light-mode")){
        fileString.style.backgroundColor = "#f7f7f7";
        fileString.style.color = "#101010";
        topBar.style.backgroundColor = "#f7f7f7";
        localStorage.setItem('theme', themeValue);
    } else if(themeValue.includes("cobalt-mode")){
        fileString.style.backgroundColor = "#0d1926";
        fileString.style.color = "#0883FF";
        topBar.style.backgroundColor = "#0d1926";
        localStorage.setItem('theme', themeValue);
    } else if(themeValue.includes("turtler-mode")){
        fileString.style.backgroundColor = "#18201e";
        fileString.style.color = "#3BE381";
        topBar.style.backgroundColor = "#18201e";
        localStorage.setItem('theme', themeValue);
    } else if(themeValue.includes("stormer-mode")){
        fileString.style.backgroundColor = "#1d262f";
        fileString.style.color = "#6E9BCF";
        topBar.style.backgroundColor = "#1d262f";
        localStorage.setItem('theme', themeValue);
    }
}
async function getHeaders(requestedDomain){
    fetch(`https://${requestedDomain}`, {
        mode: 'no-cors'
      }).then(response => {
    const headers = response.headers; 
    const HPKP = headers.get('Public-Key-Pins'); 
  });
}
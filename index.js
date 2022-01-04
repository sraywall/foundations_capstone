const searcher = document.querySelector("#searcher")
const results = document.querySelector("#results")
const toggle = document.querySelector("#lang-toggle")
const dropbtn = document.querySelector(".dropbtn")
const dropdown = document.querySelector("#myDropdown")
let language = "eng"
toggle.addEventListener('change',()=>{
    // console.log("checked: ",toggle.checked)
    searcher.value = ""
    if(toggle.checked){
        searcher.placeholder="Enter a Navajo word..."
        language="nav"
    } else {
        searcher.placeholder="Enter an English word..."
        language="eng"
    }
})

searcher.addEventListener("keyup",(e)=>{
    if(!searcher.value){
        results.innerHTML="";
        return
    }
    if(e.key === "Enter"){
        console.log(`added ${searcher.value}!!`)
        let bodyObj = {
            Word:searcher.value
        }
        axios.post(`http://localhost:8765/save`,bodyObj).then(({data:saves})=>{
            // ({data:saves}  = res)
            dropdown.innerHTML = ""
            for(let save of saves){
                let link = document.createElement("a")
                link.textContent = save
                dropdown.appendChild(link)
            }
        })
    } else {
        // console.log(`https://translate.ge/api/${searcher.value}`);
        let curr = searcher.value
        //`https://swapi.dev/api/people/?search=${curr}`
        axios.get(`http://localhost:8765/${language}/${curr}`).then(res=>{
            // const {id:num,name} = res.data
            // if(num && name){
            //     console.log("name:",name,"number:",num)
            // }
            // console.log(res)
            if(curr===searcher.value){
                results.innerHTML="";
                for(obj of res.data){
                    let entry = document.createElement("li")
                    let definition = document.createElement("span")
                    let word = document.createElement("strong")
                    word.textContent = obj.Word;
                    definition.textContent=`: ${obj.Def}`
                    entry.appendChild(word)
                    entry.appendChild(definition)
                    results.appendChild(entry)
                }
            }
        }).catch(err=>{console.log(err)})
    }
})
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
dropbtn.addEventListener("click",()=>{
    dropdown.classList.toggle("show")
})  
  // Close the dropdown if the user clicks outside of it
window.addEventListener("click",(event)=>{
    if (!event.target.matches('.dropbtn')) {
        if(dropdown.classList.contains('show')){
            dropdown.classList.remove('show')
        }
      }
  })
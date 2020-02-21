const msgArea = document.querySelector('#msg');
const q = document.querySelector('#q');
const answers = document.querySelector('#answers');
const categorySel = document.querySelector("#category");
const complexitySel = document.querySelector("#complexity");
const startStopBut = document.querySelector("#startStop");
const nextBut = document.querySelector("#next");
const nextBut2 = document.querySelector("#next2");

var optionSelected = false;
var categoryItems = null;



var curQNo=0;
var selAnswer= "";
var score=0;

function resetQuiz(){
    curQNo=0;
    selAnswer= "";
    score=0;
    msg("");
    nextBut.style.cssText="";
    nextBut.innerHTML="";
    nextBut2.style.cssText="";
    nextBut2.innerHTML="";
    q.innerHTML="";
     
    clearOptions();
}
   //Get Categories & populate.
        axios({
            url: 'https://opentdb.com/api_category.php',
            method: 'get'
        }).then(response =>{
            console.log(response);
            categoryItems=response.data.trivia_categories;

            var newOpt; 
            for(i=0; i<categoryItems.length; i++){
                newOpt= document.createElement('option')  
                newOpt.setAttribute('value', categoryItems[i].id);
                newOpt.text = categoryItems[i].name;
                categorySel.appendChild(newOpt);
            }
        }).catch(error =>{
            console.log(error);
        });
        
 function startTest(){


    axios({
        url: `https://opentdb.com/api.php?amount=10&category=${categorySel.value}&difficulty=${complexitySel.value}`, 
        method: 'get'   
       })
       .then(response => {
           
           console.log (response);
           questionList = response.data.results;
           resetQuiz();
           if(questionList.length>0)
                displayQuestion(0);
            else
                msg("Sorry, Trivia is not available for the category / complexity selected. Please try something else.");
       })
       .catch(error => {
           console.log(error);
       });
 }   
startStopBut.addEventListener('click', startTest);
    

function randomGen(maxNum){
    return Math.floor(Math.random()*maxNum) ;
}


function msg(m){
    console.log(m);
    msgArea.textContent=m;
    
}


 function choiceSel(){
    if(optionSelected)
        return;
    optionSelected = true;
    selAnswer=this.id;
    this.style.backgroundColor="lightblue";
    
    if(selAnswer==questionList[curQNo].correct_answer){
        msg("Correct. Great Job.")
        score++;
    } else {
        msg ("Sorry. Incorrect Answer.");
    }
    if(questionList.length==(curQNo+1)){
        nextBut2.style.cssText='background-Color: lightpink; border: 2px  solid black; width: 100px; margin: 100px;';
        nextBut2.innerHTML="Next Trivia";
        nextBut2.addEventListener("click", ()=>{
            if(nextBut2.innerHTML!=""){
                nextBut2.style.cssText="";
                nextBut2.innerHTML="";
                startTest();
            }

        });
        msg("Your Score is "+score+" / "+questionList.length , -1);
    } else {
        nextBut.style.cssText='background-Color: lightpink; border: 2px  solid black; width: 100px; margin: 100px;';
        nextBut.innerHTML="Next Question";
        nextBut.addEventListener("click", ()=>{
            if(nextBut.innerHTML!=""){
                nextBut.style.cssText="";
                nextBut.innerHTML="";
                msg("");
                displayQuestion(curQNo+1);
            };

        });
    }
        
}



const chlds=answers.getElementsByTagName("li");

function clearOptions(){
    while( chlds.length>0)
        answers.removeChild(chlds[0]);
}

function displayQuestion(num) {
    optionSelected=false;
    if(questionList==null || questionList.length<num){
        msg("No Questions. Click start.");
    }
    curQNo=num;
    q.innerHTML=(num+1)+"). "+questionList[num].question;
     
    clearOptions();
    
    var choices= [].concat(questionList[num].incorrect_answers);
    if(questionList[num].type=='multiple')
        choices.splice(randomGen(4),0,questionList[num].correct_answer);
    else
        choices=["True", "False"];
    
    for(i=0; i<choices.length; i++){
        var newItem = document.createElement('li')  
        newItem.setAttribute('class', 'choiceStyle');
        newItem.setAttribute('id', choices[i]);
        newItem.addEventListener('click', choiceSel);
        newItem.innerHTML = choices[i];
        answers.appendChild(newItem);
    }
    console.log("End displayQuestion:"+curQNo);
}


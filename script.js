
/*******************************
*********QUIZ CONTROLLER********
*******************************/

var quizController = (function() {

    
    //*********Question Constructor*********/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    
    var QLocalStorage = {
        setQ: function(newQ){
            localStorage.setItem("qCollection",JSON.stringify(newQ));
        },
        getQ: function(){
            return JSON.parse(localStorage.getItem("qCollection"))
        },
        removeQ: function(){
            localStorage.removeItem("qCollection")
        }
    }
    
    
    if(QLocalStorage.getQ() === null){
                QLocalStorage.setQ([]);
                
            }
    var quizProgress = {
        questionIndex: 0
    };
        //***********person constructors********/
    function Person(id,fristName,LastName,score){
        this.id = id;
        this.fristName =fristName;
        this.lastName =LastName;
        this.score =score;
    }
    
    var currPersonData = {
        fullname: [],
        score: 0
    };
    var AdminPerson=['negroo','negroo']
    
    var personLocalStorage={
        setP: function(newP){
            localStorage.setItem("newPerson",JSON.stringify(newP))
        },
        getP: function(){
            return JSON.parse(localStorage.getItem("newPerson"))
        },
        removeP: function(){
            localStorage.removeItem("newPerson")
        }
    }
    if(personLocalStorage.getP() ===null){
        personLocalStorage.setP([])
    }
    
    return {
        getQuizProgress: quizProgress,
        AllQuestionList:QLocalStorage,
        
        addQuestionOnLocalStorage: function(newQuestText, opts) {
            var qId,optsArr = [],corrAns,newQ,storedQ=[],isChecked=false;
            
            
            if(QLocalStorage.getQ() === null){
                QLocalStorage.setQ([]);
                
            }
            
            for(var x=0;x<opts.length;x++){
                if(opts[x].value != ""){
                    optsArr.push(opts[x].value);
                }
                if(opts[x].previousElementSibling.checked==true&& opts[x].value !== ""){
                    corrAns=opts[x].value;   
                    isChecked=true;
                }
            }
        
            
        
            //id
            if(QLocalStorage.getQ().length>0){
                qId=QLocalStorage.getQ()[QLocalStorage.getQ().length-1].id+1
            }
            else{
                qId=0;
            }

            if(newQuestText.value !==""&& optsArr.length>1 && isChecked){
                

                newQ=new Question(qId,newQuestText.value,optsArr,corrAns);

                storedQ=QLocalStorage.getQ();
                storedQ.push(newQ);

                QLocalStorage.setQ(storedQ);

                newQuestText.value=""
                for(var i=0;i<opts.length;i++){
                    opts[i].value="";
                    if(opts[i].previousElementSibling.checked===true){
                        opts[i].previousElementSibling.checked=false;
                    }
                }
                
                return true;
            }else{
                alert("please add all  data question and options and check correct answer");
                return false;
            }
        },
        checkAnswer:function(ans){
            if(QLocalStorage.getQ()[quizProgress.questionIndex].correctAnswer===ans.textContent){
                currPersonData.score++;
                return true;
            }else{
                return false;
            }
        },
        isFinished:function(){
            return quizProgress.questionIndex+1 === QLocalStorage.getQ().length;
        },
        
        addPersonOnls: function(){
            
            var newPerson,newId,personArr;
            
            if(personLocalStorage.getP().length>0){
                newId=personLocalStorage.getP()[personLocalStorage.getP().length-1].id+1
            }else{
                newId=0
            }
            
            newPerson=new Person(newId,currPersonData.fullname[0],currPersonData.fullname[1],currPersonData.score)
            
            personArr=personLocalStorage.getP();
            personArr.push(newPerson);
            personLocalStorage.setP(personArr);
            
            
        },
        getcurrPersonData:currPersonData,
        getAdminPerson:AdminPerson,
        getPersonLoalStorage:personLocalStorage,
    
    };
    

})();

/*******************************
**********UI CONTROLLER*********
*******************************/

var UIController = (function() {

    
    var domItems = {
        //*******Admin Panel Elements********/
        adminPanel:document.querySelector(".admin-panel-container"),
        questInsertBtn: document.getElementById('question-insert-btn'),
        questUpdateBtn:document.getElementById("question-update-btn"),
        questDeleteBtn:document.getElementById("question-delete-btn"),
        clearListBtn:document.getElementById("questions-clear-btn"),
        newQuestionText: document.getElementById('new-question-text'), 
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOpsContainer:document.querySelector('.admin-options-container'),
        qWrapper:document.querySelector(".inserted-questions-wrapper"),
        isertedQwrapper:document.querySelector(".inserted-questions-wrapper"),
        //********START QUIZ SECTION****
        quizSection:document.querySelector(".quiz-container"),
        headeQ:document.getElementById("asked-question-text"),
        quizOptsWrapper:document.querySelector(".quiz-options-wrapper"),
        progressBar:document.querySelector("progress"),
        paragOfProgBar:document.getElementById("progress"),
        instanceAns:document.querySelector(".instant-answer-container"),
        instanceText:document.getElementById("instant-answer-text"),
        instanceDiv:document.getElementById("instant-answer-wrapper"),
        imotionIcon:document.getElementById("emotion"),
        nextBtn:document.getElementById("next-question-btn"),
        resultsList:document.querySelector(".results-list-wrapper"),
        clearResultsBtn:document.getElementById("results-clear-btn"),
        //*****landing sect*********8//
        landingPage:document.querySelector(".landing-page-container"),
        startQuizBtn:document.getElementById("start-quiz-btn"),
        fristnameInp:document.getElementById("firstname"),
        lastnameInp:document.getElementById("lastname"),
        //*****finalResult********//
        finalResultPage:document.querySelector(".final-result-container"),
        finalScoreText:document.getElementById("final-score-text")
        
    };

    
    return {
        getDomItems: domItems,
        addInputDyn:function(){
            var addInp=function(){
            
                var c=domItems.adminOptions.length;
                
                domItems.adminOpsContainer.insertAdjacentHTML("beforeend",'<div class="admin-option-wrapper"><input type="radio" class="admin-option'+c+'" name="answer" value="0"><input type="text" class="admin-option admin-option'+c+'" value=""></div>')
                
                domItems.adminOpsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener("focus",addInp)
                
                domItems.adminOpsContainer.lastElementChild.lastElementChild.addEventListener("focus",addInp)   
                
            }
            domItems.adminOpsContainer.lastElementChild.lastElementChild.addEventListener("focus",addInp)
        },
        
        AllQList : function(AllQInlS){
           
            var inpHtml;
            domItems.qWrapper.innerHTML="";
            
            for(var i=0;i<AllQInlS.getQ().length;i++){
                inpHtml=' <p><span>'+(AllQInlS.getQ()[i].id+1)+'.'+AllQInlS.getQ()[i].questionText+'</span><button id="question-'+(AllQInlS.getQ()[i].id)+'">Edit</button></p> '
                
                domItems.qWrapper.insertAdjacentHTML("afterbegin",inpHtml);
                
            }

            
        },
        
        editPtn:function(e,ls,addInpDyn,updateQList){
            
            var getId,selectedQ,allq,optionHTml,indOfid;
            if("question-".indexOf(e.target.id)){
                getId=parseInt(e.target.id.split("-")[1])
                allq=ls.getQ();

                for(let i=0;i<allq.length;i++){

                    if(allq[i].id==getId){
                        selectedQ = allq[i];
                        indOfid=i;
                    }
                }

                domItems.newQuestionText.value=selectedQ.questionText
                domItems.adminOpsContainer.innerHeight=''
                optionHTml=''
                for(let x=0;x<selectedQ.options.length;x++){
                    optionHTml +='<div class="admin-option-wrapper"><input type="radio" class="admin-option'+(x)+'" name="answer" value="0"><input type="text" class="admin-option admin-option'+(x)+'" value="'+selectedQ.options[x]+'"></div>'
                }
                domItems.adminOpsContainer.innerHTML=optionHTml;
                domItems.questInsertBtn.style.visibility='hidden';
                domItems.questUpdateBtn.style.visibility='visible'
                domItems.questDeleteBtn.style.visibility='visible'
                domItems.clearListBtn.style.pointerEvents='none'
                addInpDyn();


              domItems.questUpdateBtn.addEventListener("click",function(){

                  var newops=[],opts;

                  selectedQ.questionText=domItems.newQuestionText.value;

                  selectedQ.correctAnswer=''
                  opts=document.querySelectorAll(".admin-option")

                  for(let x=0;x<opts.length;x++){
                     if(opts[x].value!==''){
                           newops.push(opts[x].value)
                           if(opts[x].previousElementSibling.checked){
                               selectedQ.correctAnswer=opts[x].value;
                           }
                      }
                   }
                  selectedQ.options=newops;
                 
                  
                      if(selectedQ.options.length>1&&selectedQ.questionText!==''&&selectedQ.correctAnswer!==''){
                          allq.splice(indOfid, 1, selectedQ)
                          ls.setQ(allq)

                          domItems.newQuestionText.value=''
                          for(let i=0;i<opts.length;i++){
                              opts[i].value=''
                              opts[i].previousElementSibling.checked=false
                          }

                          domItems.questInsertBtn.style.visibility='visible';
                          domItems.questUpdateBtn.style.visibility='hidden'
                          domItems.questDeleteBtn.style.visibility='hidden'
                          domItems.clearListBtn.style.pointerEvents=''
                          updateQList(ls)

                      }else{
                          alert("please add all  data question and options and check correct answer");
                      }
                  

                })
                domItems.questDeleteBtn.addEventListener("click",function(){
                    
                    allq=ls.getQ()
                    opts=document.querySelectorAll(".admin-option")
    
                    allq.splice(indOfid, 1)
                    ls.setQ(allq)
                    
                    domItems.newQuestionText.value=''
                          for(let i=0;i<opts.length;i++){
                              opts[i].value=''
                              opts[i].previousElementSibling.checked=false
                          }

                          domItems.questInsertBtn.style.visibility='visible';
                          domItems.questUpdateBtn.style.visibility='hidden'
                          domItems.questDeleteBtn.style.visibility='hidden'
                          domItems.clearListBtn.style.pointerEvents=''
                          updateQList(ls)
                })
                
                
            }
        },
        clearList:function(localS){
            
            if(localS.getQ() !==null){
                if(localS.getQ().length>0){
                    var conf=confirm("are you sure to clear all question list?")
                    if(conf){
                        localS.removeQ()
                        domItems.isertedQwrapper.innerHTML=''
                    }
                }
            }
        },
        displayQ: function(ls,progress){
            
            var newOptionHTML, characterArr;
            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            if(ls.getQ().length>0){
                domItems.headeQ.textContent=ls.getQ()[progress.questionIndex].questionText;
                domItems.quizOptsWrapper.innerHTML=''
                
                for(let i=0;i<ls.getQ()[progress.questionIndex].options.length;i++){
                   
                    newOptionHTML = '<div class="choice-' + i +'"><span class="choice-' + i +'">' + characterArr[i] + '</span><p  class="choice-' + i +'">' + ls.getQ()[progress.questionIndex].options[i] + '</p></div>';
                    
                    domItems.quizOptsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
                
            }
        },
        displayprogressBar:function(ls,progress){
            domItems.progressBar.max=ls.getQ().length;
            domItems.progressBar.value=progress.questionIndex+1;
            
            domItems.paragOfProgBar.textContent=(progress.questionIndex+1)+'/'+(ls.getQ().length)
            
        },
        checkAns:function(result,selected){
            
            var twoOpts={
                textAns:['This is a wrong answer', 'This is a correct answer'],
                classN:['red','green'],
                imgSrc:['images/sad.png','images/happy.png'],
                backcolor:['red','green']
            }
            
            domItems.quizOptsWrapper.style.cssText='opacity: 0.6; pointer-events: none;'
            domItems.instanceAns.style.opacity='1'
            
            if(result){
                domItems.instanceText.textContent=twoOpts.textAns[1];
                domItems.instanceDiv.className=twoOpts.classN[1];
                domItems.imotionIcon.setAttribute('src',twoOpts.imgSrc[1])
                selected.previousElementSibling.style.background=twoOpts.backcolor[1]
            
            }else{
                domItems.instanceText.textContent=twoOpts.textAns[0];
                domItems.instanceDiv.className=twoOpts.classN[0];
                domItems.imotionIcon.setAttribute('src',twoOpts.imgSrc[0])
                selected.previousElementSibling.style.background=twoOpts.backcolor[0]
            }    
        },
        resetNextDesign:function(){
            
            domItems.quizOptsWrapper.style.cssText=''
            domItems.instanceAns.style.opacity='0'
        },
        getFullName:function(ls,adminPerson,currntPerson){
            
            if(domItems.fristnameInp.value!==''&&domItems.lastnameInp.value!==''){
                
                if(domItems.fristnameInp.value===adminPerson[0]&& domItems.lastnameInp.value===adminPerson[1]){
                        domItems.landingPage.style.display='none';
                        domItems.adminPanel.style.display='block'

                }else{
                    if(ls.getQ().length>0){
                        domItems.landingPage.style.display='none';
                        domItems.quizSection.style.display='block'

                        currntPerson.fullname.push(domItems.fristnameInp.value)
                        currntPerson.fullname.push(domItems.lastnameInp.value)
                    }else{
                        alert('Quiz is not ready, please contact to administrator');
                    }

                }

            }else{
                alert('Quiz is not ready, please contact to administrator');
            }
        },
        displayResult:function(currentUser){
            
            domItems.quizSection.style.display='none'
            domItems.finalResultPage.style.display='block'
            domItems.finalScoreText.textContent=currentUser.fullname[0]+" "+currentUser.fullname[1]+"  -->  "+currentUser.score
            
        },
        createResultList:function(usersData){
            var newResultHtml;
            domItems.resultsList.innerHTML=''
            
            if(usersData.getP().length>0){
                for(let i=0;i<usersData.getP().length;i++){
                    
                    newResultHtml='<p class="person person-'+i+'"><span class="person-'+i+'">'+usersData.getP()[i].fristName+''+usersData.getP()[i].lastName+'- '+usersData.getP()[i].score+' Points</span><button id="delete-result-btn_'+usersData.getP()[i].id+'" class="delete-result-btn">Delete</button></p> '
                    
                    domItems.resultsList.insertAdjacentHTML("afterbegin",newResultHtml)
                }
            }
            
        },
        deleteList:function(e,userData){
            var currId,pesronArr;
            pesronArr=userData.getP()
            
            if("delete-result-btn_".indexOf(e.target.id)){
                currId=parseInt(e.target.id.split("_")[1])
                
                for(let i=0;i<pesronArr.length;i++){
                    if(pesronArr[i].id===currId){
                        
                        pesronArr.splice(i,1)
                        userData.setP(pesronArr)
                        
                    }
                }
            }
        },
        clearResults:function(userD){
            
            var conf;
            if(userD.getP().length !== null){
                if(userD.getP().length>0){
                    conf=confirm("warn");
                    if(conf){
                        userD.removeP();
                        domItems.resultsList.innerHTML=''
                    }
                }
            }
        }
        
        
    };
    

})();

/*******************************
***********CONTROLLER***********
*******************************/

var controller = (function(quizCtrl, UICtrl) {

   
    var selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputDyn();
    
    UICtrl.AllQList(quizCtrl.AllQuestionList);
    
    
    
    selectedDomItems.questInsertBtn.addEventListener('click', function() {
        
        
        var adminOptions = document.querySelectorAll('.admin-option');
        
        var isInserted = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText,adminOptions);
        
        if(isInserted){
            UICtrl.AllQList(quizCtrl.AllQuestionList);
        }

    });
    
    selectedDomItems.isertedQwrapper.addEventListener("click",function(e){
        UICtrl.editPtn(e,quizCtrl.AllQuestionList,UICtrl.addInputDyn,UICtrl.AllQList)
    })
    
    selectedDomItems.clearListBtn.addEventListener("click",function(){
        UICtrl.clearList(quizCtrl.AllQuestionList)
    })
    
    UICtrl.displayQ(quizCtrl.AllQuestionList,quizCtrl.getQuizProgress)
    UICtrl.displayprogressBar(quizCtrl.AllQuestionList,quizCtrl.getQuizProgress)
    
    selectedDomItems.quizOptsWrapper.addEventListener("click",function(e){
        var optsWrapper=selectedDomItems.quizOptsWrapper.querySelectorAll("div");
        
        for(let i=0;i<optsWrapper.length;i++){
            
            if(e.target.className==='choice-'+i){
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                var resultAns=quizCtrl.checkAnswer(answer);
                
                UICtrl.checkAns(resultAns,answer)
                
                if(quizCtrl.isFinished()){
                        selectedDomItems.nextBtn.   textContent='finish'
                    }
                
                var nextQ=function(ls,progress){
                    
                    
                    if(quizCtrl.isFinished()){
                        
                        quizCtrl.addPersonOnls()
                        UICtrl.displayResult(quizCtrl.getcurrPersonData)
                        
                    }else{
                        UICtrl.resetNextDesign();
                        quizCtrl.getQuizProgress.questionIndex++;
                        
                        UICtrl.displayQ(quizCtrl.AllQuestionList,quizCtrl.getQuizProgress)
                        UICtrl.displayprogressBar(quizCtrl.AllQuestionList,quizCtrl.getQuizProgress)
                        
                    }
                    
                    
                }
                
                selectedDomItems.nextBtn.onclick=function(){
                    nextQ(quizCtrl.AllQuestionList,quizCtrl.getQuizProgress)
                }
                
            }
        }
    })
    
    selectedDomItems.startQuizBtn.addEventListener("click",function(){
        
        UICtrl.getFullName(quizCtrl.AllQuestionList,quizCtrl.getAdminPerson,quizCtrl.getcurrPersonData);
    })
    
    selectedDomItems.lastnameInp.addEventListener("focus",function(){
        selectedDomItems.lastnameInp.addEventListener("keypress",function(e){
            if(e.keyCode===13){
                UICtrl.getFullName(quizCtrl.AllQuestionList,quizCtrl.getAdminPerson,quizCtrl.getcurrPersonData);
            }
        })
    })
    
    UICtrl.createResultList(quizCtrl.getPersonLoalStorage);
    
    selectedDomItems.resultsList.addEventListener("click",function(e){
        
        UICtrl.deleteList(e,quizCtrl.getPersonLoalStorage);
        UICtrl.createResultList(quizCtrl.getPersonLoalStorage)
        
    })
    selectedDomItems.clearResultsBtn.addEventListener("click",function(){
        
        UICtrl.clearResults(quizCtrl.getPersonLoalStorage)
    })
    
    
    
})(quizController, UIController);





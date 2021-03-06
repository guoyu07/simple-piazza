(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');

    // button and input elements
    var newBtn = document.querySelector('#interactors .btn');

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var questionsTemplate = document.getElementById('questions-template');
    var expandedTemplate = document.getElementById('expanded-question-template');

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestionsList: Handlebars.compile(questionsTemplate.innerHTML),
        renderExpandedQuestion: Handlebars.compile(expandedTemplate.innerHTML)
    };

    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }

        return JSON.parse(localStorage.questions);
    }

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }


    /* Add event listener to new question form, override default on submit */
    function addFormListener() {

        var form = $('#question-form')[0];
        var subjectInput = $(':input[name="subject"]')[0];
        var questionInput = $('textarea[name="question"]')[0];

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            addQuestion(subjectInput, questionInput);
        });
    }


    // improve later
    function findInStorage(id) {
        var questions = getStoredQuestions();
        for (i in questions) {
            if (questions[i].id == id) {
                return questions[i];
            }
        }
        return 0;
    }

    function findIndex(id) {
        for (i in questionsArray) {
            if (questionsArray[i].id == id) {
                return i;
            }
        }
        return 0;
    }

    /* Add event listener to left pane list, render expanded question
     * in right pane when a question from the list is clicked.
     */
    function addListListener() {
        leftPane.addEventListener('click', function(event) {
            //console.log("target: ", event.target, event.target.className);
            //console.log("parent: ", event.target.parent);
            //console.log("parentNode: ", event.target.parentNode, event.target.parentNode.className);
            
            if (event.target.parentNode.className == 'list-question question-info') {
                var id = event.target.parentNode.id;
                var question = findInStorage(id);
                rightPane.innerHTML = templates.renderExpandedQuestion(question);
                curr_question_id = id;
                addResponseListener();
                addResolveListener();
            }
        });
    }

    /* Add event listener to new question button in left pane, renders
     * new form in right pane
     */
    function addNewListener() {
        newBtn.addEventListener('click', function(event) {
            rightPane.innerHTML = templates.renderQuestionForm();
            addFormListener();
        })
    }


    function addResponseListener() {

        var responseForm = $('#response-form')[0];
        var nameInput = $(':input[name="name"]')[0];
        var responseInput = $(':input[name="response"]')[0];

        responseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addResponse(nameInput, responseInput);
        });
    }


    function addResolveListener() {
        var resolveBtn = $('.resolve-container .btn')[0];
        resolveBtn.addEventListener('click', function(event) {
            index = findIndex(curr_question_id);
            questionsArray.splice(index,1);
            storeQuestions(questionsArray);
            leftPane.innerHTML = templates.renderQuestionsList({questions: questionsArray});
            rightPane.innerHTML = templates.renderQuestionForm();
            addFormListener();
        });
    }


    /* Add question to left-pane list, called on submit of new question form */
    function addQuestion(subjectInput, questionInput) {
        if(subjectInput.value && questionInput.value) {
            questionsArray.push({
                id: next_new_id,
                subject: subjectInput.value,
                question: questionInput.value,
                responses: []
            });
            storeQuestions(questionsArray);
            leftPane.innerHTML = templates.renderQuestionsList({questions: questionsArray});
            next_new_id++;
            localStorage.next_new_id = JSON.stringify(next_new_id);
        }
        subjectInput.value = "";
        questionInput.value = "";
    }


    function addResponse(nameInput, responseInput) {
        if (nameInput.value && responseInput.value) {
            i = findIndex(curr_question_id);
            questionsArray[i].responses.push({
                name: nameInput.value,
                response: responseInput.value
            });
            storeQuestions(questionsArray);
            rightPane.innerHTML = templates.renderExpandedQuestion(questionsArray[i]);
        }
        nameInput.value = "";
        responseInput.value = "";

        addResponseListener();
    }


    // display question form initially
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)
    
    var questionsArray = getStoredQuestions();
    var curr_question_id = 0;
    var next_new_id = 1;
    localStorage.next_new_id = JSON.stringify(next_new_id);
    leftPane.innerHTML = templates.renderQuestionsList({questions : questionsArray});
    addFormListener();
    addListListener();
    addNewListener();


})(this, this.document);

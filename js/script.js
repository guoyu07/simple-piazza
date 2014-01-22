(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');

    // button and input elements
    // TODO: add button/input element selectors here

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
                //addResponseListener();
                //addResolveListener();
            }
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


    // display question form initially
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)
    
    var questionsArray = getStoredQuestions();
    var next_new_id = 1;
    localStorage.next_new_id = JSON.stringify(next_new_id);
    leftPane.innerHTML = templates.renderQuestionsList({questions : questionsArray});
    addFormListener();
    addListListener();


})(this, this.document);

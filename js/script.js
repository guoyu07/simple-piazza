(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    
    // TODO: add other panes here
    var leftPane = document.getElementById('left-pane');

    // button and input elements
    // TODO: add button/input element selectors here

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var questionsTemplate = document.getElementById('questions-template');
    // TODO: add other script elements corresponding to templates here

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        
        // TODO: add other Handlebars render functions here
        renderQuestionsList: Handlebars.compile(questionsTemplate.innerHTML)
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

    // TODO: tasks 1-5 and one extension


    /* Add event listener to new question form, override default on submit */
    function addFormListener() {
        var $form = $('#question-form');
        var form = $form[0];
        var $subjectInput = $(':input[name="subject"]');
        var subjectInput = $subjectInput[0];
        console.log("subjectInput:", subjectInput);
        var $questionInput = $('textarea[name="question"]');
        var questionInput = $questionInput[0];
        console.log("questionInput", questionInput);

        form.addEventListener('submit', function(event) {
            //  console.log("clicked submit");
            event.preventDefault();
            addQuestion(subjectInput, questionInput);
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
        }
        subjectInput.value = "";
        questionInput.value = "";
    }


    // display question form initially
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)
    
    var questionsArray = getStoredQuestions();
    leftPane.innerHTML = templates.renderQuestionsList({questions : questionsArray});
    addFormListener();
    
    var next_new_id = 1;


})(this, this.document);

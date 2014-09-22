describe('QuizController', function(){
  	var ctrl, scope, AnswerFormatter;

  	beforeEach(function(){
		module('QuizApp');

		inject(function(_AnswerFormatter_){
			AnswerFormatter = _AnswerFormatter_;
		});
	});

  	var QuizAPiMock = (function(){
  		return {
  			create_quiz: function(options){
  				options.done()
  			},
  			get_quiz: function(options) {
  				  if(options.id == 2) {
              options.error();
            } else {
              options.success(AnswerFormatter.input({id:1,
  				    title:"hurr durr?",
  					  items:JSON.stringify([{question:"derpderpderp",item_type:"open_question",$$hashKey:"003"}]),
  					  quizAnswers:[],
  					  reviewable:true
  					}));
          }
  			},
  			answer_quiz: function(options) {
          if(options.id == 3){
            options.success([{id:1,user:"124",url:null,answer:[{question:"kkk",value:"kokeilu"}],new:false}])
          } else {
  				  options.success([]);
  			}}
  		}
  	})();

  	var AuthenticationMock = (function(){
  		return {
      		log_user: function(){},
      		get_user: function(){return 'Hattumies'}
  		}
  	})();

  	beforeEach(inject(function($controller, $rootScope) {
    	scope = $rootScope.$new();
    	ctrl = $controller('QuizController', {
      		$scope: scope,
      		Authentication: AuthenticationMock,
      		API: QuizAPiMock
    	});
      scope.username = 'kalle';
    }));

    it('should be initialized correctly with username', function() {
    	scope.init(1);
    	expect(scope.quiz.title).toBe('hurr durr?');
    	expect(scope.quiz.items[0].question).toContain("derpderpderp");
  		expect(scope.quiz.items.length).toBe(1);
    });

    it('should be initialized correctly without username', function() {
      scope.username = null;
      scope.init(1);
      expect(scope.view).toBe('js/views/login.html');
    });

    it('should present the view correctly when given user name', function() {
      scope.init(1);
      expect(scope.view).toBe('js/views/quiz_form.html');
    });

    it('should be able to change users', function() {
      scope.init(1);
      expect(scope.username).toBe('kalle');
      scope.new_username = 'Hattumies';
      scope.change_username();
      expect(scope.username).toBe('Hattumies');
    });

    it('should render error message when id is not found', function() {
      scope.init(2);
      expect(scope.view).toBe('js/views/error.html');
    });
    
    it('should show proper view when review is empty', function() {
      scope.init(1);
      scope.send_answer();
      expect(scope.view).toBe('js/views/answered.html');
    });

    it('should show proper view when review is not empty'), function() {
      scope.init(3);
      scope.send_answer();
      expect(scope.view).toBe('js/views/peer_review_form.html');
    }
});
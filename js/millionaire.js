/**
*
* @param fixed 
* @param decimalDelim 
* @param breakdDelim 
* @return 
*/
Number.prototype.money = function(fixed, decimalDelim, breakDelim){
	var n = this, 
	fixed = isNaN(fixed = Math.abs(fixed)) ? 2 : fixed, 
	decimalDelim = decimalDelim == undefined ? "." : decimalDelim, 
	breakDelim = breakDelim == undefined ? "," : breakDelim, 
	negative = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(fixed)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return negative + (j ? i.substr(0, j) +
		 breakDelim : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + breakDelim) +
		  (fixed ? decimalDelim + Math.abs(n - i).toFixed(fixed).slice(2) : "");
}
/**
*
* @require
* @param id 
* @param loop 
*/
startSound = function(id, loop) {
	soundHandle = document.getElementById(id);
	if(loop)
		soundHandle.setAttribute('loop', loop);
	soundHandle.play();
}
/**
* 
* @param data 
*/
var MillionaireModel = function(data) {
	var self = this;
    this.questions = data.questions;
    this.transitioning = false;
 	this.money = new ko.observable(0);
 	this.level = new ko.observable(1);
 	this.usedFifty = new ko.observable(false);
 	this.usedPhone = new ko.observable(false);
 	this.usedAudience = new ko.observable(false);
 	self.getQuestionText = function() {
 		return self.questions[self.level() - 1].question;
 	}
 	self.getAnswerText = function(index) {
 		return self.questions[self.level() - 1].content[index];
 	}
 	self.fifty = function(item, event) {
 		if(self.transitioning)
 			return;
 		$(event.target).fadeOut('slow');
 		var correct = this.questions[self.level() - 1].correct;

 		var first = (correct + 1) % 4;
 		var second = (first + 1) % 4;
		
 		if(first == 0 || second == 0) {
 			$("#answer-one").fadeOut('slow');
 		}
 		if(first == 1 || second == 1) {
 			$("#answer-two").fadeOut('slow');
 		}
 		if(first == 2 || second == 2) {
 			$("#answer-three").fadeOut('slow');
 		}
 		if(first == 3 || second == 3) {
 			$("#answer-four").fadeOut('slow');
 		}
 	}
 	self.fadeOutOption = function(item, event) {
		if(self.transitioning)
			 return;
		let array_aswer=[
			'#answer-one',
			'#answer-two',
			'#answer-three',
			'#answer-four'
		];
		let rand = random(0,3);
		let test = $(array_aswer[rand]);
		test.css('background','orange');
	
		$(event.target).fadeOut({
			duration: 1600, 
			complete: function() {
				if(self.level() + 1) {					
					test.css('background', 'none');
				} else {
					test.css('background','red');
					self.transitioning = false;
				}
			}
		});
	}
		function random(min, max) {
			return Math.round(min + Math.random() * (max - min));
		}
 	self.answerQuestion = function(index, elm) {
 		if(self.transitioning)
 			return;
 		self.transitioning = true;
 		if(self.questions[self.level() - 1].correct == index) {
 			self.rightAnswer(elm);
 		} else {
 			self.wrongAnswer(elm);
 		}
 	}
 	self.rightAnswer = function(elm) {
 		$("#" + elm).slideUp('slow', function() {
 			startSound('rightsound', false);
 			$("#" + elm).css('background', 'green').slideDown('slow', function() {
 				self.money($(".active").data('amt'));
 				if(self.level() + 1 > 15) {
	 				$("#game").fadeOut('slow', function() {
	 					$("#game-over").html('<button class="baton" onClick="window.location.reload();">Вы стали миллионером!</button>');
	 					$("#game-over").fadeIn('slow');
	 				});
 				} else {
 					self.level(self.level() + 1);
 					$("#" + elm).css('background', 'none');
			 		$("#answer-one").show();
			 		$("#answer-two").show();
			 		$("#answer-three").show();
			 		$("#answer-four").show();
			 		self.transitioning = false;
 				}
 			});
 		});
 	}
 	self.wrongAnswer = function(elm) {
 		$("#" + elm).slideUp('slow', function() {
 			startSound('wrongsound', false);
 			$("#" + elm).css('background', 'red').slideDown('slow', function() {
 				$("#game").fadeOut('slow', function() {
 					
					
					 $("#game-over").html('<button class="buton" onClick="window.location.reload();">Вы проиграли</button>');
 					$("#game-over").fadeIn('slow');
 					self.transitioning = false;
 				});
 			});
 		});
 	}
 	self.formatMoney = function() {
	    return self.money().money(2, '.', ',');
	}
};
$(document).ready(function() {
	$.getJSON("questions.json", function(data) {
		//var rand = Math.floor(Math.random() * data.games.length)
		for(var i = 1; i <= data.games.length; i++) {
			$("#problem-set").append('<option value="' + i + '">' + i + '</option>');
		}
		$("#pre-start").show();
		$("#start").click(function() {
			var index = $('#problem-set').find(":selected").val() - 1;
			ko.applyBindings(new MillionaireModel(data.games[index]));
			$("#pre-start").fadeOut('slow', function() {
				startSound('background', true);
				$("#game").fadeIn('slow');
			});
		});
	});
});
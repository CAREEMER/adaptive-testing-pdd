const { Keyboard, Key } = require('telegram-keyboard')


function constructSelectModeKeyboard(): typeof Keyboard {
    return Keyboard.make([['🎲', '📊'], ['📝 Следующий вопрос']]).reply()
}


function constructQuestionKeyboard(question): typeof Keyboard {
    var callbackButtons: typeof Key[] = [];

    for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i];
        callbackButtons.push(Key.callback(i + 1, answer.correct + '**' + question.id))
    }

    return Keyboard.make(callbackButtons).inline()
}


export { constructQuestionKeyboard, constructSelectModeKeyboard };
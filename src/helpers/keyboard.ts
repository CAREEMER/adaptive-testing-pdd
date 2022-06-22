const { Keyboard, Key } = require('telegram-keyboard')


function constructSelectModeKeyboard(): typeof Keyboard {
    return Keyboard.make(['🎲', '📊']).reply()
}


function constructQuestionKeyboard(question): typeof Keyboard {
    var callbackButtons: typeof Key[] = [];

    for (var answer of question.answers) {
        callbackButtons.push(Key.callback(answer.text, answer.correct + '**' + question.id))
    }
    return Keyboard.make(callbackButtons, {columns: 1}).inline()
}


export { constructQuestionKeyboard, constructSelectModeKeyboard };
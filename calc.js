let sqrt = []
function calc(expression) {
    console.log(`calculating "${expression}"`)
    sqrt = []
    expression = parseElements(expression)
    console.log(`sqrt: ${JSON.stringify(sqrt).replace(/"/g, '').replace(/,/g, '')}`)
    console.log(`elements parsed: ${expression}`)
    console.log(`resolving first action`)
    return resolveNext(expression)
}

function findBrackets (expression) {
    for (const index in expression) {
        const element = expression[index]
        if (Array.isArray(element)) {
            console.log(`${element} is array`)
            return {
                index: index,
                data: element
            }
        } else {
            console.log(`${element} is not array`)
        }
    }
    return {
        index: -1,
        data: null
    }
}

function resolveNext(expression) {
    console.log(`____________`)
    console.log(`${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
    console.log(`____________`)
    let brackets = findBrackets(expression)
    let x = 0
    while (brackets.index !== -1) {
        x++
        if (x > 5) return NaN
        console.log(`brackets exists`)
        if (brackets.data.length === 1) {
            console.log(`${brackets.data.length} = 1, got result`)
            let answer = brackets.data[0]
            if (sqrt.includes(brackets.index)) {
                answer = Math.sqrt(brackets.data[0])
            }
            console.log(`old expression was ${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
            console.log(`replacing expression at index ${brackets.index} by ${answer}`)
            expression[brackets.index] = answer
            console.log(`new expression is ${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
        } else {
            const answer = resolveNext(brackets.data)
            console.log(`old expression was ${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
            console.log(`replacing expression at index ${brackets.index} by ${answer}`)
            expression[brackets.index] = answer
            console.log(`new expression is ${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
        }
        brackets = findBrackets(expression)
    }
    console.log(`brackets not exists`)
    const actions = ['^', '*', '/', '+', '-']
    for (let action of actions) {
        if (expression.includes(action)) {
            console.log(`${action} included`)
            const index = expression.indexOf(action)
            if (['+', '-'].includes(action)) {
                console.log(`action is + or -`)
                const otherAction = action === '+' ? '-' : '+'
                console.log(`other action is ${otherAction}`)
                const otherIndex = expression.indexOf(otherAction)
                console.log(`other index = ${otherIndex}`)
                if (otherIndex !== -1) {
                    console.log(`other action exists`)
                    if (otherIndex < index) {
                        console.log(`other action previous, changing`)
                        action = otherAction
                        console.log(`new action is ${action}`)
                    }
                }
            }
            let answer = resolve(expression[index - 1], action, expression[index + 1])
            if (sqrt.includes(index)) {
                answer = Math.sqrt(index)
            }
            console.log(`answer is ${answer}`)
            replaceExpression(answer, index, expression)
            if (expression.length === 1) {
                console.log(`${expression.length} = 1, got result`)
                return expression[0]
            } else {
                console.log(`${expression.length} != 1, resolving next action`)
            }
            return resolveNext(expression)
        } else {
            console.log(`${action} not included`)
        }
    }
    console.log(`Error occured, return null`)
    return null
}

function replaceExpression(answer, index, expression) {
    console.log(`replacing expression at index ${index} by ${answer}`)
    console.log(`old expression was ${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
    expression[index] = answer
    expression.splice(index - 1, 1)
    expression.splice(index, 1)
    console.log(`new expression is ${JSON.stringify(expression).replace(/"/g, '').replace(/,/g, '')}`)
}

function parseElements(expression) {
    const parsed = expression
        .replace(/ /g, '')
        .replace(/--/g, '0-')
        .replace(/++/g, '0+')
        .replace(/+-/g, '-')
        .replace(/-+/g, '0-')
        .match(/(\d+|sqrt(?:\(.+?\))|(?:\(.+?\))|\+|-|\*|\/|\^)/g)
    for (const index in parsed) {
        let element = parsed[index]
        if (!isNaN(parseFloat(element))) {
            element = parseFloat(element)
        } else {
            const sqrtExp = element.toString().startsWith('sqrt(')
            if (sqrtExp) {
                sqrt.push(index)
            }
            if (element.toString().startsWith('(') || sqrtExp) {
                element = parseElements(element.toString().replace(/\(/, '').replace(/\)/, ''))
            }
        }
        parsed[index] = element
    }
    return parsed
}

function resolve(a, type, b) {
    switch (type) {
        case '+':
            return a + b
        case '-':
            return a - b
        case '*':
            return a * b
        case '/':
            return a / b
        case '^':
            return a ** b
        case 'sqrt':
            return Math.sqrt(a)
        default:
            return NaN
    }
}

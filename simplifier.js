const math = require('mathjs')

module.exports = {
    simplifyBooleanExpression: (input) => {
        let simplifiedExpression = input.replace(/\./g, "*")

        const rules = [
            {l: 'n1 + n2', r: 'n2 + n1'}, //1
            {l: '(n1 + n2) * (n1 + ~n2)', r: 'n1'}, //2
            {l: 'n1 * (n2 + n3)', r: 'n1 * n2 + n1 * n3'}, //3
            {l: 'n1 + 0', r: 'n1'}, //4
            {l: 'n1 * 1', r: 'n1'}, //5
            {l: 'n1 + 1', r: '1'}, //6
            {l: 'n1 * 0', r: '0'}, //7
            {l: 'n1 + n1', r: 'n1'}, //8
            {l: 'n1 * n1', r: 'n1'}, //9
            {l: 'n1 + ~n1', r: '1'}, //10
            {l: 'n1 * ~n1', r: '0'}, //11
            {l: 'n1 + n1 * n2', r: 'n1'},  //12
            {l: 'n1 * (n1 + n2)', r: 'n1'},  //13
            {l: 'n1*n2 + n1*~n2', r: 'n1'}, //14
            {l: '(n1 + n2) * (n1 + n3)', r: 'n1 + n2 * n3'}, //15
            {l: '~~n1', r: 'n1'} //16
        ]

        try {
            simplifiedExpression = math.simplify(simplifiedExpression, rules)

            if (simplifiedExpression.isAccessorNode) {
                simplifiedExpression = simplifiedExpression.object
            }
        }
        catch (e) {
            simplifiedExpression = e
        }

        return simplifiedExpression.toString().replace(/\*/g, ".")
    }
}
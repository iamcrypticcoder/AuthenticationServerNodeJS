import { expect } from "chai";
import { it } from "mocha";

describe('Simple Mocha Testing', () => {
    it('should equal', () => {
        const num1 = 10
        const num2 = 20
        expect(num1 + num2).to.equal(30)
    })
    
    it('should not equal', () => {
        const num1 = 10
        const num2 = 20
        expect(num1 + num2).to.not.equal(25)
    })
})
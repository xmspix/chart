import assert from 'assert';
import { dateToTimeScale, formatPrice, humanScalePrice, inside, relativeFontSize } from '../src/helpers/chartTools';

describe("Chart Tools", () => {
    describe("formatPrice", () => {
        it("should not format price: 1000", () => {
            const formattedPrice = formatPrice(1000);
            assert.equal(formattedPrice, '1.00K');
        })
        it("should format price: 10000 to 10K", () => {
            const formattedPrice = formatPrice(10000);
            assert.equal(formattedPrice, '10.00K');
        })
        it("should format price: 100000 to 100K", () => {
            const formattedPrice = formatPrice(100000);
            assert.equal(formattedPrice, '100.00K');
        })
        it("should format price: 1000000 to 1M", () => {
            const formattedPrice = formatPrice(1000000);
            assert.equal(formattedPrice, '1.00M');
        })
        it("should format price: 1450000 to 1.45M", () => {
            const formattedPrice = formatPrice(1450000);
            assert.equal(formattedPrice, '1.45M');
        })
    })
})
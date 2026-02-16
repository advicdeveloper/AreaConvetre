export const AreaUnits = [
    { key: "sqm", text: "m²" },         // Square Meter
    { key: "sqcm", text: "cm²" },       // Square Centimeter
    { key: "sqmm", text: "mm²" },       // Square Millimeter
    { key: "sqkm", text: "km²" },       // Square Kilometer
    { key: "sqin", text: "in²" },       // Square Inch
    { key: "sqft", text: "ft²" },       // Square Feet
    { key: "sqyd", text: "yd²" },       // Square Yard
    { key: "acre", text: "Acre" },
    { key: "hectare", text: "Hectare" }
];

export const ConversionFactor: Record<string, number> = {
    sqm: 1,
    sqcm: 0.0001,
    sqmm: 0.000001,
    sqkm: 1_000_000,
    sqin: 0.00064516,
    sqft: 0.092903,
    sqyd: 0.836127,
    acre: 4046.8564224,
    hectare: 10000
};

/**
 * Converts value from a specific unit TO Square Meters (Base)
 */
export const toSquareMeters = (value: number, unit: string): number => {
    const factor = ConversionFactor[unit] || 1;
    return value * factor;
};

/**
 * Converts value FROM Square Meters (Base) TO a specific unit
 */
export const fromSquareMeters = (sqm: number, unit: string): number => {
    const factor = ConversionFactor[unit] || 1;
    if (factor === 0) return 0;
    return sqm / factor;
};

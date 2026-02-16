import * as React from "react";
import { TextField, Dropdown, IDropdownOption, Stack, Label, initializeIcons } from "@fluentui/react";
import { AreaUnits, toSquareMeters, fromSquareMeters } from "./conversion";

// Initialize Fluent UI icons (needed for Dropdown chevorn)
initializeIcons();

export interface IAreaConverterProps {
    value: number | null;
    disabled: boolean;
    onChange: (sqmValue: number | null) => void;
}

export const AreaConverter: React.FC<IAreaConverterProps> = ({ value, disabled, onChange }) => {
    // Default to Square Meter if no state, but realistically we expect props/state
    const [unit, setUnit] = React.useState<string>("sqm");
    const [displayValue, setDisplayValue] = React.useState<string>("");

    // Track the last numeric value processed to avoid double updates/loops
    const lastValueRef = React.useRef<number | null>(null);

    // Initial load and External updates (Model -> View)
    React.useEffect(() => {
        // If the value passed from PCF (Model) is different from what we last processed...
        // We need to update the View.

        // Handle null case
        if (value === null || value === undefined) {
            if (lastValueRef.current !== null) {
                setDisplayValue("");
                lastValueRef.current = null;
            }
            return;
        }

        // Calculate what the current UI represents in SQM
        const currentUiSqm = lastValueRef.current;

        // If significant difference (handling float precision), update UI
        // We use a small epsilon for float comparison
        if (currentUiSqm === null || Math.abs(value - currentUiSqm) > 0.0001) {
            // Convert CRM value (sqm) to Current Unit value
            const converted = fromSquareMeters(value, unit);
            // Limit decimals for display to avoid ugly long numbers, but keep enough precision
            const formatted = parseFloat(converted.toFixed(4)).toString();
            setDisplayValue(formatted);
            lastValueRef.current = value;
        }
    }, [value, unit]); // Dependencies: value (primary), unit (to recalculate if external value stays same but unit logic changes? No, unit change is handled by onUnitChange usually)

    // Handling Unit Change
    // When Unit changes: 
    // 1. Keep the same AREA (sqm). 
    // 2. Update Display Value to match new unit.
    const onUnitChange = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (!option) return;

        const newUnit = option.key as string;

        // If we have a value, convert it
        let currentSqm = value; // Default to current props value (source of truth)

        // If user was typing and we have a display value, use that as source?
        // Actually, props.value is the source of truth for "Current Area in SQM".
        // BUT if the user typed "100" and hasn't blurred? 
        // We want to convert "100 {CurrentUnit}" to "{NewValue} {NewUnit}".
        // "100 {CurrentUnit}" -> X SQM.
        // "X SQM" -> Y {NewUnit}.

        // Let's use the current displayValue as the source of "What user sees"
        const numericDisplay = parseFloat(displayValue);
        if (!isNaN(numericDisplay)) {
            currentSqm = toSquareMeters(numericDisplay, unit);
        }

        setUnit(newUnit);

        if (currentSqm !== null) {
            const newDisplay = fromSquareMeters(currentSqm, newUnit);
            setDisplayValue(parseFloat(newDisplay.toFixed(4)).toString());
            // We should also ensure CRM has the correct SQM value (it should already, but good to sync)
            onChange(currentSqm);
            lastValueRef.current = currentSqm;
        }
    };

    // Handling Input Change
    // When User inputs:
    // 1. Update Display Value.
    // 2. Calculate new SQM.
    // 3. Notify CRM.
    const onValueChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const valStr = newValue || "";
        setDisplayValue(valStr);

        if (valStr === "") {
            onChange(null);
            lastValueRef.current = null;
            return;
        }

        const numeric = parseFloat(valStr);
        if (!isNaN(numeric)) {
            const sqm = toSquareMeters(numeric, unit);
            onChange(sqm);
            lastValueRef.current = sqm;
        }
    };

    return (
        <Stack tokens={{ childrenGap: 10 }} style={{ width: '100%' }}>
            <div className="area-converter">
                <TextField
                    value={displayValue}
                    onChange={onValueChange}
                    type="number" // Use text to control formatting better, but number implies mobile keyboard
                    disabled={disabled}
                    placeholder="Enter area"
                />
                <Dropdown
                    options={AreaUnits}
                    selectedKey={unit}
                    onChange={onUnitChange}
                    disabled={disabled}
                />
            </div>
            {/* Optional visualization of base value */}

        </Stack>
    );
};

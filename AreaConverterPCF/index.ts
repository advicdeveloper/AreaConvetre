import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { AreaConverter } from "./AreaConverter";

export class AreaConverterPCF
    implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container!: HTMLDivElement;
    private notifyOutputChanged!: () => void;
    private value: number | null = null;
    private disabled = false;
    private _root!: Root;

    init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ) {
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;
        this.disabled = context.mode.isControlDisabled;
        this._root = createRoot(this.container);
    }

    updateView(context: ComponentFramework.Context<IInputs>) {
        this.value = context.parameters.areaValue.raw ?? null;
        this.disabled = context.mode.isControlDisabled;

        this._root.render(
            React.createElement(AreaConverter, {
                value: this.value,
                disabled: this.disabled,
                onChange: (val) => {
                    this.value = val;
                    this.notifyOutputChanged();
                }
            })
        );
    }

    getOutputs(): IOutputs {
        return {
            areaValue: this.value ?? undefined
        };
    }

    destroy() {
        this._root.unmount();
    }
}

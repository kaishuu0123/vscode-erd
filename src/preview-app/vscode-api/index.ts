interface IVSCodeApi {
    getState(): any;
    setState(state: any): void;
}

declare function acquireVsCodeApi(): IVSCodeApi;

export default acquireVsCodeApi();
import { IState, ISource, IBackground } from './IState';
import vscodeApi from '../vscode-api';

const DEFAULT_SCALE_STEP = 0.1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 20;

export const actions = () => ({
    updateSource: (state: IState, source: ISource) => {
        vscodeApi.setState(source);
        return { ...state, source, scale: 1 };
    },
    zoomIn: (state: IState, step = DEFAULT_SCALE_STEP) => {
        const nextScale = state.scale + state.scale * step;
        return { ...state, scale: nextScale <= MAX_SCALE ? nextScale : MAX_SCALE };
    },
    zoomOut: (state: IState, step = DEFAULT_SCALE_STEP) => {
        const nextScale = state.scale - state.scale * step;
        return { ...state, scale: nextScale >= MIN_SCALE ? nextScale : MIN_SCALE };
    },
    zoomReset: (state: IState) => {
        return { ...state, scale: 1 };
    },
    changeBackground: (state: IState, background: IBackground) => {
        return { ...state, background };
    },
    toggleSourceImageValidity: (state: IState, validity: boolean) => ({ ...state, sourceImageValidity: validity })
});

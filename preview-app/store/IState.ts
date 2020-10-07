export type ISource = { uri: string, data: string };
export type IBackground = 'dark' | 'light' | 'transparent';

export interface IState {
    source: ISource;
    scale: number;
    background: IBackground;
    sourceImageValidity: boolean;
}
import { h, FunctionalComponent, Ref } from 'preact';

interface PreviewProps {
    data: string;
    attachRef: Ref<HTMLImageElement>;
    dimension: { width: number, height: number, units: string };
    onWheel: JSX.WheelEventHandler;
    background: string;
}

const Preview: FunctionalComponent<PreviewProps> = ({ data, attachRef, dimension: { width, height, units }, onWheel, background }) => {
    const styles = {
        width: `${width}${units}`,
        minWidth: `${width}${units}`,
        height: `${height}${units}`,
        minHeight: `${height}${units}`
    };
    return (
        <div className={`preview ${background}`} onWheel={onWheel}>
            <img
                src={`data:image/svg+xml,${encodeURIComponent(data)}`}
                ref={attachRef}
                style={styles}
                alt=""
            />
        </div>
    );
};

export default Preview;
import { h, FunctionalComponent } from 'preact';

const PreviewError: FunctionalComponent = () => (
    <div className="error-container">
        <img src="media/error.png" />
            <div>
                <div>Image Not Loaded</div>
                <div>Try to open it externally to fix format problem</div>
            </div>
    </div>
);

export default PreviewError;
import { h, Component } from 'preact';
import { connect } from 'redux-zero/preact';
import messageBroker from './messaging';
import ToolbarContainer from './containers/ToolbarContainer';
import PreviewContainer from './containers/PreviewContainer';
import { actions, ISource, IState } from './store';

interface AppProps {
    updateSource: (...args: any[]) => void;
    updateSettings: (...args: any[]) => void;
    source: ISource;
}

const mapToProps = (state: IState) => ({ source: state.source });

class App extends Component<AppProps> {
    componentDidMount() {
        messageBroker.addListener('source:update', this.props.updateSource);
    }

    componentWillUnmount() {
        messageBroker.removeListener('source:update', this.props.updateSource);
    }

    render() {
        return (
            <div className="layout">
                {/* @ts-ignore */}
                <ToolbarContainer />
                {/* @ts-ignore */}
                {this.props.source.data && <PreviewContainer/>}
            </div>
        );
    }
}

export default connect(mapToProps, actions)(App);
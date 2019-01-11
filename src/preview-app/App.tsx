import { h, Component } from 'preact';
import { connect } from 'redux-zero/preact';
import messageBroker from './messaging';
import ToolbarContainer from './containers/ToolbarContainer';
import PreviewContainer from './containers/PreviewContainer';
import { actions, ISource, IState } from './store';

interface AppProps {
    updateSource: Function;
    source: ISource;
}

const mapToProps = (state: IState) => ({ source: state.source });

class App extends Component<AppProps> {
    componentDidMount() {
        messageBroker.addListener('source:update', this.onSourceUpdate);
    }

    componentWillUnmount() {
        messageBroker.removeListener('source:update', this.onSourceUpdate);
    }

    onSourceUpdate = (source: ISource) => {
        this.props.updateSource(source);
    }

    render() {
        return (
            <div className="layout">
                <ToolbarContainer />
                {this.props.source.data && <PreviewContainer/>}
            </div>
        );
    }
}

export default connect(mapToProps, actions)(App);
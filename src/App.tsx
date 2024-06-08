import { RouteConfigs } from './router';
import './app.css';
import { List } from './components/List/index';
function App() {
	return <List infos={RouteConfigs} />;
}

export default App;

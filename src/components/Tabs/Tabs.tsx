import { Bookmark, CheckCircle, Search } from 'react-bootstrap-icons';
import useStore from '../../store';
import './Tabs.scss';
function Tabs() {
  const tab = useStore((state) => state.tab);
  const setTab = useStore((state) => state.setTab);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  return (
    <nav className="tabs">
      <div
        className={`tab${tab === 'toWatch' ? ' active' : ''}`}
        onClick={() => {
          setTab('toWatch');
          setSearchQuery('');
        }}
      >
        <Bookmark className="tab-icon" />
        <span className="tab-name">To Watch</span>
      </div>
      <div
        className={`tab${tab === 'watched' ? ' active' : ''}`}
        onClick={() => {
          setTab('watched');
          setSearchQuery('');
        }}
      >
        <CheckCircle className="tab-icon" />
        <span className="tab-name">Watched</span>
      </div>
      <div
        className={`tab${tab === 'search' ? ' active' : ''}`}
        onClick={() => {
          setTab('search');
          setSearchQuery('');
        }}
      >
        <Search className="tab-icon" />
        <span className="tab-name">Search</span>
      </div>
    </nav>
  );
}

export default Tabs;

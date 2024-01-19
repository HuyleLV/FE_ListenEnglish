import Header from "./component/Header";
import DefaultLayoutAdmin from "./component/defaultLayoutAdmin";
import { Admin } from "./route/admin.route";
import { Client } from "./route/client.route";
import { useLocation } from 'react-router-dom';

const roterAdmin = '/admin'
function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  if(currentPath?.includes(roterAdmin)) {
    return <DefaultLayoutAdmin />
  } else {
    return (
        <div className="App bg-[#fafafa] h-full">
          <Header />
          <Client />
        </div>
    );
  }
}

export default App;

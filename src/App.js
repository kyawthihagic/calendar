import "antd/dist/antd.css";
import moment from "moment";
import Index from "./components";
moment.locale("en", {
  week: {
    dow: 1,
  },
});

function App() {
  return <Index />;
}

export default App;

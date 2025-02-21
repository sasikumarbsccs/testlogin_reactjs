import Login from "../components/Login";
import Signup from "../components/Signup";

const RouteList = [
  {
    name: 'Login',
    path: '/',
    element: <Login />
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <Signup />
  }
];

export default RouteList;

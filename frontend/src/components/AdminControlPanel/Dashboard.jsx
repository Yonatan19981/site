import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HashLoader from 'react-spinners/HashLoader';
import { useUserContext } from '../useUserContext';
import { UsersContextProvider } from './useUsersContext';

const Dashboard = () => {
  const { user } = useUserContext();

  let navigate = useNavigate();

  switch (true) {
    case !user:
      return (
        <>
          <div className="grid w-screen h-screen place-items-center">
            <HashLoader className="content-center" size={100} />
            <h3>Loading, please wait...</h3>
          </div>
        </>
      );
    case user && user.admin === false && user.isAuthenticated === true:
      navigate('/');
      break;
    case user && user.isAuthenticated === false:
      navigate('/login');
      break;
    default:
      break;
  }

  return (
    <>
      <Navbar />
      <div>
        <div className="grid mt-5 place-items-center" dir="rtl">
          <div className="w-11/12 lg:w-4/6">
            <h1 className="text-3xl font-semibold">לוח בקרה</h1>
            <UsersContextProvider>
              <h3 className="text-2xl font-medium text-center my-28">בקרוב</h3>
            </UsersContextProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

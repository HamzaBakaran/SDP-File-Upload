import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';

const Navbar = () => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          Cloud file upload
        </Link>
        <ul className="nav mx-auto">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/home">
              Products
            </Link>
          </li>

          {!userToken ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/user">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/order">
                  Orders
                </Link>
              </li>
              <div className="d-flex align-items-center">
                <button className="btn btn-danger text-white" onClick={() => dispatch(logout())}>
                  Log Out
                </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

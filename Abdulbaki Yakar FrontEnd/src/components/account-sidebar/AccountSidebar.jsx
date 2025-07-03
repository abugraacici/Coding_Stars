import './AccountSidebarStyle.css';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

const baseMenu = [
    {
        path: 'profile',
        label: 'Hesap Detayları',
        roles: ['customer', 'seller', 'admin'],
    },
    {
        path: 'orders',
        label: 'Siparişlerim',
        roles: ['customer', 'seller', 'admin'],
    },
    { path: 'cart', label: 'Sepetim', roles: ['customer', 'seller', 'admin'] },
    { path: 'products', label: 'Ürünlerim', roles: ['seller', 'admin'] },
];

const AccountSidebar = () => {
    const location = useLocation();
    const role = useSelector((state) => state.auth.role);

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    const menu = baseMenu.filter((item) =>
        Array.isArray(item.roles)
            ? item.roles.includes(role)
            : item.roles === role
    );

    return (
        <aside className="account-sidebar">
            <ul>
                {menu.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={`/account/${item.path}`}
                            className={() =>
                                isActive(item.path)
                                    ? 'nav-link active'
                                    : 'nav-link'
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default AccountSidebar;

// src/components/common/Header/index.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled, { css, keyframes } from 'styled-components';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiSearch } from 'react-icons/fi';
import { toggleMobileMenu, closeMobileMenu, toggleTheme } from '../../../store/slices/uiSlice';
import { logout } from '../../../store/slices/authSlice';
import { pop, wiggle } from '../../../styles/animations';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: ${({ theme }) => theme.navbar};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
  z-index: 100;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 0 50px;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.primary};
  z-index: 101;

  img {
    height: 40px;
    margin-right: 10px;
  }

  &:hover {
    animation: ${wiggle} 0.5s ease;
  }
`;

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? '0' : '-280px')};
  width: 280px;
  height: 100vh;
  background-color: ${({ theme }) => theme.navbar};
  box-shadow: -2px 0 10px ${({ theme }) => theme.shadow};
  transition: right 0.3s ease;
  z-index: 100;
  padding: 80px 20px 20px;

  @media (min-width: 768px) {
    position: static;
    width: auto;
    height: auto;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItem = styled.li`
  margin: 15px 0;

  @media (min-width: 768px) {
    margin: 0 15px;
  }
`;

const NavLink = styled(Link)`
  font-size: 1.1rem;
  color: ${({ theme, active }) => (active ? theme.primary : theme.text)};
  position: relative;
  font-weight: ${({ active }) => (active ? '600' : '400')};

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    height: 3px;
    width: ${({ active }) => (active ? '100%' : '0')};
    background-color: ${({ theme }) => theme.primary};
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  margin-left: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.shadowStrong};
    transform: scale(1.05);
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: ${pop} 0.3s ease;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 4px 15px ${({ theme }) => theme.shadow};
  padding: 10px 0;
  width: 180px;
  z-index: 101;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.3s ease;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: ${({ theme }) => theme.text};
  transition: all 0.2s ease;

  svg {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.shadow};
    color: ${({ theme }) => theme.primary};
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 10px 15px;
  color: ${({ theme }) => theme.text};
  transition: all 0.2s ease;
  cursor: pointer;

  svg {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.shadow};
    color: ${({ theme }) => theme.error};
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  z-index: 101;

  @media (min-width: 768px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-right: 10px;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  border: 2px solid ${({ theme, isFocused }) => (isFocused ? theme.primary : theme.border)};
  border-radius: 50px;
  padding: 8px 15px;
  padding-right: 35px;
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  width: ${({ isFocused }) => (isFocused ? '200px' : '150px')};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    width: 200px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 5px;
  font-size: 1rem;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { mobileMenuOpen, theme } = useSelector(state => state.ui);
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Cerrar dropdown y menú móvil al cambiar de página
    useEffect(() => {
        setDropdownOpen(false);
        dispatch(closeMobileMenu());
    }, [location, dispatch]);

    const handleMenuToggle = () => {
        dispatch(toggleMobileMenu());
    };

    const handleUserMenuToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <HeaderContainer>
            <LogoContainer to="/">
                <img src="/assets/images/logo.png" alt="Restaurant Logo" />
                Foodie
            </LogoContainer>

            <NavbarContainer isOpen={mobileMenuOpen}>
                <NavList>
                    <NavItem>
                        <NavLink to="/" active={isActive('/')}>
                            Inicio
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/menu" active={isActive('/menu')}>
                            Menú
                        </NavLink>
                    </NavItem>
                    {isAuthenticated && (
                        <NavItem>
                            <NavLink to="/orders" active={isActive('/orders')}>
                                Mis Pedidos
                            </NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        <NavLink to="/contact" active={isActive('/contact')}>
                            Contacto
                        </NavLink>
                    </NavItem>
                </NavList>
            </NavbarContainer>

            <IconContainer>
                <SearchContainer>
                    <form onSubmit={handleSearch}>
                        <SearchInput
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            isFocused={searchFocused}
                        />
                        <SearchButton type="submit">
                            <FiSearch />
                        </SearchButton>
                    </form>
                </SearchContainer>

                <IconButton onClick={() => dispatch(toggleTheme())} title="Cambiar tema">
                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                </IconButton>

                <IconButton as={Link} to="/cart" title="Carrito">
                    <FiShoppingCart />
                    {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
                </IconButton>

                {isAuthenticated ? (
                    <UserDropdown>
                        <IconButton onClick={handleUserMenuToggle} title="Mi cuenta">
                            <FiUser />
                        </IconButton>
                        <DropdownMenu isOpen={dropdownOpen}>
                            <DropdownItem to="/profile">
                                <FiUser />
                                Mi Perfil
                            </DropdownItem>
                            <DropdownItem to="/orders">
                                <FiShoppingCart />
                                Mis Pedidos
                            </DropdownItem>
                            <DropdownButton onClick={handleLogout}>
                                <FiLogOut />
                                Cerrar Sesión
                            </DropdownButton>
                        </DropdownMenu>
                    </UserDropdown>
                ) : (
                    <IconButton as={Link} to="/login" title="Iniciar sesión">
                        <FiUser />
                    </IconButton>
                )}
            </IconContainer>

            <MenuButton onClick={handleMenuToggle}>
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MenuButton>
        </HeaderContainer>
    );
};

export default Header;
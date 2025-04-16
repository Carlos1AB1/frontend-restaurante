// src/components/common/Header/index.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled, { css, keyframes } from 'styled-components';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiSearch } from 'react-icons/fi';
import { toggleMobileMenu, closeMobileMenu, toggleTheme } from '../../../store/slices/uiSlice';
import { logout } from '../../../store/slices/authSlice';
import { pop, wiggle } from '../../../styles/animations'; // Asegúrate que esta ruta es correcta

// --- Styled Components (con corrección en NavLink) ---

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
  z-index: 101; // Asegurar que esté sobre otros elementos del header si es necesario

  img {
    height: 40px;
    margin-right: 10px;
    display: block; // Evita espacio extra
  }

  &:hover {
    animation: ${wiggle} 0.5s ease;
  }
`;

// --- CORRECCIÓN: Usa $isOpen en NavbarContainer ---
// Renombra la prop a $isOpen para que no se pase al DOM
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  /* Usa la prop $isOpen para controlar la posición */
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-280px')}; 
  width: 280px;
  height: 100vh;
  background-color: ${({ theme }) => theme.navbar};
  box-shadow: -2px 0 10px ${({ theme }) => theme.shadow};
  transition: right 0.3s ease;
  z-index: 99; // Un poco menos que el Header/MenuButton
  padding: 80px 20px 20px;
  overflow-y: auto; // Permitir scroll si el menú es largo

  @media (min-width: 768px) {
    position: static;
    width: auto;
    height: auto;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    display: flex;
    align-items: center;
    overflow-y: visible;
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

// --- CORRECCIÓN: Usa $active en NavLink ---
// Renombra la prop a $active
const NavLink = styled(Link)`
  font-size: 1.1rem;
  /* Usa $active para los estilos */
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.text)};
  position: relative;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  transition: color 0.3s ease; /* Añadir transición de color */

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    height: 3px;
    /* Usa $active para los estilos */
    width: ${({ $active }) => ($active ? '100%' : '0')};
    background-color: ${({ theme }) => theme.primary};
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  &:hover {
     color: ${({ theme }) => theme.primary};
     /* El &:after se maneja en el hover de abajo */
  }

  /* Mostrar subrayado en hover solo si NO está activo */
  &:hover:after {
    width: ${({ $active }) => ($active ? '100%' : '100%')}; /* Siempre 100% en hover */
    /* Opcional: podrías cambiar el comportamiento si no quieres que se subraye al pasar por encima si ya está activo */
    /* width: 100%; */ 
  }
`;


const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  background: ${({ theme }) => theme.cardBg}; // Añade un fondo visible
  border: 2px solid ${({ theme }) => theme.border}; // Añade un borde para mejor visibilidad
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary}; // Usa el color primario para los iconos
  font-size: 1.2rem;
  margin-left: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px ${({ theme }) => theme.shadow}; // Añade sombra para profundidad

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
  pointer-events: none; // Evita que interfiera con el clic del botón
`;

const UserDropdown = styled.div`
  position: relative;
`;

// --- CORRECCIÓN: Usa $isOpen en DropdownMenu ---
// Renombra la prop a $isOpen
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
  /* Usa $isOpen para los estilos */
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-10px)')};
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
    flex-shrink: 0; // Evita que el icono se encoja
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
  font-size: 1rem; // Heredar fuente

  svg {
    margin-right: 10px;
     flex-shrink: 0;
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
  z-index: 101; // Por encima de la barra lateral

  @media (min-width: 768px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-right: 10px;
  
  @media (max-width: 767px) {
    display: none; // Ocultar en móvil por defecto
  }
`;

// --- CORRECCIÓN: Usa $isFocused en SearchInput ---
// Renombra la prop a $isFocused
const SearchInput = styled.input`
  /* Usa $isFocused para los estilos */
  border: 2px solid ${({ theme, $isFocused }) => ($isFocused ? theme.primary : theme.border)};
  border-radius: 50px;
  padding: 8px 15px;
  padding-right: 35px;
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  /* Usa $isFocused para los estilos */
  width: ${({ $isFocused }) => ($isFocused ? '200px' : '150px')};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    /* El foco ya cambia el borde arriba, pero puedes añadir otros estilos */
    /* box-shadow: 0 0 5px ${({ theme }) => theme.primary}; */
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


// --- Componente React (con correcciones en el JSX) ---
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

    useEffect(() => {
        setDropdownOpen(false);
        dispatch(closeMobileMenu());
    }, [location, dispatch]);

    const handleMenuToggle = () => {
        dispatch(toggleMobileMenu());
    };

    const handleUserMenuToggle = (e) => {
        // Evitar que el clic se propague si está dentro de otro elemento clicable
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    // Cerrar dropdown si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el dropdown está abierto y el clic NO fue en el botón o el menú mismo
            if (dropdownOpen && !event.target.closest('.user-dropdown-container')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);


    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(''); // Limpiar búsqueda después de enviar
            if (mobileMenuOpen) dispatch(closeMobileMenu()); // Cerrar menú móvil si está abierto
        }
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        // Usar startsWith para que /menu también active la pestaña "Menú" si estás en /menu/producto
        return location.pathname.startsWith(path);
    };

    return (
        <HeaderContainer>
            <LogoContainer to="/">
                <img src="/assets/images/logo.png" alt="Logo Foodie" />
                Foodie
            </LogoContainer>

            {/* --- CORRECCIÓN: Pasa $isOpen a NavbarContainer --- */}
            <NavbarContainer $isOpen={mobileMenuOpen}>
                <NavList>
                    <NavItem>
                        {/* --- CORRECCIÓN: Pasa $active a NavLink --- */}
                        <NavLink to="/" $active={isActive('/')} onClick={() => dispatch(closeMobileMenu())}>
                            Inicio
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        {/* --- CORRECCIÓN: Pasa $active a NavLink --- */}
                        <NavLink to="/menu" $active={isActive('/menu')} onClick={() => dispatch(closeMobileMenu())}>
                            Menú
                        </NavLink>
                    </NavItem>
                    {isAuthenticated && (
                        <NavItem>
                            {/* --- CORRECCIÓN: Pasa $active a NavLink --- */}
                            <NavLink to="/orders" $active={isActive('/orders')} onClick={() => dispatch(closeMobileMenu())}>
                                Mis Pedidos
                            </NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        {/* --- CORRECCIÓN: Pasa $active a NavLink --- */}
                        <NavLink to="/contact" $active={isActive('/contact')} onClick={() => dispatch(closeMobileMenu())}>
                            Contacto
                        </NavLink>
                    </NavItem>
                    {/* Añadir enlaces de Login/Logout al menú móvil también puede ser útil */}
                    {!isAuthenticated && (
                        <NavItem>
                            <NavLink to="/login" $active={isActive('/login')} onClick={() => dispatch(closeMobileMenu())}>
                                Iniciar Sesión
                            </NavLink>
                        </NavItem>
                    )}
                    {isAuthenticated && (
                        <NavItem>
                            {/* Usar un botón estilizado como NavLink si es una acción */}
                            <DropdownButton onClick={() => { handleLogout(); dispatch(closeMobileMenu()); }} style={{ padding: '10px 0', color: theme.text, justifyContent: 'flex-start' }}>
                                <FiLogOut />
                                Cerrar Sesión
                            </DropdownButton>
                        </NavItem>
                    )}
                </NavList>
            </NavbarContainer>

            <IconContainer>
                <SearchContainer>
                    <form onSubmit={handleSearch}>
                        {/* --- CORRECCIÓN: Pasa $isFocused a SearchInput --- */}
                        <SearchInput
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            $isFocused={searchFocused} // Pasa la prop con $
                        />
                        <SearchButton type="submit" aria-label="Buscar">
                            <FiSearch />
                        </SearchButton>
                    </form>
                </SearchContainer>

                <IconButton onClick={() => dispatch(toggleTheme())} title="Cambiar tema">
                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                </IconButton>

                <IconButton as={Link} to="/cart" title="Carrito" aria-label={`Carrito con ${totalItems} items`}>
                    <FiShoppingCart />
                    {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
                </IconButton>

                {isAuthenticated ? (
                    // Añadir clase para el listener de clic fuera
                    <UserDropdown className="user-dropdown-container">
                        <IconButton onClick={handleUserMenuToggle} title="Mi cuenta" aria-expanded={dropdownOpen}>
                            <FiUser />
                        </IconButton>
                        {/* --- CORRECCIÓN: Pasa $isOpen a DropdownMenu --- */}
                        <DropdownMenu $isOpen={dropdownOpen}>
                            <DropdownItem to="/profile" onClick={()=> setDropdownOpen(false)}>
                                <FiUser />
                                Mi Perfil
                            </DropdownItem>
                            <DropdownItem to="/orders" onClick={()=> setDropdownOpen(false)}>
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

            <MenuButton onClick={handleMenuToggle} aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileMenuOpen}>
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MenuButton>
        </HeaderContainer>
    );
};

export default Header;
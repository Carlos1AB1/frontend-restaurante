// src/pages/Profile/index.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { showNotification } from '../../store/slices/uiSlice';
import { FiUser, FiMail, FiPhone, FiHome, FiEdit, FiSave, FiX } from 'react-icons/fi';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
  text-align: center;
`;

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 20px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.heading};
  margin: 0 0 5px 0;
`;

const UserEmail = styled.p`
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme, disabled }) => disabled ? theme.shadow : theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
  grid-column: 1 / -1;
`;

const EditButton = styled(Button)`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 8px;
  border-radius: 50%;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 0.9rem;
  margin-top: 5px;
`;

const OrdersSection = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.heading};
  margin: 0 0 20px 0;
`;

const OrdersStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.shadow};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
  }
`;

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        address: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar error para este campo si existe
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'El nombre es obligatorio';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'El apellido es obligatorio';
        }

        if (formData.phone_number && !/^\d{9,}$/.test(formData.phone_number.replace(/\s/g, ''))) {
            newErrors.phone_number = 'El número de teléfono debe tener al menos 9 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulación de actualización de perfil
            setTimeout(() => {
                setEditMode(false);

                dispatch(showNotification({
                    message: 'Perfil actualizado correctamente',
                    type: 'success'
                }));
            }, 1000);
        }
    };

    const handleCancel = () => {
        // Restablecer datos del formulario
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone_number: user.phone_number || '',
            address: user.address || ''
        });
        setErrors({});
        setEditMode(false);
    };

    if (loading || !user) {
        return <Loader type="cartoon" text="Cargando perfil..." />;
    }

    const getInitials = () => {
        const first = formData.first_name.charAt(0) || '';
        const last = formData.last_name.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    // Datos simulados de estadísticas de pedidos
    const orderStats = [
        { number: 12, label: 'Pedidos Totales' },
        { number: 2, label: 'En Proceso' },
        { number: 10, label: 'Completados' },
        { number: 0, label: 'Cancelados' }
    ];

    return (
        <ProfileContainer>
            <PageTitle>Mi Perfil</PageTitle>

            <ProfileCard>
                <ProfileHeader>
                    <AvatarContainer>
                        <Avatar>{getInitials()}</Avatar>
                        {!editMode && (
                            <EditButton
                                variant="outline"
                                iconOnly
                                small
                                onClick={() => setEditMode(true)}
                            >
                                <FiEdit />
                            </EditButton>
                        )}
                    </AvatarContainer>

                    <UserInfo>
                        <UserName>{`${formData.first_name} ${formData.last_name}`}</UserName>
                        <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                </ProfileHeader>

                <ProfileForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <label htmlFor="first_name">
                            <FiUser /> Nombre
                        </label>
                        <Input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            required
                        />
                        {errors.first_name && <ErrorMessage>{errors.first_name}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="last_name">
                            <FiUser /> Apellidos
                        </label>
                        <Input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            required
                        />
                        {errors.last_name && <ErrorMessage>{errors.last_name}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="email">
                            <FiMail /> Email
                        </label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            disabled
                        />
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="phone_number">
                            <FiPhone /> Teléfono
                        </label>
                        <Input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            disabled={!editMode}
                        />
                        {errors.phone_number && <ErrorMessage>{errors.phone_number}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="address">
                            <FiHome /> Dirección (para entregas)
                        </label>
                        <Input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!editMode}
                        />
                    </FormGroup>

                    {editMode && (
                        <ButtonGroup>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                <FiX /> Cancelar
                            </Button>
                            <Button
                                type="submit"
                                cartoon
                            >
                                <FiSave /> Guardar Cambios
                            </Button>
                        </ButtonGroup>
                    )}
                </ProfileForm>
            </ProfileCard>

            <OrdersSection>
                <SectionTitle>Mis Estadísticas</SectionTitle>

                <OrdersStats>
                    {orderStats.map((stat, index) => (
                        <StatCard key={index}>
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </StatCard>
                    ))}
                </OrdersStats>

                <Button
                    to="/orders"
                    cartoon
                    fullWidth
                >
                    Ver Historial de Pedidos
                </Button>
            </OrdersSection>
        </ProfileContainer>
    );
};

export default Profile;
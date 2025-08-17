// src/pages/ProductDetail/ProductReviews.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiStar, FiUser, FiSend } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { showNotification } from '../../store/slices/uiSlice';

const Container = styled.div`
  margin-top: 20px;
`;

const ReviewsList = styled.div`
  margin-bottom: 40px;
`;

const Review = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.shadow};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const UserName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.heading};
`;

const ReviewDate = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

const Rating = styled.div`
  display: flex;
  gap: 5px;
  color: ${({ theme }) => theme.accent};
`;

const ReviewContent = styled.p`
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 30px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  margin-bottom: 30px;
  
  h3 {
    color: ${({ theme }) => theme.heading};
    margin-bottom: 10px;
  }
  
  p {
    color: ${({ theme }) => theme.text};
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 30px 0;
`;

const WriteReviewContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 30px;
  border-radius: 12px;
  margin-top: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const WriteReviewTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.heading};
`;

const StarsInput = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ active, theme }) => active ? theme.accent : theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    fill: ${({ active, theme }) => active ? theme.accent : 'none'};
  }
  
  &:hover {
    transform: scale(1.2);
  }
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 15px;
  font-size: 1rem;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.primaryLight};
  border-radius: 8px;
  margin-bottom: 20px;
  
  p {
    margin-bottom: 15px;
    color: ${({ theme }) => theme.text};
  }
`;

const ProductReviews = ({ productId, productSlug }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [userHasReviewed, setUserHasReviewed] = useState(false);

    // Datos de ejemplo
    const dummyReviews = [
        {
            id: 1,
            user: {
                name: 'Juan Pérez'
            },
            rating: 5,
            comment: '¡Excelente sabor! Uno de los mejores platos que he probado. La combinación de ingredientes es perfecta y la presentación impecable.',
            created_at: '2025-03-15T14:22:00Z'
        },
        {
            id: 2,
            user: {
                name: 'Ana Gómez'
            },
            rating: 4,
            comment: 'Muy bueno, aunque la porción podría ser un poco más grande para el precio. El sabor es genial y la entrega fue rápida.',
            created_at: '2025-03-10T18:45:00Z'
        },
        {
            id: 3,
            user: {
                name: 'Carlos Rodríguez'
            },
            rating: 3,
            comment: 'Regular. El sabor estaba bien, pero llegó un poco frío. Lo pediría de nuevo si mejoran el sistema de entrega.',
            created_at: '2025-03-05T20:30:00Z'
        }
    ];

    useEffect(() => {
        // Simular carga de reseñas desde la API
        setLoading(true);
        setTimeout(() => {
            setReviews(dummyReviews);
            setLoading(false);

            // Comprobar si el usuario ya ha dejado una reseña (simulación)
            setUserHasReviewed(false);
        }, 1000);
    }, [productId]);

    const handleRatingClick = (rating) => {
        setUserRating(rating);
    };

    const handleReviewSubmit = () => {
        if (userRating === 0) {
            dispatch(showNotification({
                message: 'Por favor, selecciona una calificación',
                type: 'warning'
            }));
            return;
        }

        if (reviewText.trim().length < 10) {
            dispatch(showNotification({
                message: 'Por favor, escribe un comentario de al menos 10 caracteres',
                type: 'warning'
            }));
            return;
        }

        // Simular envío de reseña a la API
        setLoading(true);
        setTimeout(() => {
            // Añadir la nueva reseña al inicio de la lista
            const newReview = {
                id: Date.now(),
                user: {
                    name: 'Tú' // En una implementación real, sería el nombre del usuario
                },
                rating: userRating,
                comment: reviewText,
                created_at: new Date().toISOString()
            };

            setReviews([newReview, ...reviews]);
            setUserRating(0);
            setReviewText('');
            setUserHasReviewed(true);
            setLoading(false);

            dispatch(showNotification({
                message: '¡Gracias por tu opinión!',
                type: 'success'
            }));
        }, 1000);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FiStar
                    key={i}
                    style={{ fill: i <= rating ? 'currentColor' : 'none' }}
                />
            );
        }
        return stars;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Container>
            {reviews.length > 0 ? (
                <ReviewsList>
                    {reviews.map(review => (
                        <Review key={review.id}>
                            <ReviewHeader>
                                <UserInfo>
                                    <UserAvatar>
                                        <FiUser />
                                    </UserAvatar>
                                    <UserName>{review.user.name}</UserName>
                                </UserInfo>
                                <div>
                                    <Rating>
                                        {renderStars(review.rating)}
                                    </Rating>
                                    <ReviewDate>{formatDate(review.created_at)}</ReviewDate>
                                </div>
                            </ReviewHeader>
                            <ReviewContent>{review.comment}</ReviewContent>
                        </Review>
                    ))}
                </ReviewsList>
            ) : (
                <NoReviews>
                    <h3>No hay opiniones todavía</h3>
                    <p>Sé el primero en opinar sobre este producto.</p>
                </NoReviews>
            )}

            {isAuthenticated ? (
                userHasReviewed ? (
                    <NoReviews>
                        <h3>Ya has dejado una opinión para este producto</h3>
                        <p>Gracias por compartir tu experiencia con nuestra comunidad.</p>
                    </NoReviews>
                ) : (
                    <WriteReviewContainer>
                        <WriteReviewTitle>Escribe tu opinión</WriteReviewTitle>

                        <StarsInput>
                            {[1, 2, 3, 4, 5].map(star => (
                                <StarButton
                                    key={star}
                                    onClick={() => handleRatingClick(star)}
                                    active={star <= userRating ? 1 : 0}
                                >
                                    <FiStar />
                                </StarButton>
                            ))}
                        </StarsInput>

                        <ReviewTextarea
                            placeholder="Comparte tu experiencia con este producto..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />

                        <SubmitRow>
                            <Button onClick={handleReviewSubmit} cartoon>
                                <FiSend /> Enviar opinión
                            </Button>
                        </SubmitRow>
                    </WriteReviewContainer>
                )
            ) : (
                <LoginPrompt>
                    <p>Debes iniciar sesión para dejar una opinión.</p>
                    <Button to="/login" cartoon>Iniciar Sesión</Button>
                </LoginPrompt>
            )}
        </Container>
    );
};

export default ProductReviews;
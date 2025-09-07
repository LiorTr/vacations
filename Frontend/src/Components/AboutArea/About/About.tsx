import "./About.css";
import { useSelector } from 'react-redux';
import { AppState } from '../../../Redux/store';
import { UserModel } from '../../../Models/UserModel';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { notify } from '../../../Utils/notify';

export function About() {
    const user = useSelector<AppState, UserModel>((store) => store.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            notify.error('You must be logged in to access this page.');
        }
    }, [user, navigate]);

    return (
        <div className="about-container">
            <section className="hero-section">
                <h1>Explore the World with Us! <span role="img" aria-label="airplane">✈️</span></h1>
                <p>Your dream vacations start here. Discover, plan, and enjoy unforgettable experiences.</p>
            </section>

            <section className="vacation-highlights">
                <div>Why Choose Us for Your Vacations?</div>
                <div>
                    <div>🌴 Handpicked exotic destinations</div>
                    <div>📅 Easy vacation planning and management</div>
                    <div>💰 Best price guarantees</div>
                    <div>⭐ Personalized recommendations</div>
                    <div>🛫 Seamless booking and updates</div>
                </div>
            </section>

            <section className="about-info">
                <h2>Our Mission</h2>
                <p>
                    We believe that everyone deserves a break to recharge, explore, and create memories. Our mission is to connect you with the best vacation experiences, tailored to your desires and budget.
                </p>
                <blockquote>
                    "Travel isn’t always pretty. It isn’t always comfortable. Sometimes it hurts, it even breaks your heart. But that’s okay. The journey changes you; it should change you." — Anthony Bourdain
                </blockquote>
            </section>
        </div>
    );
}

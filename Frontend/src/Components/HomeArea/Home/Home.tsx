import './Home.css';
import { useSelector } from 'react-redux';
import { AppState } from '../../../Redux/store';
import { UserModel } from '../../../Models/UserModel';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { notify } from '../../../Utils/notify';

export function Home() {
    const user = useSelector<AppState, UserModel>((store) => store.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            notify.error('You must be logged in');
        }
    }, [user, navigate]);

    return (
        <div className="home-container">
            <header className="hero-section">
                <div className="hero-text">
                    <h1>Welcome back{user ? `, ${user.firstName}!` : '!'}</h1>
                    <p>Discover amazing vacations and start planning your next adventure today.</p>
                </div>
                <div className="hero-image">
                    {/* Use public URL for images */}
                    <img src="/home2.jpg" alt="Beautiful vacation spot" />
                </div>
            </header>

            <section className="featured-vacations">
    <h2>Featured Vacations</h2>
    <div className="vacation-cards">
        <div className="vacation-card">
            <img src="/home.jpg" alt="Eiffel Tower" />
            <h3>Eiffel Tower</h3>
            <p>The iconic symbol of Paris and a must-see landmark.</p>
        </div>
        <div className="vacation-card">
            <img src="/home3.jpg" alt="Mysterious Place" />
            <h3>Mysterious Place</h3>
            <p>Explore the secrets hidden in this captivating destination.</p>
        </div>
        <div className="vacation-card">
            <img src="/home4.jpg" alt="Nature Adventure" />
            <h3>Nature Adventure</h3>
            <p>Experience thrilling outdoor adventures and breathtaking scenery.</p>
        </div>
        <div className="vacation-card">
            <img src="/home5.jpg" alt="Santorini" />
            <h3>Santorini</h3>
            <p>Enjoy stunning sunsets and whitewashed buildings by the sea.</p>
        </div>
        <div className="vacation-card">
            <img src="/home6.jpg" alt="Kyoto Temples" />
            <h3>Kyoto Temples</h3>
            <p>Discover the serene beauty and rich history of Japan’s cultural capital.</p>
        </div>
        <div className="vacation-card">
            <img src="/home7.jpg" alt="Maldives" />
            <h3>Maldives</h3>
            <p>Relax in crystal-clear waters on pristine white sand beaches.</p>
        </div>
    </div>
</section>

        </div>
    );
}

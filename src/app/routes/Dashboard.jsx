import { UserAuth } from '/src/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '/src/components/Header';

const Dashboard = () => {
    const { session, signOut } = UserAuth()
    const navigate = useNavigate()

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut()
            navigate("/")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <Header />
            <h1>User Dashboard</h1>
            <h2>Welcome, {session?.user?.email}</h2>
            <button onClick={handleSignOut} >Sign out</button>
        </>
    );
}

export default Dashboard;

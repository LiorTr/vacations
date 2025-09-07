import { useSelector } from "react-redux";
import "./UserMenu.css";
import { AppState } from "../../../Redux/store";
import { UserModel } from "../../../Models/UserModel";
import { NavLink, useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/notify";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Styled Button to match font and size
const CustomButton = styled(Button)({
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px', // Adjust the font size to match your typography
    textTransform: 'none', // Prevents uppercase transformation
});

export function UserMenu() {
    const user = useSelector<AppState, UserModel>(store => store.user);
    const navigate = useNavigate();

    function logout() {
        userService.logout();
        notify.success("Bye bye");
        navigate('/login'); // Redirect to login after logout
    }

    return (
        <div className="UserMenu">
            {!user && (
                <AppBar sx={{ backgroundColor: 'black' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" style={{ fontSize: "30px", color: 'white', fontFamily: 'Roboto, sans-serif' }}>
                                Vacation Site
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <CustomButton color="inherit">
                                <NavLink
                                    to="/login"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Typography variant="subtitle1" style={{ fontFamily: 'Roboto, sans-serif', color: 'white' }}>
                                        Please log in
                                    </Typography>
                                </NavLink>
                            </CustomButton>
                            <CustomButton color="inherit">
                                <NavLink
                                    to="/register"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Typography variant="subtitle1" style={{ fontFamily: 'Roboto, sans-serif', color: 'white' }}>
                                        Register
                                    </Typography>
                                </NavLink>
                            </CustomButton>
                        </Box>
                    </Box>
                </AppBar>
            )}
            {user && (
                <AppBar sx={{ backgroundColor: 'black' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                        <Typography variant="h6" style={{ fontSize: "30px", color: 'white', fontFamily: 'Roboto, sans-serif' }}>
                            Vacation Site
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="subtitle1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                <NavLink to="/home" style={{ textDecoration: 'none', color: 'white' }}>
                                    Home
                                </NavLink>
                            </Typography>
                            <Typography variant="subtitle1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                <NavLink to="/vacations" style={{ textDecoration: 'none', color: 'white' }}>
                                    Vacations
                                </NavLink>
                            </Typography>

                            {/* Show Add Vacation only if user is admin */}
                            {user.roleId === 1 && (
                                <Typography variant="subtitle1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                    <NavLink to="/new-vacation" style={{ textDecoration: 'none', color: 'white' }}>
                                        Add Vacation
                                    </NavLink>
                                </Typography>
                            )}

                            <Typography variant="subtitle1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                <NavLink to="/about" style={{ textDecoration: 'none', color: 'white' }}>
                                    About
                                </NavLink>
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="h6" style={{ color: '#9b77e6', fontFamily: 'Roboto, sans-serif' }}>Welcome</Typography>
                            <Typography variant="h6" style={{ color: 'white', fontFamily: 'Roboto, sans-serif' }}>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Button style={{ color: 'white', fontFamily: 'Roboto, sans-serif' }} onClick={logout}>Logout</Button>
                        </Box>
                    </Box>
                </AppBar>
            )}
        </div>
    );
}

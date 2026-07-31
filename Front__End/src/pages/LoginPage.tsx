import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff, Apple } from 'lucide-react';
import { Separator } from '@base-ui/react/separator';
import { loginUser } from "@/api/authenticationApi"
import { useAuth } from '@/context/AuthContext';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === '' || password === '') {
            alert("Fields must be entered!");
            return;
        }

        try {
            const data = await loginUser({
                email,
                password
            });

            const userData = {
                userID: data.user.id_user,
                role: data.user.role,
                avatar: data.user.image_url,
                name: data.user.name
            }
            login(data.accessToken, userData)
            navigate("/home");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Login failed");
        }
    };

    return (
        <div className="h-[100dvh] w-full flex items-center justify-center px-6">
            <Card className="w-full border-0 shadow-none rounded-3xl">
                <CardHeader className="space-y-2 pt-8">
                    <CardTitle className="text-4xl font-bold tracking-tight">
                        Bienvenue 👋
                    </CardTitle>

                    <CardDescription className="text-base text-muted-foreground">
                        Connectez-vous à votre compte
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-medium">
                                Adresse email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="utilisateur@mail.com"
                                className="h-12 rounded-xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-medium">
                                Mot de passe
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl pr-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}

                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Login */}
                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl text-base font-semibold bg-[#17B347] text-white"
                        >
                            Se connecter
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>

                            <div className="relative flex justify-center">
                                <span className="bg-background px-4 text-sm text-muted-foreground">
                                    ou continuer avec
                                </span>
                            </div>

                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="h-14 rounded-xl"
                                type="button"
                            >
                                <Apple className="h-6 w-6" />
                            </Button>

                            <Button
                                variant="outline"
                                className="h-14 rounded-xl"
                                type="button"
                            >
                                {/* <Chrome className="h-6 w-6" /> */}
                            </Button>

                        </div>

                        {/* Bottom */}
                        <div className="pt-2 text-center text-sm">

                            <span className="text-muted-foreground">
                                Pas encore de compte ?
                            </span>

                            {" "}

                            <Link
                                to="/register"
                                className="font-semibold text-primary hover:underline"
                            >
                                Demander un accès
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
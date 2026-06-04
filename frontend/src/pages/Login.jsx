import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error) => error.response?.data?.message || "Unable to complete request.";

const Login = () => {
  const { login, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-neutral-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-emerald-600 dark:text-emerald-300">TaskFlow</p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">Login</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input-field"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address."
                }
              })}
            />
            {errors.email ? <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input-field"
              type="password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required." })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">{errors.password.message}</p>
            ) : null}
          </div>

          <button className="btn-primary w-full" type="submit" disabled={authLoading}>
            {authLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-600 dark:text-zinc-300">
          New here?{" "}
          <Link className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;

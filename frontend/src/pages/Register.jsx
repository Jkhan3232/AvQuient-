import { Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error) => {
  if (!error.response) {
    return "Unable to reach API. Check VITE_API_URL, CORS, and deployment protection.";
  }

  return error.response.data?.message || "Unable to complete request.";
};

const Register = () => {
  const { register: registerUser, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success("Account created.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-neutral-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-emerald-600 dark:text-emerald-300">TaskFlow</p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">Register</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input-field"
              type="text"
              autoComplete="name"
              {...register("name", {
                required: "Name is required.",
                minLength: { value: 2, message: "Name must be at least 2 characters." },
                maxLength: { value: 80, message: "Name cannot exceed 80 characters." }
              })}
            />
            {errors.name ? <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">{errors.name.message}</p> : null}
          </div>

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
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required.",
                minLength: { value: 6, message: "Password must be at least 6 characters." },
                maxLength: { value: 72, message: "Password cannot exceed 72 characters." }
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">{errors.password.message}</p>
            ) : null}
          </div>

          <button className="btn-primary w-full" type="submit" disabled={authLoading}>
            {authLoading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-600 dark:text-zinc-300">
          Already registered?{" "}
          <Link className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300" to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;

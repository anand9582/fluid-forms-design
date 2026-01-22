import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_URLS } from "@/components/Config/api";
import { showToast } from "@/components/SweetAlertpopup/ToastService";

interface Props {
  goToView: (view: "forgotPassword") => void;
}

const loginSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const initialValues = {
     username: "",
     password: "",
     rememberMe:false
  };

export const Login = ({ goToView }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_URLS.Login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Invalid credentials");
      }
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.data.username,
          roleType: data.data.roleType, 
          permissions: data.data.permissions,
          userId: data.data.userId,
        })
      );

      showToast({
        title: "Login Successful",
        description: "Welcome back! Redirecting...",
        type: "success",
        duration: 2000,
      });

      navigate("/");
    } catch (err: any) {
      showToast({
        title: "Login Failed",
        description: err?.message || "Invalid credentials",
        type: "error",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-slate-500">
          Connect securely to your VMS server instance.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Field
                  as={Input}
                  name="username"
                  placeholder="admin@company"
                  className="pl-10 h-12"
                />
              </div>
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Field
                  as={Input}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={values.rememberMe}
                  onCheckedChange={(val) =>
                    setFieldValue("rememberMe", val)
                  }
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </div>

              <button
                type="button"
                onClick={() => goToView("forgotPassword")}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-700 text-white"
            >
              {isSubmitting ? "Connecting..." : "Connect to server"}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="text-center mt-6 border-t pt-5">
        <span className="text-slate-500 text-sm">Need help connecting? </span>
        <a className="text-blue-700 text-sm underline">
          View connection guide
        </a>
      </div>
    </>
  );
};

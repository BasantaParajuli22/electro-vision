import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {  ValidatedInput } from "./FieldValidation";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/config";
import { Check, LogIn } from "lucide-react";
import { GoogleIcon } from "../../components/assets/icons/icon";
import { useField } from "./useField";



const SignInPage = () =>{
  const loginUser = useField((v) => v.length > 0);
  const loginPass = useField((v) => v.length > 0);
  const [remember, setRemember] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate(); 
  const recaptchaRef = useRef<ReCAPTCHA>(null);


  const handleLogin = async () => {
    if (!loginUser.field.value || !loginPass.field.value) {
    toast.error("Please fill email and password field to login."); return;
    }
    
    // captcha token
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      toast.info("Please check the 'I am not a robot' box");
      return;
    }
    setLoginLoading(true);

    try {
    await axios.post(`${API_BASE_URL}/auth/login`, 
      { email: loginUser.field.value, password: loginPass.field.value, captchaToken:token },
      { withCredentials: true }
    );

    toast.success("login successful");
    
    // navigate('/products');
    window.location.href = "/products";
    } catch(error: unknown) {
    let message ="unknown error while logging";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    }
    toast.error("Error while login: "+message);
    } finally {
    setLoginLoading(false);
    }
};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error  = params.get("error");

    if (error === "google_conflict") {
      toast.error("Cancelled or This email is already registered with a password. Please log in with email instead.");
    }

    // Clean the URL so toast doesn't re-show on refresh
    if (error) {
      navigate('/login');
    }
  }, []);
  


  return(
    <>
    <div className="min-h-[calc(100dvh-64px)] bg-stone-50 flex items-center justify-center"> 
    <div className="flex flex-col gap-8 justify-center w-96">

      <div className="flex items-center text-stone-400 text-sm gap-2">
        <LogIn /> login
      </div>

      {/* OAuth buttons */}
      <div className="flex">
        <a
          href={`${API_BASE_URL}/auth/google`}
          className="flex-1 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm rounded-md py-2.5 transition-colors no-underline"
        >
          <GoogleIcon /> Google
        </a>
        {/* <button className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm rounded-md py-2.5 transition-colors cursor-pointer">
          <GitHubIcon /> GitHub
        </button> */}
      </div>

      <div className="text-center text-xs text-stone-400">or</div>
      

      <div className="flex flex-col">
        <ValidatedInput placeholder="email" field={loginUser.field} onChange={loginUser.onChange} title="email"/>
        <ValidatedInput placeholder="password" field={loginPass.field} onChange={loginPass.onChange} type="password" title="password"/>
    
        {/* Remember me */}
        <div
          className="flex items-center cursor-pointer gap-2 select-none"
          onClick={() => setRemember((r) => !r)}
        >
          <div className={`w-4 h-4  rounded flex items-center justify-center transition-colors flex-shrink-0 ${remember ? "bg-green-400" : "bg-stone-200"}`}>
            {remember && (
              <Check  color="white"/>
            )}
          </div>
          <span className="text-stone-400 text-sm">remember me</span>
        </div>
      </div>

      {/* robot captcha */}
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        ref={recaptchaRef}
      />
      <button
        onClick={handleLogin}
        disabled={loginLoading}
        className="w-full flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed text-stone-100 text-sm rounded-md py-2.5 transition-colors cursor-pointer"
      >
        <LogIn />
        {loginLoading ? "signing in..." : "sign in"}
      </button>

    </div>
    </div>
    </>
  )
}

export default SignInPage;
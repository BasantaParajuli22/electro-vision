import axios from "axios";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/config";
import { ValidatedInput, type Field } from "./FieldValidation";


const isEmail    = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPassword = (v: string) => v.length >= 8;
const isUsername = (v: string) => v.length >= 3;


//custom react hook pattern 
function useField(validator: (v: string) => boolean) {
  
  const [field, setField] = useState<Field>({ value: "", valid: false, touched: false });

  const onChange = (v: string) =>
    setField({ value: v, valid: validator(v), touched: v.length > 0 });
  return { field, onChange };
}

const SignUpPage = () =>{

  const regUsername = useField(isUsername);
  const regEmail    = useField(isEmail);
  const regConfirm  = useField(isEmail);
  const regPass     = useField(isPassword);
  const regPass2    = useField(isPassword);

  const [regLoading,   setRegLoading]   = useState(false);

  const [otpSent,    setOtpSent]    = useState(false);
  const [otpValue,   setOtpValue]   = useState("");
  const [regEmail2,  setRegEmail2]  = useState(""); // store email for step

  // const navigate = useNavigate(); 

  

  const handleSendOtp = async () => {
    
    //checking if field is valid 
    if (!regUsername.field.valid) {
      toast.error("Username must be at least 3 characters."); return;
    }
    if (!regEmail.field.valid) {
      toast.error("Enter a valid email."); return;
    }
    if (regEmail.field.value !== regConfirm.field.value) {
      toast.error("Emails do not match."); return;
    }
    if (!regPass.field.valid) {
      toast.error("Password must be at least 8 characters."); return;
    }
    if (regPass.field.value !== regPass2.field.value) {
      toast.error("Passwords do not match."); return;
    }

    setRegLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        username: regUsername.field.value,
        email:    regEmail.field.value,
        password: regPass.field.value,
      },{
      // Equivalent to credentials: "include"
      withCredentials: true, 
      headers: { 
        "Content-Type": "application/json" 
      }
      });

      setRegEmail2(regEmail.field.value);
      setOtpSent(true);
      toast.success("OTP sent! Check your email.");
    } catch(error: unknown) {
      let message ="unknown error while logging";
      if (axios.isAxiosError(error)) {
      // console.log('is axios error:', true);
      // console.log('data:', error.response?.data);
      message = error.response?.data?.message || error.message;
      }
      toast.error("Error while login: "+message)
    } finally {
      setRegLoading(false);
    }
  };

  // Step 2 — verify OTP
  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) { toast.error("Enter the 6-digit code."); return; }
    setRegLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-otp`, 
      { email: regEmail2, otp: otpValue }
      );

      // if (!res.data.success) { toast.error("otp verification failed"); return; }
      toast.success("Registered successfully!");

      // navigate("/login");
      window.location.href = "/login";
    } catch(error: unknown) {
      let message ="unknown error while logging";
      if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
      }
      toast.error("Error while login: "+message);
    } finally {
      setRegLoading(false);
    }
  };


  return(
  <>
  <div className="min-h-[calc(100dvh-64px)] bg-stone-50 flex items-center justify-center"> 
    <div className="flex flex-col gap-8 justify-center w-96">

      <div className="flex items-center gap-2 text-stone-400 text-sm mb-3">
        <UserRoundPlus />  register
      </div>
      <div className="flex flex-col gap-3 ">
        <ValidatedInput placeholder="username"         field={regUsername.field} onChange={regUsername.onChange}  title="username"/>
        <ValidatedInput placeholder="email"            field={regEmail.field}    onChange={regEmail.onChange}    type="email" title="email"/>
        <ValidatedInput placeholder="confirm email"    field={regConfirm.field}  onChange={regConfirm.onChange}  type="email" title="email again"/>
        <ValidatedInput placeholder="password"         field={regPass.field}     onChange={regPass.onChange}     type="password" title="password"/>
        <ValidatedInput placeholder="confirm password" field={regPass2.field}    onChange={regPass2.onChange}    type="password" title="confrim password "/>
      </div>


      {!otpSent ?(
        <button
          onClick={handleSendOtp}
          disabled={regLoading}
          className="w-full mt-1 flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed text-stone-100 text-sm rounded-md py-2.5 transition-colors cursor-pointer"
        >
          <UserRoundPlus /> 
          {regLoading ? "signing up..." : "sign up"}
        </button>
      ):(
        // otp input field
        <div>
          <p className="text-stone-400 text-xs mb-3">
            Enter the 6-digit code sent to <span className="text-stone-600">{regEmail2}</span>
          </p>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))} // numbers only
            className="w-full bg-stone-100 rounded-md px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none font-mono tracking-widest text-center border-0"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={regLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800 disabled:opacity-60 text-stone-100 text-sm rounded-md py-2.5 transition-colors cursor-pointer"
          >
            {regLoading ? "verifying..." : "verify & create account"}
          </button>
          <button
            onClick={() => setOtpSent(false)}
            className="w-full mt-2 text-xs text-stone-400 hover:text-stone-600 transition-colors bg-transparent border-0 cursor-pointer"
          >
            ← go back
          </button>
        </div>
        
      )}
    </div>
      
  </div>
  </>
  )
}

export default SignUpPage;
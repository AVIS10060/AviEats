import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import api from '../api/axios';


  const primaryColor = "#ff4d2d";
const hoverColor = "#e64323";

const ForgotPassword = () => {

    const [step,setStep] = useState(1)
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const navigate = useNavigate()


    const handleSendOtp = async() =>{
        try {
            const response = await api.post('/auth/send-otp',{
                email
            })
            console.log(response)
            setStep(2)
            toast.success("OTP sent")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Unable to send OTP')
        }
    }
    const handleVerifyOtp = async() =>{
        try {
            const response = await api.post('/auth/verify-otp',{
                email,otp
            })
            console.log(response)
            setStep(3)
            toast.success(response.data.message)
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'OTP verification failed')
        }
    }
    const handleResetPassword = async() =>{
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        try {
            const response = await api.post('/auth/reset-password',{
                email,newPassword,confirmPassword
            })
            console.log(response)
            toast.success(response.data.message)
            navigate("/signin")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Password reset failed')
        }
    }



  return (
    <div className='h-screen w-screen flex items-center justify-center bg-pink-100'>
       <div className='h-64 max-w-2xl w-full flex flex-col gap-5 items-center justify-center bg-white '> 
        <div className='w-full flex items-center justify-center gap-5'> 
           <FaArrowLeft onClick={()=>navigate("/signin")}  size={25}/>
        <h2>
            Forgot Password
        </h2>
        </div>

            {/* Step 1 */}
         
        {step === 1  && 
        <div className=' mb-4'>
             <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
            <button
            type="submit"
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
            onClick={handleSendOtp}
          >
           Send Otp
          </button>

        </div>
        }

        {step === 2  && 
        <div className=' mb-4'>
             <label className="block text-sm font-medium mb-1">
              One Time Password
            </label>
            <input
              type="text"
              name="otp"
              placeholder="Enter your otp"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              required
            />
            <button
            onClick={handleVerifyOtp}
            type="submit"
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
          >
           Verify 
          </button>

        </div>
        }


        {step === 3  && 
        <div className=' mb-4'>
             <label className="block text-sm font-medium mb-1">
              Enter New Password
            </label>
            <input
              type="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              required
            />
            <label className="block text-sm font-medium mb-1">
              Confirm Password 
            </label>
            <input
              type="confirmPassword"
              name="confirmPassword"
              placeholder="confirm password "
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
            <button
            onClick={handleResetPassword}
            type="submit"
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
          >
           Reset Password 
          </button>

        </div>
        }




       </div>

    </div>
  )
}

export default ForgotPassword

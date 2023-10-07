import React from "react";

export default function RegisterForm(){
    return(
        <div className="login-container">
            <h1 className='main-title'>Register</h1>

            <form className="login-form">
                <div className="input-group">
                    <label htmlFor="username" className="input-label">Username or Email</label>
                    <input type="text" id="username" name="username" className="input-field" placeholder="Enter your username or email"/>
                </div>
                
                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input type="password" id="password" name="password" className="input-field" placeholder="Enter your password"/>
                </div>

                <button type="submit" className="login-button">Register</button>
            </form>

        </div>
    )
}

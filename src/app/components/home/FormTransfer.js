import React from "react";


export default function FormTransfer(){
    return(
        <div className="transfer-form">
          
          <h2 className='title-transfer'>Transfer Tokens</h2>
          <form className="transfer-form">
                    <label htmlFor="address">Recipient Address:</label>
                    <input type="text" id="address" name="address" required />
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" required />
                    <button className="submit-transfer-form" type="submit">Send</button>
          </form>
        </div>
    )
}
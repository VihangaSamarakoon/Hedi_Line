import { Link } from "react-router-dom";

const AdminProfile= () =>{

    return(
        <div className="formbox">
                <h2>WELCOME ADMIN</h2>
                <br/>
                <nav>
                    <div >
                    <a href='/AddStaff'><button className="btnConfirm" style={{width: '250px',height: '50px'}}>Register Staff Member</button></a><br/><br/>
                    <a href='/AllStaff'><button className="btnConfirm" style={{width: '250px',height: '50px'}}>Staff Details</button></a><br/><br/>
                    <a href='/Salary'><button className="btnConfirm" style={{width: '250px',height: '50px'}}>Salary Calculation</button></a>
                    </div>
                </nav>
            </div>
    )
}

export default AdminProfile
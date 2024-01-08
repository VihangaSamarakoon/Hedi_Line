import { useState } from 'react';
import '../../css/MachineStyles/machineDetails.css'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UpdateMachineService = ({machine}) => {
  //const { dispatch } = useMachineContext();
    const navigate = useNavigate();

    const [LastserviceDate, setLastserviceDate] = useState(machine.LastserviceDate)
    const [NextServiceDate, setNextServiceDate] = useState(machine.NextServiceDate)
    const [TechnicianName, setTechnicianName] = useState(machine.TechnicianName)
    const [TechTelno, setTechTelno] = useState(machine.TechTelno)
    const [TechnicianPayment, setTechnicianPayment] = useState(machine.TechnicianPayment)
    const [error, setError] = useState(null);
    const[emptyFields, setEmptyFields] = useState([]);

  const handleMachineUpdate = async (e) => {
            e.preventDefault()
    
            const updatedMachineService = {LastserviceDate,NextServiceDate, TechnicianName,TechTelno,TechnicianPayment} 
            
            const response = await fetch(`/api/serviceMachines/` + machine._id, {
                method: 'PATCH',
                body: JSON.stringify(updatedMachineService),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
    
            if(!response.ok) {
                setError(json.error)
                setEmptyFields(json.emptyFields)
                console.log(json.emptyFields)
                Swal.fire({
                    title: 'Error',
                    text: error,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1000,
                })
            }
            if(response.ok) {
                if( response.status === 200 ) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Service Details updated Successfully',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    }).then(() => {
                        navigate('/machineHistory/' + machine.machineId);
                    })
                }
            }
        }
  
  ;

  return (
    <div className="">
      <hr />
      <form className="create" onSubmit={handleMachineUpdate}>
        <div className="machinelabels">
          <div className="input-box">
            <label> Last Service Date:</label>
            <input
              type="date"
              onChange={(e) => setLastserviceDate(e.target.value)}
              value={LastserviceDate}
              className={emptyFields.includes('LastserviceDate') ? 'error' : ''}
            />
          </div>
          <div className="input-box">
            <label>Next Service Date:</label>
            <input
              type="date"
              onChange={(e) => setNextServiceDate(e.target.value)}
              value={NextServiceDate}
              // required
              className={emptyFields.includes('NextServiceDate') ? 'error' : ''}
            />
          </div>
          <div className="input-box">
            <label>Technician's Name:</label>
            <input
              type="text"
              onChange={(e) => setTechnicianName(e.target.value)}
              value={TechnicianName}
              // required
              className={emptyFields.includes('TechnicianName') ? 'error' : ''}
            />
          </div>
          <div className="input-box">
            <label>Technician's tel no</label>
            <input
              type="text"
              onChange={(e) => setTechTelno(e.target.value)}
              value={TechTelno}
              // required
              pattern="[0-9]{10}"
              className={emptyFields.includes('TechTelno') ? 'error' : ''}
            />
          </div>
          <div className="input-box">
            <label>Technician's Payment:</label>
            <input
              type="number"
              onChange={(e) => setTechnicianPayment(e.target.value)}
              value={TechnicianPayment}
              // required
              className={emptyFields.includes('TechnicianPayment') ? 'error' : ''}
            />
          </div>
          <div className="Add-button">
            <button className='subBtn'>Update</button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default UpdateMachineService;

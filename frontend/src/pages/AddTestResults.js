import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const TestResultView = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [testResult, setTestResult] = useState(null)
  const [updatedResult, setUpdatedResult] = useState([])
  const [error,setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        const response = await fetch(`/api/testResult/${id}`);
        const json = await response.json();

        if (response.ok) {
          setTestResult(json)
          setUpdatedResult(json.result)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTestResult();
  }, [id]);

  const handleClickSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/testResult/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: updatedResult,
          status: 'completed'
        })
      });
      const json = await response.json()
      if(!response.ok){
        setError(json.error)
        setEmptyFields(json.emptyFields)
      }
      if (response.ok) {
        Swal.fire(
            {
              title: 'Success',
              text: 'Record has been updated',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true  
          }
          )
          setError(null)
          setEmptyFields([])
          navigate('/pendingTests')
      }else{
        setError(json.error)
        setEmptyFields(json.emptyFields)
        Swal.fire({
          title: 'Error',
          text: 'Record could not be updated',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: 'alerts'
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <div>
      {testResult && (
        <div>
          <h4>{testResult.test?.testName ?? "deleted"}</h4>
          <div style={{display:"flex" , gap: '10px'}}>
          <p>{testResult.patient?.firstName ?? "deleted"}</p>
          <p>{testResult.patient?.lastName ?? "deleted"}</p>
          </div>
      </div>
      
    )}
    <form onSubmit={handleClickSubmit}>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Value</th>
            <th scope="col">Unit</th>
            <th scope="col">Reference Range</th>
          </tr>
        </thead>
        <tbody>
          {testResult && testResult.result.map((resultObj, index) => {
            const isEmpty = emptyFields.includes(index);
            return(
              <tr  key={index}>
                  <td>{resultObj.category?.category ?? "Record not found"}</td>
                  <td><input 
                        type="number" 
                        onChange={(e) => {
                          const updatedResults = [...testResult.result];
                          updatedResults[index].value = e.target.value;
                          setTestResult({ ...testResult, result: updatedResults });
                        }} 
                        value={resultObj.value || ''}
                        className={isEmpty ? 'error' : ''}
                      />
                  </td>
                  <td>{resultObj.category?.UOM ?? "Record not found"}</td>
                  {testResult.patient?.gender === 'Male' && <td>{resultObj.category?.startMRef ?? "Record not found"}{resultObj.category?.operatorM ?? "Record not found"}{resultObj.category?.endMRef ?? "Record not found"}</td>}
                {testResult.patient?.gender  === 'Female' && <td>{resultObj.category?.startFRef ?? "Record not found"}{resultObj.category?.operatorF ?? "Record not found"}{resultObj.category?.endFRef ?? "Record not found"}</td>}
              </tr>
              )
            }
          )}
        </tbody>
      </table>
      <button className="btnSubmit" style={{marginRight:"10px"}} type="submit">Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
    </div>
  )
}

export default TestResultView;

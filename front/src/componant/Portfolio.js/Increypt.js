import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { NavLink, useParams } from 'react-router-dom'

// const decryptID = (encryptedID) => {
//     try {
//         const bytes = CryptoJS.AES.decrypt(encryptedID, 'your-secret-key');
//         const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//         return decrypted;
//     } catch (error) {
//         console.error("Error decrypting ID:", error);
//         return null;
//     }
// };
const decryptID = (encryptedID) => {
    try {
        const safeEncryptedID = encryptedID.replace(/_/g, '/'); // Replace `_` back to `/`
        const bytes = CryptoJS.AES.decrypt(safeEncryptedID, 'your-secret-key');
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.error("Error decrypting ID:", error);
        return null;
    }
};

export default function Increypt() {

    const { ids } = useParams()

    const [decryptedID, setDecryptedID] = useState(null);

    useEffect(() => {
        const decrypt = async () => {
            const decrypted = decryptID(ids);
            if (decrypted) {
                setDecryptedID(decrypted);
                // Fetch data using decryptedID
            } else {
                // Handle the case where decryption fails
                console.error("Failed to decrypt ID");
            }
        };
        decrypt();
    }, [ids]);

    return (
        <div>
            <div className="page-wrapper page-settings">
                <div className="content">
                    <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                            <li className="breadcrumb-item active" aria-current="page">Student Data Report</li>
                        </ol>
                    </nav>
                    <div className="content-page-header content-page-headersplit">
                        <h5>Student {ids}</h5>
                        <h5>Student {decryptedID}</h5>
                    </div>
                    <div className="row">
                        <div className="col-12 ">
                            <div className="table-resposnive">
                                <table className="table datatable">
                                    <thead>
                                        <tr>
                                            <th>Index</th>
                                            <th>Profile</th>
                                            <th>Student</th>
                                            <th>Branch</th>
                                            <th>Board</th>
                                            <th>Medium</th>
                                            <th>Standard</th>
                                            <th>Batch</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React from 'react';
import IconBtn from './IconBtn';

export default function ConfirmationModal({ modalData }) {
  const handleIconBtnClick = () => {
    console.log(modalData)
    if (modalData?.btn1Handler) modalData.btn1Handler();
    if (modalData?.removeModal) modalData.removeModal(); // Set removeModal to null
  };

  return (
    <div className="modal fixed-top d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '350px' }}>
        <div className="modal-content bg-dark text-light border border-secondary p-4 rounded">
          <p className="text-xl font-weight-bold">{modalData?.text1}</p>
          <p className="mt-3 mb-4">{modalData?.text2}</p>
          <div className="d-flex gap-4">
            <IconBtn onClick={handleIconBtnClick} text={modalData?.btn1Text} outline />
            <button className="btn btn-secondary" onClick={modalData?.btn2Handler}>{modalData?.btn2Text}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

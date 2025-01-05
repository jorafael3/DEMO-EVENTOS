import React from 'react';
import { ClipLoader } from 'react-spinners';

const FullScreenSpinner = ({ loading }) => {
  return (
    loading && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ClipLoader color="#36d7b7" size={150} />
      </div>
    )
  );
};

export default FullScreenSpinner;

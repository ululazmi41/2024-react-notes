import React from 'react';

function Toasters({ toasters }) {
  return (
    <div className='toaster-wrapper'>
        <div className="toasters">
          {toasters.map((toaster) => (
            <React.Fragment key={toaster.id}>
              {toaster.element}
            </React.Fragment>
          ))}
        </div>
      </div>
  )
}

export default Toasters;

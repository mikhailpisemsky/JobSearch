import React from 'react'

export const Loader = () => {
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }} >
        <div claclassNamess="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle" />
                </div><div className="gap-patch">
                    <div className="circle" />
                </div><div className="circle-clipper right">
                    <div className="circle" />
                </div>
            </div>
        </div>
    </div>
}
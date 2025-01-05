import React from "react";
import { CCard, CCardBody, CCardTitle, CCardText, CButton, CContainer, CRow, CCol } from "@coreui/react";
import { useNavigate } from "react-router-dom";

import datos_eventos from "./data"; // Importa los datos


function Incidencias() {
    const navigate = useNavigate();


    return (
        <CContainer>
            <CRow className="g-4">
                {datos_eventos.map((evento) => (
                    <CCol md="6" key={evento.id}>
                        <CCard>
                            <CCardBody>
                                <CCardTitle>{evento.nombre}</CCardTitle>
                                <CCardText>
                                    <strong>Fecha:</strong> {evento.fecha} <br />
                                    <strong>Lugar:</strong> {evento.lugar} <br />
                                    <strong>Descripción:</strong> {evento.descripcion} <br />
                                </CCardText>
                                <CButton
                                    color="primary"
                                    onClick={() => navigate(`/incidencias/DetalleEvento?id=` + evento.id)}
                                >
                                    Ver Detalles
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    );
}

export default Incidencias;
